import api from './Axios';

export const validation = async (no, data) => {
  return await api.get(`/ai-validation/${no}/?userMessage=${data}`);
};

export const sendOtp = async (phoneNumber) => {
  return await api.post('/sendOtp', {
    phoneNumber,
  });
};

export const verifyOtp = async (data) => {
  return await api.post('/verifyOtp', {
    phoneNumber: data.phone,
    otp: data.otpString,
  });
};

export const resendOtp = async (phoneNumber) => {
  return await api.post('/resendOtp', {
    phoneNumber,
  });
};
