/**
 * StyleZ - Order History Module
 * Displays user order archives, statuses, item previews and downloadable receipts
 */

const Orders = {
  elements: {},

  init() {
    this.elements = {
      modalOverlay: document.getElementById('ordersModalOverlay'),
      closeBtn: document.getElementById('closeOrdersBtn'),
      listContainer: document.getElementById('ordersListContainer'),
      navLink: document.getElementById('navOrdersLink')
    };

    this.bindEvents();
  },

  bindEvents() {
    if (this.elements.closeBtn) {
      this.elements.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.elements.navLink) {
      this.elements.navLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    }

    if (this.elements.modalOverlay) {
      this.elements.modalOverlay.addEventListener('click', (e) => {
        if (e.target === this.elements.modalOverlay) {
          this.close();
        }
      });
    }
  },

  async open() {
    if (!window.StyleZState.user) {
      window.StyleZUI.showToast('Authentication Required', 'Please sign in to view your Order Archives.', 'info');
      window.StyleZAuth.open('login');
      return;
    }

    if (this.elements.modalOverlay) {
      this.elements.modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    await this.fetchAndRender();
  },

  close() {
    if (this.elements.modalOverlay) {
      this.elements.modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  },

  async fetchAndRender() {
    if (!this.elements.listContainer) return;

    this.elements.listContainer.innerHTML = `
      <div style="text-align: center; padding: 3rem; color: var(--gold-light);">
        <p style="font-family: var(--font-display); letter-spacing: 0.1em;">Retrieving your haute couture archives...</p>
      </div>
    `;

    try {
      const data = await window.StyleZAPI.orders.getMyOrders();
      const orders = data.orders || [];

      if (orders.length === 0) {
        this.elements.listContainer.innerHTML = `
          <div style="text-align: center; padding: 4rem 1rem;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 1.5rem auto; color: var(--border-gold);">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <h4 style="font-family: var(--font-display); font-size: 1.25rem; margin-bottom: 0.5rem; color: var(--ivory-white);">No Order History Found</h4>
            <p style="font-size: 0.85rem; color: var(--ivory-muted); max-width: 320px; margin: 0 auto 1.5rem auto;">
              You have not placed any orders with StyleZ yet. Explore our latest runway collection to get started.
            </p>
            <button class="btn btn-gold btn-sm" onclick="StyleZOrders.close()">Explore Haute Couture</button>
          </div>
        `;
        return;
      }

      let html = '';
      for (const order of orders) {
        const orderDate = new Date(order.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });

        let statusClass = 'confirmed';
        if (order.status.toLowerCase() === 'delivered') statusClass = 'delivered';
        if (order.status.toLowerCase() === 'processing') statusClass = 'processing';

        // Thumbnails of items
        let thumbsHtml = '';
        if (Array.isArray(order.items)) {
          for (const item of order.items) {
            thumbsHtml += `
              <div class="order-thumb-wrap" title="${item.product_name}">
                <img src="${item.product_image || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=200&q=80'}" alt="${item.product_name}" loading="lazy">
                <span class="qty-tag">x${item.quantity}</span>
              </div>
            `;
          }
        }

        html += `
          <div class="order-card-item">
            <div class="order-card-header">
              <div>
                <span class="order-id-tag">${order.order_number}</span>
                <span style="font-size: 0.78rem; color: var(--ivory-muted); margin-left: 0.75rem;">Placed on ${orderDate}</span>
              </div>
              <span class="order-status-pill ${statusClass}">${order.status}</span>
            </div>

            <div class="order-items-row">
              ${thumbsHtml}
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 0.85rem; font-size: 0.85rem;">
              <div>
                <span style="color: var(--ivory-muted);">Shipped to: </span>
                <strong style="color: var(--ivory-secondary);">${order.shipping_address}, ${order.city}</strong>
              </div>
              <div>
                <span style="color: var(--ivory-muted); margin-right: 0.5rem;">Order Total:</span>
                <strong style="font-family: var(--font-display); font-size: 1.15rem; color: var(--gold-light);">$${Number(order.total).toFixed(2)}</strong>
              </div>
            </div>
          </div>
        `;
      }

      this.elements.listContainer.innerHTML = html;
    } catch (err) {
      console.error('Failed to load orders:', err);
      this.elements.listContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #ef4444;">
          <p>Unable to retrieve order history. Please try again later.</p>
        </div>
      `;
    }
  }
};

window.StyleZOrders = Orders;
