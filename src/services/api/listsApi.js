import api from './Axios';

export const fetchLists = async () => {
  try {
    const resp = await api.get(`/user/userList/${localStorage.getItem('uuid')}`);
    return resp.data.userList;
  } catch (err) {
    return err;
  }
};

export const createList = async (data) => {
  try {
    const resp = await api.post(`/user/userList/addCategoryInUserList`, data);
    return resp;
  } catch (err) {
    return err;
  }
};

export const addPostinAList = async () => {
  try {
    const resp = await api.get(`user/userList/addPostInCategoryInUserList`, {
      userUuid,
      categoryId,
      data: { post: 'Data' },
    });
    return resp;
  } catch (err) {
    return err;
  }
};
