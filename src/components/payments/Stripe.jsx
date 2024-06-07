import { useEffect, useState } from 'react';
import { formatCreditCardNumber, formatCVC, formatExpirationDate } from './cardUtil';
import axios from 'axios';
import { Field, Form } from 'react-final-form';
import { useSelector } from 'react-redux';

const baseURL = import.meta.env.VITE_API_URL;
// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const Stripe = () => {
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!window.document.getElementById('stripe-script')) {
      var s = window.document.createElement('script');
      s.id = 'stripe-script';
      s.type = 'text/javascript';
      s.src = 'https://js.stripe.com/v2/';
      s.onload = () => {
        window['Stripe'].setPublishableKey(
          'pk_test_51Ott5GRsSrx9w04qmMpcMAZerQ3SbDZo25pyFnylcVwumxPJWFL2fJuC6VeiKQ9ja01tuG35xmvDEy9mt80b61R800DtasPDeo',
        );
      };
      window.document.body.appendChild(s);
    }
  }, []);

  const onSubmit = async (values) => {
    // await sleep(300);
    try {
      window.Stripe.card.createToken(
        {
          number: values.number,
          exp_month: values.expiry.split('/')[0],
          exp_year: values.expiry.split('/')[1],
          cvc: values.cvc,
          name: values.name,
        },
        (status, response) => {
          if (status === 200) {
            // Set the base URL here
            axios
              .post(`${baseURL}/finance/spay`, {
                token: response,
                email: values.email,
                amount: values.amount,
                userUuid: persistedUserInfo.uuid,
              })
              .then((res) => {
                console.log('Response:', res.data);
              })
              .catch((err) => {
                setError(err);
                console.log('Error:', err);
              });
          } else {
            setError(response.error.message);
            console.log(response.error.message);
          }
        },
      );
    } catch (error) {}
  };

  if (error) return <p>{error}</p>;

  return (
    <div>
      stripe
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, form, submitting, pristine, values, active }) => {
          return (
            <form onSubmit={handleSubmit}>
              {/* <Card
                number={values.number || ''}
                name={values.name || ''}
                expiry={values.expiry || ''}
                cvc={values.cvc || ''}
                focused={active}
              /> */}
              <div>
                <Field name="amount" component="input" type="number" placeholder="Amount" />
                <Field name="email" component="input" type="text" placeholder="Your email" />
              </div>
              <div>
                <Field
                  name="number"
                  component="input"
                  type="text"
                  pattern="[\d| ]{16,22}"
                  placeholder="Card Number"
                  format={formatCreditCardNumber}
                />
              </div>
              <div>
                <Field name="name" component="input" type="text" placeholder="Name" />
              </div>
              <div>
                <Field
                  name="expiry"
                  component="input"
                  type="text"
                  pattern="\d\d/\d\d"
                  placeholder="Valid Thru"
                  format={formatExpirationDate}
                />
                <Field
                  name="cvc"
                  component="input"
                  type="text"
                  pattern="\d{3,4}"
                  placeholder="CVC"
                  format={formatCVC}
                />
              </div>
              <div className="buttons">
                <button type="submit" disabled={submitting}>
                  Submit
                </button>
                <button type="button" onClick={form.reset} disabled={submitting || pristine}>
                  Reset
                </button>
              </div>
              <h2>Values</h2>
              <pre>{JSON.stringify(values, 0, 2)}</pre>
            </form>
          );
        }}
      />
    </div>
  );
};

export default Stripe;
