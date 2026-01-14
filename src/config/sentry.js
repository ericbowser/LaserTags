/**
 * Sentry Configuration for LaserTags
 * 
 * Comprehensive error tracking, performance monitoring, and logging
 * for production and development environments.
 */

import * as Sentry from "@sentry/react";

/**
 * Initialize Sentry with enhanced configuration
 * 
 * Features enabled:
 * - Error tracking with source maps
 * - Performance monitoring (tracing)
 * - Session replay on errors
 * - Custom breadcrumbs for order flow
 * - User context tracking
 */
export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  const environment = import.meta.env.VITE_SENTRY_ENVIRONMENT || 'development';
  const isProduction = environment === 'production';

  // Don't initialize if DSN is missing
  if (!dsn) {
    console.warn('[Sentry] DSN not configured - skipping initialization');
    return;
  }

  Sentry.init({
    dsn,
    environment,
    
    // Enable tracing for performance monitoring
    integrations: [
      // Browser tracing for performance monitoring
      // Note: React Router instrumentation will be added via withSentryRouting wrapper
      Sentry.browserTracingIntegration(),
      
      // Session replay - capture video on errors
      Sentry.replayIntegration({
        // Only capture replays on errors in production
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    // Performance Monitoring - sample rate
    tracesSampleRate: isProduction ? 0.1 : 1.0, // 10% in prod, 100% in dev
    
    // Session Replay - sample rate
    replaysSessionSampleRate: 0.0, // Don't record normal sessions
    replaysOnErrorSampleRate: 1.0, // Always record when errors occur

    // Send user IP and default PII
    sendDefaultPii: true,

    // Enable automatic logging to Sentry
    enableLogs: true,

    // Before sending events, filter out sensitive data
    beforeSend(event, hint) {
      // Don't send events in development unless explicitly enabled
      if (!isProduction && !import.meta.env.VITE_SENTRY_DEBUG) {
        console.log('[Sentry] Event captured (dev mode - not sending):', event);
        return null; // Don't send to Sentry in dev
      }

      // Filter out sensitive data from breadcrumbs
      if (event.breadcrumbs) {
        event.breadcrumbs = event.breadcrumbs.map(breadcrumb => {
          if (breadcrumb.data) {
            const sanitized = { ...breadcrumb.data };
            
            // Remove sensitive fields
            delete sanitized.password;
            delete sanitized.stripe_secret;
            delete sanitized.auth_token;
            delete sanitized.api_key;
            
            return { ...breadcrumb, data: sanitized };
          }
          return breadcrumb;
        });
      }

      // Add custom error context
      if (hint.originalException) {
        event.extra = {
          ...event.extra,
          errorType: hint.originalException.constructor.name,
        };
      }

      return event;
    },

    // Ignore specific errors
    ignoreErrors: [
      // Browser extensions
      'top.GLOBALS',
      // Random plugins/extensions
      'originalCreateNotification',
      'canvas.contentDocument',
      'MyApp_RemoveAllHighlights',
      // Facebook related errors
      'fb_xd_fragment',
      // Network errors (handled separately)
      'Network request failed',
      'NetworkError',
      // React errors we handle ourselves
      'ResizeObserver loop limit exceeded',
    ],

    // Release tracking (optional - set via build process)
    release: import.meta.env.VITE_APP_VERSION || 'development',
  });

  // Log successful initialization
  if (isProduction) {
    console.log('[Sentry] Initialized for production environment');
  } else {
    console.log('[Sentry] Initialized for development environment (events not sent unless VITE_SENTRY_DEBUG=true)');
  }
}

/**
 * Set user context for Sentry
 * Call this after user logs in or places an order
 * 
 * @param {Object} user - User information
 * @param {string} user.id - User ID or order ID
 * @param {string} user.email - User email
 * @param {string} user.username - User name (optional)
 */
export function setSentryUser(user) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.username || user.firstname || 'anonymous',
  });
}

/**
 * Clear user context (e.g., on logout)
 */
export function clearSentryUser() {
  Sentry.setUser(null);
}

/**
 * Add custom breadcrumb for order flow tracking
 * 
 * @param {string} category - Category (e.g., 'order', 'payment', 'api')
 * @param {string} message - Descriptive message
 * @param {Object} data - Additional context data
 * @param {string} level - Log level: 'info', 'warning', 'error'
 */
export function addBreadcrumb(category, message, data = {}, level = 'info') {
  Sentry.addBreadcrumb({
    category,
    message,
    data,
    level,
    timestamp: Date.now() / 1000,
  });
}

/**
 * Capture an exception with additional context
 * 
 * @param {Error} error - The error object
 * @param {Object} context - Additional context
 * @param {string} context.component - Component name
 * @param {string} context.action - Action being performed
 * @param {Object} context.extra - Extra data
 */
export function captureException(error, context = {}) {
  Sentry.captureException(error, {
    tags: {
      component: context.component || 'unknown',
      action: context.action || 'unknown',
    },
    extra: context.extra || {},
  });
}

/**
 * Capture a message (non-error event)
 * 
 * @param {string} message - Message to log
 * @param {string} level - Severity: 'info', 'warning', 'error'
 * @param {Object} extra - Additional data
 */
export function captureMessage(message, level = 'info', extra = {}) {
  Sentry.captureMessage(message, {
    level,
    extra,
  });
}

/**
 * Start a new transaction for performance monitoring
 * 
 * @param {string} name - Transaction name (e.g., 'checkout-flow')
 * @param {string} op - Operation type (e.g., 'http.request', 'db.query')
 * @returns {Transaction} Sentry transaction object
 */
export function startTransaction(name, op = 'custom') {
  return Sentry.startTransaction({
    name,
    op,
  });
}

/**
 * Common breadcrumb helpers for LaserTags workflow
 */
export const LaserTagsBreadcrumbs = {
  // Material selection
  materialSelected: (shape, color) => {
    addBreadcrumb('material', 'Material selected', { shape, color });
  },

  // Tag design
  tagDesignStarted: (designType) => {
    addBreadcrumb('design', 'Tag design started', { type: designType });
  },

  tagTextEntered: (side, lineCount) => {
    addBreadcrumb('design', 'Tag text entered', { side, lineCount });
  },

  fontChanged: (fontFamily) => {
    addBreadcrumb('design', 'Font changed', { fontFamily });
  },

  // Contact info
  contactInfoEntered: (hasEmail, hasPhone) => {
    addBreadcrumb('contact', 'Contact info entered', { hasEmail, hasPhone });
  },

  // Order flow
  orderCreated: (orderId) => {
    addBreadcrumb('order', 'Order created', { orderId }, 'info');
  },

  paymentStarted: (amount) => {
    addBreadcrumb('payment', 'Payment started', { amount }, 'info');
  },

  paymentCompleted: (orderId, amount) => {
    addBreadcrumb('payment', 'Payment completed', { orderId, amount }, 'info');
  },

  paymentFailed: (error) => {
    addBreadcrumb('payment', 'Payment failed', { error }, 'error');
  },

  // API calls
  apiRequest: (endpoint, method) => {
    addBreadcrumb('api', `API request: ${method} ${endpoint}`, { endpoint, method });
  },

  apiSuccess: (endpoint, status) => {
    addBreadcrumb('api', `API success: ${endpoint}`, { endpoint, status });
  },

  apiError: (endpoint, error) => {
    addBreadcrumb('api', `API error: ${endpoint}`, { endpoint, error }, 'error');
  },

  // QR code
  qrCodeGenerated: (contactId) => {
    addBreadcrumb('qrcode', 'QR code generated', { contactId });
  },

  // Shipping
  shippingInfoEntered: (hasAddress) => {
    addBreadcrumb('shipping', 'Shipping info entered', { hasAddress });
  },
};

// Export Sentry for direct access when needed
export { Sentry };
