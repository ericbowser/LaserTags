import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { CreditCard, Lock } from 'lucide-react';
import { STRIPE_API_KEY, LASER_BACKEND_BASE_URL } from '../../env.json';
import axios from 'axios';

const stripePromise = loadStripe(STRIPE_API_KEY);

// Calculate total: price + shipping (example: $5 shipping)
const calculateTotal = (price) => {
  return Math.round((price + 5) * 100); // Convert to cents
};

const options = (amount) => ({
  mode: 'payment',
  amount: amount,
  currency: 'usd',
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
    // Create payment intent on component mount
    const createPaymentIntent = async () => {
      try {
        const amount = calculateTotal(orderData.material.price);
        
        const response = await axios.post(`${LASER_BACKEND_BASE_URL}/create-payment-intent`, {
          amount: amount,
          currency: 'usd',
          orderData: orderData,
        });

        setClientSecret(response.data.clientSecret);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to initialize payment. Please try again.');
        setIsLoading(false);
        console.error('Payment intent error:', err);
      }
    };

    createPaymentIntent();
  }, [orderData]);

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
            <Elements
              stripe={stripePromise}
              options={options(calculateTotal(orderData.material.price))}
            >
              <CheckoutForm
                orderData={orderData}
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

const CheckoutForm = ({ orderData, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
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

    // In a real app, you would get the clientSecret from your server
    // For now, we'll need the parent to handle payment confirmation
    
    // The payment confirmation should happen on the backend
    // After successful payment, redirect to success page
    onSuccess();
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

