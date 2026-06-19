// --- FreshWave Laundry Main Script ---
// Created for student laundry assignment project

// Global pricing state and configuration
const GST_RATE = 0.18; // 18% GST Tax rate
let cart = []; // Array to hold selected services

// Service pricing list (in ₹)
const SERVICE_PRICES = {
  'Dry Cleaning': 150,
  'Wash & Fold': 100,
  'Ironing': 80,
  'Premium Laundry': 200,
  'Stain Removal': 120,
  'Express Service': 250
};

// EmailJS Credentials - replace these with your actual keys from your emailjs.com account
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";

// Setup and initialize EmailJS
if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
  emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY
  });
}

// Execute when page structure is ready
document.addEventListener('DOMContentLoaded', function() {
  
  // 1. Page Loader Handler
  const loader = document.getElementById('pageLoader');
  if (loader) {
    window.addEventListener('load', function() {
      setTimeout(function() {
        loader.classList.add('hidden');
      }, 500);
    });
  }

  // 2. Set copyright year in footer
  const yearEl = document.getElementById('footerYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 3. Dark/Light Mode Theme Toggle
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  if (themeToggle && themeIcon) {
    // load theme setting if stored previously
    const savedTheme = localStorage.getItem('freshwave_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', function() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('freshwave_theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (theme === 'dark') {
      themeIcon.classList.replace('fa-moon', 'fa-sun');
      themeToggle.title = 'Switch to Light Mode';
    } else {
      themeIcon.classList.replace('fa-sun', 'fa-moon');
      themeToggle.title = 'Switch to Dark Mode';
    }
  }

  // 4. Sticky Navbar & Scroll Highlighting
  const navLinks = document.querySelectorAll('#navMenu .nav-link');
  const sections = document.querySelectorAll('section[id]');
  
  window.addEventListener('scroll', function() {
    let currentSection = '';
    const scrollY = window.scrollY + 120; // Offset for navbar height
    
    sections.forEach(function(section) {
      if (scrollY >= section.offsetTop) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(function(link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentSection) {
        link.classList.add('active');
      }
    });
  });

  // hide collapsed navbar menu when click links (on mobile devices)
  navLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      const navCollapse = document.getElementById('navMenu');
      if (navCollapse && navCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      }
    });
  });

  // 5. Back to Top Button
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 6. Smooth Scroll for link clicks
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navbarHeight = document.getElementById('mainNavbar')?.offsetHeight || 76;
        const offsetTop = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });

  // 7. Scroll Reveal Animations (using IntersectionObserver)
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (revealElements.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.getAttribute('data-delay') || 0, 10);
          setTimeout(function() {
            entry.target.classList.add('revealed');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(function(el) {
      observer.observe(el);
    });
  } else {
    // fallback - show immediately if observer not supported
    revealElements.forEach(function(el) {
      el.classList.add('revealed');
    });
  }

  // 8. Achievements Section Stats Counters
  const counters = document.querySelectorAll('.stat-number');
  if (counters.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          startCounterAnimation(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function(counter) {
      counterObserver.observe(counter);
    });
  }

  function startCounterAnimation(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800; // Total duration in ms
    const frameTime = 16; // Approx 60fps
    const totalFrames = Math.round(duration / frameTime);
    let currentFrame = 0;

    const interval = setInterval(function() {
      currentFrame++;
      const progress = currentFrame / totalFrames;
      const easedProgress = 1 - Math.pow(1 - progress, 4); // easeOutQuart transition
      const val = Math.round(target * easedProgress);
      el.textContent = val + suffix;

      if (currentFrame >= totalFrames) {
        clearInterval(interval);
        el.textContent = target + suffix;
      }
    }, frameTime);
  }

  // 9. Service Search and Filtering Options
  const serviceSearch = document.getElementById('serviceSearch');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceItems = document.querySelectorAll('.service-item');
  const noResults = document.getElementById('noServiceResults');

  if (serviceSearch) {
    let currentFilter = 'all';
    let searchQuery = '';

    serviceSearch.addEventListener('input', function() {
      searchQuery = serviceSearch.value.trim().toLowerCase();
      runFilter();
    });

    filterBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        filterBtns.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        runFilter();
      });
    });

    function runFilter() {
      let count = 0;
      serviceItems.forEach(function(item) {
        const category = item.getAttribute('data-category');
        const title = item.querySelector('.service-title')?.textContent.toLowerCase() || '';
        const desc = item.querySelector('.service-desc')?.textContent.toLowerCase() || '';

        const catMatch = currentFilter === 'all' || category === currentFilter;
        const searchMatch = !searchQuery || title.includes(searchQuery) || desc.includes(searchQuery);

        if (catMatch && searchMatch) {
          item.classList.remove('hidden');
          count++;
        } else {
          item.classList.add('hidden');
        }
      });

      if (noResults) {
        if (count === 0) {
          noResults.classList.remove('d-none');
        } else {
          noResults.classList.add('d-none');
        }
      }
    }
  }

  // 10. Price Calculator Logic
  const calcService = document.getElementById('calcService');
  const calcQty = document.getElementById('calcQty');
  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus = document.getElementById('qtyPlus');

  if (calcService && calcQty) {
    qtyMinus.addEventListener('click', function() {
      let qty = parseInt(calcQty.value, 10) || 1;
      if (qty > 1) {
        calcQty.value = qty - 1;
        calculatePrice();
      }
    });

    qtyPlus.addEventListener('click', function() {
      let qty = parseInt(calcQty.value, 10) || 1;
      if (qty < 100) {
        calcQty.value = qty + 1;
        calculatePrice();
      }
    });

    calcQty.addEventListener('input', function() {
      let qty = parseInt(calcQty.value, 10);
      if (isNaN(qty) || qty < 1) qty = 1;
      if (qty > 100) qty = 100;
      calcQty.value = qty;
      calculatePrice();
    });

    calcService.addEventListener('change', calculatePrice);

    function calculatePrice() {
      const price = parseInt(calcService.value, 10) || 0;
      const qty = parseInt(calcQty.value, 10) || 1;
      const subtotal = price * qty;
      const gst = Math.round(subtotal * GST_RATE);
      const total = subtotal + gst;

      document.getElementById('priceRate').textContent = price ? `₹${price} /item` : '₹0 /item';
      document.getElementById('priceQty').textContent = qty;
      document.getElementById('priceSubtotal').textContent = `₹${subtotal}`;
      document.getElementById('priceGst').textContent = `₹${gst}`;
      document.getElementById('priceTotal').textContent = `₹${total}`;
    }

    // calculate initial values
    calculatePrice();
  }

  // 11. Booking Cart System
  const bookingForm = document.getElementById('bookingForm');
  
  if (bookingForm) {
    // Set pickup date field's minimum value to today
    const bookDateInput = document.getElementById('bookDate');
    if (bookDateInput) {
      const today = new Date().toISOString().split('T')[0];
      bookDateInput.setAttribute('min', today);
    }

    // Add buttons listener for cart increment/decrement
    document.querySelectorAll('.btn-add-item').forEach(function(button) {
      button.addEventListener('click', function() {
        const service = button.getAttribute('data-service');
        const price = SERVICE_PRICES[service];
        addToCart(service, price);
      });
    });

    document.querySelectorAll('.btn-remove-item').forEach(function(button) {
      button.addEventListener('click', function() {
        const service = button.getAttribute('data-service');
        removeFromCart(service);
      });
    });

    // Add from direct services section buttons
    document.querySelectorAll('.btn-add-direct').forEach(function(button) {
      button.addEventListener('click', function() {
        const service = button.getAttribute('data-service');
        const price = SERVICE_PRICES[service];
        addToCart(service, price);

        // scroll down to booking section
        const bookingSection = document.getElementById('booking');
        if (bookingSection) {
          const navbarHeight = document.getElementById('mainNavbar')?.offsetHeight || 76;
          const offsetTop = bookingSection.getBoundingClientRect().top + window.scrollY - navbarHeight;
          window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
      });
    });

    function addToCart(service, price) {
      const item = cart.find(function(i) { return i.name === service; });
      if (item) {
        item.quantity += 1;
      } else {
        cart.push({ name: service, price: price, quantity: 1 });
      }
      updateCartUI();
    }

    function removeFromCart(service) {
      const index = cart.findIndex(function(i) { return i.name === service; });
      if (index > -1) {
        cart[index].quantity -= 1;
        if (cart[index].quantity <= 0) {
          cart.splice(index, 1);
        }
      }
      updateCartUI();
    }

    function updateCartUI() {
      let total = 0;

      // Reset quantities shown in list badges
      document.querySelectorAll('.qty-display').forEach(function(badge) {
        badge.textContent = '0';
      });

      // Update badge displays and calculate subtotal
      cart.forEach(function(item) {
        const idFormatted = item.name.replace(/ & /g, '-').replace(/ /g, '-').replace(/amp;/g, '');
        const badgeEl = document.getElementById('qty-' + idFormatted);
        if (badgeEl) {
          badgeEl.textContent = item.quantity;
        }
        total += item.price * item.quantity;
      });

      // Update total price element
      document.getElementById('cartTotalPrice').textContent = `₹${total}`;

      // Update cart list UI
      const emptyState = document.getElementById('cartEmptyState');
      const itemsList = document.getElementById('cartItemsList');
      const cartErr = document.getElementById('cartGeneralErr');

      if (cart.length === 0) {
        emptyState?.classList.remove('d-none');
        itemsList?.classList.add('d-none');
        if (itemsList) itemsList.innerHTML = '';
      } else {
        emptyState?.classList.add('d-none');
        itemsList?.classList.remove('d-none');
        if (itemsList) {
          itemsList.innerHTML = cart.map(function(item) {
            return `<li class="list-group-item d-flex justify-content-between align-items-center text-dark bg-transparent border-bottom px-0 py-2">
              <div>
                <strong>${item.name}</strong> <small class="text-muted">(₹${item.price} each)</small>
              </div>
              <span class="badge bg-primary rounded-pill px-3 py-2">x${item.quantity} - ₹${item.price * item.quantity}</span>
            </li>`;
          }).join('');
        }
        if (cartErr) cartErr.textContent = '';
      }
    }

    // 12. Form Submission & Validation flow
    bookingForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Reset error styles
      clearErrors();

      let isValid = true;
      let firstInvalidInput = null;

      // 12a. Validate cart size
      if (cart.length === 0) {
        showError('cartGeneralErr', 'Please add at least one laundry service to your cart.');
        isValid = false;
      }

      // 12b. Validate Name
      const nameInput = document.getElementById('bookName');
      const nameVal = nameInput.value.trim();
      if (!nameVal) {
        showFieldError(nameInput, 'bookNameErr', 'Full name is required.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = nameInput;
      } else if (nameVal.length < 2) {
        showFieldError(nameInput, 'bookNameErr', 'Name must be at least 2 characters.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = nameInput;
      }

      // 12c. Validate Email
      const emailInput = document.getElementById('bookEmail');
      const emailVal = emailInput.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal) {
        showFieldError(emailInput, 'bookEmailErr', 'Email address is required.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = emailInput;
      } else if (!emailPattern.test(emailVal)) {
        showFieldError(emailInput, 'bookEmailErr', 'Please enter a valid email address.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = emailInput;
      }

      // 12d. Validate Phone
      const phoneInput = document.getElementById('bookPhone');
      const phoneVal = phoneInput.value.trim().replace(/[\s\-+()]/g, '');
      const phonePattern = /^\d{10,15}$/;
      if (!phoneVal) {
        showFieldError(phoneInput, 'bookPhoneErr', 'Phone number is required.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = phoneInput;
      } else if (!phonePattern.test(phoneVal)) {
        showFieldError(phoneInput, 'bookPhoneErr', 'Enter a valid phone number (10 to 15 digits).');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = phoneInput;
      }

      // 12e. Validate Pickup Date (Required validation check)
      const dateInput = document.getElementById('bookDate');
      const dateVal = dateInput.value;
      if (!dateVal) {
        showFieldError(dateInput, 'bookDateErr', 'Pickup date is required.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = dateInput;
      } else {
        const selectedDate = new Date(dateVal);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          showFieldError(dateInput, 'bookDateErr', 'Pickup date cannot be in the past.');
          isValid = false;
          if (!firstInvalidInput) firstInvalidInput = dateInput;
        }
      }

      // 12f. Validate Address
      const addressInput = document.getElementById('bookAddress');
      const addressVal = addressInput.value.trim();
      if (!addressVal) {
        showFieldError(addressInput, 'bookAddressErr', 'Pickup address is required.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = addressInput;
      } else if (addressVal.length < 10) {
        showFieldError(addressInput, 'bookAddressErr', 'Please provide a complete address (minimum 10 characters).');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = addressInput;
      }

      // Set focus to the first invalid element if any
      if (!isValid && firstInvalidInput) {
        firstInvalidInput.focus();
      }

      if (isValid) {
        submitBookingForm();
      }
    });

    // Reset validation errors dynamically as the user types/changes inputs
    const inputsToWatch = ['bookName', 'bookEmail', 'bookPhone', 'bookDate', 'bookAddress'];
    inputsToWatch.forEach(function(id) {
      const input = document.getElementById(id);
      if (input) {
        const eventType = (input.tagName === 'SELECT' || input.type === 'date' || input.type === 'checkbox') ? 'change' : 'input';
        input.addEventListener(eventType, function() {
          input.classList.remove('is-invalid');
          const errDiv = document.getElementById(id + 'Err');
          if (errDiv) errDiv.textContent = '';
        });
      }
    });

    function showFieldError(inputEl, errId, message) {
      inputEl.classList.add('is-invalid');
      const errDiv = document.getElementById(errId);
      if (errDiv) {
        errDiv.textContent = message;
        errDiv.style.color = '#ef4444';
      }
    }

    function showError(errId, message) {
      const errDiv = document.getElementById(errId);
      if (errDiv) {
        errDiv.textContent = message;
        errDiv.style.color = '#ef4444';
      }
    }

    function clearErrors() {
      document.querySelectorAll('.custom-input').forEach(function(input) {
        input.classList.remove('is-invalid');
      });
      document.querySelectorAll('.invalid-feedback-custom').forEach(function(div) {
        div.textContent = '';
      });
      const cartErr = document.getElementById('cartGeneralErr');
      if (cartErr) cartErr.textContent = '';
    }

    function submitBookingForm() {
      const bookingId = 'BK' + Math.floor(1000 + Math.random() * 9000);
      const totalAmount = cart.reduce(function(sum, item) { return sum + (item.price * item.quantity); }, 0);
      
      const bookingData = {
        id: bookingId,
        name: document.getElementById('bookName').value.trim(),
        email: document.getElementById('bookEmail').value.trim(),
        phone: document.getElementById('bookPhone').value.trim(),
        date: document.getElementById('bookDate').value,
        address: document.getElementById('bookAddress').value.trim(),
        instructions: document.getElementById('bookInstructions').value.trim(),
        cart: [...cart],
        total: totalAmount,
        timestamp: new Date().toISOString()
      };

      const servicesText = cart.map(function(item) {
        return `${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}`;
      }).join('\n');

      const templateParams = {
        booking_id: bookingId,
        customer_name: bookingData.name,
        customer_email: bookingData.email,
        customer_phone: bookingData.phone,
        selected_services: servicesText,
        total_price: `₹${totalAmount}`,
        pickup_date: formatDateString(bookingData.date),
        delivery_address: bookingData.address,
        special_instructions: bookingData.instructions || 'None'
      };

      const feedbackEl = document.getElementById('bookingGeneralErr');
      if (feedbackEl) {
        feedbackEl.innerHTML = '<span class="text-info"><i class="fas fa-spinner fa-spin me-2"></i>Processing your booking & sending email...</span>';
      }

      // Check if EmailJS is loaded and active
      if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
          .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            if (feedbackEl) feedbackEl.innerHTML = '';
            finalizeBooking(bookingData);
          }, function(error) {
            console.error('EmailJS FAILED...', error);
            if (feedbackEl) {
              feedbackEl.innerHTML = `<span class="text-danger d-block my-2"><i class="fas fa-exclamation-triangle me-1"></i>EmailJS failed to deliver: ${error.text || error.status}. Please check your credentials config.</span>`;
            }
            // Execute fallback local confirmation card so submission is still functional
            finalizeBooking(bookingData);
          });
      } else {
        // Fallback for placeholder state (simulates local booking success)
        console.warn('EmailJS SDK not loaded or using placeholders. Booking completed locally.');
        if (feedbackEl) {
          feedbackEl.innerHTML = '<span class="text-warning d-block my-2"><i class="fas fa-info-circle me-1"></i>EmailJS keys not configured. Local simulation success.</span>';
        }
        finalizeBooking(bookingData);
      }
    }

    function finalizeBooking(data) {
      // save record to localStorage
      const savedBookings = JSON.parse(localStorage.getItem('freshwave_bookings') || '[]');
      savedBookings.push(data);
      localStorage.setItem('freshwave_bookings', JSON.stringify(savedBookings));

      // show confirmation details card
      showConfirmation(data);

      // reset booking form and cart variables
      bookingForm.reset();
      cart = [];
      updateCartUI();
    }

    function showConfirmation(data) {
      const card = document.getElementById('confirmationCard');
      if (!card) return;

      document.getElementById('confirmBookingId').textContent = data.id;
      document.getElementById('confirmName').textContent = data.name;
      document.getElementById('confirmEmailAddress').textContent = data.email;
      document.getElementById('confirmPhone').textContent = data.phone;
      document.getElementById('confirmDate').textContent = formatDateString(data.date);
      document.getElementById('confirmTotal').textContent = `₹${data.total}`;

      const servicesListEl = document.getElementById('confirmServicesList');
      if (servicesListEl) {
        servicesListEl.innerHTML = data.cart.map(function(item) {
          return `<div class="d-flex justify-content-between border-bottom py-1">
            <span>${item.name} x ${item.quantity}</span>
            <span>₹${item.price * item.quantity}</span>
          </div>`;
        }).join('');
      }

      card.classList.remove('d-none');
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function formatDateString(dateStr) {
      if (!dateStr) return '--';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', options);
    }
  }

  // 13. Newsletter Form submission
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const emailInput = document.getElementById('newsletterEmail');
      const errorEl = document.getElementById('newsletterEmailErr');
      const successEl = document.getElementById('newsletterSuccess');
      const submitBtn = document.getElementById('newsletterBtn');

      if (errorEl) errorEl.textContent = '';
      successEl?.classList.add('d-none');

      const emailVal = emailInput.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailVal) {
        if (errorEl) errorEl.textContent = 'Please enter your email address.';
        return;
      }
      if (!emailPattern.test(emailVal)) {
        if (errorEl) errorEl.textContent = 'Please enter a valid email address.';
        return;
      }

      // save to subscriber list in localStorage
      const subscribers = JSON.parse(localStorage.getItem('freshwave_subscribers') || '[]');
      if (subscribers.includes(emailVal)) {
        if (errorEl) errorEl.textContent = 'This email is already subscribed!';
        return;
      }

      subscribers.push(emailVal);
      localStorage.setItem('freshwave_subscribers', JSON.stringify(subscribers));

      emailInput.value = '';
      successEl?.classList.remove('d-none');
      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-check me-2"></i>Subscribed!';
        submitBtn.disabled = true;
        setTimeout(function() {
          submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Subscribe';
          submitBtn.disabled = false;
        }, 3000);
      }
    });
  }

});
