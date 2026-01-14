# Sentry Setup & Usage Guide for LaserTags

## ✅ What's Configured

### 1. **Sentry Initialization** (`src/config/sentry.js`)
- ✅ Error tracking with source maps
- ✅ Performance monitoring (`browserTracingIntegration`)
- ✅ Session replay on errors only (`replayIntegration`)
- ✅ Custom breadcrumbs for order flow
- ✅ User context tracking
- ✅ Development vs Production modes
- ✅ React Router v7 tracking (`withSentryReactRouterV7Routing` in main.js)

### 2. **Error Boundary** (`src/components/ErrorBoundary.js`)
- ✅ Catches React component errors
- ✅ User-friendly fallback UI
- ✅ Automatic Sentry reporting
- ✅ Reset functionality

### 3. **Environment Configuration** (`.env`)
```bash
VITE_SENTRY_DSN=https://91d897f01542770fddff3460cb98a931@...
VITE_SENTRY_ENVIRONMENT=development
VITE_SENTRY_DEBUG=false  # Set to true to send events in dev mode
```

---

## 🚀 How to Use Sentry

### Import the Utilities

```javascript
import { 
  addBreadcrumb, 
  captureException,
  setSentryUser,
  LaserTagsBreadcrumbs 
} from '../config/sentry';
```

### Track User Actions with Breadcrumbs

Replace your current `console.log()` statements with breadcrumbs:

**BEFORE:**
```javascript
console.log('Material selected:', shape, color);
```

**AFTER:**
```javascript
import { LaserTagsBreadcrumbs } from '../config/sentry';

// Material selection
LaserTagsBreadcrumbs.materialSelected(shape, color);
```

### Available Breadcrumb Helpers

```javascript
// Material selection
LaserTagsBreadcrumbs.materialSelected('bone', 'blue');

// Tag design
LaserTagsBreadcrumbs.tagDesignStarted('qr-code');  // or 'engrave'
LaserTagsBreadcrumbs.tagTextEntered('side1', 3);  // side, lineCount
LaserTagsBreadcrumbs.fontChanged('Pacifico');

// Contact info
LaserTagsBreadcrumbs.contactInfoEntered(true, true);  // hasEmail, hasPhone

// Order flow
LaserTagsBreadcrumbs.orderCreated(orderId);
LaserTagsBreadcrumbs.paymentStarted(1199);  // amount in cents
LaserTagsBreadcrumbs.paymentCompleted(orderId, 1199);
LaserTagsBreadcrumbs.paymentFailed(error.message);

// API calls
LaserTagsBreadcrumbs.apiRequest('/saveContact', 'POST');
LaserTagsBreadcrumbs.apiSuccess('/saveContact', 200);
LaserTagsBreadcrumbs.apiError('/saveContact', error.message);

// QR code
LaserTagsBreadcrumbs.qrCodeGenerated(contactId);

// Shipping
LaserTagsBreadcrumbs.shippingInfoEntered(true);  // hasAddress
```

---

## 🔍 Tracking Errors

### Automatic Error Tracking

Errors thrown inside React components are automatically caught by the ErrorBoundary:

```javascript
// This will be caught and reported automatically
throw new Error('Something went wrong!');
```

### Manual Error Tracking

For API errors, async errors, or errors outside React:

```javascript
import { captureException } from '../config/sentry';

try {
  const response = await saveContact(contactData);
} catch (error) {
  // Report to Sentry with context
  captureException(error, {
    component: 'MaterialSelection',
    action: 'saveContact',
    extra: { contactData }
  });
  
  // Show user-friendly error message
  alert('Failed to save contact information');
}
```

---

## 👤 User Context

Set user context after contact info is entered or order is created:

```javascript
import { setSentryUser } from '../config/sentry';

// After saveContact success
setSentryUser({
  id: contactId,
  email: contactData.email,
  username: contactData.firstname
});
```

This helps you see which users are experiencing errors in Sentry.

---

## 📊 Performance Monitoring

### Automatic Tracking
- Route changes (via React Router)
- Component render times
- API request durations

### Manual Transaction Tracking

For long-running operations (e.g., QR code generation):

```javascript
import { startTransaction } from '../config/sentry';

async function generateQRCode() {
  const transaction = startTransaction('qr-code-generation', 'custom');
  
  try {
    // Your QR code generation logic
    const qrCode = await generateQR(contactData);
    
    transaction.setStatus('ok');
    return qrCode;
  } catch (error) {
    transaction.setStatus('internal_error');
    throw error;
  } finally {
    transaction.finish();
  }
}
```

---

## 🧹 Removing console.log Statements

### Development Only Logs

If you want to keep some logs for development:

```javascript
// ❌ BAD - Always logs
console.log('User selected:', material);

// ✅ GOOD - Only logs in development
if (import.meta.env.DEV) {
  console.log('[DEV] User selected:', material);
}

// ✅ BETTER - Use Sentry breadcrumb instead
LaserTagsBreadcrumbs.materialSelected(material.shape, material.color);
```

### Replace console.log with Sentry

**MaterialSelection.js Example:**

Find: `console.log('saveContact - response data:', response.data);`

Replace with:
```javascript
LaserTagsBreadcrumbs.apiSuccess('/saveContact', response.status);
setSentryUser({
  id: response.data.id,
  email: response.data.email,
  username: response.data.firstname
});
```

**Error Logging:**

Find: `console.error('Error saving contact:', error);`

Replace with:
```javascript
LaserTagsBreadcrumbs.apiError('/saveContact', error.message);
captureException(error, {
  component: 'MaterialSelection',
  action: 'saveContact',
  extra: { requestData: contactData }
});
```

---

## 📁 Files to Update

Priority files with most console.log statements:

### 1. **src/components/MaterialSelection.js** (~100 logs)
   - Replace order flow logs with breadcrumbs
   - Add captureException for API errors
   - Set user context after saveContact

### 2. **src/api/tagApi.js** (~50 logs)
   - Add breadcrumbs for API requests/responses
   - Capture exceptions for failed requests

### 3. **src/components/TagPreview.js**
   - Add breadcrumbs for design changes
   - Track font changes, side flipping

### 4. **src/components/StripeCheckout.js**
   - Track payment events
   - Capture payment errors with full context

---

## 🧪 Testing Sentry

### Quick Test (After Setup)

**1. Check Console for Initialization:**
You should see:
```
[Sentry] Initialized for development environment (events not sent unless VITE_SENTRY_DEBUG=true)
```

**2. Test Error Boundary**

Add a temporary test button to App.js:

```javascript
// In App.js header, after the "Create Your Tag" button (temporary test)
<button
  onClick={() => { throw new Error('Sentry test error!'); }}
  className="px-4 py-2 bg-red-500 text-white rounded"
>
  Test Error
</button>
```

Click the button and you should see:
1. ✅ Error caught by ErrorBoundary
2. ✅ Fallback UI displayed with "Oops! Something went wrong"
3. ✅ "Try Again" and "Go to Homepage" buttons
4. ✅ Error logged to console (in dev mode)

**In Production Mode:**
Set `VITE_SENTRY_DEBUG=true` in `.env`, then the error will also be sent to Sentry dashboard.

### Test Breadcrumbs

```javascript
// Add to MaterialSelection.js
LaserTagsBreadcrumbs.materialSelected('bone', 'blue');
LaserTagsBreadcrumbs.orderCreated('test-123');

// Then trigger an error to see the breadcrumb trail
throw new Error('Test breadcrumb trail');
```

In Sentry, you'll see the complete trail of user actions leading up to the error.

---

## 🎯 Next Steps

### Phase 1: Integrate Breadcrumbs (2-3 hours)
- [ ] Add breadcrumbs to MaterialSelection.js (order flow)
- [ ] Add breadcrumbs to tagApi.js (API calls)
- [ ] Set user context after saveContact
- [ ] Test with a few test orders

### Phase 2: Replace console.log (3-4 hours)
- [ ] MaterialSelection.js - Replace ~100 logs
- [ ] tagApi.js - Replace ~50 logs
- [ ] TagPreview.js - Replace ~20 logs
- [ ] StripeCheckout.js - Replace ~15 logs

### Phase 3: Error Handling (2 hours)
- [ ] Wrap all try/catch blocks with captureException
- [ ] Add error boundaries to individual components
- [ ] Test error scenarios

### Phase 4: Production Prep (1 hour)
- [ ] Remove all development-only console.logs
- [ ] Verify no sensitive data in Sentry events
- [ ] Set up Sentry alerts for critical errors
- [ ] Test in production mode locally

---

## 🔐 Security Notes

**The Sentry configuration already filters:**
- ✅ Passwords
- ✅ API keys
- ✅ Stripe secrets
- ✅ Auth tokens

**Make sure NEVER to log:**
- Credit card numbers
- Full SSNs
- Passwords or auth tokens
- Stripe secret keys

---

## 📈 Sentry Dashboard

Access your project at:
**https://sentry.io/organizations/self-xah/issues/**

### Key Features to Monitor:
- **Issues** - All errors grouped by type
- **Performance** - Transaction times, slow queries
- **Releases** - Track errors per deployment
- **User Feedback** - Users can submit bug reports

---

## 🚨 Development vs Production

### Development Mode (Current)
- Events logged to console
- NOT sent to Sentry (saves quota)
- Full error details shown in browser

### Production Mode
- Events sent to Sentry automatically
- User-friendly error messages
- Session replay captured on errors
- Performance monitoring active

To test production mode locally:
```bash
# Set in .env
VITE_SENTRY_ENVIRONMENT=production
VITE_SENTRY_DEBUG=true  # To send events in local prod mode

# Then rebuild
npm run dev
```

---

## ✅ Ready to Launch?

Before deploying to production:

1. ✅ All console.log replaced with Sentry
2. ✅ Error boundaries on all major components
3. ✅ Breadcrumbs for critical user actions
4. ✅ User context set after contact/order creation
5. ✅ No sensitive data logged
6. ✅ Test error scenarios work correctly
7. ✅ Sentry alerts configured

---

## 💡 Pro Tips

1. **Search by tag in Sentry:**
   - `component:MaterialSelection` - All errors from this component
   - `action:saveContact` - All errors during contact save

2. **Use breadcrumbs to understand user flow:**
   - See exactly what the user did before the error
   - Reproduce bugs faster

3. **Monitor performance:**
   - Track slow API calls
   - Identify bottlenecks in order flow

4. **Set up alerts:**
   - Email when critical errors occur
   - Slack integration for team notifications

---

## 🆘 Need Help?

- **Sentry Docs:** https://docs.sentry.io/platforms/javascript/guides/react/
- **Linear Ticket:** LAS-7 (Tag Designer Refactor)
- **Questions?** Just ask Claude!

---

**You're all set! 🎉**

Sentry will now track every error, performance issue, and user action in LaserTags. This will be invaluable for debugging production issues and improving the customer experience.
