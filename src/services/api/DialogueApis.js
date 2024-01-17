import api from "./Axios";

export const sendEmail = async (data) => {
  return await api.post("/user/send/email", {
    email: data.email,
    subject: data.subject,
    message: data.message,
  });
};