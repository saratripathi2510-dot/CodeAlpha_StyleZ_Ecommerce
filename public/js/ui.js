/**
 * StyleZ - UI & Interaction Controller
 * Product rendering, Quick View modal with interactive gallery, zoom, toast notifications & scroll reveals
 */

const UI = {
  elements: {},
  toastContainer: null,

  init() {
    this.createToastContainer();
    this.elements = {
      productGrid: document.getElementById('productGrid'),
      quickViewOverlay: document.getElementById('quickViewOverlay'),
      closeQuickViewBtn: document.getElementById('closeQuickViewBtn')
    };

    this.bindEvents();
    this.initScrollReveal();
  },

  createToastContainer() {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    this.toastContainer = container;
  },

  bindEvents() {
    if (this.elements.closeQuickViewBtn) {
      this.elements.closeQuickViewBtn.addEventListener('click', () => this.closeQuickView());
    }

    if (this.elements.quickViewOverlay) {
      this.elements.quickViewOverlay.addEventListener('click', (e) => {
        if (e.target === this.elements.quickViewOverlay) {
          this.closeQuickView();
        }
      });
    }

    // Escape key to close modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeQuickView();
        window.StyleZCart?.close();
        window.StyleZAuth?.close();
        window.StyleZCheckout?.close();
        window.StyleZOrders?.close();
      }
    });
  },

  showToast(title, message, type = 'gold') {
    if (!this.toastContainer) this.createToastContainer();

    const toast = document.createElement('div');
    toast.className = 'toast';

    let iconSvg = `
      <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    `;

    if (type === 'success') {
      iconSvg = `
        <svg class="toast-icon" style="color: #4ade80;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      `;
    } else if (type === 'warning') {
      iconSvg = `
        <svg class="toast-icon" style="color: #fb923c;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      `;
    }

    toast.innerHTML = `
      ${iconSvg}
      <div class="toast-body">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" aria-label="Close notification">&times;</button>
    `;

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      toast.classList.add('hiding');
      setTimeout(() => toast.remove(), 300);
    });

    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      if (toast.parentElement) {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300);
      }
    }, 4000);
  },

  renderProducts(products) {
    if (!this.elements.productGrid) return;

    if (!products || products.length === 0) {
      this.elements.productGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 5rem 1rem;">
          <p style="font-family: var(--font-display); font-size: 1.25rem; color: var(--ivory-secondary); margin-bottom: 0.5rem;">
            No couture pieces match your selection
          </p>
          <p style="font-size: 0.85rem; color: var(--ivory-muted); margin-bottom: 1.5rem;">
            Adjust your filters or reset search to browse our full atelier catalog.
          </p>
          <button class="btn btn-outline-gold btn-sm" onclick="StyleZApp.resetFilters()">Reset All Filters</button>
        </div>
      `;
      return;
    }

    let html = '';
    products.forEach((p, index) => {
      const primaryImage = Array.isArray(p.images) && p.images.length > 0
        ? p.images[0]
        : 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80';

      const comparePriceHtml = p.compare_price
        ? `<span class="product-card-compare-price">$${Number(p.compare_price).toFixed(2)}</span>`
        : '';

      const badgeHtml = p.badge
        ? `<span class="product-badge">${p.badge}</span>`
        : '';

      const stockClass = p.stock <= 10 ? 'low' : '';
      const stockText = p.stock <= 10 ? `${p.stock} remaining` : 'In Atelier';

      const isWishlisted = window.StyleZState.wishlist.has(p.id);

      html += `
        <article class="product-card reveal-on-scroll delay-${(index % 4) * 100}">
          <div class="product-image-container">
            ${badgeHtml}
            <button class="product-wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="StyleZUI.toggleWishlist(${p.id}, this)" title="Save to wishlist" aria-label="Save to wishlist">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <img class="product-image" src="${primaryImage}" alt="${p.name}" loading="lazy">
            <div class="product-card-actions">
              <button class="btn btn-dark" onclick="StyleZUI.openQuickView(${p.id})">Quick View</button>
              <button class="btn btn-gold" onclick="StyleZUI.quickAddToCart(${p.id})">Add to Bag</button>
            </div>
          </div>
          <div class="product-card-body">
            <span class="product-card-category">${p.category_name || 'Haute Couture'}</span>
            <h3 class="product-card-title" onclick="StyleZUI.openQuickView(${p.id})">${p.name}</h3>
            <div class="product-card-rating">
              <span class="stars">★</span>
              <span>${p.rating || 4.9}</span>
              <span>(${p.review_count || 18})</span>
            </div>
            <div class="product-card-bottom">
              <div class="product-card-price-group">
                <span class="product-card-price">$${Number(p.price).toFixed(2)}</span>
                ${comparePriceHtml}
              </div>
              <span class="product-card-stock-pill ${stockClass}">
                <span class="dot"></span>
                <span>${stockText}</span>
              </span>
            </div>
          </div>
        </article>
      `;
    });

    this.elements.productGrid.innerHTML = html;
    this.initScrollReveal();
  },

  toggleWishlist(productId, btn) {
    if (window.StyleZState.wishlist.has(productId)) {
      window.StyleZState.wishlist.delete(productId);
      btn.classList.remove('active');
      btn.querySelector('svg').setAttribute('fill', 'none');
      this.showToast('Wishlist Updated', 'Piece removed from your curated wishlist.', 'info');
    } else {
      window.StyleZState.wishlist.add(productId);
      btn.classList.add('active');
      btn.querySelector('svg').setAttribute('fill', 'currentColor');
      this.showToast('Saved to Wishlist', 'Piece added to your private wishlist.', 'success');
    }
  },

  quickAddToCart(productId) {
    const product = window.StyleZState.products.find(p => p.id === productId);
    if (!product) return;

    const defaultSize = (product.sizes && product.sizes[0]) || 'Standard';
    const defaultColor = (product.colors && product.colors[0]?.name) || 'Original';

    window.StyleZCart.addItem(product, {
      size: defaultSize,
      color: defaultColor,
      quantity: 1
    });
  },

  async openQuickView(productId) {
    let product = window.StyleZState.products.find(p => p.id === productId);

    if (!product || !product.details) {
      try {
        const res = await window.StyleZAPI.products.getById(productId);
        product = res.product;
      } catch (e) {
        console.error('Failed to load product details:', e);
      }
    }

    if (!product) return;
    window.StyleZState.activeProduct = product;

    const modalBody = document.getElementById('quickViewBody');
    if (!modalBody) return;

    const images = Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80'];

    const sizes = Array.isArray(product.sizes) ? product.sizes : ['Standard'];
    const colors = Array.isArray(product.colors) ? product.colors : [{ name: 'Default', hex: '#111' }];
    const details = Array.isArray(product.details) ? product.details : [];

    let thumbsHtml = images.map((img, i) => `
      <img class="qv-thumb ${i === 0 ? 'active' : ''}" src="${img}" alt="${product.name}" onclick="StyleZUI.switchQuickViewImage('${img}', this)">
    `).join('');

    let sizesHtml = sizes.map((s, i) => `
      <button class="qv-size-pill ${i === 0 ? 'active' : ''}" onclick="StyleZUI.selectSize('${s}', this)">${s}</button>
    `).join('');

    let colorsHtml = colors.map((c, i) => `
      <button class="qv-color-chip ${i === 0 ? 'active' : ''}" style="background-color: ${c.hex};" title="${c.name}" onclick="StyleZUI.selectColor('${c.name}', this)"></button>
    `).join('');

    let bulletsHtml = details.map(d => `<li>${d}</li>`).join('');

    modalBody.innerHTML = `
      <div class="quickview-grid">
        <div class="qv-gallery">
          <div class="qv-main-image-container" id="qvMainContainer">
            <img class="qv-main-image" id="qvMainImg" src="${images[0]}" alt="${product.name}">
          </div>
          <div class="qv-thumbnails">
            ${thumbsHtml}
          </div>
        </div>

        <div class="qv-details">
          ${product.badge ? `<span class="qv-badge">${product.badge}</span>` : ''}
          <h2 class="qv-title">${product.name}</h2>
          <div class="qv-price-row">
            <span class="qv-price">$${Number(product.price).toFixed(2)}</span>
            ${product.compare_price ? `<span class="qv-compare">$${Number(product.compare_price).toFixed(2)}</span>` : ''}
          </div>
          <p class="qv-description">${product.description}</p>

          <div class="qv-option-group">
            <div class="qv-option-label">
              <span>Select Size</span>
              <span class="selected-val" id="selectedSizeLabel">${sizes[0]}</span>
            </div>
            <div class="qv-size-selector">
              ${sizesHtml}
            </div>
          </div>

          <div class="qv-option-group">
            <div class="qv-option-label">
              <span>Color Variation</span>
              <span class="selected-val" id="selectedColorLabel">${colors[0]?.name || ''}</span>
            </div>
            <div class="qv-color-selector">
              ${colorsHtml}
            </div>
          </div>

          <div class="qv-stock-status in-stock">
            <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #4ade80;"></span>
            <span>${product.stock > 0 ? `${product.stock} pieces in Milanese atelier` : 'Made to order'}</span>
          </div>

          <div class="qv-actions">
            <div class="qty-stepper" style="border: 1px solid var(--border-gold);">
              <button class="qty-btn" id="qvQtyMinus" onclick="StyleZUI.adjustQvQty(-1)">−</button>
              <span class="qty-value" id="qvQtyVal">1</span>
              <button class="qty-btn" id="qvQtyPlus" onclick="StyleZUI.adjustQvQty(1)">+</button>
            </div>
            <button class="btn btn-gold btn-full" id="qvAddBagBtn" onclick="StyleZUI.addActiveProductToCart()">
              Add to Shopping Bag
            </button>
          </div>

          ${bulletsHtml ? `
            <ul class="qv-details-bullets">
              ${bulletsHtml}
            </ul>
          ` : ''}
        </div>
      </div>
    `;

    // Interactive main image zoom on hover
    const mainContainer = document.getElementById('qvMainContainer');
    const mainImg = document.getElementById('qvMainImg');
    if (mainContainer && mainImg) {
      mainContainer.addEventListener('mousemove', (e) => {
        const rect = mainContainer.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        mainImg.style.transformOrigin = `${x}% ${y}%`;
      });

      mainContainer.addEventListener('mouseleave', () => {
        mainImg.style.transformOrigin = 'center center';
      });
    }

    if (this.elements.quickViewOverlay) {
      this.elements.quickViewOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  },

  switchQuickViewImage(src, thumbElement) {
    const mainImg = document.getElementById('qvMainImg');
    if (mainImg) mainImg.src = src;

    document.querySelectorAll('.qv-thumb').forEach(el => el.classList.remove('active'));
    thumbElement.classList.add('active');
  },

  selectSize(size, pill) {
    document.querySelectorAll('.qv-size-pill').forEach(el => el.classList.remove('active'));
    pill.classList.add('active');
    const label = document.getElementById('selectedSizeLabel');
    if (label) label.textContent = size;
  },

  selectColor(colorName, chip) {
    document.querySelectorAll('.qv-color-chip').forEach(el => el.classList.remove('active'));
    chip.classList.add('active');
    const label = document.getElementById('selectedColorLabel');
    if (label) label.textContent = colorName;
  },

  adjustQvQty(delta) {
    const qtyVal = document.getElementById('qvQtyVal');
    if (!qtyVal) return;
    let current = parseInt(qtyVal.textContent, 10) || 1;
    current += delta;
    if (current < 1) current = 1;
    const maxStock = window.StyleZState.activeProduct?.stock || 20;
    if (current > maxStock) current = maxStock;
    qtyVal.textContent = current;
  },

  addActiveProductToCart() {
    const product = window.StyleZState.activeProduct;
    if (!product) return;

    const size = document.getElementById('selectedSizeLabel')?.textContent || 'Standard';
    const color = document.getElementById('selectedColorLabel')?.textContent || 'Original';
    const qty = parseInt(document.getElementById('qvQtyVal')?.textContent, 10) || 1;

    const added = window.StyleZCart.addItem(product, { size, color, quantity: qty });
    if (added) {
      this.closeQuickView();
      window.StyleZCart.open();
    }
  },

  closeQuickView() {
    if (this.elements.quickViewOverlay) {
      this.elements.quickViewOverlay.classList.remove('open');
      document.body.style.overflow = '';
      window.StyleZState.activeProduct = null;
    }
  },

  initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal-on-scroll:not(.is-visible)');
    if (!('IntersectionObserver' in window)) {
      reveals.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
  }
};

window.StyleZUI = UI;
