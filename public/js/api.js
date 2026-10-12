/**
 * StyleZ - API Client Layer
 * Handles communication with the Node.js/Express backend,
 * with automatic fallback to static data (window.StyleZStaticData)
 * when running on static hosts (e.g. GitHub Pages) or when the backend is offline.
 */

const API_BASE = '/api';

// Tracks whether static fallback has been triggered
let hasLoggedFallbackNotice = false;

function logStaticFallback(context = '') {
  if (!hasLoggedFallbackNotice) {
    console.info(
      `✦ StyleZ Static Mode Active: Backend API is unreachable (${context || 'Catalog'}). Using pre-seeded static luxury collection (window.StyleZStaticData).`
    );
    hasLoggedFallbackNotice = true;
  }
}

/**
 * Standard fetch wrapper with JSON and error handling
 */
async function request(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);

    // Check content type to avoid throwing syntax errors on HTML 404 pages (common on GitHub Pages)
    const contentType = res.headers.get('content-type') || '';
    let data;

    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      data = {
        message: res.statusText || 'Endpoint returned non-JSON response.',
        status: res.status,
        raw: text
      };
    }

    if (!res.ok) {
      const errorMsg = data.message || data.error || `Request failed with status ${res.status}`;
      const error = new Error(errorMsg);
      error.status = res.status;
      error.data = data;
      error.isStaticHost = res.status === 404 || !contentType.includes('application/json');
      throw error;
    }

    return data;
  } catch (err) {
    err.isNetworkOrStatic = true;
    throw err;
  }
}

/**
 * Static catalog helper functions
 * (Querying window.StyleZStaticData with matching backend behavior)
 */

function getStaticCategories() {
  const staticData = window.StyleZStaticData;
  if (!staticData || !Array.isArray(staticData.categories)) {
    return { categories: [] };
  }
  return {
    categories: staticData.categories.map(c => ({ ...c }))
  };
}

function getStaticProducts(params = {}) {
  const staticData = window.StyleZStaticData;
  if (!staticData || !Array.isArray(staticData.products)) {
    return { products: [], total: 0 };
  }

  let list = staticData.products.map(p => ({
    ...p,
    details: Array.isArray(p.details) ? [...p.details] : [],
    images: Array.isArray(p.images) ? [...p.images] : [],
    sizes: Array.isArray(p.sizes) ? [...p.sizes] : [],
    colors: Array.isArray(p.colors) ? p.colors.map(c => ({ ...c })) : []
  }));

  // 1. Category filtering (by slug or id)
  if (params.category && params.category !== 'all') {
    const cat = String(params.category).toLowerCase().trim();
    list = list.filter(p => 
      (p.category_slug && p.category_slug.toLowerCase() === cat) ||
      String(p.category_id) === cat
    );
  }

  // 2. Search query (matches title, description, badge, or category name)
  if (params.q && params.q.trim()) {
    const term = params.q.trim().toLowerCase();
    list = list.filter(p => {
      const nameMatch = p.name && p.name.toLowerCase().includes(term);
      const descMatch = p.description && p.description.toLowerCase().includes(term);
      const badgeMatch = p.badge && p.badge.toLowerCase().includes(term);
      const catMatch = p.category_name && p.category_name.toLowerCase().includes(term);
      return nameMatch || descMatch || badgeMatch || catMatch;
    });
  }

  // 3. Minimum price filter
  if (params.minPrice !== undefined && params.minPrice !== null && !isNaN(Number(params.minPrice))) {
    const min = Number(params.minPrice);
    list = list.filter(p => p.price >= min);
  }

  // 4. Maximum price filter
  if (params.maxPrice !== undefined && params.maxPrice !== null && !isNaN(Number(params.maxPrice))) {
    const max = Number(params.maxPrice);
    list = list.filter(p => p.price <= max);
  }

  // 5. Featured filter
  if (params.featured === 'true' || params.featured === '1' || params.featured === true || params.featured === 1) {
    list = list.filter(p => p.featured === 1);
  }

  // 6. Sorting logic
  switch (params.sort) {
    case 'price_asc':
      list.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      list.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.review_count || 0) - (a.review_count || 0));
      break;
    case 'newest':
      list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0) || b.id - a.id);
      break;
    case 'featured':
    default:
      list.sort((a, b) => (b.featured || 0) - (a.featured || 0) || a.id - b.id);
      break;
  }

  // 7. Limit
  if (params.limit && !isNaN(Number(params.limit))) {
    list = list.slice(0, Number(params.limit));
  }

  return {
    products: list,
    total: list.length
  };
}

function getStaticProductById(idOrSlug) {
  const staticData = window.StyleZStaticData;
  if (!staticData || !Array.isArray(staticData.products)) {
    throw new Error('Static product catalog not available.');
  }

  let product = null;
  const numId = Number(idOrSlug);
  if (!isNaN(numId)) {
    product = staticData.products.find(p => p.id === numId);
  }
  if (!product) {
    product = staticData.products.find(p => p.slug === String(idOrSlug));
  }

  if (!product) {
    throw new Error('Product not found.');
  }

  // Find up to 4 related products from the same category
  const related = staticData.products
    .filter(p => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 4)
    .map(p => ({ ...p }));

  return {
    product: {
      ...product,
      details: Array.isArray(product.details) ? [...product.details] : [],
      images: Array.isArray(product.images) ? [...product.images] : [],
      sizes: Array.isArray(product.sizes) ? [...product.sizes] : [],
      colors: Array.isArray(product.colors) ? product.colors.map(c => ({ ...c })) : []
    },
    related
  };
}

const api = {
  isStaticMode: false,

  auth: {
    me: async () => {
      try {
        return await request('/auth/me');
      } catch (err) {
        // Silently treat as guest in static mode or when backend is down
        return { authenticated: false, user: null, isStaticMode: true };
      }
    },
    login: async (email, password) => {
      try {
        return await request('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password })
        });
      } catch (err) {
        if (err.isNetworkOrStatic || err.isStaticHost) {
          throw new Error('User sign-in requires the Node.js/Express backend server. (The catalog and shopping bag are running in static mode on GitHub Pages. Run "npm start" locally to test full authentication).');
        }
        throw err;
      }
    },
    register: async (name, email, password) => {
      try {
        return await request('/auth/register', {
          method: 'POST',
          body: JSON.stringify({ name, email, password })
        });
      } catch (err) {
        if (err.isNetworkOrStatic || err.isStaticHost) {
          throw new Error('User registration requires the Node.js/Express backend server. (Running in static mode on GitHub Pages. Run "npm start" locally to test account registration).');
        }
        throw err;
      }
    },
    logout: async () => {
      try {
        return await request('/auth/logout', { method: 'POST' });
      } catch (err) {
        return { success: true, message: 'Signed out locally.' };
      }
    }
  },

  products: {
    getAll: async (params = {}) => {
      try {
        const query = new URLSearchParams();
        if (params.category && params.category !== 'all') query.set('category', params.category);
        if (params.q) query.set('q', params.q);
        if (params.minPrice) query.set('minPrice', params.minPrice);
        if (params.maxPrice) query.set('maxPrice', params.maxPrice);
        if (params.sort) query.set('sort', params.sort);
        if (params.featured) query.set('featured', params.featured);
        const qs = query.toString();
        const res = await request(`/products${qs ? '?' + qs : ''}`);
        return res;
      } catch (err) {
        api.isStaticMode = true;
        logStaticFallback('Products listing');
        return getStaticProducts(params);
      }
    },

    getById: async (idOrSlug) => {
      try {
        const res = await request(`/products/${idOrSlug}`);
        return res;
      } catch (err) {
        api.isStaticMode = true;
        logStaticFallback(`Product detail #${idOrSlug}`);
        return getStaticProductById(idOrSlug);
      }
    },

    getCategories: async () => {
      try {
        const res = await request('/products/categories');
        return res;
      } catch (err) {
        api.isStaticMode = true;
        logStaticFallback('Categories');
        return getStaticCategories();
      }
    }
  },

  checkout: {
    submit: async (payload) => {
      try {
        return await request('/checkout', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      } catch (err) {
        if (err.isNetworkOrStatic || err.isStaticHost) {
          throw new Error('Server-side stock verification and order processing require the Node.js/Express backend. (Running in static mode on GitHub Pages. Run "npm start" locally to test full checkout).');
        }
        throw err;
      }
    }
  },

  orders: {
    getMyOrders: async () => {
      try {
        return await request('/orders');
      } catch (err) {
        if (err.isNetworkOrStatic || err.isStaticHost) {
          throw new Error('Order Archives require the Node.js/Express backend with SQLite database. (Running in static mode on GitHub Pages).');
        }
        throw err;
      }
    },
    getByNumber: async (orderNumber) => {
      try {
        return await request(`/orders/${orderNumber}`);
      } catch (err) {
        if (err.isNetworkOrStatic || err.isStaticHost) {
          throw new Error('Order lookup requires the Node.js/Express backend server.');
        }
        throw err;
      }
    }
  }
};

window.StyleZAPI = api;
