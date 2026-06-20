document.addEventListener('DOMContentLoaded', () => {
  // Load EmailJS config from js/emailConfig.js
  const CFG = window.EMAIL_CFG || {};
  const emailConfigured = CFG.serviceID && CFG.templateID && CFG.publicKey;
  if (window.emailjs && CFG.publicKey) {
    try { emailjs.init(CFG.publicKey); } catch (e) { console.warn('EmailJS init failed', e); }
  }

  // Elements
  const bookingForm = document.getElementById('bookingForm');
  const serviceCards = document.getElementById('serviceCards');
  const addServiceBtn = document.getElementById('addServiceBtn');
  const cartItemsEl = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');
  const clearCartBtn = document.getElementById('clearCart');
  const thankYouEl = document.getElementById('thankYou');
  const statServices = document.getElementById('statServices');
  const statCartItems = document.getElementById('statCartItems');
  const statBookings = document.getElementById('statBookings');

  // Local storage keys
  const CART_KEY = 'lp_cart_v1';
  const BOOKINGS_KEY = 'bookings';
  const NEWS_KEY = 'newsletter_subs_v1';

  // Cart model
  let cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');

  // Helpers
  function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCart();
    updateStats();
  }

  function formatCurrency(n){ return `$${n.toFixed(2)}`; }

  function renderCart(){
    if (!cart.length) {
      cartItemsEl.textContent = 'Cart is empty.';
      cartTotalEl.textContent = formatCurrency(0);
      statCartItems.textContent = '0';
      return;
    }
    cartItemsEl.innerHTML = '';
    let total = 0;
    cart.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = 'cart-row';
      row.innerHTML = `
        <div class="cart-name">${escapeHtml(item.name)}</div>
        <div class="cart-meta">${formatCurrency(item.price)} x <input data-idx="${idx}" class="qty" type="number" min="1" value="${item.qty}" aria-label="Quantity for ${escapeHtml(item.name)}"></div>
        <div><button class="btn remove-from-cart" data-idx="${idx}">Remove</button></div>
      `;
      cartItemsEl.appendChild(row);
      total += item.price * item.qty;
    });
    cartTotalEl.textContent = formatCurrency(total);
    statCartItems.textContent = String(cart.reduce((s,i)=>s+i.qty,0));
  }

  function escapeHtml(s){ return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }

  // Add to cart from service card
  serviceCards.addEventListener('click', (e)=>{
    const addBtn = e.target.closest('.add-to-cart');
    if (addBtn) {
      const card = addBtn.closest('.card');
      const nameEl = card.querySelector('h4');
      const name = nameEl ? nameEl.textContent.trim() : 'Service';
      const price = parseFloat(card.dataset.price) || 0;
      const existing = cart.find(i => i.name === name && i.price === price);
      if (existing) existing.qty += 1; else cart.push({id: Date.now()+Math.random(), name, price, qty:1});
      saveCart();
      return;
    }

    const removeBtn = e.target.closest('.remove-service');
    if (removeBtn) {
      const card = removeBtn.closest('.card');
      if (!card) return;
      if (!confirm('Remove this service from the catalog?')) return;
      card.remove();
      updateStats();
    }
  });

  // Cart actions (delegated)
  cartItemsEl.addEventListener('click', (e)=>{
    const rem = e.target.closest('.remove-from-cart');
    if (rem) {
      const idx = Number(rem.dataset.idx);
      if (!Number.isNaN(idx)) {
        cart.splice(idx,1);
        saveCart();
      }
    }
  });

  cartItemsEl.addEventListener('input', (e)=>{
    const q = e.target.closest('.qty');
    if (!q) return;
    const idx = Number(q.dataset.idx);
    const val = Number(q.value);
    if (Number.isNaN(idx) || Number.isNaN(val) || val < 1) return;
    cart[idx].qty = Math.floor(val);
    saveCart();
  });

  clearCartBtn.addEventListener('click', ()=>{
    if (!cart.length) return;
    if (!confirm('Clear all items from cart?')) return;
    cart = [];
    saveCart();
  });

  // Admin: add new service card
  addServiceBtn.addEventListener('click', ()=>{
    const name = prompt('Service name','New Service'); if(!name) return;
    const desc = prompt('Short description','Description here') || '';
    const price = Number(prompt('Price (numeric, e.g. 5)','5')) || 0;
    const art = document.createElement('article');
    art.className = 'card';
    art.dataset.price = String(price);
    art.innerHTML = `<button class="remove-service" aria-label="Remove service">Remove</button><h4>${escapeHtml(name)}</h4><p>${escapeHtml(desc)}</p><div class="price">From $${price}</div><button class="btn add-to-cart">Add to cart</button>`;
    serviceCards.appendChild(art);
    updateStats();
  });

  // Booking submission: uses cart items; requires phone
  bookingForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const fd = new FormData(bookingForm);
    const data = Object.fromEntries(fd.entries());
    // Simple client-side validation
    if (!data.name || !data.email || !data.phone || !data.date) {
      alert('Please complete required fields.'); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) { alert('Please enter a valid email address.'); return; }
    if (!/^[+0-9\s\-()]{7,20}$/.test(data.phone)) { alert('Please enter a valid phone number.'); return; }
    const picked = new Date(data.date);
    const today = new Date(); today.setHours(0,0,0,0);
    if (isNaN(picked.getTime()) || picked < today) { alert('Pickup date must be today or later.'); return; }
    if (!cart.length) {
      alert('Your cart is empty. Please add services to book.'); return;
    }

    const total = cart.reduce((s,i)=>s + i.price*i.qty, 0);
    const itemsSummary = cart.map(i=>`${i.name} x${i.qty} ($${(i.price*i.qty).toFixed(2)})`).join('\n');

    // Prepare template params for EmailJS
    const templateParams = {
      customer_name: data.name,
      customer_email: data.email,
      customer_phone: data.phone,
      pickup_date: data.date,
      notes: data.notes || '',
      items: itemsSummary,
      total: formatCurrency(total)
    };

    // Save booking locally
    const bookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
    bookings.push({ ...templateParams, created: new Date().toISOString() });
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    updateStats();
    // Send email via EmailJS if user configured it in js/emailConfig.js
    if (emailConfigured && window.emailjs) {
      emailjs.send(CFG.serviceID, CFG.templateID, templateParams)
        .then(()=> showConfirmation(data.name, templateParams))
        .catch(err => {
          console.error('EmailJS send error', err);
          showConfirmation(data.name, templateParams, err);
        })
        .finally(()=>{
          cart = [];
          saveCart();
          bookingForm.reset();
        });
    } else {
      // Not configured: inform user how to enable real emails
      console.warn('EmailJS not configured. To enable email sending, set values in js/emailConfig.js');
      showConfirmation(data.name, templateParams, new Error('EmailJS not configured'));
      cart = [];
      saveCart();
      bookingForm.reset();
    }
  });

  function showConfirmation(name, params, error){
    const msg = error ? `Booking received for ${escapeHtml(name)}. (Email not sent or failed)` : `Booking confirmed for ${escapeHtml(name)}. A confirmation was sent to ${escapeHtml(params.customer_email)}.`;
    thankYouEl.style.display = 'block';
    thankYouEl.textContent = msg;
    // update modal content if present
    const modal = document.getElementById('confirmModal');
    const confirmContent = document.getElementById('confirmContent');
    if (modal && confirmContent) {
      confirmContent.innerHTML = `<p>${escapeHtml(msg)}</p><pre style="white-space:pre-wrap">${escapeHtml(params.items || '')}\nTotal: ${escapeHtml(params.total || '')}</pre>`;
      modal.setAttribute('aria-hidden','false');
    }
  }

  // Newsletter form handling (simple)
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (ev)=>{
      ev.preventDefault();
      const f = new FormData(newsletterForm);
      const e = (f.get('newsletterEmail') || '').trim();
      if (!e) { alert('Please enter your email to subscribe.'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) { alert('Please enter a valid email address.'); return; }
      const list = JSON.parse(localStorage.getItem(NEWS_KEY) || '[]');
      if (list.includes(e)) { alert('This email is already subscribed.'); return; }
      list.push(e);
      localStorage.setItem(NEWS_KEY, JSON.stringify(list));
      alert('Thanks — you are subscribed.');
      newsletterForm.reset();
    });
  }

  // modal close
  const modal = document.getElementById('confirmModal');
  if (modal) {
    const closeBtn = modal.querySelector('.modal-close');
    const okBtn = document.getElementById('confirmOk');
    function closeModal(){ modal.setAttribute('aria-hidden','true'); }
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (okBtn) okBtn.addEventListener('click', closeModal);
  }

  // Stats updater
  function updateStats(){
    statServices.textContent = String(document.querySelectorAll('#serviceCards .card').length);
    statCartItems.textContent = String(cart.reduce((s,i)=>s+i.qty,0));
    statBookings.textContent = String(JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]').length);
  }

  // Initial render
  renderCart();
  updateStats();
});
