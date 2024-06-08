import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { PaymentForm } from './PaymentForm';
import { useState, useEffect } from 'react';

const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
const url = import.meta.env.VITE_API_URL;

const Paypal = () => {
  const [clientToken, setClientToken] = useState(null);

  const initialOptions = {
    'client-id': clientId,
    'data-client-token': clientToken,
    components: 'hosted-fields,buttons',
    'enable-funding': 'paylater,venmo',
    'data-sdk-integration-source': 'integrationbuilder_ac',
  };

  useEffect(() => {
    (async () => {
      const response = await fetch(`${url}/finance/ppayToken`, {
        method: 'POST',
      });
      const { client_token } = await response.json();

      setClientToken(client_token);
    })();
  }, []);

  return (
    <>
      {clientToken ? (
        <PayPalScriptProvider options={initialOptions}>
          <PaymentForm />
        </PayPalScriptProvider>
      ) : (
        <h4>WAITING ON CLIENT TOKEN</h4>
      )}
    </>
  );
};

export default Paypal;
