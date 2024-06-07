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
