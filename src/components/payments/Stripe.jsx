import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_URL;

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  'pk_test_51Ott5GRsSrx9w04qmMpcMAZerQ3SbDZo25pyFnylcVwumxPJWFL2fJuC6VeiKQ9ja01tuG35xmvDEy9mt80b61R800DtasPDeo',
);

const Stripe = () => {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    axios
      .post(`${BASE_URL}/finance/getStripePaymentIntent`, { amount: 10, currency: 'usd' })
      .then((response) => {
        console.log('resp', response);
        setClientSecret(response.data.clientSecret);
      })
      .catch((error) => {
        console.error('Error creating payment intent:', error);
      });
  }, []);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
};

export default Stripe;
