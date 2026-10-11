/**
 * StyleZ - Checkout Module
 * Handles client-side form collection, server price/stock validation, and demo order completion
 */

const Checkout = {
  elements: {},

  init() {
    this.elements = {
      modalOverlay: document.getElementById('checkoutModalOverlay'),
      closeBtn: document.getElementById('closeCheckoutBtn'),
      form: document.getElementById('checkoutForm'),
      itemsPreview: document.getElementById('checkoutItemsPreview'),
      subtotalText: document.getElementById('checkoutSubtotalText'),
      shippingText: document.getElementById('checkoutShippingText'),
      taxText: document.getElementById('checkoutTaxText'),
      totalText: document.getElementById('checkoutTotalText'),
      submitBtn: document.getElementById('placeOrderBtn'),
      errorBanner: document.getElementById('checkoutErrorBanner'),

      // Success modal
      successOverlay: document.getElementById('orderSuccessModalOverlay'),
      closeSuccessBtn: document.getElementById('closeSuccessBtn'),
      successOrderNumber: document.getElementById('successOrderNumber'),
      successReceiptBody: document.getElementById('successReceiptBody'),
      continueShoppingBtn: document.getElementById('successContinueBtn'),
      viewOrderHistoryBtn: document.getElementById('successViewOrdersBtn')
    };

    this.bindEvents();
  },

  bindEvents() {
    if (this.elements.closeBtn) {
      this.elements.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.elements.modalOverlay) {
      this.elements.modalOverlay.addEventListener('click', (e) => {
        if (e.target === this.elements.modalOverlay) {
          this.close();
        }
      });
    }

    if (this.elements.form) {
      this.elements.form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.submitOrder();
      });
    }

    // Success modal controls
    if (this.elements.closeSuccessBtn) {
      this.elements.closeSuccessBtn.addEventListener('click', () => this.closeSuccess());
    }
    if (this.elements.continueShoppingBtn) {
      this.elements.continueShoppingBtn.addEventListener('click', () => this.closeSuccess());
    }
    if (this.elements.viewOrderHistoryBtn) {
      this.elements.viewOrderHistoryBtn.addEventListener('click', () => {
        this.closeSuccess();
        window.StyleZOrders.open();
      });
    }
  },

  open() {
    if (window.StyleZState.cart.length === 0) {
      window.StyleZUI.showToast('Bag Empty', 'Please add items before checking out.', 'warning');
      return;
    }

    this.hideError();
    this.prefillUser();
    this.renderSummary();

    if (this.elements.modalOverlay) {
      this.elements.modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  },

  close() {
    if (this.elements.modalOverlay) {
      this.elements.modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
      this.hideError();
    }
  },

  prefillUser() {
    const user = window.StyleZState.user;
    const nameInput = document.getElementById('checkoutName');
    const emailInput = document.getElementById('checkoutEmail');

    if (user) {
      if (nameInput && !nameInput.value) nameInput.value = user.name;
      if (emailInput && !emailInput.value) emailInput.value = user.email;
    }
  },

  renderSummary() {
    const metrics = window.StyleZState.getCartMetrics();

    if (this.elements.subtotalText) {
      this.elements.subtotalText.textContent = `$${metrics.subtotal.toFixed(2)}`;
    }
    if (this.elements.shippingText) {
      this.elements.shippingText.textContent = metrics.shippingFee === 0 ? 'Complimentary' : `$${metrics.shippingFee.toFixed(2)}`;
    }
    if (this.elements.taxText) {
      this.elements.taxText.textContent = `$${metrics.tax.toFixed(2)}`;
    }
    if (this.elements.totalText) {
      this.elements.totalText.textContent = `$${metrics.total.toFixed(2)}`;
    }

    if (this.elements.itemsPreview) {
      let html = '';
      for (const item of window.StyleZState.cart) {
        const itemTotal = (item.price * item.quantity).toFixed(2);
        html += `
          <div class="checkout-preview-item">
            <img class="checkout-preview-thumb" src="${item.image}" alt="${item.name}">
            <div class="checkout-preview-info">
              <div class="checkout-preview-name">${item.name}</div>
              <div class="checkout-preview-meta">Qty: ${item.quantity} • ${item.size} • ${item.color}</div>
            </div>
            <div class="checkout-preview-price">$${itemTotal}</div>
          </div>
        `;
      }
      this.elements.itemsPreview.innerHTML = html;
    }
  },

  showError(msg) {
    if (this.elements.errorBanner) {
      this.elements.errorBanner.textContent = msg;
      this.elements.errorBanner.style.display = 'block';
    }
  },

  hideError() {
    if (this.elements.errorBanner) {
      this.elements.errorBanner.style.display = 'none';
    }
  },

  async submitOrder() {
    this.hideError();

    const name = document.getElementById('checkoutName')?.value.trim();
    const email = document.getElementById('checkoutEmail')?.value.trim();
    const phone = document.getElementById('checkoutPhone')?.value.trim();
    const address = document.getElementById('checkoutAddress')?.value.trim();
    const city = document.getElementById('checkoutCity')?.value.trim();
    const postal = document.getElementById('checkoutPostal')?.value.trim();
    const country = document.getElementById('checkoutCountry')?.value.trim() || 'United States';
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'Demo Card (Instant Approval)';

    if (!name || !email || !address || !city || !postal) {
      this.showError('Please complete all required shipping fields.');
      return;
    }

    const payload = {
      items: window.StyleZState.cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        size: item.size,
        color: item.color
      })),
      customer: {
        name,
        email,
        phone,
        shippingAddress: address,
        city,
        postalCode: postal,
        country
      },
      paymentMethod
    };

    try {
      if (this.elements.submitBtn) {
        this.elements.submitBtn.disabled = true;
        this.elements.submitBtn.textContent = 'Authenticating & Placing Order...';
      }

      const res = await window.StyleZAPI.checkout.submit(payload);

      // Order successfully placed!
      this.close();
      window.StyleZCart.clearCart();

      // Show Order Success Modal
      this.openSuccess(res.order, res.items, res.demoNotice);

      // Re-fetch products to update stock numbers on cards
      if (window.StyleZApp) {
        window.StyleZApp.loadProducts();
      }
    } catch (err) {
      this.showError(err.message || 'Failed to complete checkout. Please review items.');
    } finally {
      if (this.elements.submitBtn) {
        this.elements.submitBtn.disabled = false;
        this.elements.submitBtn.textContent = 'Authorize Demo Order';
      }
    }
  },

  openSuccess(order, items, demoNotice) {
    if (this.elements.successOrderNumber) {
      this.elements.successOrderNumber.textContent = order.order_number;
    }

    if (this.elements.successReceiptBody) {
      let itemsHtml = items.map(item => `
        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 0.4rem 0; border-bottom: 1px dashed var(--border-subtle);">
          <span>${item.product_name} <small style="color: var(--ivory-muted);">(${item.size || 'Std'}, x${item.quantity})</small></span>
          <strong style="color: var(--gold-light);">$${Number(item.subtotal).toFixed(2)}</strong>
        </div>
      `).join('');

      this.elements.successReceiptBody.innerHTML = `
        <div style="margin-bottom: 1rem;">
          <p style="font-size: 0.85rem; color: var(--ivory-secondary); margin-bottom: 0.25rem;">
            Recipient: <strong>${order.customer_name}</strong> (${order.customer_email})
          </p>
          <p style="font-size: 0.85rem; color: var(--ivory-muted);">
            Destination: ${order.shipping_address}, ${order.city}, ${order.postal_code}, ${order.country}
          </p>
          <p style="font-size: 0.85rem; color: var(--ivory-muted);">
            Payment Method: <span style="color: var(--gold-primary); font-weight: 500;">${order.payment_method}</span>
          </p>
        </div>
        <div style="margin-bottom: 1rem;">
          ${itemsHtml}
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--ivory-muted); margin-bottom: 0.25rem;">
          <span>Subtotal</span>
          <span>$${Number(order.subtotal).toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--ivory-muted); margin-bottom: 0.25rem;">
          <span>White Glove Courier</span>
          <span>${Number(order.shipping_fee) === 0 ? 'Complimentary' : '$' + Number(order.shipping_fee).toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--ivory-muted); margin-bottom: 0.5rem;">
          <span>Estimated Tax</span>
          <span>$${Number(order.tax).toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 1.15rem; font-weight: 700; color: var(--ivory-white); padding-top: 0.5rem; border-top: 1px solid var(--border-gold);">
          <span>Total</span>
          <span style="font-family: var(--font-display); color: var(--gold-light);">$${Number(order.total).toFixed(2)}</span>
        </div>
        <div style="margin-top: 1.25rem; padding: 0.75rem; background: rgba(212,175,55,0.08); border: 1px solid var(--border-gold); border-radius: var(--radius-sm); font-size: 0.75rem; color: var(--gold-light); text-align: center;">
          ${demoNotice || 'Notice: This was a simulated checkout. No real payment was processed.'}
        </div>
      `;
    }

    if (this.elements.successOverlay) {
      this.elements.successOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  },

  closeSuccess() {
    if (this.elements.successOverlay) {
      this.elements.successOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
};

window.StyleZCheckout = Checkout;
