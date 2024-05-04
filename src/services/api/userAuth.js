import api from './Axios';

export const signUp = async (data) => {
  return await api.post('/user/signUpUser', {
    userEmail: data.email,
    userPassword: data.password,
  });
};

export const signUpGuest = async (data) => {
  return await api.post('/user/signUp/guestMode', {
    email: data.email,
    password: data.password,
    uuid: data.uuid,
  });
};

export const signIn = async (data) => {
  return await api.post('/user/signInUser', data);
};

export const signOut = async () => {
  return await api.post('user/logout');
};

export const userInfo = async () => {
  return await api.post('/user/userInfo');
  // return await api.post('/user/userInfo', { uuid: localStorage.getItem('uuid') });
};

export const getTreasuryAmount = async () => {
  const res = await api.get(`/treasury/get`);
  localStorage.setItem('treasuryAmount', res.data.data);
  if (Object.keys(res.data).length === 0 && res.data.constructor === Object) {
    return 0;
  } else {
    return res.data.data;
  }
};

export const userInfoById = async (uuid) => {
  return await api.post('/user/userInfoById', { uuid });
};

export const changePassword = async (params) => {
  return await api.put('/user/changePassword', params);
};

export const getAllLedgerData = async (page, limit, sort) => {
  return await api.get('/ledger/ledgerById', {
    params: { page, limit, sort },
  });
};

export const getAllRadeemLedgerData = async (page, limit, sort) => {
  return await api.get('/ledger/ledgerById', {
    params: { page, limit, sort, txAuth: 'DAO' },
  });
};

export const getAllRedemptionLedgerData = async (page, limit, sort, uuid) => {
  return await api.get('/ledger/ledgerById', {
    params: { page, limit, sort, txAuth: 'DAO', uuid },
  });
};

export const setFilterStates = async (state) => {
  const data = await api.post('/user/setStates', state);
  localStorage.setItem('userData', JSON.stringify(data?.data?.updatedUser));
};

export const setBookmarkFilterStates = async (state) => {
  return await api.post('/user/setBookmarkStates', state);
};

export const searchLedger = async (page, limit, sort, term) => {
  return await api.post('/ledger/searchLedger', {
    params: { page, limit, sort, term },
  });
};

export const searchRedemptionLedger = async (page, limit, sort, term, uuid) => {
  return await api.post('/ledger/searchLedger', {
    params: { page, limit, sort, term, type: 'redemption', uuid },
  });
};

export const deleteAccount = async (uuid) => {
  return await api.delete(`/delete/${uuid}`);
};

export const createGuestMode = async () => {
  return await api.post('/user/create/guestMode');
};
