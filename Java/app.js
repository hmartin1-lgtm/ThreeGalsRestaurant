const FALLBACK_MENU = [
  {
    id: 'classic-gal',
    name: 'Classic Gal Burger',
    price: 10.5,
    category: 'burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
    shortDescription: 'Double smashed patties, crisp lettuce, tomato, pickles, house green sauce.',
    description: 'A balanced house burger with juicy beef, toasted bun, and a bright green herb sauce that makes it stand out.',
    details: ['Two beef patties', 'Green herb sauce', 'Pickles, onion, tomato', 'Served on toasted brioche'],
    tags: ['Best Seller', 'House Favorite']
  },
  {
    id: 'garden-gal',
    name: 'Garden Gal Burger',
    price: 9.75,
    category: 'burgers',
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=900&q=80',
    shortDescription: 'Vegetarian patty, avocado, spinach, pickled onion, lemon aioli.',
    description: 'A fresh vegetarian option with creamy avocado and a bright finish.',
    details: ['Vegetarian patty', 'Avocado & spinach', 'Pickled red onion', 'Lemon aioli'],
    tags: ['Vegetarian', 'Fresh']
  },
  {
    id: 'triple-stack',
    name: 'Triple Stack',
    price: 12.25,
    category: 'burgers',
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=900&q=80',
    shortDescription: 'Three patties, cheddar, grilled onion, jalapeño relish.',
    description: 'Big flavor and extra height for the hungriest guests.',
    details: ['Three beef patties', 'Sharp cheddar', 'Grilled onion', 'Jalapeño relish'],
    tags: ['Big Bite', 'Spicy']
  },
  {
    id: 'green-fries',
    name: 'Green Herb Fries',
    price: 4.5,
    category: 'sides',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=900&q=80',
    shortDescription: 'Crispy fries tossed in parsley, garlic, and parmesan.',
    description: 'Classic fries with a Three Gals twist.',
    details: ['Crispy cut fries', 'Parsley & garlic butter', 'Parmesan finish'],
    tags: ['Side', 'Popular']
  },
  {
    id: 'sparkling-lime',
    name: 'Sparkling Lime Soda',
    price: 2.95,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=80',
    shortDescription: 'Bright lime soda served ice cold.',
    description: 'A crisp, refreshing drink that pairs with burgers and fries.',
    details: ['Fresh lime profile', 'Served chilled', 'Lightly sparkling'],
    tags: ['Drink', 'Refreshing']
  },
  {
    id: 'mint-shake',
    name: 'Mint Green Shake',
    price: 5.25,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=900&q=80',
    shortDescription: 'Creamy vanilla shake with mint and cookie crumble.',
    description: 'Dessert in a cup, perfect for a treat at the end of your meal.',
    details: ['Vanilla base', 'Mint flavor', 'Cookie crumble topping'],
    tags: ['Shake', 'Sweet']
  }
];

const STORAGE_KEYS = {
  cart: 'threeGalsCart',
  order: 'threeGalsOrder'
};

async function loadMenu() {
  try {
    const response = await fetch('./data/menu.json');
    if (!response.ok) throw new Error('No external menu found');
    return await response.json();
  } catch (error) {
    return FALLBACK_MENU;
  }
}

function money(value) {
  return `$${value.toFixed(2)}`;
}

function getCart() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.cart) || '[]');
}

function setCart(cart) {
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
  updateBagCount();
}

function updateBagCount() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('[data-bag-count]').forEach(el => el.textContent = count);
}

function addToCart(item, quantity = 1) {
  const cart = getCart();
  const existing = cart.find(entry => entry.id === item.id);
  if (existing) existing.quantity += quantity;
  else cart.push({ id: item.id, name: item.name, price: item.price, image: item.image, quantity });
  setCart(cart);
}

function cartTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const service = cart.length ? 1.5 : 0;
  const total = subtotal + service;
  return { subtotal, service, total };
}

function renderMenuCards(items, container) {
  container.innerHTML = items.map(item => `
    <article class="card menu-card">
      <img src="${item.image}" alt="${item.name}">
      <div class="menu-card-body">
        <div class="tag-row">${(item.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
        <h3>${item.name}</h3>
        <p>${item.shortDescription}</p>
        <div class="price-row">
          <span class="price">${money(item.price)}</span>
          <div class="cta-row">
            <a class="btn btn-outline" href="details.html?id=${item.id}">Details</a>
            <button class="btn btn-primary" data-add-id="${item.id}">Add</button>
          </div>
        </div>
      </div>
    </article>
  `).join('');
}

async function initHome() {
  const menu = await loadMenu();
  const featured = menu.slice(0, 3);
  const featuredContainer = document.querySelector('#featured-menu');
  if (!featuredContainer) return;
  renderMenuCards(featured, featuredContainer);
  featuredContainer.querySelectorAll('[data-add-id]').forEach(button => {
    button.addEventListener('click', () => {
      const item = menu.find(entry => entry.id === button.dataset.addId);
      addToCart(item);
      alert(`${item.name} added to bag.`);
    });
  });
}

async function initOrder() {
  const menu = await loadMenu();
  const container = document.querySelector('#order-menu');
  if (!container) return;

  const searchInput = document.querySelector('#menu-search');
  const categorySelect = document.querySelector('#menu-category');

  function applyFilters() {
    const q = searchInput.value.trim().toLowerCase();
    const category = categorySelect.value;
    const filtered = menu.filter(item => {
      const matchesText = [item.name, item.shortDescription, item.category].join(' ').toLowerCase().includes(q);
      const matchesCategory = category === 'all' || item.category === category;
      return matchesText && matchesCategory;
    });
    renderMenuCards(filtered, container);
    container.querySelectorAll('[data-add-id]').forEach(button => {
      button.addEventListener('click', () => {
        const item = menu.find(entry => entry.id === button.dataset.addId);
        addToCart(item);
        alert(`${item.name} added to bag.`);
      });
    });
  }

  applyFilters();
  searchInput.addEventListener('input', applyFilters);
  categorySelect.addEventListener('change', applyFilters);
}

async function initDetails() {
  const target = document.querySelector('#detail-view');
  if (!target) return;
  const menu = await loadMenu();
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || menu[0]?.id;
  const item = menu.find(entry => entry.id === id) || menu[0];

  target.innerHTML = `
    <div class="span-7 card detail-media">
      <img src="${item.image}" alt="${item.name}">
    </div>
    <div class="span-5 card detail-panel">
      <div class="tag-row">${(item.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
      <h2>${item.name}</h2>
      <p>${item.description}</p>
      <p class="price">${money(item.price)}</p>
      <h3>What is included</h3>
      <ul>${(item.details || []).map(detail => `<li>${detail}</li>`).join('')}</ul>
      <div class="cta-row" style="margin-top:16px;">
        <button class="btn btn-primary" id="detail-add">Add to bag</button>
        <a class="btn btn-secondary" href="order.html">Back to menu</a>
      </div>
    </div>
  `;

  document.querySelector('#detail-add').addEventListener('click', () => {
    addToCart(item);
    alert(`${item.name} added to bag.`);
  });
}

function initBag() {
  const cartContainer = document.querySelector('#cart-items');
  if (!cartContainer) return;

  function renderBag() {
    const cart = getCart();
    const summaryTarget = document.querySelector('#bag-summary');

    if (!cart.length) {
      cartContainer.innerHTML = `
        <div class="empty-state">
          <h2>Your bag is empty</h2>
          <p class="muted">Add a burger, side, or drink to begin your order.</p>
          <div class="cta-row" style="justify-content:center;margin-top:16px;">
            <a class="btn btn-primary" href="order.html">Browse menu</a>
          </div>
        </div>
      `;
      summaryTarget.innerHTML = `
        <h3>Order summary</h3>
        <p class="muted">No items yet.</p>
      `;
      return;
    }

    cartContainer.innerHTML = cart.map(item => `
      <article class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div>
          <h3>${item.name}</h3>
          <p class="muted">${money(item.price)} each</p>
          <button class="btn btn-outline" data-remove-id="${item.id}" style="margin-top:10px;">Remove</button>
        </div>
        <div class="text-right">
          <div class="qty-control">
            <button data-qty-id="${item.id}" data-direction="down">−</button>
            <span>${item.quantity}</span>
            <button data-qty-id="${item.id}" data-direction="up">+</button>
          </div>
          <div class="price" style="margin-top:10px;">${money(item.price * item.quantity)}</div>
        </div>
      </article>
    `).join('');

    const totals = cartTotals();
    summaryTarget.innerHTML = `
      <h3>Order summary</h3>
      <div class="summary-line"><span>Subtotal</span><strong>${money(totals.subtotal)}</strong></div>
      <div class="summary-line"><span>Service fee</span><strong>${money(totals.service)}</strong></div>
      <div class="summary-line"><span class="summary-total">Total</span><span class="summary-total">${money(totals.total)}</span></div>
      <div class="cta-row" style="margin-top:16px;">
        <a class="btn btn-primary" href="checkout.html">Go to checkout</a>
        <a class="btn btn-secondary" href="order.html">Add more</a>
      </div>
    `;

    cartContainer.querySelectorAll('[data-qty-id]').forEach(button => {
      button.addEventListener('click', () => {
        const cart = getCart();
        const item = cart.find(entry => entry.id === button.dataset.qtyId);
        if (!item) return;
        item.quantity += button.dataset.direction === 'up' ? 1 : -1;
        const updated = cart.filter(entry => entry.quantity > 0);
        setCart(updated);
        renderBag();
      });
    });

    cartContainer.querySelectorAll('[data-remove-id]').forEach(button => {
      button.addEventListener('click', () => {
        const updated = getCart().filter(entry => entry.id !== button.dataset.removeId);
        setCart(updated);
        renderBag();
      });
    });
  }

  renderBag();
}

function initCheckout() {
  const form = document.querySelector('#checkout-form');
  const summaryTarget = document.querySelector('#checkout-summary');
  if (!form || !summaryTarget) return;

  const cart = getCart();
  const totals = cartTotals();
  if (!cart.length) {
    window.location.href = 'bag.html';
    return;
  }

  summaryTarget.innerHTML = `
    <h3>Review</h3>
    ${cart.map(item => `<div class="summary-line"><span>${item.quantity} × ${item.name}</span><strong>${money(item.price * item.quantity)}</strong></div>`).join('')}
    <div class="summary-line"><span>Subtotal</span><strong>${money(totals.subtotal)}</strong></div>
    <div class="summary-line"><span>Service fee</span><strong>${money(totals.service)}</strong></div>
    <div class="summary-line"><span class="summary-total">Total</span><span class="summary-total">${money(totals.total)}</span></div>
  `;

  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const orderNumber = `TG-${Date.now().toString().slice(-6)}`;
    const order = {
      orderNumber,
      customer: data,
      cart,
      totals,
      pickupTime: data.pickupTime || 'ASAP'
    };
    localStorage.setItem(STORAGE_KEYS.order, JSON.stringify(order));
    localStorage.removeItem(STORAGE_KEYS.cart);
    window.location.href = 'confirmation.html';
  });
}

function initConfirmation() {
  const target = document.querySelector('#confirmation-card');
  if (!target) return;
  const order = JSON.parse(localStorage.getItem(STORAGE_KEYS.order) || 'null');
  if (!order) {
    target.innerHTML = `
      <div class="empty-state">
        <h2>No recent order found</h2>
        <p class="muted">Place an order to see confirmation details here.</p>
        <div class="cta-row" style="justify-content:center;margin-top:16px;">
          <a class="btn btn-primary" href="order.html">Start order</a>
        </div>
      </div>
    `;
    return;
  }

  target.innerHTML = `
    <div class="notice">Demo flow only. No payment is collected on this website.</div>
    <h2 style="margin-bottom:0;">Thanks, ${order.customer.firstName}.</h2>
    <p class="muted">Your order has been received and is being prepared.</p>
    <div class="summary-line"><span>Order number</span><strong>${order.orderNumber}</strong></div>
    <div class="summary-line"><span>Pickup name</span><strong>${order.customer.firstName} ${order.customer.lastName}</strong></div>
    <div class="summary-line"><span>Pickup time</span><strong>${order.pickupTime}</strong></div>
    <div class="summary-line"><span>Contact</span><strong>${order.customer.email}</strong></div>
    <div class="summary-line"><span>Total</span><strong>${money(order.totals.total)}</strong></div>
    <div class="cta-row" style="margin-top:16px;">
      <a class="btn btn-primary" href="order.html">Order again</a>
      <a class="btn btn-secondary" href="index.html">Back home</a>
    </div>
  `;
}

function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav]').forEach(link => {
    if (link.getAttribute('href') === page) link.classList.add('active');
  });
}

function initApp() {
  updateBagCount();
  setActiveNav();
  initHome();
  initOrder();
  initDetails();
  initBag();
  initCheckout();
  initConfirmation();
}

document.addEventListener('DOMContentLoaded', initApp);
