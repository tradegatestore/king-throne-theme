/* King Throne Theme - Main JavaScript */
(function() {
  'use strict';

  // FAQ Accordion
  class FAQAccordion {
    constructor() {
      this.items = document.querySelectorAll('.faq__item');
      this.init();
    }
    init() {
      this.items.forEach(item => {
        const question = item.querySelector('.faq__question');
        if (question) {
          question.addEventListener('click', () => this.toggle(item));
        }
      });
    }
    toggle(item) {
      const isActive = item.classList.contains('active');
      this.items.forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    }
  }

  // Collection Tabs
  class CollectionTabs {
    constructor() {
      this.container = document.querySelector('[data-collection-tabs]');
      if (!this.container) return;
      this.buttons = this.container.querySelectorAll('.collection-tabs__btn');
      this.init();
    }
    init() {
      this.buttons.forEach(btn => {
        btn.addEventListener('click', () => this.switchTab(btn));
      });
    }
    switchTab(activeBtn) {
      this.buttons.forEach(btn => btn.classList.remove('active'));
      activeBtn.classList.add('active');
    }
  }

  // Product Cards
  class ProductCards {
    constructor() {
      this.cards = document.querySelectorAll('.product-card');
      this.init();
    }
    init() {
      this.cards.forEach(card => {
        const swatches = card.querySelectorAll('.product-card__variant-swatch');
        swatches.forEach(swatch => {
          swatch.addEventListener('click', () => this.selectVariant(card, swatch));
        });
        const addBtn = card.querySelector('.product-card__add-to-cart');
        if (addBtn) addBtn.addEventListener('click', (e) => this.addToCart(e, card));
      });
    }
    selectVariant(card, swatch) {
      card.querySelectorAll('.product-card__variant-swatch').forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
    }
    async addToCart(e, card) {
      e.preventDefault();
      const btn = card.querySelector('.product-card__add-to-cart');
      const variantId = btn.dataset.variantId;
      btn.textContent = 'Adding...';
      btn.disabled = true;
      try {
        const response = await fetch(window.routes.cart_add_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ items: [{ id: variantId, quantity: 1 }] })
        });
        if (response.ok) {
          btn.textContent = 'Added!';
          setTimeout(() => { btn.textContent = 'Add to Cart'; btn.disabled = false; }, 2000);
          this.updateCartCount();
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        btn.textContent = 'Add to Cart';
        btn.disabled = false;
      }
    }
    async updateCartCount() {
      const response = await fetch('/cart.js');
      const cart = await response.json();
      const countEl = document.querySelector('.header__cart-count');
      if (countEl) countEl.textContent = cart.item_count;
    }
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    new FAQAccordion();
    new CollectionTabs();
    new ProductCards();
  });
})();
