// import { useState, useEffect } from 'react';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
// import axios from 'axios';

// const BASE_URL = import.meta.env.VITE_API_URL;
// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const Stripe = ({ clientSecret }) => {
  // const [clientSecret, setClientSecret] = useState('');

  const [localClientSecret, setLocalClientSecret] = useState(clientSecret || localStorage.getItem('scs'));

  // useEffect(() => {
  //   // Create PaymentIntent as soon as the page loads
  //   axios
  //     .post(`${BASE_URL}/finance/getStripePaymentIntent`, { amount: 10, currency: 'usd' })
  //     .then((response) => {
  //       console.log('resp', response);
  //       setClientSecret(response.data.clientSecret);
  //     })
  //     .catch((error) => {
  //       console.error('Error creating payment intent:', error);
  //     });
  // }, []);

  const appearance = {
    theme: 'stripe',
  };

  const options = {
    clientSecret: localClientSecret,
    appearance,
  };

  return (
    <div>
      {(localClientSecret || localStorage.getItem('scs')) && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
};

export default Stripe;
