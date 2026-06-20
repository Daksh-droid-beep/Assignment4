# Laundry Services — Assignment

A responsive web app for booking laundry services with cart management, booking form, newsletter signup, and email confirmations.

## Features

- **Service Catalog**: View available services with pricing
- **Shopping Cart**: Add/remove services, adjust quantities
- **Booking Form**: Schedule pickups with client-side validation
- **Newsletter Signup**: Subscribe for updates (stores in localStorage)
- **Email Confirmations**: Booking confirmations via EmailJS
- **Service Stats**: Hardcoded company metrics (15+ Services, 240+ Customers, 2+ Years)
- **Smooth Scrolling**: Anchor links with smooth behavior
- **Responsive Design**: Works on mobile, tablet, and desktop

## How to Run Locally

### Option 1: Simple Demo (No Email)

1. Clone and navigate:
   ```bash
   git clone https://github.com/Daksh-droid-beep/Assignment4.git
   cd Assignment4
   ```

2. Open in browser:
   ```bash
   start index.html
   ```

Bookings save to `localStorage` but emails won't send without credentials.

### Option 2: With Email Support (Development)

**IMPORTANT: Never commit real credentials to git!**

1. Create EmailJS account and set up:
   - Visit https://www.emailjs.com/ (free account)
   - Create Email Service (Gmail recommended)
   - Create Email Template with variables: `{{customer_name}}`, `{{pickup_date}}`, `{{items}}`, `{{total}}`, `{{customer_phone}}`, `{{notes}}`
   - Copy: Service ID, Template ID, and Public Key

2. Create local config (git-ignored):
   ```bash
   # Create file: js/emailConfig.local.js
   ```

3. Paste credentials:
   ```javascript
   // js/emailConfig.local.js
   window.EMAIL_CFG = {
     serviceID: 'service_xxx',      // from EmailJS dashboard
     templateID: 'template_yyy',    // from Email Templates
     publicKey: 'your_public_key'   // from Account > API Keys
   };
   ```

4. Update index.html to use local config:
   ```html
   <!-- Find this line in index.html -->
   <script src="js/emailConfig.js"></script>
   
   <!-- Change to -->
   <script src="js/emailConfig.local.js"></script>
   ```

5. Reload browser and test booking form

### Option 3: Production (Recommended)

For live deployment, use backend:
- Create Node.js/Python API endpoint
- Endpoint receives booking data and calls EmailJS server-to-server
- Keeps credentials secure and away from client-side code
- Return booking confirmation to frontend

## File Structure

```
Assignment4/
├── index.html              # Main page with all sections
├── css/
│   └── styles.css          # Responsive styling
├── js/
│   ├── app.js              # Booking, cart, form logic
│   ├── emailConfig.js      # Empty template (credentials go in local file)
│   └── emailConfig.local.js # YOUR credentials (git-ignored, create manually)
├── README.md               # This file
└── .gitignore              # Excludes local config
```

## Data Storage

- **Cart**: Browser `localStorage` (temporary, resets on browser clear)
- **Bookings**: Browser `localStorage` (local only, use backend DB for production)
- **Newsletter**: Browser `localStorage` (local only, use backend for production)

## What I Learned

✅ HTML form validation and accessibility  
✅ JavaScript DOM manipulation and event handling  
✅ localStorage for client-side persistence  
✅ Responsive CSS Grid and Flexbox  
✅ EmailJS integration basics  
✅ Cart and booking logic  

## Security Considerations

⚠️ **CRITICAL: Never commit API credentials to version control**

Current approach:
- `emailConfig.js` has empty credentials (safe to commit)
- `emailConfig.local.js` has your real credentials (git-ignored, never committed)
- For production, use backend proxy to keep credentials server-side

Better approach for production:
- Create a backend endpoint that handles email sending
- Frontend sends booking data to your backend
- Backend calls EmailJS with secured credentials
- Frontend never sees API keys

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Future Improvements

- Backend API for secure email and data persistence
- Database (Firebase, MongoDB, PostgreSQL)
- User authentication and account management
- Payment processing (Stripe, PayPal)
- Admin dashboard for managing bookings
- Email scheduling and reminder notifications
