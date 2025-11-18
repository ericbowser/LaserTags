import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { LASER_BACKEND_BASE_URL } from '../../env.json';
import { sendEmail } from '../api/tagApi';

function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error'
  const [error, setError] = useState(null);

  const paymentIntentId = searchParams.get('payment_intent');
  const redirectStatus = searchParams.get('redirect_status');

  useEffect(() => {
    const processOrder = async () => {
      if (!paymentIntentId) {
        setError('No payment intent found in URL');
        setStatus('error');
        return;
      }

      if (redirectStatus !== 'succeeded') {
        setError(`Payment status: ${redirectStatus}`);
        setStatus('error');
        return;
      }

      try {
        // Get payment intent from backend to retrieve orderid and contactid from metadata
        const paymentResponse = await axios.get(
          `${LASER_BACKEND_BASE_URL}/stripePayment/${paymentIntentId}`
        );

        const paymentIntent = paymentResponse.data;
        const orderid = paymentIntent.metadata?.orderid;
        const contactid = paymentIntent.metadata?.contactid;

        if (!orderid || !contactid) {
          throw new Error('Order ID or Contact ID not found in payment intent metadata');
        }

        // Try to get orderData from sessionStorage (stored before payment)
        const storedOrderData = sessionStorage.getItem('pendingOrderData');
        let orderData = null;

        if (storedOrderData) {
          try {
            orderData = JSON.parse(storedOrderData);
            // Clear sessionStorage
            sessionStorage.removeItem('pendingOrderData');
          } catch (e) {
            console.warn('Failed to parse stored order data:', e);
          }
        }

        // Payment succeeded - send email notification
        console.log('Payment verified:', {
          paymentIntentId: paymentIntentId,
          orderid: orderid,
          contactid: contactid,
          status: paymentIntent.status
        });

        // Send email notification
        // Backend will fetch order/contact details and generate email body
        try {
          // Get email from orderData if available, otherwise backend will fetch from contact
          const recipientEmail = orderData?.notificationEmail || orderData?.contactInfo?.email;
          
          const emailData = {
            orderid: orderid,
            contactid: contactid,
          };
          
          // Include email if available, otherwise backend will fetch from contact table
          if (recipientEmail) {
            emailData.email = recipientEmail;
          }
          
          await sendEmail(emailData);
          console.log('Email sent successfully after payment redirect');
        } catch (emailError) {
          // Log error but don't block success flow
          console.error('Failed to send email after payment redirect:', emailError);
        }

        // Clear sessionStorage
        if (orderData) {
          sessionStorage.removeItem('pendingOrderData');
        }

        setStatus('success');
      } catch (err) {
        console.error('Error processing order:', err);
        setError(err.response?.data?.error || err.message || 'Failed to process order');
        setStatus('error');
      }
    };

    processOrder();
  }, [paymentIntentId, redirectStatus]);

  if (status === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing Your Order</h2>
          <p className="text-gray-600">Please wait while we confirm your payment...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Processing Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/create-tag')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Return to Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for your order. We've received your payment and will process your laser tag shortly.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          You will receive an email confirmation shortly with your order details.
        </p>
        <button
          onClick={() => navigate('/create-tag')}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all"
        >
          Create Another Tag
        </button>
      </div>
    </div>
  );
}

export default OrderSuccess;

