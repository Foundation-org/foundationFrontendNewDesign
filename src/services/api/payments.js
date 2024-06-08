import api from './Axios';

export const spay = async ({ charge, userUuid }) => {
  try {
    return await api.post(`/finance/spay`, {
      charge,
      userUuid,
    });
  } catch (err) {
    return err;
  }
};

export const paypalPay = async ({ charge, userUuid }) => {
  try {
    return await api.post(`/finance/ppay`, {
      charge,
      userUuid,
    });
  } catch (err) {
    return err;
  }
};
