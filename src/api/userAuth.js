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

export const getAllQuestsWithDefaultStatus = async (params) => {
  return await api.post('/infoquestions/getAllQuestsWithDefaultStatus', params);
};

export const getAllLedgerData = async (page, limit,sort) => {
  return await api.get('/ledger/getAllLedger', { params: { page, limit,sort } });
};

export const searchLedger = async (page, limit,sort,term) => {
  return await api.post('/ledger/searchLedger', { params: { page, limit,sort,term } });
};


export const deleteAccount = async (uuid) => {
  return await api.delete(`/delete/${uuid}`);
};
