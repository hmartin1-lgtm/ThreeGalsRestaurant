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

const TOPPINGS = [
  { id: 'cheese', name: 'Cheese', price: 1.00 },
  { id: 'bacon', name: 'Bacon', price: 2.00 },
  { id: 'avocado', name: 'Avocado', price: 1.50 },
  { id: 'jalapenos', name: 'Jalapeños', price: 0.50 },
  { id: 'grilled-onions', name: 'Grilled Onions', price: 0.75 },
  { id: 'extra-patty', name: 'Extra Patty', price: 3.00 },
  { id: 'lettuce', name: 'Lettuce', price: 0.00 },
  { id: 'tomato', name: 'Tomato', price: 0.00 },
  { id: 'onion', name: 'Onion', price: 0.00 },
  { id: 'pickles', name: 'Pickles', price: 0.00 }
];

const MIX_INS = [
  { id: 'oreo', name: 'Oreo Crumble', price: 1.00 },
  { id: 'm&m', name: 'M&M', price: 1.00 },
  { id: 'peanut-butter', name: 'Peanut Butter', price: 1.50 },
  { id: 'banana', name: 'Banana', price: 0.75 },
  { id: 'strawberry', name: 'Strawberry', price: 0.75 },
  { id: 'chocolate-chips', name: 'Chocolate Chips', price: 1.00 },
  { id: 'whipped-cream', name: 'Whipped Cream', price: 0.50 }
];

let currentItem = null;

async function loadMenu() {
  try {
    const response = await fetch('/data/menu.json');
    if (!response.ok) throw new Error('No external menu found');
    var jsonData = await response.json();
    return ConvertedJson(jsonData);
  } catch (error) {
    return FALLBACK_MENU;
  }
}

async function loadToppings() {
  try {
    const menu = await loadMenu();
    return menu.filter(item => item.category === 'Toppings').map(item => ({
      id: item.id,
      name: item.name,
      price: item.price
    }));
  } catch (error) {
    // Fallback to hardcoded toppings if menu loading fails
    return [
      { id: 'Ketchup', name: 'Ketchup', price: 0.75 },
      { id: 'Mustard', name: 'Mustard', price: 0.75 },
      { id: 'Pickles', name: 'Pickles', price: 0.75 },
      { id: 'Onions', name: 'Onions', price: 0.75 },
      { id: 'Lettuce', name: 'Lettuce', price: 0.75 },
      { id: 'Tomato', name: 'Tomato', price: 0.75 },
      { id: 'Bacon', name: 'Bacon', price: 0.75 },
      { id: 'Avocado', name: 'Avocado', price: 0.75 }
    ];
  }
}
function ConvertedJson(jsonData) {
  // Convert details and tags from csv format to arrays
  jsonData.forEach(element => {
     var myDetails = element.details
     if (myDetails === String) {
          element.details = myDetails.split(',')
     }
     myDetails = element.tags
     if (myDetails === String) {
          element.tags = myDetails.split(',')
     }
});
  return jsonData
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

function addToCart(item, quantity = 1, addIns = []) {
  const cart = getCart();
  const existing = cart.find(entry => entry.id === item.id && JSON.stringify(entry.addIns || []) === JSON.stringify(addIns));
  if (existing) existing.quantity += quantity;
  else cart.push({ id: item.id, name: item.name, price: item.price, image: item.image, quantity, addIns });
  setCart(cart);
}

function needsCustomization(item) {
  return item.category === 'burgers' || item.category === 'hot-dogs' || (item.category === 'drinks' && (item.name.toLowerCase().includes('shake') || item.id.includes('milkshake')));
}

function handleAddToCart(item) {
  if (needsCustomization(item)) {
    currentItem = item;
    const isOnOrderOrDetails = window.location.pathname.includes('order.html') || window.location.pathname.includes('details.html');
    if (isOnOrderOrDetails) {
      showToppingsModal(item);
    } else {
      window.location.href = `toppings.html?id=${item.id}`;
    }
  } else {
    addToCart(item);
    alert(`${item.name} added to bag.`);
  }
}

function cartTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => {
    const addInsPrice = (item.addIns || []).reduce((addSum, addIn) => addSum + addIn.price, 0);
    return sum + (item.price + addInsPrice) * item.quantity;
  }, 0);
  const service = cart.length ? 1.5 : 0;
  const total = subtotal + service;
  return { subtotal, service, total };
}

function renderMenuCards(items, container) {
  container.innerHTML = items.map(item => `
    <article class="card menu-card">
      <img src="/Images/${item.image}" alt="${item.name}">
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
      handleAddToCart(item);
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
    const normalizedCategory = category.toLowerCase();
    const filtered = menu.filter(item => {
      const matchesText = [item.name, item.shortDescription, item.category].join(' ').toLowerCase().includes(q);
      const itemCategory = (item.category || '').toLowerCase();
      const matchesCategory = category === 'all' || itemCategory === normalizedCategory;
      return matchesText && matchesCategory;
    });
    renderMenuCards(filtered, container);
    container.querySelectorAll('[data-add-id]').forEach(button => {
      button.addEventListener('click', () => {
        const item = menu.find(entry => entry.id === button.dataset.addId);
        handleAddToCart(item);
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
      <img src="/Images/${item.image}" alt="${item.name}">
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
    handleAddToCart(item);
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

    cartContainer.innerHTML = cart.map((item, index) => {
      const addInsPrice = (item.addIns || []).reduce((sum, addIn) => sum + addIn.price, 0);
      const itemPrice = item.price + addInsPrice;
      const addInsText = item.addIns && item.addIns.length ? `<br><small class="muted">${item.addIns.map(a => a.name).join(', ')}</small>` : '';
      return `
      <article class="cart-item">
        <img src="/Images/${item.image}" alt="${item.name}">
        <div>
          <h3>${item.name}${addInsText}</h3>
          <p class="muted">${money(itemPrice)} each</p>
          <button class="btn btn-outline" data-remove-index="${index}" style="margin-top:10px;">Remove</button>
        </div>
        <div class="text-right">
          <div class="qty-control">
            <button data-qty-index="${index}" data-direction="down">−</button>
            <span>${item.quantity}</span>
            <button data-qty-index="${index}" data-direction="up">+</button>
          </div>
          <div class="price" style="margin-top:10px;">${money(itemPrice * item.quantity)}</div>
        </div>
      </article>
    `;}).join('');

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
    ${cart.map(item => {
      const addInsPrice = (item.addIns || []).reduce((sum, addIn) => sum + addIn.price, 0);
      const itemTotal = (item.price + addInsPrice) * item.quantity;
      const addInsText = item.addIns && item.addIns.length ? ` (${item.addIns.map(a => a.name).join(', ')})` : '';
      return `<div class="summary-line"><span>${item.quantity} × ${item.name}${addInsText}</span><strong>${money(itemTotal)}</strong></div>`;
    }).join('')}
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

function initToppings() {
  const container = document.querySelector('#toppings-container');
  const itemNameEl = document.querySelector('#item-name');
  const itemDescEl = document.querySelector('#item-description');
  const addBtn = document.querySelector('#add-to-cart-btn');
  if (!container || !itemNameEl || !itemDescEl || !addBtn) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) {
    window.location.href = 'order.html';
    return;
  }

  loadMenu().then(menu => {
    const item = menu.find(entry => entry.id === id);
    if (!item) {
      window.location.href = 'order.html';
      return;
    }

    itemNameEl.textContent = item.name;
    itemDescEl.textContent = item.shortDescription;

    const isShake = item.category === 'drinks' && (item.name.toLowerCase().includes('shake') || item.id.includes('milkshake'));
    
    if (isShake) {
      // Use hardcoded mix-ins for shakes
      const options = MIX_INS;
      const title = 'Mix-Ins';

      container.innerHTML = `
        <h3>${title}</h3>
        <p>Select any ${title.toLowerCase()} you'd like to add.</p>
        <div class="toppings-grid">
          ${options.map(option => `
            <label class="topping-option">
              <input type="checkbox" data-id="${option.id}" data-price="${option.price}">
              <span class="topping-name">${option.name}</span>
              <span class="topping-price">${option.price > 0 ? money(option.price) : 'Free'}</span>
            </label>
          `).join('')}
        </div>
      `;

      addBtn.addEventListener('click', () => {
        const selected = Array.from(container.querySelectorAll('input:checked')).map(cb => ({
          id: cb.dataset.id,
          name: options.find(o => o.id === cb.dataset.id).name,
          price: parseFloat(cb.dataset.price)
        }));
        addToCart(item, 1, selected);
        alert(`${item.name} with ${selected.length ? selected.map(s => s.name).join(', ') : 'no add-ins'} added to bag.`);
        window.location.href = 'bag.html';
      });
    } else {
      // Load toppings from menu.json for burgers/hot dogs
      loadToppings().then(options => {
        const title = 'Toppings';

        container.innerHTML = `
          <h3>${title}</h3>
          <p>Select any ${title.toLowerCase()} you'd like to add.</p>
          <div class="toppings-grid">
            ${options.map(option => `
              <label class="topping-option">
                <input type="checkbox" data-id="${option.id}" data-price="${option.price}">
                <span class="topping-name">${option.name}</span>
                <span class="topping-price">${option.price > 0 ? money(option.price) : 'Free'}</span>
              </label>
            `).join('')}
          </div>
        `;

        addBtn.addEventListener('click', () => {
          const selected = Array.from(container.querySelectorAll('input:checked')).map(cb => ({
            id: cb.dataset.id,
            name: options.find(o => o.id === cb.dataset.id).name,
            price: parseFloat(cb.dataset.price)
          }));
          addToCart(item, 1, selected);
          alert(`${item.name} with ${selected.length ? selected.map(s => s.name).join(', ') : 'no add-ins'} added to bag.`);
          window.location.href = 'bag.html';
        });
      });
    }
  });
}

function showToppingsModal(item) {
  const modal = document.querySelector('#toppings-modal');
  const itemNameEl = document.querySelector('#modal-item-name');
  const itemDescEl = document.querySelector('#modal-item-description');
  const container = document.querySelector('#modal-toppings-container');
  const addBtn = document.querySelector('#modal-add-to-cart');
  const cancelBtn = document.querySelector('#modal-cancel');
  const closeBtn = modal.querySelector('.close');

  if (!modal || !itemNameEl || !itemDescEl || !container || !addBtn || !cancelBtn || !closeBtn) return;

  itemNameEl.textContent = `Customize ${item.name}`;
  itemDescEl.textContent = item.shortDescription;

  const isShake = item.category === 'drinks' && (item.name.toLowerCase().includes('shake') || item.id.includes('milkshake'));
  
  if (isShake) {
    // Use hardcoded mix-ins for shakes
    const options = MIX_INS;
    const title = 'Mix-Ins';

    container.innerHTML = `
      <h3>${title}</h3>
      <p>Select any ${title.toLowerCase()} you'd like to add.</p>
      <div class="toppings-grid">
        ${options.map(option => `
          <label class="topping-option">
            <input type="checkbox" data-id="${option.id}" data-price="${option.price}">
            <span class="topping-name">${option.name}</span>
            <span class="topping-price">${option.price > 0 ? money(option.price) : 'Free'}</span>
          </label>
        `).join('')}
      </div>
    `;

    modal.style.display = 'flex';

    const closeModal = () => {
      modal.style.display = 'none';
      currentItem = null;
    };

    cancelBtn.onclick = closeModal;
    closeBtn.onclick = closeModal;
    modal.onclick = (e) => {
      if (e.target === modal) closeModal();
    };

    addBtn.onclick = () => {
      const selected = Array.from(container.querySelectorAll('input:checked')).map(cb => ({
        id: cb.dataset.id,
        name: options.find(o => o.id === cb.dataset.id).name,
        price: parseFloat(cb.dataset.price)
      }));
      addToCart(item, 1, selected);
      alert(`${item.name} with ${selected.length ? selected.map(s => s.name).join(', ') : 'no add-ins'} added to bag.`);
      closeModal();
    };
  } else {
    // Load toppings from menu.json for burgers/hot dogs
    loadToppings().then(options => {
      const title = 'Toppings';

      container.innerHTML = `
        <h3>${title}</h3>
        <p>Select any ${title.toLowerCase()} you'd like to add.</p>
        <div class="toppings-grid">
          ${options.map(option => `
            <label class="topping-option">
              <input type="checkbox" data-id="${option.id}" data-price="${option.price}">
              <span class="topping-name">${option.name}</span>
              <span class="topping-price">${option.price > 0 ? money(option.price) : 'Free'}</span>
            </label>
          `).join('')}
        </div>
      `;

      modal.style.display = 'flex';

      const closeModal = () => {
        modal.style.display = 'none';
        currentItem = null;
      };

      cancelBtn.onclick = closeModal;
      closeBtn.onclick = closeModal;
      modal.onclick = (e) => {
        if (e.target === modal) closeModal();
      };

      addBtn.onclick = () => {
        const selected = Array.from(container.querySelectorAll('input:checked')).map(cb => ({
          id: cb.dataset.id,
          name: options.find(o => o.id === cb.dataset.id).name,
          price: parseFloat(cb.dataset.price)
        }));
        addToCart(item, 1, selected);
        alert(`${item.name} with ${selected.length ? selected.map(s => s.name).join(', ') : 'no add-ins'} added to bag.`);
        closeModal();
      };
    });
  }
}

function initApp() {
  updateBagCount();
  setActiveNav();
  initHome();
  initOrder();
  initDetails();
  initToppings();
  initBag();
  initCheckout();
  initConfirmation();
}

document.addEventListener('DOMContentLoaded', initApp);
