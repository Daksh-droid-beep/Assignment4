document.addEventListener('DOMContentLoaded',()=>{
  const bookingForm=document.getElementById('bookingForm');
  const modal=document.getElementById('confirmModal');
  const confirmContent=document.getElementById('confirmContent');
  const closeBtn=modal.querySelector('.modal-close');
  const okBtn=document.getElementById('confirmOk');

  function openModal(html){
    confirmContent.innerHTML=html;
    modal.setAttribute('aria-hidden','false');
  }
  function closeModal(){ modal.setAttribute('aria-hidden','true'); }

  closeBtn.addEventListener('click',closeModal);
  okBtn.addEventListener('click',closeModal);

  bookingForm.addEventListener('submit',e=>{
    e.preventDefault();
    const fd=new FormData(bookingForm);
    const data=Object.fromEntries(fd.entries());
    // basic validation
    if(!data.name||!data.email||!data.date){
      alert('Please complete required fields.');
      return;
    }
    // persist booking locally (demo)
    const bookings=JSON.parse(localStorage.getItem('bookings')||'[]');
    bookings.push({...data,created:new Date().toISOString()});
    localStorage.setItem('bookings',JSON.stringify(bookings));

    openModal(`<p>Thanks <strong>${escapeHtml(data.name)}</strong> — we received your request for <strong>${escapeHtml(data.service)}</strong> on <strong>${escapeHtml(data.date)}</strong>.</p><p>We sent a confirmation to <strong>${escapeHtml(data.email)}</strong> (demo).</p>`);
    bookingForm.reset();
  });

  // newsletter
  const newsletterForm=document.getElementById('newsletterForm');
  newsletterForm.addEventListener('submit',e=>{
    e.preventDefault();
    const email=new FormData(newsletterForm).get('newsletterEmail');
    const list=JSON.parse(localStorage.getItem('subscribers')||'[]');
    if(list.includes(email)){
      alert('You are already subscribed.');
      return;
    }
    list.push(email); localStorage.setItem('subscribers',JSON.stringify(list));
    alert('Subscribed — thank you! (demo)');
    newsletterForm.reset();
  });

  // Services: add / remove
  const addServiceBtn = document.getElementById('addServiceBtn');
  const serviceCards = document.getElementById('serviceCards');

  addServiceBtn.addEventListener('click',()=>{
    const name = prompt('Service name','New Service');
    if(!name) return;
    const desc = prompt('Short description','Description here');
    const price = prompt('Price label (e.g. From $5/kg)','From $5');

    const art = document.createElement('article');
    art.className = 'card';
    art.innerHTML = `<button class="remove-service" aria-label="Remove service">Remove</button><h4>${escapeHtml(name)}</h4><p>${escapeHtml(desc)}</p><div class="price">${escapeHtml(price)}</div>`;
    serviceCards.appendChild(art);
  });

  // Delegate remove clicks
  serviceCards.addEventListener('click', (e)=>{
    const btn = e.target.closest('.remove-service');
    if(!btn) return;
    const card = btn.closest('.card');
    if(!card) return;
    if(!confirm('Remove this service?')) return;
    card.remove();
  });

  function escapeHtml(s){return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');}
});
