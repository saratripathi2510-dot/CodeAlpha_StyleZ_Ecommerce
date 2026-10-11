/**
 * StyleZ - API Client Layer
 * Handles communication with the Node.js/Express backend
 */

const API_BASE = '/api';

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
    const data = await res.json();

    if (!res.ok) {
      const errorMsg = data.message || data.error || 'Request failed';
      const error = new Error(errorMsg);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, err);
    throw err;
  }
}

const api = {
  auth: {
    me: () => request('/auth/me'),
    login: (email, password) => request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
    register: (name, email, password) => request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    }),
    logout: () => request('/auth/logout', { method: 'POST' })
  },
  products: {
    getAll: (params = {}) => {
      const query = new URLSearchParams();
      if (params.category && params.category !== 'all') query.set('category', params.category);
      if (params.q) query.set('q', params.q);
      if (params.minPrice) query.set('minPrice', params.minPrice);
      if (params.maxPrice) query.set('maxPrice', params.maxPrice);
      if (params.sort) query.set('sort', params.sort);
      if (params.featured) query.set('featured', params.featured);
      const qs = query.toString();
      return request(`/products${qs ? '?' + qs : ''}`);
    },
    getById: (idOrSlug) => request(`/products/${idOrSlug}`),
    getCategories: () => request('/products/categories')
  },
  checkout: {
    submit: (payload) => request('/checkout', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  },
  orders: {
    getMyOrders: () => request('/orders'),
    getByNumber: (orderNumber) => request(`/orders/${orderNumber}`)
  }
};

window.StyleZAPI = api;
