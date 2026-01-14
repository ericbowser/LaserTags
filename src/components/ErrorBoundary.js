/**
 * ErrorBoundary Component for LaserTags
 * 
 * Catches React errors and reports them to Sentry
 * Shows a user-friendly fallback UI when errors occur
 */

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import * as Sentry from '@sentry/react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so next render shows fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);

    // Capture error in Sentry and get event ID
    Sentry.withScope((scope) => {
      scope.setExtras({
        ...errorInfo,
        component: this.props.componentName || 'Unknown',
      });
      
      const eventId = Sentry.captureException(error);
      
      this.setState({
        error,
        errorInfo,
        eventId,
      });
    });
  }

  handleReset = () => {
    // Reset error state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null,
    });

    // Call optional onReset callback
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleReportFeedback = () => {
    // Show Sentry feedback dialog
    if (this.state.eventId) {
      Sentry.showReportDialog({
        eventId: this.state.eventId,
        user: {
          email: '',
          name: '',
        },
      });
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI provided by parent
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          errorInfo: this.state.errorInfo,
          resetError: this.handleReset,
        });
      }

      // Default fallback UI
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-charcoal-900 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white dark:bg-charcoal-800 rounded-2xl shadow-2xl p-8 border-2 border-red-200 dark:border-red-800">
            {/* Error Icon */}
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>

            {/* Error Message */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-3">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              We're sorry for the inconvenience. Our team has been notified and we're working on fixing this issue.
            </p>

            {/* Error Details (Development Only) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="mb-6 p-4 bg-gray-100 dark:bg-charcoal-700 rounded-lg">
                <p className="text-sm font-mono text-red-600 dark:text-red-400 mb-2">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="text-xs text-gray-600 dark:text-gray-400">
                    <summary className="cursor-pointer font-semibold mb-2">
                      Stack Trace
                    </summary>
                    <pre className="whitespace-pre-wrap overflow-auto max-h-48">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-coral-500 hover:bg-coral-600 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-charcoal-700 dark:hover:bg-charcoal-600 text-gray-900 dark:text-white font-bold rounded-xl transition-all duration-200"
              >
                <Home className="w-5 h-5" />
                Go to Homepage
              </button>

              {/* Report Feedback (Production Only) */}
              {!import.meta.env.DEV && this.state.eventId && (
                <button
                  onClick={this.handleReportFeedback}
                  className="w-full px-6 py-3 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Report this issue
                </button>
              )}
            </div>

            {/* Event ID (for support) */}
            {this.state.eventId && (
              <p className="text-xs text-gray-500 dark:text-gray-600 text-center mt-6">
                Error ID: {this.state.eventId}
              </p>
            )}
          </div>
        </div>
      );
    }

    // No error, render children normally
    return this.props.children;
  }
}

// Wrap component with Sentry's error boundary HOC
export default Sentry.withErrorBoundary(ErrorBoundary, {
  fallback: ({ error, componentStack, resetError }) => (
    <ErrorBoundary
      fallback={() => (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Critical Error
            </h1>
            <p className="text-gray-600 mb-4">
              The error boundary itself encountered an error.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-coral-500 text-white rounded-lg"
            >
              Reload Page
            </button>
          </div>
        </div>
      )}
    >
      <div />
    </ErrorBoundary>
  ),
  showDialog: true,
});
