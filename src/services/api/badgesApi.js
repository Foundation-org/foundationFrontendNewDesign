import api from './Axios';

export const validation = async (no, data) => {
  return await api.get(`/ai-validation/${no}/?userMessage=${data}`);
};
