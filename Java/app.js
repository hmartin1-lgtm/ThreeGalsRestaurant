const serverName = 'ROG-2';
const databaseName = 'ThreeGals';
let currentItem = null;

var currentOrder = null;
let usingCurrentOrder = localStorage.getItem("usingCurrentOrder");
if ( usingCurrentOrder != null)
{
  try
  {
    currentOrder = parseInt(usingCurrentOrder)
  }
  catch
  {
  }
}

var usingDatabase = false;
let usingDatabaseText = localStorage.getItem("usingDatabase");
if (usingDatabaseText == null)
{
  localStorage.setItem("usingDatabase", 'false')
}
else if (usingDatabaseText == "true" )
{
  usingDatabase = true
}

const STORAGE_KEYS = {
  cart: 'threeGalsCart',
  order: 'threeGalsOrder'
};

function displayDatabaseButton()
{
  let id = document.getElementById("databaseButton")
  if ( id != null )
  {
    if (usingDatabase )
    {
      id.textContent = "Database is On"
      id.style.backgroundColor="green"
      id.style.color="white"
    }
    else
    {
      id.textContent = "Database is Off"
      id.style.backgroundColor="yellow"
      id.style.color="black"
    }
  }
}

function initDatabaseButton()
{
  let id = document.getElementById("databaseButton")
  if ( id != null )
  {    
    id.addEventListener('click', () => {
      if (usingDatabase )
      {
        usingDatabase = false
        usingDatabaseText = "false"
      }
      else
      {
        usingDatabase = true
        usingDatabaseText = "true"
      }
      localStorage.setItem("usingDatabase", usingDatabaseText)
      displayDatabaseButton();
    });
    displayDatabaseButton();
  }
}
async function loadMenu(queryString)
{
  // Using Database: all requests go to the database. Response may take time.
  if (usingDatabase)
  {
      const response = await fetch('http://localhost:3000/DatabaseResponse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serverName, databaseName, queryString })
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    let jsonValues = response.json(); // JSON from SQL Server
    return await jsonValues; // JSON from SQL Server
  }
  else // Get everything from the json file. Response depends on specific  request
  {
    // Collect all the informnation possible
    let jsonData = [];
    let watchingForData = [];
    const response = await fetch('/data/menu.json');
    if (!response.ok) throw new Error('No external menu found');
    jsonData = await response.json();
    jsonData =  ConvertedJson(jsonData);

    // For specific items, select just those
    if ( queryString == 'EXEC FeaturedMenu')
    {      
      jsonData.forEach(item => {
        let entry = (item.category == 'burgers' || item.category == 'hot-dogs')
        if (entry) {
            watchingForData.push(item);
        }
      });
      jsonData = watchingForData.splice(0,2);
    }
    else if ( queryString == 'EXEC AllToppings')
    {
      jsonData.forEach(item => {
        if (item.category == 'Toppings') {
            watchingForData.push(item);
        }
      });
      jsonData = watchingForData;
    }
    else if ( queryString == 'EXEC AllMixIns')
    {
      jsonData.forEach(item => {
        if (item.category == 'Mix-ins') {
            watchingForData.push(item);
        }
      });
      jsonData = watchingForData;
    }
    else if ( queryString == 'EXEC FullEntreMenu')
    {
      jsonData.forEach(item => {
        let entry = (item.category == 'burgers' || item.category == 'hot-dogs')
        if (entry) {
            watchingForData.push(item);
        }
      });
      jsonData = watchingForData;
    }
    else if ( queryString == 'EXEC FullMenu')
    {
      jsonData.forEach(item => {
        if (item.category != 'Toppings' && item.category != 'Mix-ins') {
            watchingForData.push(item);
        }
      });
      jsonData = watchingForData;
    }
    // These are specific database requests with no or little resppnse needed.
    // All this is done by the website.
    else if ( queryString.startsWith('EXEC MakeNewOrder'))
    {
    }
    else if ( queryString.startsWith('EXEC StartOrder'))
    {
    }
    else if ( queryString.startsWith('EXEC AddMenuItem'))
    {
    }
    return jsonData;
  }
}
////////////////////////////////////////////////////////
// Database function to add one item to the database one at a time
// Database fuction to insure there is a currentOrder
async function makeNewOrder()
{ 
  if ( currentOrder == null )
  {
    if (usingDatabase)
    {
      let command = 'EXEC MakeNewOrder'
      let response = await loadMenu(command);
      let jsonObject = response[0];
      currentOrder = jsonObject.OrderID;
      localStorage.setItem("usingCurrentOrder", currentOrder.toString());
    }  
    else
    {
      currentOrder = 1
      localStorage.setItem("usingCurrentOrder", currentOrder.toString());
    }
  }
}

async function addMenuItem(item)
{
  if (usingDatabase)
  {
    if (currentOrder == null)
    {
      await makeNewOrder();
    }
    const quantity = Number(item.quantity) > 0 ? Number(item.quantity) : 1;
    const escapeSqlText = (value) => String(value || '').replace(/'/g, "''");
    const toppings = item.addIns && item.addIns.length ? item.addIns.map(a => a.name).join(', ') : '';
    const command = `EXEC AddMenuItem ${currentOrder}, '${escapeSqlText(item.name)}', ${quantity}, '${escapeSqlText(toppings)}'`;
    return await loadMenu(command);
  }
}
async function startOrder(order)
{
  if (usingDatabase)
  {
    let command = `EXEC StartOrder ${currentOrder}, ${order.customer.firstName}`
    let response = await loadMenu(command)
    let jsonObject = response[0]
    let ticket = jsonObject.TicketNumber;
    currentOrder = null;
    localStorage.removeItem("usingCurrentOrder");
    return ticket;
  }
  else
  {
    currentOrder = null;
    localStorage.removeItem("usingCurrentOrder");
    return 99;
  }
}

async function loadMixIns() {
  try {
    let menu = await loadMenu('EXEC AllMixIns');
    let mixInsList = menu.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price
    }));
    return mixInsList;
  } catch (error) {
    return [];
  }
}
function ConvertedJson(jsonData) {
  // Convert details and tags from csv format to arrays
  jsonData.forEach(element => {
     var myDetails = element.details;
     var isString = typeof myDetails == 'string';
     if (isString) {
          element.details = myDetails.split(',')
     }
     myDetails = element.tags
     var isString = typeof myDetails == 'string';
     if (isString) {
          element.tags = myDetails.split(',')
     }
});
  return jsonData
}

async function loadToppings() {
  try {
    let menu = await loadMenu('EXEC AllToppings');
    let toppingsList = menu.map(item => ({
      id: item.id,
      name: item.name,
      price: 0.75 //item.price
    }));
    return toppingsList;
  } catch (error) {
    return [];
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

async function handleAddToCart(item) {
  if (needsCustomization(item)) {

    currentItem = item;
    const useToppingsModal = window.location.pathname.includes('order.html') 
                          || window.location.pathname.includes('details.html')
                          || window.location.pathname.includes('index.html');
    if (useToppingsModal)
    {
      showToppingsModal(item);
    }
    else
    {
      window.location.href = `toppings.html?id=${item.id}`;
    }
  } else {
    addToCart(item);
    await addMenuItem({ ...item, quantity: 1, addIns: [] });
    if (!needsCustomization(item))
    {
      showOrderedItemModal(item);
    }
    //alert(`${item.name} added to bag.`);
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
  let baseTag = (items.tags || [])
  let baseClass = baseTag.map(tag => `<span class="tag">${tag}</span>`)
  let finalTag = baseClass.join('')
  container.innerHTML = items.map(item => `
    <article class="card menu-card">
      <img src="/Images/${item.image}" alt="${item.name}">
      <div class="menu-card-body">
        <div class="tag-row">${finalTag}</div>
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

// Render the home page
async function initHome() {
  let rawJsonData = await loadMenu('EXEC FeaturedMenu');
  let featured = ConvertedJson(rawJsonData);
  const featuredContainer = document.querySelector('#featured-menu');
  if (!featuredContainer) return;

  // Continue if there is a place for featured items
  renderMenuCards(featured, featuredContainer);
  featuredContainer.querySelectorAll('[data-add-id]').forEach(button => {
    button.addEventListener('click', async () => {
      const item = featured.find(entry => entry.id === button.dataset.addId);
      await handleAddToCart(item);
    });
  });
}

async function initOrder() {
  const rawJsonData = await loadMenu('EXEC FullMenu');
  var menu = ConvertedJson(rawJsonData);
  const container = document.querySelector('#order-menu');
  if (!container) 
  {
    return;
  }    
  if ( currentOrder == null)
  {
      await makeNewOrder();
  }

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
          button.addEventListener('click', async () => {
                const item = menu.find(entry => entry.id === button.dataset.addId);
            await handleAddToCart(item);
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
  const rawJsonData = await loadMenu('EXEC FullMenu');
  const menu = ConvertedJson(rawJsonData);
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

  document.querySelector('#detail-add').addEventListener('click', async () => {
    await handleAddToCart(item);
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

    cartContainer.querySelectorAll('[data-qty-index]').forEach(button => {
      button.addEventListener('click', () => {
        const cart = getCart();
        const index = parseInt(button.dataset.qtyIndex);
        cart[index].quantity += button.dataset.direction === 'up' ? 1 : -1;
        const updated = cart.filter(entry => entry.quantity > 0);
        setCart(updated);
        renderBag();
      });
    });
    
    cartContainer.querySelectorAll('[data-remove-index]').forEach(button => {
      button.addEventListener('click', () => {
        const cart = getCart();
        const index = parseInt(button.dataset.removeIndex);
        cart.splice(index, 1);
        setCart(cart);
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

  form.addEventListener('submit', async event => {
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
    let ticket = await startOrder(order);
    order.ticket = ticket;
    localStorage.setItem(STORAGE_KEYS.order, JSON.stringify(order));
    localStorage.removeItem(STORAGE_KEYS.cart);
    window.location.href = 'confirmation.html';
  });
}

function WeatherBug() {
    fetch('https://api.weatherapi.com/v1/current.json?key=3a4515825e3c433f8dc40901220203&q=Denver&aqi=no')
    .then((res) => res.json())
    .then((data) => {
        let timeArray = data.location.localtime.split(" ")
        let output = `<br /><div>
                         <br />
                           <div>
                            At ${timeArray[1]} on ${timeArray[0]} in ${data.location.name},
                    ${data.location.region}, the temperature is ${data.current.temp_f} F `
        if (data.current.wind_mph == 0) {
            output += `with no wind`
        }
        else {
            output += `with the wind from the ${data.current.wind_dir} at
                            ${data.current.wind_mph} mph`
        }
        output += `</div></div>
                      <br />
                      <a href="https://www.weatherapi.com/" title="Free Weather API"><img src='//cdn.weatherapi.com/v4/images/weatherapi_logo.png' alt="Weather data by WeatherAPI.com" border="0"></a>
                      <br />Powered by <a href="https://www.weatherapi.com/" title="Weather API">WeatherAPI.com</a>            `;
        document.getElementById('weather').innerHTML = output;
      });
};
    
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

    loadMenu('EXEC AllToppings').then(menu => {
    const item = menu.find(entry => entry.id === id);
    if (!item) {
      window.location.href = 'order.html';
      return;
    }

    itemNameEl.textContent = item.name;
    itemDescEl.textContent = item.shortDescription;

    const isShake = item.category === 'drinks' && (item.name.toLowerCase().includes('shake') || item.id.includes('milkshake'));
    
    if (isShake) {
      // Load mix-ins from menu.json for shakes
      loadMixIns().then(options => {
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

        addBtn.addEventListener('click', async () => {
          const selected = Array.from(container.querySelectorAll('input:checked')).map(cb => ({
            id: cb.dataset.id,
            name: options.find(o => o.id === cb.dataset.id).name,
            price: parseFloat(cb.dataset.price)
          }));
          addToCart(item, 1, selected);
          await addMenuItem({ ...item, quantity: 1, addIns: selected });
          //alert(`${item.name} with ${selected.length ? selected.map(s => s.name).join(', ') : 'no add-ins'} added to bag.`);
          window.location.href = 'bag.html';
        });
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

        addBtn.addEventListener('click', async () => {
          const selected = Array.from(container.querySelectorAll('input:checked')).map(cb => ({
            id: cb.dataset.id,
            name: options.find(o => o.id === cb.dataset.id).name,
            price: parseFloat(cb.dataset.price)
          }));
          addToCart(item, 1, selected);
          await addMenuItem({ ...item, quantity: 1, addIns: selected });
          //alert(`${item.name} with ${selected.length ? selected.map(s => s.name).join(', ') : 'no add-ins'} added to bag.`);
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

  // Determine if it's a shake
  const isShake = item.category === 'drinks' && (item.name.toLowerCase().includes('shake') || item.id.includes('milkshake'));

  // Load appropriate options based on item type
  const loadOptions = isShake ? loadMixIns() : loadToppings();
  
  loadOptions.then(options => {
    const title = isShake ? 'Mix-Ins' : 'Toppings';

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

    addBtn.onclick = async () => {
      const selected = Array.from(container.querySelectorAll('input:checked')).map(cb => ({
        id: cb.dataset.id,
        name: options.find(o => o.id === cb.dataset.id).name,
        price: parseFloat(cb.dataset.price)
      }));
      addToCart(item, 1, selected);
      await addMenuItem({ ...item, quantity: 1, addIns: selected });
      //alert(`${item.name} with ${selected.length ? selected.map(s => s.name).join(', ') : 'no add-ins'} added to bag.`);
      closeModal();
    };
  });
}
function showOrderedItemModal(item) {
  const modal = document.querySelector('#orderedItem-modal'); 
  const orderedItemName = document.querySelector('#modal-ordered-item-name');
  const container = document.querySelector('#modal-ordered-container');
  const okBtn = document.querySelector('#modal-ok');
  const closeBtn = modal.querySelector('.close');

  if (!modal || !orderedItemName || !container || !closeBtn || !okBtn) return;

  orderedItemName.textContent = `Ordered ${item.name}`;
  container.innerHTML = `<h3>${item.name} is in the Bag!</h3>`;

  modal.style.display = 'flex';

  const closeModal = () => {
      modal.style.display = 'none';
      currentItem = null;
    };

  closeBtn.onclick = closeModal;
  okBtn.onclick = closeModal;
  modal.onclick = (e) => {
      if (e.target === modal) closeModal();
  };
}
/////////////////////////////////////////////////
function loginScript()
{
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    // Credentials
    const VALID_USERNAME = 'three gals';
    const VALID_PASSWORD = '1234';
    
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const username = usernameInput.value.trim();
      const password = passwordInput.value;
      
      if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        // Store login state
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loginTime', new Date().toISOString());
        
        // Redirect to orders page
        window.location.href = 'orders.html';
      }
      else if (serverName == 'ROG-2')
      {
        // Store login state
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loginTime', new Date().toISOString());
        
        // Redirect to orders page
        window.location.href = 'orders.html';
      
      } else {
        errorMessage.textContent = 'Invalid username or password';
        errorMessage.classList.add('show');
        passwordInput.value = '';
        passwordInput.focus();
      }
    });
  }
/////////////////////////////////////////////////
const STATUS_FLOW = ['preparing', 'ready', 'completed'];
function EncodeIntoJson( rawString )
{
    let returnList = []
    let rawList = rawString.split(`\n`);
    let length = rawList.length
    if (length >= 2) {
      let labels = rawList[0];
      let labelList = labels.split(',')
      for (let index = 1; index < length; index++) {
        let row = rawList[index];
        let rowList = row.split(',')
        let rawObject = {}
        let count = labelList.length
        for (let index = 0; index < count; index++) {
          let key = labelList[index]
          let value = rowList[index]
          rawObject[key] = value;
        }
        returnList.push(rawObject)
      };
    }
    return returnList;
}
function DecodeOrders(jsonOrders)
{
  let orderList = []
  if ( jsonOrders == null || jsonOrders.length == 0 )
  {
    return orderList
  }
  
  // Extract the base information that is the same for all orders
  // orderID, ticket, customerName, dataTime, status, menuName, menuID, toppingID, quantity, total
  let baseModel = jsonOrders[0]
  let toppingsList = []
  let timeDate = baseModel.Date.split(' ') // or is "2026-04-28T01:02:33.757Z
  if ( timeDate.length == 1)
  {
      timeDate = baseModel.Date.split('T')
  }
  let orderDate = timeDate[0] // full date
  let orderTime = timeDate[1] // just hh:mm
  let timeList = orderTime.split(':')
  orderTime = timeList[0] + ':' + timeList[1]

  // Insure there are no spaces in keys (if so, remove any quotes as well)
  //    and if found, make a new key without spaces (cause they are hard to work with)
  jsonOrders.forEach((individualOrder) => {
    for( let key in individualOrder)
    {
      // Insure no spaces or quotes
      let newkey = key
      if ( newkey.indexOf(' ') >= 0 )
      {
        while ( newkey.indexOf("'") >= 0 )
        {
          newkey = newkey.replace("'","")
        }
        while ( newkey.indexOf('"') >= 0 )
        {
          newkey = newkey.replace('"',"")
        }
        newkey = key.trim()
        while ( newkey.indexOf(' ') >= 0 )
        {
          newkey = newkey.replace(" ","")
        }
        individualOrder[newkey] = individualOrder[key]
      }
      // Convert any number-strings into numbers
      let oldValue = individualOrder[newkey]
      try{
        let newInteger = parseInt(oldValue)
        if ( isNaN(newInteger)) continue;
        individualOrder[newkey] = newInteger
        if ( oldValue.indexOf('.') < 0 ) continue;
        let newFloat = parseFloat(oldValue)
        if ( isNaN(newFloat)) continue;
        individualOrder[newkey] = newFloat
      }
      catch {
      }

    }  
  });  
    
  // Loop for each order and store it without entries or individual details
  let listOfOrders = []
  jsonOrders.forEach((individualOrder) => {
    let checkingOrderNumber = individualOrder.OrderNumber
    if ( !listOfOrders.includes(checkingOrderNumber)) 
    {
    listOfOrders.push(individualOrder.OrderNumber)
    
    let anOrder = {
      id : baseModel.ItemID,
      orderNumber : checkingOrderNumber,
      ticket : baseModel.Ticket,
      customerName : baseModel.Customer,
      date : orderDate,
      time : orderTime,
      items : [],
      total : 0.0,
      status : baseModel.Status
    }
    orderList.push(anOrder)
  }
  });
    
    // Loop for each saved order and extract just entries, toppings are saved after that
  orderList.forEach((eachOrder) => {
      jsonOrders.forEach((individualOrder) => {
      if ( eachOrder.orderNumber == individualOrder.OrderNumber)
      {
        // Proccess each entre in the order
        if ( individualOrder.ItemID > 0)
        {
          entre = {
            menuName : individualOrder.Name,
            menuID : individualOrder.ItemID,
            toppingID : 0,
            quantity : individualOrder.Quantity,
            price : individualOrder.Price,
            toppings : ""
          }
          eachOrder.items.push(entre)
        }
        // For a topping, save each topping to process after entres
        else
        {
          toppingsList.push(individualOrder)
        }
      }
    });
  });

  // For each order, match each topping to its entre and add toppings in csv format
  orderList.forEach((eachOrder) => {
    let orderGrandTotal = 0;

    eachOrder.items.forEach(entre => {

      let count = 0
      let topping = ""
      let entrePrice = entre.price;

      // Once matched, place all toppings into a csv format
      toppingsList.forEach(individualTopping => {

        if (entre.menuID == individualTopping.ToppingID)
        {
          if ( isNaN(individualTopping.Price))
          {
            individualTopping.Price = 0;
          }
          entrePrice  = entrePrice + (individualTopping.Price * individualTopping.Quantity);
          toppingName = ", "
          count += 1;
          if (count > 1)
          {
            toppingName = toppingName + individualTopping.Name
          }
          else
          {
            toppingName = "with " + individualTopping.Name
          }
          topping = topping + toppingName
        }
      orderGrandTotal = orderGrandTotal + (entrePrice * entre.quantity);
      });
      entre.toppings = topping
    });
    eachOrder.total = orderGrandTotal;
  });

  return orderList;
}

// Check if user is logged in
function checkLoginStatus() {
  // Logout setup
  document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loginTime');
    window.location.href = 'index.html';
  });

  if (!localStorage.getItem('isLoggedIn')) {
    window.location.href = 'login.html';
  }
}

// Load orders from JSON
async function loadOrders() {
  if ( usingDatabase )
  {
      let command = 'EXEC GetOrders'
      //let rawCsv = await loadMenu(command);
      let response = await loadMenu(command);

// let rawCsv = `Order Number,Ticket,Customer,Date,Status,Name,ItemID,Topping ID,Quantity,Price
// 23,2,Jeff,2026-04-28 01:02:33.757,Preparing,Leviathan Burger,2,0,1,23.75
// 23,2,Jeff,2026-04-28 01:02:33.757,Preparing,Soda,4,0,1,2.75
// 23,2,Jeff,2026-04-28 01:02:33.757,Preparing,The Seth Specialty Fries,3,0,1,6.25
// 23,2,Jeff,2026-04-28 01:02:33.757,Preparing,Tomato,0,2,1,0.50`

      //let response = EncodeIntoJson(rawCsv)

      let orders = DecodeOrders(response)
      renderOrders(orders);
      document.getElementById('totalOrders').textContent = orders.length;
  }
  else
  {        
    try {
        const response = await fetch('/data/orders.json');
        const orders = await response.json();
        renderOrders(orders);
        document.getElementById('totalOrders').textContent = orders.length;
    } catch (error) {
        console.error('Error loading orders:', error);
        document.getElementById('ordersContainer').innerHTML = '<div class="empty-state"><h2>Error Loading Orders</h2><p>Unable to load orders data.</p></div>';
    }
  }
}

// Group orders by date
function groupOrdersByDate(orders) {
  const grouped = {};
  
  orders.forEach(order => {
    if (!grouped[order.date]) {
      grouped[order.date] = [];
    }
    grouped[order.date].push(order);
  });
  
  return grouped;
}

// Format date
function formatDate(dateString) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', options);
}

// Format time
function formatTime(timeString) {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

// Update order status
function updateOrderStatus(orderId, newStatus) {
  // In a real application, this would send data to the server
  const orderElement = document.querySelector(`[data-order-id="${orderId}"]`);
  if (orderElement) {
    const statusBadge = orderElement.querySelector('.order-status');
    statusBadge.className = `order-status status-${newStatus}`;
    statusBadge.innerHTML = `<span>Status: ${newStatus}</span>`;
    
    // Update button states
    updateActionButtons(orderElement, newStatus);
  }
}

// Update action button states
function updateActionButtons(orderElement, status) {
  const btnPrevious = orderElement.querySelector('.btn-previous');
  const btnNext = orderElement.querySelector('.btn-next');
  const currentStatusIndex = STATUS_FLOW.indexOf(status);
  
  // Disable previous if at first status
  btnPrevious.disabled = currentStatusIndex === 0;
  
  // Disable next if at last status
  btnNext.disabled = currentStatusIndex === STATUS_FLOW.length - 1;
}

// Move status forward
function moveStatusForward(orderId, currentStatus) {
  const currentIndex = STATUS_FLOW.indexOf(currentStatus);
  if (currentIndex < STATUS_FLOW.length - 1) {
    const newStatus = STATUS_FLOW[currentIndex + 1];
    updateOrderStatus(orderId, newStatus);
  }
}

// Move status backward
function moveStatusBackward(orderId, currentStatus) {
  const currentIndex = STATUS_FLOW.indexOf(currentStatus);
  if (currentIndex > 0) {
    const newStatus = STATUS_FLOW[currentIndex - 1];
    updateOrderStatus(orderId, newStatus);
  }
}

// Remove order (pickup complete)
function removeOrder(orderId) {
  const orderElement = document.querySelector(`[data-order-id="${orderId}"]`);
  if (orderElement) {
    orderElement.style.opacity = '0';
    orderElement.style.transform = 'translateY(10px)';
    setTimeout(() => {
      orderElement.remove();
      const totalOrders = parseInt(document.getElementById('totalOrders').textContent) - 1;
      document.getElementById('totalOrders').textContent = totalOrders;
      
      // Show empty state if no orders
      if (totalOrders === 0) {
        document.getElementById('ordersContainer').innerHTML = '<div class="empty-state"><h2>No Orders</h2><p>All orders have been picked up.</p></div>';
      }
    }, 300);
  }
}

// Render orders
function renderOrders(orders) {
  const container = document.getElementById('ordersContainer');
  
  if (orders.length === 0) {
    container.innerHTML = '<div class="empty-state"><h2>No Orders</h2><p>There are currently no orders to display.</p></div>';
    return;
  }
  
  const groupedOrders = groupOrdersByDate(orders);
  let html = '';
  
  // Sort dates in descending order (newest first)
  const sortedDates = Object.keys(groupedOrders).sort().reverse();
  
  sortedDates.forEach(date => {
    html += `<div class="date-group">
      <div class="date-group-header">${formatDate(date)}</div>`;
    
    groupedOrders[date].forEach(order => {
      const currentStatusIndex = STATUS_FLOW.indexOf(order.status);
      const isPreviousDisabled = currentStatusIndex === 0;
      const isNextDisabled = currentStatusIndex === STATUS_FLOW.length - 1;
      
      html += `
        <div class="order-card" data-order-id="${order.orderNumber}">
          <div class="order-header">
            <div class="order-id-time">
              <div class="order-id">Ticket ${order.ticket} for ${order.customerName}</div>
              <div class="order-time">${formatDate(order.date)} ${formatTime(order.time)}</div>
            </div>
            <div class="order-status status-${order.status}">
              <span>Status: ${order.status}</span>
            </div>
          </div>
          
          <div class="order-items">
      `;
      
      order.items.forEach(item => {
        html += `
          <div class="order-item">
            <div>
              <div class="item-name">${item.menuName}  ${item.toppings}</div>
              <div class="item-qty">Qty: ${item.quantity}</div>
            </div>
            <div class="item-price">$${(item.price).toFixed(2)}</div>
          </div>
        `;
      });
      
      html += `
          </div>
          
          <div class="order-footer">
            <div class="order-total">Total: <span>${order.total.toFixed(2)}</span></div>
          </div>
          
          <div class="order-actions">
            <button class="action-btn btn-previous" ${isPreviousDisabled ? 'disabled' : ''} onclick="moveStatusBackward('${order.orderNumber}', '${order.status}')">← Previous Status</button>
            <button class="action-btn btn-next" ${isNextDisabled ? 'disabled' : ''} onclick="moveStatusForward('${order.orderNumber}', '${order.status}')">Next Status →</button>
            <button class="action-btn btn-pickup" onclick="removeOrder('${order.orderNumber}')">📦 Picked Up</button>
          </div>
        </div>
      `;
    });
    
    html += '</div>';
  });
  
  container.innerHTML = html;
}


// Initialize
/////////////////////////////////////////////////

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
  initDatabaseButton();
}

document.addEventListener('DOMContentLoaded', initApp);
