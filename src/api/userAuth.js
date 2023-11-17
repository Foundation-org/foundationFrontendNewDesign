import api from './Axios';

export const signUp = async (data) => {
  return await api.post('/user/signUpUser', {
    userEmail: data.email,
    userPassword: data.password,
  });
};

export const signIn = async (data) => {
  return await api.post('/user/signInUser', data);
};

export const userInfo = async (uuid) => {
  return await api.post('/user/userInfo', { uuid });
};
export const changePassword = async (params) => {
  return await api.put('/user/changePassword', params);
};

export const getAllLedgerData = async (page, limit) => {
  return await api.get('/ledger', { params: { page, limit } });
};

export const deleteAccount = async (uuid) => {
  return await api.delete(`/delete/${uuid}`);
};
