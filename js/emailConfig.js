// EmailJS configuration - SECURITY WARNING
// DO NOT commit your real credentials to version control!
// Use environment variables or a backend proxy instead.
//
// For local development only:
// 1. Create a file: js/emailConfig.local.js (add to .gitignore)
// 2. Add your credentials there:
//    window.EMAIL_CFG = {
//      serviceID: 'your_service_id',
//      templateID: 'your_template_id', 
//      publicKey: 'your_public_key'
//    };
// 3. This file will NOT be committed to git
//
// For production/deployment:
// Use backend API to send emails securely, or use Netlify/Vercel
// environment variables with a serverless function.

// Default: credentials disabled for security
window.EMAIL_CFG = {
  serviceID: '',
  templateID: '',
  publicKey: ''
};
