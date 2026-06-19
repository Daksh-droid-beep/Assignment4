# FreshWave Laundry Website – Student Assignment

A complete, responsive, frontend-only commercial laundry website built with HTML, CSS, JavaScript, and Bootstrap 5. This project simulates a real-world booking workflow with a dynamic cart system, EmailJS booking notifications, and browser local storage.

---

## 1. Project Overview
FreshWave Laundry is a demonstration of modern frontend techniques designed as a student assignment. It represents a fully functional website for a commercial laundry service, enabling users to:
* Learn about the company, features, and pricing.
* Dynamically select services (Wash & Fold, Dry Cleaning, Ironing, etc.) using an interactive cart.
* Book services using validation-checked forms.
* Simulate a booking confirmation via EmailJS and view the resulting booking details.
* Explore a fully responsive UI complete with scroll animations and dark/light modes.

---

## 2. Features
* **Two-Column Booking Layout**: Quick service cart adjustment on the left and input form on the right.
* **Dynamic Cart Management**: Instantly add or remove items, view quantity indicators, and see running price totals update in real-time.
* **EmailJS Integration**: Submits bookings directly from the client browser and simulates dispatch of confirmation emails containing booking summaries.
* **Interactive Price Calculator**: Quick quote calculator with custom sliders/counters and tax breakdown.
* **Persistent Dark & Light Themes**: Quick button to toggle display aesthetics, saving the choice to localStorage.
* **Animated Achievements & Stats Counters**: Smooth increment counter animations triggered as the achievements block rolls onto the page.
* **Filtering and Search**: Real-time service menu searches and tab-based filters.
* **Modern CSS details**: Smooth scroll indicators, interactive hover micro-animations, custom scrollbars, and back-to-top navigation.

---

## 3. Technologies Used
* **HTML5**: Semantic tags structure (`<section>`, `<nav>`, `<footer>`).
* **CSS3**: Variable-based design tokens, custom keyframes, scroll indicators, and responsiveness overrides.
* **JavaScript (ES6+)**: Event listeners, dynamic array manipulations, regex validation, local storage synchronization, and IntersectionObservers.
* **Bootstrap 5.3**: Grid framework, layouts, and responsive accordion collapses.
* **Font Awesome 6.5**: Vector graphics and icons.
* **EmailJS SDK**: Third-party secure client-side form submissions.

---

## 4. Cart System Explanation
The cart system is engineered using a clean, readable JavaScript array:
```javascript
let cart = [];
```
When a service is added (either via the main section or the cart sidebar):
1. **Adding**: If the item exists in the array, its quantity is incremented by 1. Otherwise, a new object `{ name: serviceName, price: price, quantity: 1 }` is appended.
2. **Removing**: Clicking "Remove" decrements the quantity. If the quantity reaches 0, the item is spliced from the array entirely.
3. **UI Synchronization**: A master `updateCartUI()` function synchronizes the array state with the document elements. It recalculates the total sum, updates selection badge numbers, and renders list items dynamically inside the cart column.

---

## 5. EmailJS Integration Guide
This project uses the official EmailJS client-side SDK to submit booking forms directly.

### Step-by-Step Setup:
1. **Import Library**:
   Included in the `<head>` of [index.html](file:///d:/Assignment4/index.html):
   ```html
   <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
   ```
2. **Initialization**:
   In [script.js](file:///d:/Assignment4/script.js):
   ```javascript
   emailjs.init({ publicKey: "YOUR_PUBLIC_KEY" });
   ```
3. **Send Request**:
   When submission is triggered:
   ```javascript
   emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams);
   ```
4. **Setup in Dashboard**:
   * Create an account at [emailjs.com](https://www.emailjs.com).
   * Connect a mail server (e.g., Gmail) to obtain a **Service ID**.
   * Create a new template and map the parameters: `{{booking_id}}`, `{{customer_name}}`, `{{customer_email}}`, `{{customer_phone}}`, `{{selected_services}}`, `{{total_price}}`, `{{pickup_date}}`, and `{{delivery_address}}`. Copy the **Template ID**.
   * Find your **Public Key** under Account > API Keys.
   * Replace the placeholders (`YOUR_PUBLIC_KEY`, `YOUR_SERVICE_ID`, `YOUR_TEMPLATE_ID`) inside [script.js](file:///d:/Assignment4/script.js).

*Note: For testing convenience, if keys are missing or credentials fail, the JS script handles this gracefully by displaying a local success confirmation card and logging the transaction to the console.*

---

## 6. LocalStorage Usage
LocalStorage is used to capture persistent information without a database:
1. **Theme Preference**: Stores `'dark'` or `'light'` under the key `freshwave_theme` so the layout matches user choice upon page reload.
2. **Newsletter Signups**: Captures subscriber email arrays under the key `freshwave_subscribers` to prevent duplicate submissions.
3. **Booking Database**: Stores complete logs of successfully completed bookings under the key `freshwave_bookings` as a JSON string array of objects:
   ```json
   {
     "id": "BK4820",
     "name": "Jane Doe",
     "email": "jane@example.com",
     "phone": "9876543210",
     "date": "2026-06-25",
     "address": "456, Lakeview Road",
     "instructions": "Delicate wash",
     "cart": [{"name": "Wash & Fold", "price": 100, "quantity": 2}],
     "total": 200,
     "timestamp": "2026-06-19T10:00:00.000Z"
   }
   ```

---

## 7. How To Run Project
1. Clone or download this project folder containing [index.html](file:///d:/Assignment4/index.html), [style.css](file:///d:/Assignment4/style.css), and [script.js](file:///d:/Assignment4/script.js).
2. To run directly:
   Double-click [index.html](file:///d:/Assignment4/index.html) to load it in any browser.
3. To run locally as a server (highly recommended):
   Open a terminal in the folder and run:
   ```bash
   npx serve
   ```
   Or using Python:
   ```bash
   python -m http.server 8000
   ```
   Open `http://localhost:3000` or `http://localhost:8000` to view the page.

---

## 8. Folder Structure
```text
Assignment4/
│
├── index.html     # Main markup containing page layouts
├── style.css      # Design tokens, custom stylesheet, and responsive media rules
├── script.js      # App initialization, cart handler, verification, and API simulator
└── README.md      # Setup guide and documentation (this file)
```

---

## 9. Challenges Faced
* **State Syncing**: Maintaining clean array structures to calculate totals and update elements simultaneously when adding from multiple different places (such as the upper services cards and the cart column buttons). Resolved by consolidating UI changes inside a single `updateCartUI()` helper.
* **EmailJS API Fallback**: Web browsers blocking calls or missing API keys throwing errors which breaks form submissions during local inspection. Resolved by catching fetch errors and initiating a fallback configuration that logs the raw template parameter values in the console while continuing to display the success confirmation card.

---

## 10. Future Improvements
* Integration of real-time maps APIs to allow users to pin pickup addresses.
* Addition of a calendar slot allocator to book hourly slots.
* Dynamic billing adjustments for Express delivery priority select options.
