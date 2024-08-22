import api from './Axios';

export const deleteMessage = async (data) => {
  return await api.delete(`/directMessage/delete`, {
    _id: data.id,
    reciever: data.reciever,
  });
};

export const createMessage = async (data) => {
  return await api.post('/directMessage/send', {
    from: data.from,
    to: data.to,
    subject: data.subject,
    message: data.message,
    type: data.type,
  });
};

export const createDraftMessage = async (data) => {
  return await api.post('/directMessage/draft', {
    from: data.from,
    to: data.to,
    subject: data.subject,
    message: data.message,
  });
};
export const viewMessage = async (data) => {
  return await api.post('/directMessage/view', {
    _id: data.id,
    sender: data.sender,
    receiver: data.receiver,
  });
};
export const getSentMessages = async (uuid) => {
  try {
    return await api.get(`/directMessage/getAllSend/${uuid}`);
  } catch (error) {
    console.log(err);
    toast.error(error.response.data.message.split(':')[1]);
  }
};

export const getRecievedMessages = async (uuid) => {
  try {
    return await api.get(`/directMessage/getAllReceive/${uuid}`);
  } catch (error) {
    console.log(err);
    toast.error(error.response.data.message.split(':')[1]);
  }
};

export const getDeletedMessages = async (uuid) => {
  try {
    return await api.get(`/directMessage/getAllDeletedMessage/${uuid}`);
  } catch (error) {
    console.log(err);
    toast.error(error.response.data.message.split(':')[1]);
  }
};

export const getDraftdMessages = async (uuid) => {
  try {
    return await api.get(`/directMessage/getAllDraft/${uuid}`);
  } catch (error) {
    console.log(err);
    toast.error(error.response.data.message.split(':')[1]);
  }
};
