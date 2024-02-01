import api from './Axios';

export const verifyCode = async (urlQuery) => {
  return await api.post(`user/verify?${urlQuery}`, {
    verificationCode: urlQuery.substr(urlQuery.length - 6),
  });
};

export const referral = async (code, uuid) => {
  return await api.post('user/referral', {
    code,
    uuid,
  });
};
