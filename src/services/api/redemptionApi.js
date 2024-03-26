import api from './Axios';
import { toast } from 'sonner';

export const createRedeeemCode = async (data) => {
  try {
    return await api.post('/redeem/create', {
      creator: data.creator,
      owner: data.owner,
      uuid: data.uuid,
      amount: data.amount,
      description: data.description,
      to: data.to,
      expiry: data.expiry,
    });
  } catch (error) {
    toast.error(error.response.data.message.split(':')[1]);
  }
};
