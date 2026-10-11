/**
 * StyleZ - Shopping Cart Module
 * Sliding cart drawer, quantity steppers, server stock bounds & subtotal calculations
 */

const Cart = {
  elements: {},

  init() {
    this.elements = {
      drawerOverlay: document.getElementById('cartDrawerOverlay'),
      openBtn: document.getElementById('openCartBtn'),
      closeBtn: document.getElementById('closeCartBtn'),
      itemsContainer: document.getElementById('cartItemsContainer'),
      countBadge: document.getElementById('cartCountBadge'),
      headerCount: document.getElementById('cartHeaderCount'),
      subtotalAmount: document.getElementById('cartSubtotalAmount'),
      shippingNotice: document.getElementById('cartShippingNotice'),
      shippingBarFill: document.getElementById('cartShippingBarFill'),
      shippingText: document.getElementById('cartShippingText'),
      checkoutBtn: document.getElementById('cartCheckoutBtn'),
      continueShoppingBtn: document.getElementById('cartContinueShoppingBtn')
    };

    this.bindEvents();
    this.render();
  },

  bindEvents() {
    if (this.elements.openBtn) {
      this.elements.openBtn.addEventListener('click', () => this.open());
    }

    if (this.elements.closeBtn) {
      this.elements.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.elements.continueShoppingBtn) {
      this.elements.continueShoppingBtn.addEventListener('click', () => this.close());
    }

    // Close on overlay backdrop click
    if (this.elements.drawerOverlay) {
      this.elements.drawerOverlay.addEventListener('click', (e) => {
        if (e.target === this.elements.drawerOverlay) {
          this.close();
        }
      });
    }

    // Proceed to checkout button
    if (this.elements.checkoutBtn) {
      this.elements.checkoutBtn.addEventListener('click', () => {
        if (window.StyleZState.cart.length === 0) {
          window.StyleZUI.showToast('Bag Empty', 'Please select a garment before checking out.', 'info');
          return;
        }
        this.close();
        window.StyleZCheckout.open();
      });
    }
  },

  open() {
    if (this.elements.drawerOverlay) {
      this.elements.drawerOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      this.render();
    }
  },

  close() {
    if (this.elements.drawerOverlay) {
      this.elements.drawerOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  },

  addItem(product, options = {}) {
    const size = options.size || (product.sizes && product.sizes[0]) || 'Standard';
    const color = options.color || (product.colors && product.colors[0]?.name) || 'Original';
    const quantity = options.quantity || 1;

    // Check if item with identical product ID, size, and color exists
    const existingIndex = window.StyleZState.cart.findIndex(
      item => item.productId === product.id && item.size === size && item.color === color
    );

    let primaryImage = '';
    if (Array.isArray(product.images) && product.images.length > 0) {
      primaryImage = product.images[0];
    } else if (typeof product.images === 'string') {
      try {
        const parsed = JSON.parse(product.images);
        primaryImage = parsed[0] || '';
      } catch (e) {
        primaryImage = '';
      }
    }

    if (existingIndex > -1) {
      const currentQty = window.StyleZState.cart[existingIndex].quantity;
      if (currentQty + quantity > product.stock) {
        window.StyleZUI.showToast(
          'Maximum Stock Reached',
          `Only ${product.stock} units of ${product.name} are available.`,
          'warning'
        );
        return false;
      }
      window.StyleZState.cart[existingIndex].quantity += quantity;
    } else {
      if (quantity > product.stock) {
        window.StyleZUI.showToast(
          'Insufficient Stock',
          `Only ${product.stock} units are currently available.`,
          'warning'
        );
        return false;
      }

      window.StyleZState.cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: primaryImage,
        size: size,
        color: color,
        quantity: quantity,
        stock: product.stock
      });
    }

    window.StyleZState.saveCart();
    this.render();
    this.triggerBadgeAnimation();

    window.StyleZUI.showToast(
      'Added to Bag',
      `${product.name} (${size}) has been added to your shopping bag.`,
      'success'
    );

    return true;
  },

  updateQuantity(index, newQty) {
    if (index < 0 || index >= window.StyleZState.cart.length) return;

    const item = window.StyleZState.cart[index];

    if (newQty <= 0) {
      this.removeItem(index);
      return;
    }

    if (newQty > item.stock) {
      window.StyleZUI.showToast(
        'Stock Limit',
        `Cannot add more than ${item.stock} units of this piece.`,
        'warning'
      );
      return;
    }

    item.quantity = newQty;
    window.StyleZState.saveCart();
    this.render();
  },

  removeItem(index) {
    if (index < 0 || index >= window.StyleZState.cart.length) return;
    const removed = window.StyleZState.cart.splice(index, 1)[0];
    window.StyleZState.saveCart();
    this.render();

    window.StyleZUI.showToast(
      'Removed from Bag',
      `${removed.name} has been removed.`,
      'info'
    );
  },

  clearCart() {
    window.StyleZState.cart = [];
    window.StyleZState.saveCart();
    this.render();
  },

  triggerBadgeAnimation() {
    if (this.elements.countBadge) {
      this.elements.countBadge.classList.add('bump');
      setTimeout(() => {
        this.elements.countBadge.classList.remove('bump');
      }, 300);
    }
  },

  render() {
    const metrics = window.StyleZState.getCartMetrics();

    // Update Badges
    if (this.elements.countBadge) {
      this.elements.countBadge.textContent = metrics.count;
      this.elements.countBadge.style.display = metrics.count > 0 ? 'flex' : 'none';
    }

    if (this.elements.headerCount) {
      this.elements.headerCount.textContent = `(${metrics.count} item${metrics.count === 1 ? '' : 's'})`;
    }

    if (this.elements.subtotalAmount) {
      this.elements.subtotalAmount.textContent = `$${metrics.subtotal.toFixed(2)}`;
    }

    // Shipping progress bar
    if (this.elements.shippingBarFill && this.elements.shippingText) {
      this.elements.shippingBarFill.style.width = `${metrics.progressToFreeShipping}%`;
      if (metrics.amountRemainingForFreeShipping === 0 && metrics.count > 0) {
        this.elements.shippingText.innerHTML = `<span>✦</span> Complimentary White-Glove Shipping Unlocked!`;
      } else {
        this.elements.shippingText.innerHTML = `<span>✦</span> Add <strong>$${metrics.amountRemainingForFreeShipping.toFixed(2)}</strong> more for complimentary delivery.`;
      }
    }

    // Render items list
    if (!this.elements.itemsContainer) return;

    if (window.StyleZState.cart.length === 0) {
      this.elements.itemsContainer.innerHTML = `
        <div class="cart-empty-state">
          <svg class="cart-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <h4 class="cart-empty-title">Your Bag is Empty</h4>
          <p class="cart-empty-desc">Discover our winter/spring haute couture drops and add timeless elegance to your wardrobe.</p>
          <button class="btn btn-outline-gold btn-sm" onclick="StyleZCart.close()">Discover Collection</button>
        </div>
      `;
      if (this.elements.checkoutBtn) {
        this.elements.checkoutBtn.disabled = true;
      }
      return;
    }

    if (this.elements.checkoutBtn) {
      this.elements.checkoutBtn.disabled = false;
    }

    let html = '';
    window.StyleZState.cart.forEach((item, index) => {
      const itemSubtotal = (item.price * item.quantity).toFixed(2);
      html += `
        <div class="cart-item">
          <img class="cart-item-image" src="${item.image}" alt="${item.name}" loading="lazy">
          <div class="cart-item-details">
            <h5 class="cart-item-name">${item.name}</h5>
            <div class="cart-item-meta">
              <span>Size: <strong>${item.size}</strong></span>
              <span>•</span>
              <span>Color: <strong>${item.color}</strong></span>
            </div>
            <div class="cart-item-price-row">
              <span class="cart-item-price">$${itemSubtotal}</span>
              <div class="qty-stepper">
                <button class="qty-btn" onclick="StyleZCart.updateQuantity(${index}, ${item.quantity - 1})" aria-label="Decrease quantity">−</button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn" onclick="StyleZCart.updateQuantity(${index}, ${item.quantity + 1})" aria-label="Increase quantity">+</button>
              </div>
            </div>
          </div>
          <button class="cart-item-remove-btn" onclick="StyleZCart.removeItem(${index})" title="Remove item" aria-label="Remove item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      `;
    });

    this.elements.itemsContainer.innerHTML = html;
  }
};

window.StyleZCart = Cart;
