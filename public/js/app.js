/**
 * StyleZ - Main Application Orchestrator
 * Coordinates state, APIs, filter controls, navigation and lifecycle
 */

const App = {
  elements: {},
  searchTimeout: null,

  async init() {
    console.log('✨ Initializing StyleZ Haute Couture E-Commerce Experience...');

    this.cacheElements();
    this.bindEvents();

    // Initialize subsystems
    window.StyleZUI?.init();
    window.StyleZCart?.init();
    window.StyleZAuth?.init();
    window.StyleZCheckout?.init();
    window.StyleZOrders?.init();

    // Fetch initial datasets
    await this.loadCategories();
    await this.loadProducts();

    console.log('💎 StyleZ application online.');
  },

  cacheElements() {
    this.elements = {
      categoriesRow: document.getElementById('filterCategoriesRow'),
      searchInput: document.getElementById('catalogSearchInput'),
      priceSlider: document.getElementById('priceRangeSlider'),
      priceValueText: document.getElementById('priceFilterValueText'),
      sortSelect: document.getElementById('sortSelect'),
      resetFilterBtn: document.getElementById('resetFilterBtn'),
      mobileMenuToggle: document.getElementById('mobileMenuToggle'),
      navLinks: document.getElementById('navLinks')
    };
  },

  bindEvents() {
    // Search input with debounce
    if (this.elements.searchInput) {
      this.elements.searchInput.addEventListener('input', (e) => {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
          window.StyleZState.filters.q = e.target.value.trim();
          this.loadProducts();
        }, 300);
      });
    }

    // Price range slider
    if (this.elements.priceSlider) {
      this.elements.priceSlider.addEventListener('input', (e) => {
        const val = Number(e.target.value);
        window.StyleZState.filters.maxPrice = val;
        if (this.elements.priceValueText) {
          this.elements.priceValueText.textContent = `$${val}`;
        }
      });

      this.elements.priceSlider.addEventListener('change', () => {
        this.loadProducts();
      });
    }

    // Sort selector
    if (this.elements.sortSelect) {
      this.elements.sortSelect.addEventListener('change', (e) => {
        window.StyleZState.filters.sort = e.target.value;
        this.loadProducts();
      });
    }

    // Reset filters button
    if (this.elements.resetFilterBtn) {
      this.elements.resetFilterBtn.addEventListener('click', () => {
        this.resetFilters();
      });
    }

    // Mobile menu toggle
    if (this.elements.mobileMenuToggle && this.elements.navLinks) {
      this.elements.mobileMenuToggle.addEventListener('click', () => {
        this.elements.navLinks.classList.toggle('mobile-open');
      });
    }

    // Smooth scroll for nav anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#') {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });
  },

  async loadCategories() {
    try {
      const data = await window.StyleZAPI.products.getCategories();
      let categories = data && Array.isArray(data.categories) ? data.categories : [];

      if (categories.length === 0 && window.StyleZStaticData && Array.isArray(window.StyleZStaticData.categories)) {
        categories = window.StyleZStaticData.categories;
      }

      window.StyleZState.categories = categories;

      if (!this.elements.categoriesRow) return;

      let html = `
        <button class="category-pill active" data-category="all" onclick="StyleZApp.selectCategory('all', this)">
          All Collections
        </button>
      `;

      categories.forEach(cat => {
        html += `
          <button class="category-pill" data-category="${cat.slug}" onclick="StyleZApp.selectCategory('${cat.slug}', this)">
            ${cat.name} (${cat.product_count})
          </button>
        `;
      });

      this.elements.categoriesRow.innerHTML = html;
    } catch (err) {
      console.error('Failed to load categories:', err);
      if (window.StyleZStaticData && Array.isArray(window.StyleZStaticData.categories) && this.elements.categoriesRow) {
        const categories = window.StyleZStaticData.categories;
        window.StyleZState.categories = categories;
        let html = `
          <button class="category-pill active" data-category="all" onclick="StyleZApp.selectCategory('all', this)">
            All Collections
          </button>
        `;
        categories.forEach(cat => {
          html += `
            <button class="category-pill" data-category="${cat.slug}" onclick="StyleZApp.selectCategory('${cat.slug}', this)">
              ${cat.name} (${cat.product_count})
            </button>
          `;
        });
        this.elements.categoriesRow.innerHTML = html;
      }
    }
  },

  selectCategory(categorySlug, pillElement) {
    window.StyleZState.filters.category = categorySlug;

    // Update active class on pills
    document.querySelectorAll('.category-pill').forEach(el => el.classList.remove('active'));
    if (pillElement) {
      pillElement.classList.add('active');
    }

    this.loadProducts();
  },

  async loadProducts() {
    try {
      const params = {
        category: window.StyleZState.filters.category,
        q: window.StyleZState.filters.q,
        maxPrice: window.StyleZState.filters.maxPrice,
        sort: window.StyleZState.filters.sort
      };

      const data = await window.StyleZAPI.products.getAll(params);
      let products = data && Array.isArray(data.products) ? data.products : [];

      if (products.length === 0 && (!params.q && (!params.category || params.category === 'all') && (!params.maxPrice || params.maxPrice >= 1200))) {
        if (window.StyleZStaticData && Array.isArray(window.StyleZStaticData.products)) {
          products = window.StyleZStaticData.products;
        }
      }

      window.StyleZState.products = products;
      window.StyleZUI.renderProducts(window.StyleZState.products);
    } catch (err) {
      console.error('Failed to load products:', err);
      if (window.StyleZStaticData && Array.isArray(window.StyleZStaticData.products)) {
        window.StyleZState.products = window.StyleZStaticData.products;
        window.StyleZUI.renderProducts(window.StyleZState.products);
      } else {
        window.StyleZUI.renderProducts([]);
      }
      window.StyleZUI.showToast('Network Notice', 'Displaying offline catalog.', 'warning');
    }
  },

  resetFilters() {
    window.StyleZState.filters = {
      category: 'all',
      q: '',
      maxPrice: 1200,
      sort: 'featured'
    };

    if (this.elements.searchInput) this.elements.searchInput.value = '';
    if (this.elements.priceSlider) this.elements.priceSlider.value = 1200;
    if (this.elements.priceValueText) this.elements.priceValueText.textContent = '$1200';
    if (this.elements.sortSelect) this.elements.sortSelect.value = 'featured';

    document.querySelectorAll('.category-pill').forEach(el => {
      el.classList.toggle('active', el.dataset.category === 'all');
    });

    this.loadProducts();
  }
};

window.StyleZApp = App;

// Bootstrap application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.StyleZApp.init();
});
