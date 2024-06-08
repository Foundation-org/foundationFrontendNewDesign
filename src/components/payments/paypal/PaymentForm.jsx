import { useState, useRef } from 'react';
import styles from './PaymentForm.module.css';

export const url = import.meta.env.VITE_API_URL;

import {
  PayPalHostedFieldsProvider,
  PayPalHostedField,
  PayPalButtons,
  usePayPalHostedFields,
} from '@paypal/react-paypal-js';
import { paypalPay } from '../../../services/api/payments';
import { useSelector } from 'react-redux';

async function createOrderCallback() {
  try {
    const response = await fetch(`${url}/finance/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 10,
      }),
    });

    const orderData = await response.json();

    if (orderData.id) {
      return orderData.id;
    } else {
      const errorDetail = orderData?.details?.[0];
      const errorMessage = errorDetail
        ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
        : JSON.stringify(orderData);

      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error(error);
    return `Could not initiate PayPal Checkout...${error}`;
  }
}

async function onApproveCallback(data, actions, persistedUserInfo) {
  console.log('first', data, actions, persistedUserInfo);
  try {
    const response = await fetch(`${url}/finance/${data.orderID}/captureOrderCall`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const orderData = await response.json();
    // Three cases to handle:
    //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
    //   (2) Other non-recoverable errors -> Show a failure message
    //   (3) Successful transaction -> Show confirmation or thank you message

    const transaction =
      orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
      orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];
    const errorDetail = orderData?.details?.[0];

    // this actions.restart() behavior only applies to the Buttons component
    if (errorDetail?.issue === 'INSTRUMENT_DECLINED' && !data.card && actions) {
      // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
      // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
      return actions.restart();
    } else if (errorDetail || !transaction || transaction.status === 'DECLINED') {
      // (2) Other non-recoverable errors -> Show a failure message
      let errorMessage;
      if (transaction) {
        errorMessage = `Transaction ${transaction.status}: ${transaction.id}`;
      } else if (errorDetail) {
        errorMessage = `${errorDetail.description} (${orderData.debug_id})`;
      } else {
        errorMessage = JSON.stringify(orderData);
      }

      throw new Error(errorMessage);
    } else {
      // (3) Successful transaction -> Show confirmation or thank you message
      // Or go to another URL:  actions.redirect('thank_you.html');
      console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
      await paypalPay({ charge: orderData, userUuid: persistedUserInfo.uuid });
      return `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`;
    }
  } catch (error) {
    return `Sorry, your transaction could not be processed...${error}`;
  }
}

const SubmitPayment = ({ onHandleMessage }) => {
  // Here declare the variable containing the hostedField instance
  const { cardFields } = usePayPalHostedFields();
  const cardHolderName = useRef(null);
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const submitHandler = () => {
    if (typeof cardFields.submit !== 'function') return; // validate that \`submit()\` exists before using it
    //if (errorMsg) showErrorMsg(false);
    cardFields
      .submit({
        // The full name as shown in the card and billing addresss
        // These fields are optional for Sandbox but mandatory for production integration
        cardholderName: cardHolderName?.current?.value,
      })
      .then(async (data) => onHandleMessage(await onApproveCallback(data, persistedUserInfo)))
      .catch((orderData) => {
        onHandleMessage(`Sorry, your transaction could not be processed...${JSON.stringify(orderData)}`);
      });
  };

  return (
    <button onClick={submitHandler} className="btn btn-primary">
      Pay
    </button>
  );
};

const Message = ({ content }) => {
  return <p>{content}</p>;
};

export const PaymentForm = () => {
  const [message, setMessage] = useState('');
  return (
    <div className={styles.form}>
      <PayPalButtons
        style={{
          shape: 'rect',
          //color:'blue' change the default color of the buttons
          layout: 'vertical', //default value. Can be changed to horizontal
        }}
        styles={{ marginTop: '4px', marginBottom: '4px' }}
        createOrder={createOrderCallback}
        onApprove={async (data) => setMessage(await onApproveCallback(data))}
      />

      <PayPalHostedFieldsProvider createOrder={createOrderCallback}>
        <div style={{ marginTop: '4px', marginBottom: '4px' }}>
          <PayPalHostedField
            id="card-number"
            hostedFieldType="number"
            options={{
              selector: '#card-number',
              placeholder: 'Card Number',
            }}
            className={styles.input}
          />
          <div className={styles.container}>
            <PayPalHostedField
              id="expiration-date"
              hostedFieldType="expirationDate"
              options={{
                selector: '#expiration-date',
                placeholder: 'Expiration Date',
              }}
              className={styles.input}
            />
            <PayPalHostedField
              id="cvv"
              hostedFieldType="cvv"
              options={{
                selector: '#cvv',
                placeholder: 'CVV',
              }}
              className={styles.input}
            />
          </div>
          <div className={styles.container}>
            <input id="card-holder" type="text" placeholder="Name on Card" className={styles.input} />

            <input id="card-billing-address-country" type="text" placeholder="Country Code" className={styles.input} />
          </div>
          <SubmitPayment onHandleMessage={setMessage} />
        </div>
      </PayPalHostedFieldsProvider>
      <Message content={message} />
    </div>
  );
};
