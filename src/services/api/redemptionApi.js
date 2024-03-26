import api from './Axios';
import { toast } from 'sonner';

export const createRedeeemCode = async (data) => {
  return await api.post('/redeem/create', {
    creator: data.creator,
    owner: data.owner,
    uuid: data.uuid,
    amount: data.amount,
    description: data.description,
    to: data.to,
    expiry: data.expiry,
  });
};

export const addRedeemCode = async (data) => {
  return await api.post('/redeem/transfer', {
    uuid: data.uuid,
    code: data.code,
  });
};

export const getUnredeemedData = async (id, uuid) => {
  try {
    return await api.get(`/redeem/getUnredeemedById/${id}/${uuid}`);
  } catch (error) {
    toast.error(error.response.data.message.split(':')[1]);
  }
};

export const getHistoryData = async (id, uuid) => {
  try {
    return await api.get(`/redeem/getRedeemHistoryById/${id}/${uuid}`);
  } catch (error) {
    toast.error(error.response.data.message.split(':')[1]);
  }
};
