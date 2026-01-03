import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
// import {
//   PaymentElement,
//   Elements,
//   useStripe,
//   useElements,
// } from '@stripe/react-stripe-js';
import { CreditCard, Lock } from 'lucide-react';
import axios from 'axios';
import { sendEmail, updateOrderPayment } from '../../api/tagApi';

const STRIPE_API_KEY = import.meta.env.VITE_STRIPE_API_KEY;
const LASER_BACKEND_BASE_URL = import.meta.env.VITE_LASER_BACKEND_BASE_URL;

// Validate Stripe API key format
if (!STRIPE_API_KEY) {
  console.error('STRIPE_API_KEY is not defined in environment variables');
} else if (!STRIPE_API_KEY.startsWith('pk_test_') && !STRIPE_API_KEY.startsWith('pk_live_')) {
  console.error('Invalid Stripe API key format. Test keys should start with pk_test_, live keys with pk_live_');
} else if (STRIPE_API_KEY.startsWith('pk_live_')) {
  console.warn('⚠️ WARNING: Using LIVE Stripe API key. Switch to pk_test_ for sandbox/testing.');
} else {
  console.log('✓ Using Stripe TEST/SANDBOX API key (pk_test_)');
}

const stripePromise = loadStripe(STRIPE_API_KEY);

// Calculate total: price + shipping (example: $5 shipping)
const calculateTotal = (price) => {
  return Math.round((price + 5) * 100); // Convert to cents
};

const options = (clientSecret) => ({
  clientSecret,
  appearance: {
    theme: 'stripe',
    variables: {
      colorPrimary: '#6366f1',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorDanger: '#ef4444',
      fontFamily: 'system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  },
});

const StripeCheckout = ({ orderData, onSuccess, onCancel }) => {
  const [clientSecret, setClientSecret] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Validate Stripe API key before proceeding
    if (!STRIPE_API_KEY || !STRIPE_API_KEY.startsWith('pk_test_')) {
      setError('Invalid or missing Stripe test API key. Please check your configuration.');
      setIsLoading(false);
      return;
    }

    // Create payment intent on component mount
    const createPaymentIntent = async () => {
      try {
        const amount = calculateTotal(orderData.material.price);
        
        console.log('Creating payment intent:', {
          url: `${LASER_BACKEND_BASE_URL}/stripePayment`,
          amount,
          currency: 'usd',
          contactid: orderData.contactid,
          orderid: orderData.orderid
        });
        
        // Backend expects contactid and orderid
        if (!orderData.contactid) {
          throw new Error('contactid is required but missing from orderData');
        }
        if (!orderData.orderid) {
          throw new Error('orderid is required but missing from orderData. Order must be created first.');
        }
        
        const response = await axios.post(
          `${LASER_BACKEND_BASE_URL}/stripePayment`,
          {
            amount: amount,
            currency: 'usd',
            contactid: orderData.contactid,
            orderid: orderData.orderid,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 10000, // 10 second timeout
          }
        );

        console.log('Payment intent response:', response.data);

        if (!response.data?.clientSecret) {
          throw new Error('No clientSecret received from backend. Response: ' + JSON.stringify(response.data));
        }

        // Extract payment intent ID from response
        const paymentIntentId = response.data.paymentIntentId || response.data.id;
        
        // Payment intent ID will be updated by webhook
        console.log('Payment intent created:', paymentIntentId, 'for order:', orderData.orderid);
        console.log('Webhook will update order with payment intent ID');

        setClientSecret(response.data.clientSecret);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        
        // Provide more detailed error messages
        let errorMessage = 'Failed to initialize payment. ';
        
        if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
          errorMessage += 'Cannot connect to backend server. Please ensure the backend is running on port 3003.';
        } else if (err.response) {
          // Backend responded with error status
          const status = err.response.status;
          const data = err.response.data;
          
          if (status === 404) {
            errorMessage += 'Payment endpoint not found. Please check if /create-payment-intent exists on the backend.';
          } else if (status === 500) {
            errorMessage += 'Backend server error. Check backend logs for details.';
          } else if (status === 401 || status === 403) {
            errorMessage += 'Authentication failed. Check Stripe secret key configuration.';
          } else {
            errorMessage += `Backend error (${status}): ${data?.message || data?.error || JSON.stringify(data)}`;
          }
          
          console.error('Backend error response:', {
            status,
            data,
            headers: err.response.headers
          });
        } else if (err.request) {
          // Request was made but no response received
          errorMessage += 'No response from backend server. Check if backend is running and accessible.';
          console.error('No response received:', err.request);
        } else {
          // Something else happened
          errorMessage += err.message || 'Unknown error occurred.';
        }
        
        setError(errorMessage);
        console.error('Payment intent error details:', {
          message: err.message,
          code: err.code,
          response: err.response?.data,
          request: err.request,
          fullError: err
        });
      }
    };

    createPaymentIntent();
  }, [orderData]);
  
  // Pass clientSecret to CheckoutForm
  const stripeCheckoutProps = { clientSecret };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up secure payment...</p>
        </div>
      </div>
    );
  }

  if (error || !clientSecret) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <p className="text-red-600 mb-4">{error || 'Payment setup failed'}</p>
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
            <div className="flex items-center gap-3 mb-2">
              <Lock className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Secure Checkout</h2>
            </div>
            <p className="text-indigo-100">Your payment information is secure and encrypted</p>
          </div>

          <div className="p-8">
            <Elements stripe={stripePromise} options={options(clientSecret)}>
              <CheckoutForm
                orderData={orderData}
                clientSecret={clientSecret}
                onSuccess={onSuccess}
                onCancel={onCancel}
              />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckoutForm = ({ orderData, clientSecret, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message);
      setIsProcessing(false);
      return;
    }

    // Confirm payment with Stripe
    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/order-success`,
      },
      redirect: 'if_required', // Only redirect if required by payment method
    });

    if (confirmError) {
      // Payment failed
      setErrorMessage(confirmError.message);
      setIsProcessing(false);
    } else {
      // Payment succeeded - send email notification
      // Backend will fetch order/contact details and generate email body
      try {
        await sendEmail({
          orderid: orderData.orderid,
          contactid: orderData.contactid,
          email: orderData.notificationEmail || orderData.contactInfo?.email,
        });
        console.log('Email sent successfully after payment');
      } catch (emailError) {
        // Log error but don't block success flow
        console.error('Failed to send email after payment:', emailError);
      }
      
      onSuccess();
    }
  };

  const subtotal = orderData.material.price;
  const shipping = 5;
  const total = subtotal + shipping;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order Summary */}
      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-bold mb-4">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>{orderData.material.name} Tag</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Element */}
      <div className="border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4 text-gray-700">
          <CreditCard className="w-5 h-5" />
          <span className="font-semibold">Payment Information</span>
        </div>
        <PaymentElement />
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-800">{errorMessage}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || !elements || isProcessing}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none inline-flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            <>
              Complete Payment
            </>
          )}
        </button>
      </div>

      {/* Security Notice */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Lock className="w-4 h-4" />
        <span>Powered by Stripe. Your payment information is secure and encrypted.</span>
      </div>
    </form>
  );
};

export default StripeCheckout;

