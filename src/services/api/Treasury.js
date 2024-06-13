import api from './Axios';

export const fetchPurchasedFdxHistory = async (userUuid) => {
  try {
    const resp = await api.get(`/finance/purchasedFdxHistory/${userUuid}`);
    return resp.data.history;
  } catch (err) {
    return err;
  }
};
