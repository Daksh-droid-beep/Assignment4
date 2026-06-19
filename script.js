/**
 * FreshWave Laundry – script.js
 * Author: FreshWave Team
 * Description: All JavaScript functionality for the Laundry Service Website
 * Features: Page Loader, Dark/Light Mode, Sticky Navbar, Smooth Scroll,
 *           Scroll Reveal, Animated Counters, Service Filter, Booking Form,
 *           Price Calculator, Newsletter, Back-to-Top
 */

'use strict';

/* ============================================================
   CONSTANTS & PRICING DATA
   ============================================================ */

/** Pricing map for each laundry service (₹ per item) */
const SERVICE_PRICES = {
  'Dry Cleaning': 50,
  'Wash & Fold': 30,
  'Ironing': 20,
  'Premium Laundry': 70,
  'Stain Removal': 40,
  'Express Service': 80
};

/** GST rate applied on subtotal */
const GST_RATE = 0.18;

/* ============================================================
   1. PAGE LOADER
   ============================================================ */

/**
 * Hides the full-screen loading overlay once the page is fully loaded.
 * Adds the 'hidden' class which triggers a CSS fade-out transition.
 */
function initPageLoader() {
  const loader = document.getElementById('pageLoader');
  if (!loader) return;

  // Wait for window load event (all assets loaded)
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      // Remove from DOM after transition ends
      loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    }, 500);
  });
}

/* ============================================================
   2. DARK / LIGHT MODE TOGGLE
   ============================================================ */

/**
 * Initializes dark/light mode toggle.
 * Reads saved preference from localStorage and toggles between themes.
 */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const htmlEl = document.documentElement;

  if (!toggleBtn || !themeIcon) return;

  // Load saved theme preference (default: 'light')
  const savedTheme = localStorage.getItem('freshwave_theme') || 'light';
  applyTheme(savedTheme);

  toggleBtn.addEventListener('click', () => {
    const current = htmlEl.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('freshwave_theme', newTheme);
  });

  /**
   * Applies the specified theme to the HTML element and updates toggle icon.
   * @param {string} theme - 'dark' or 'light'
   */
  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      themeIcon.classList.replace('fa-moon', 'fa-sun');
      toggleBtn.title = 'Switch to Light Mode';
    } else {
      themeIcon.classList.replace('fa-sun', 'fa-moon');
      toggleBtn.title = 'Switch to Dark Mode';
    }
  }
}

/* ============================================================
   3. STICKY NAVBAR & ACTIVE LINK HIGHLIGHTING
   ============================================================ */

/**
 * Adds a scrolled class to the navbar when page is scrolled.
 * Also highlights the nav link corresponding to the current visible section.
 */
function initNavbar() {
  const navbar = document.getElementById('mainNavbar');
  const navLinks = document.querySelectorAll('#navMenu .nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (!navbar) return;

  // Update navbar appearance on scroll
  window.addEventListener('scroll', () => {
    // Highlight active section link
    highlightActiveNavLink(navLinks, sections);
  }, { passive: true });

  // Smooth close of mobile menu when nav link clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const navCollapse = document.getElementById('navMenu');
      if (navCollapse && navCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });
}

/**
 * Determines which section is currently in view and marks its nav link as active.
 * @param {NodeList} links - All navigation anchor links
 * @param {NodeList} sections - All page sections with IDs
 */
function highlightActiveNavLink(links, sections) {
  let currentSection = '';
  const scrollY = window.scrollY + 120; // Offset for sticky navbar

  sections.forEach(section => {
    if (scrollY >= section.offsetTop) {
      currentSection = section.getAttribute('id');
    }
  });

  links.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

/* ============================================================
   4. BACK TO TOP BUTTON
   ============================================================ */

/**
 * Shows/hides the "Back to Top" button based on scroll position.
 * Scrolls smoothly to the top when clicked.
 */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   5. SCROLL REVEAL ANIMATIONS
   ============================================================ */

/**
 * Uses IntersectionObserver to reveal elements as they enter the viewport.
 * Elements with [data-reveal] attribute get the 'revealed' class added.
 * Supports delay via [data-delay] attribute (in milliseconds).
 */
function initScrollReveal() {
  const elements = document.querySelectorAll('[data-reveal]');

  if (!elements.length) return;

  // Fallback: if IntersectionObserver is not supported, show all elements immediately
  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.getAttribute('data-delay') || 0, 10);
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay);
        // Unobserve after revealing (animation plays once)
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,      // Trigger when 12% of element is visible
    rootMargin: '0px 0px -40px 0px'  // Slightly before it fully enters
  });

  elements.forEach(el => observer.observe(el));
}

/* ============================================================
   6. ANIMATED COUNTERS (ACHIEVEMENTS SECTION)
   ============================================================ */

/**
 * Animates numeric counters from 0 to their target value.
 * Uses IntersectionObserver to start animation when section is visible.
 * Reads [data-target] and [data-suffix] attributes from counter elements.
 */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

/**
 * Runs the counting animation for a single counter element.
 * @param {HTMLElement} el - The counter element with data-target and data-suffix
 */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 1800; // ms
  const frameDuration = 1000 / 60; // ~16ms per frame at 60fps
  const totalFrames = Math.round(duration / frameDuration);
  let frame = 0;

  const counter = setInterval(() => {
    frame++;
    // Ease-out progress curve: starts fast, slows down at end
    const progress = easeOutQuart(frame / totalFrames);
    const currentVal = Math.round(target * progress);
    el.textContent = currentVal + suffix;

    if (frame >= totalFrames) {
      clearInterval(counter);
      el.textContent = target + suffix; // Ensure exact final value
    }
  }, frameDuration);
}

/**
 * Ease-out quartic function for smooth deceleration.
 * @param {number} t - Progress (0 to 1)
 * @returns {number} Eased value (0 to 1)
 */
function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

/* ============================================================
   7. SERVICE SEARCH & FILTER
   ============================================================ */

/**
 * Handles the service search input and filter tab buttons.
 * Filters service cards based on search text and/or category.
 */
function initServiceFilter() {
  const searchInput = document.getElementById('serviceSearch');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceItems = document.querySelectorAll('.service-item');
  const noResults = document.getElementById('noServiceResults');

  if (!searchInput) return;

  let activeFilter = 'all';
  let searchQuery = '';

  // Search input listener
  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value.trim().toLowerCase();
    applyFilters();
  });

  // Filter tab button listeners
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter');
      applyFilters();
    });
  });

  /**
   * Applies both search query and category filter simultaneously.
   * Shows/hides cards and displays a "no results" message if needed.
   */
  function applyFilters() {
    let visibleCount = 0;

    serviceItems.forEach(item => {
      const category = item.getAttribute('data-category');
      const titleEl = item.querySelector('.service-title');
      const descEl = item.querySelector('.service-desc');
      const title = titleEl ? titleEl.textContent.toLowerCase() : '';
      const desc = descEl ? descEl.textContent.toLowerCase() : '';

      // Check if item passes both filters
      const categoryMatch = activeFilter === 'all' || category === activeFilter;
      const searchMatch = !searchQuery || title.includes(searchQuery) || desc.includes(searchQuery);

      if (categoryMatch && searchMatch) {
        item.classList.remove('hidden');
        visibleCount++;
      } else {
        item.classList.add('hidden');
      }
    });

    // Show "no results" message if nothing is visible
    if (noResults) {
      noResults.classList.toggle('d-none', visibleCount > 0);
    }
  }
}

/* ============================================================
   8. BOOKING FORM WITH VALIDATION & LOCAL STORAGE
   ============================================================ */

/**
 * Handles booking form submission with full client-side validation.
 * On success: saves to localStorage, shows confirmation card, clears form.
 */
function initBookingForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  // Set min date to today for pickup date input
  const dateInput = document.getElementById('bookDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearFormErrors();

    if (validateBookingForm()) {
      submitBooking();
    }
  });

  /**
   * Validates all required booking form fields.
   * Shows error messages next to invalid fields.
   * @returns {boolean} true if all fields are valid
   */
  function validateBookingForm() {
    let isValid = true;

    // Validate Full Name
    const name = document.getElementById('bookName').value.trim();
    if (!name) {
      showError('bookNameErr', 'Full name is required.');
      isValid = false;
    } else if (name.length < 2) {
      showError('bookNameErr', 'Name must be at least 2 characters.');
      isValid = false;
    }

    // Validate Email
    const email = document.getElementById('bookEmail').value.trim();
    if (!email) {
      showError('bookEmailErr', 'Email address is required.');
      isValid = false;
    } else if (!isValidEmail(email)) {
      showError('bookEmailErr', 'Please enter a valid email address.');
      isValid = false;
    }

    // Validate Phone
    const phone = document.getElementById('bookPhone').value.trim();
    if (!phone) {
      showError('bookPhoneErr', 'Phone number is required.');
      isValid = false;
    } else if (!isValidPhone(phone)) {
      showError('bookPhoneErr', 'Enter a valid phone number (10–15 digits).');
      isValid = false;
    }

    // Validate Service Type
    const service = document.getElementById('bookService').value;
    if (!service) {
      showError('bookServiceErr', 'Please select a service type.');
      isValid = false;
    }

    // Validate Pickup Date
    const date = document.getElementById('bookDate').value;
    if (!date) {
      showError('bookDateErr', 'Pickup date is required.');
      isValid = false;
    } else {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        showError('bookDateErr', 'Pickup date cannot be in the past.');
        isValid = false;
      }
    }

    // Validate Address
    const address = document.getElementById('bookAddress').value.trim();
    if (!address) {
      showError('bookAddressErr', 'Pickup address is required.');
      isValid = false;
    } else if (address.length < 10) {
      showError('bookAddressErr', 'Please provide a complete address.');
      isValid = false;
    }

    return isValid;
  }

  /**
   * Collects form data, generates a booking ID, saves to localStorage,
   * displays the confirmation card, and resets the form.
   */
  function submitBooking() {
    const bookingId = generateBookingId();
    const bookingData = {
      id: bookingId,
      name: document.getElementById('bookName').value.trim(),
      email: document.getElementById('bookEmail').value.trim(),
      phone: document.getElementById('bookPhone').value.trim(),
      service: document.getElementById('bookService').value,
      date: document.getElementById('bookDate').value,
      address: document.getElementById('bookAddress').value.trim(),
      instructions: document.getElementById('bookInstructions').value.trim(),
      timestamp: new Date().toISOString()
    };

    // Save to localStorage
    saveBookingToStorage(bookingData);

    // Display confirmation card
    showConfirmationCard(bookingData);

    // Reset form
    form.reset();
  }

  /**
   * Saves booking data to localStorage under 'freshwave_bookings' key.
   * Appends to existing bookings array.
   * @param {Object} data - Booking data object
   */
  function saveBookingToStorage(data) {
    const existingRaw = localStorage.getItem('freshwave_bookings');
    const bookings = existingRaw ? JSON.parse(existingRaw) : [];
    bookings.push(data);
    localStorage.setItem('freshwave_bookings', JSON.stringify(bookings));
  }

  /**
   * Populates and shows the booking confirmation card.
   * @param {Object} data - Booking data object
   */
  function showConfirmationCard(data) {
    const card = document.getElementById('confirmationCard');
    if (!card) return;

    document.getElementById('confirmBookingId').textContent = data.id;
    document.getElementById('confirmName').textContent = data.name;
    document.getElementById('confirmService').textContent = data.service;
    document.getElementById('confirmDate').textContent = formatDate(data.date);
    document.getElementById('confirmPhone').textContent = data.phone;

    card.classList.remove('d-none');

    // Smooth scroll to confirmation card
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /**
   * Clears all error messages from the booking form.
   */
  function clearFormErrors() {
    const errorEls = form.querySelectorAll('.invalid-feedback-custom');
    errorEls.forEach(el => {
      el.textContent = '';
    });
  }
}

/* ============================================================
   9. PRICE CALCULATOR
   ============================================================ */

/**
 * Sets up the interactive price calculator.
 * Updates price display in real-time when service or quantity changes.
 */
function initPriceCalculator() {
  const serviceSelect = document.getElementById('calcService');
  const qtyInput = document.getElementById('calcQty');
  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus = document.getElementById('qtyPlus');

  if (!serviceSelect || !qtyInput) return;

  // Quantity control buttons
  qtyMinus.addEventListener('click', () => {
    const current = parseInt(qtyInput.value, 10);
    if (current > 1) {
      qtyInput.value = current - 1;
      updatePriceDisplay();
    }
  });

  qtyPlus.addEventListener('click', () => {
    const current = parseInt(qtyInput.value, 10);
    if (current < 100) {
      qtyInput.value = current + 1;
      updatePriceDisplay();
    }
  });

  // Prevent invalid quantity input
  qtyInput.addEventListener('input', () => {
    let val = parseInt(qtyInput.value, 10);
    if (isNaN(val) || val < 1) val = 1;
    if (val > 100) val = 100;
    qtyInput.value = val;
    updatePriceDisplay();
  });

  serviceSelect.addEventListener('change', updatePriceDisplay);

  /**
   * Recalculates and displays the price breakdown based on
   * selected service rate and item quantity.
   */
  function updatePriceDisplay() {
    const pricePerItem = parseInt(serviceSelect.value, 10) || 0;
    const qty = parseInt(qtyInput.value, 10) || 0;
    const subtotal = pricePerItem * qty;
    const gst = Math.round(subtotal * GST_RATE);
    const total = subtotal + gst;

    document.getElementById('priceRate').textContent = pricePerItem ? `₹${pricePerItem} /item` : '₹0 /item';
    document.getElementById('priceQty').textContent = qty;
    document.getElementById('priceSubtotal').textContent = `₹${subtotal}`;
    document.getElementById('priceGst').textContent = `₹${gst}`;

    // Animate total change
    const totalEl = document.getElementById('priceTotal');
    totalEl.classList.add('price-updating');
    setTimeout(() => {
      totalEl.textContent = `₹${total}`;
      totalEl.classList.remove('price-updating');
    }, 100);
  }

  // Run once on init
  updatePriceDisplay();
}

/* ============================================================
   10. NEWSLETTER SUBSCRIPTION
   ============================================================ */

/**
 * Handles newsletter form submission.
 * Validates email, saves to localStorage, shows success message.
 */
function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailInput = document.getElementById('newsletterEmail');
    const errorEl = document.getElementById('newsletterEmailErr');
    const successEl = document.getElementById('newsletterSuccess');
    const btn = document.getElementById('newsletterBtn');

    // Reset previous state
    errorEl.textContent = '';
    successEl.classList.add('d-none');

    const email = emailInput.value.trim();

    // Validate email
    if (!email) {
      showError('newsletterEmailErr', 'Please enter your email address.', '#ef4444');
      return;
    }
    if (!isValidEmail(email)) {
      showError('newsletterEmailErr', 'Please enter a valid email address.', '#ef4444');
      return;
    }

    // Check for duplicate subscription
    const existing = JSON.parse(localStorage.getItem('freshwave_subscribers') || '[]');
    if (existing.includes(email)) {
      showError('newsletterEmailErr', 'This email is already subscribed!', '#f59e0b');
      return;
    }

    // Save subscriber to localStorage
    existing.push(email);
    localStorage.setItem('freshwave_subscribers', JSON.stringify(existing));

    // Show success
    emailInput.value = '';
    successEl.classList.remove('d-none');
    btn.innerHTML = '<i class="fas fa-check me-2"></i>Subscribed!';
    btn.disabled = true;

    // Reset button after 3 seconds
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Subscribe';
      btn.disabled = false;
    }, 3000);
  });
}

/* ============================================================
   11. FOOTER YEAR
   ============================================================ */

/**
 * Dynamically sets the current year in the footer copyright text.
 */
function initFooterYear() {
  const yearEl = document.getElementById('footerYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ============================================================
   12. SMOOTH SCROLLING FOR ANCHOR LINKS
   ============================================================ */

/**
 * Enables smooth scrolling for all in-page anchor links (#...).
 * Accounts for the fixed navbar height.
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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
}

/* ============================================================
   UTILITY FUNCTIONS
   ============================================================ */

/**
 * Validates an email address against a standard regex pattern.
 * @param {string} email - Email string to validate
 * @returns {boolean}
 */
function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Validates a phone number: allows digits, spaces, hyphens, plus sign.
 * Minimum 10 digits, maximum 15 digits.
 * @param {string} phone - Phone string to validate
 * @returns {boolean}
 */
function isValidPhone(phone) {
  const cleaned = phone.replace(/[\s\-+()]/g, '');
  return /^\d{10,15}$/.test(cleaned);
}

/**
 * Displays a validation error message.
 * @param {string} elementId - ID of the error display element
 * @param {string} message - Error message text
 * @param {string} [color='#ef4444'] - Optional text color
 */
function showError(elementId, message, color = '#ef4444') {
  const el = document.getElementById(elementId);
  if (el) {
    el.textContent = message;
    el.style.color = color;
  }
}

/**
 * Generates a unique booking ID.
 * Format: FW-YYYYMMDD-XXXX (e.g., FW-20240619-A3F1)
 * @returns {string}
 */
function generateBookingId() {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `FW-${datePart}-${randomPart}`;
}

/**
 * Formats a date string (YYYY-MM-DD) into a readable format (e.g., 19 June 2024).
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {string}
 */
function formatDate(dateStr) {
  if (!dateStr) return '--';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', options);
}

/* ============================================================
   INITIALISATION – Run all modules on DOM ready
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initPageLoader();
  initThemeToggle();
  initNavbar();
  initBackToTop();
  initScrollReveal();
  initCounters();
  initServiceFilter();
  initBookingForm();
  initPriceCalculator();
  initNewsletter();
  initFooterYear();
  initSmoothScroll();
});
