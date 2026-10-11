/**
 * StyleZ - Application State Store
 * Manages shopping cart, active user session, catalog filters & active modals
 */

const CART_STORAGE_KEY = 'stylez_shopping_cart_v1';

const state = {
  user: null,
  cart: [],
  products: [],
  categories: [],
  filters: {
    category: 'all',
    q: '',
    maxPrice: 1200,
    sort: 'featured'
  },
  activeProduct: null,
  wishlist: new Set(),

  // Load cart from localStorage
  initCart() {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        this.cart = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse cart from storage:', e);
      this.cart = [];
    }
  },

  // Save cart to localStorage
  saveCart() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.cart));
    } catch (e) {
      console.warn('Failed to save cart to storage:', e);
    }
  },

  // Calculate cart metrics
  getCartMetrics() {
    let count = 0;
    let subtotal = 0;

    for (const item of this.cart) {
      count += item.quantity;
      subtotal += item.price * item.quantity;
    }

    subtotal = Math.round(subtotal * 100) / 100;
    const freeShippingThreshold = 300;
    const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 25;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const total = Math.round((subtotal + shippingFee + tax) * 100) / 100;
    const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
    const amountRemainingForFreeShipping = Math.max(0, Math.round((freeShippingThreshold - subtotal) * 100) / 100);

    return {
      count,
      subtotal,
      shippingFee,
      tax,
      total,
      freeShippingThreshold,
      progressToFreeShipping,
      amountRemainingForFreeShipping
    };
  }
};

state.initCart();
window.StyleZState = state;
