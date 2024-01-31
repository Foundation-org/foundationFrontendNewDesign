import api from './Axios';

export const verifyCode = async (urlQuery) => {
  console.log('urque', urlQuery);
  return await api.post(`user/verify?${urlQuery}`, {
    verificationCode: urlQuery.substr(urlQuery.length - 6),
  });
};
