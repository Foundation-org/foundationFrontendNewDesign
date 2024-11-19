import showToast from '../../components/ui/Toast';
import api from './Axios';

export const fetchLists = async (search) => {
  const userUuid = localStorage.getItem('uuid');
  const url = search ? `/userlists/userList?userUuid=${userUuid}` : `/userlists/userList?userUuid=${userUuid}`;

  try {
    const resp = await api.get(url);
    return resp.data.userList;
  } catch (err) {
    return err;
  }
};

export const createList = async (data) => {
  try {
    const resp = await api.post(`/userlists/userList/addCategoryInUserList`, data);
    return resp;
  } catch (err) {
    return err;
  }
};

export const addPostinAList = async (data) => {
  try {
    const resp = await api.post(`userlists/userList/addPostInCategoryInUserList`, data);
    return resp;
  } catch (err) {
    return err;
  }
};

export const findPostsByCategoryId = async (data) => {
  try {
    const resp = await api.get(`/userlists/userList/findCategoryById/${data.userUuid}/${data.categoryId}`);
    return resp.data.userList;
  } catch (err) {
    return err;
  }
};

export const deleteList = async (categoryId) => {
  try {
    const resp = await api.delete(
      `/userlists/userList/deleteCategoryFromList/${localStorage.getItem('uuid')}/${categoryId}`
    );
    return resp.data;
  } catch (err) {
    return err;
  }
};

export const deleteListSettings = async (categoryId) => {
  try {
    const resp = await api.delete(
      `/userlists/userList/deleteSharedListSettings/${localStorage.getItem('uuid')}/${categoryId}`
    );
    return resp.data;
  } catch (err) {
    return err;
  }
};

export const findCategoryByName = async (data) => {
  try {
    const resp = await api.get(`/userlists/userList/findCategoryByName/${data.userUuid}/${data.categoryName}`);
    return resp.data;
  } catch (err) {
    return err;
  }
};

export const updateCategory = async ({ userUuid, categoryId, postId }) => {
  try {
    const resp = await api.patch(
      `/userlists/userList/updateCategoryInUserList/${userUuid}/${categoryId}/?postId=${postId}`
    );
    return resp.data;
  } catch (err) {
    return err;
  }
};

export const updateCategoryName = async ({ userUuid, categoryId, category }) => {
  try {
    const resp = await api.patch(`/userlists/userList/updateCategoryInUserList/${userUuid}/${categoryId}`, {
      category,
    });
    return resp.data;
  } catch (err) {
    return err;
  }
};

export const searchPosts = async (term, uuid) => {
  try {
    if (term !== '') {
      const response = await api.post(`/search/easySearch?term=${term}`, {
        moderationRatingFilter: {
          initial: 0,
          final: 100,
        },
        uuid,
      });
      return response.data;
    }
  } catch (err) {
    console.log('err', err);
  }
};

export const generateCategoryShareLink = async (userUuid, categoryId, customizedLink) => {
  try {
    const params = {
      customizedLink,
    };

    const response = await api.get(`/userlists/userList/generateCategoryShareLink/${userUuid}/${categoryId}`, {
      params,
    });

    return response;
  } catch (err) {
    showToast('error', 'error', {}, err.response?.data?.message.split(':')[1]);
  }
};

export const findPostsBySharedLink = async ({ id }) => {
  try {
    const resp = await api.get(`/userlists/findCategoryByLink/${id}?uuid=${localStorage.getItem('uuid')}`);
    return resp.data.category;
  } catch (err) {
    return err;
  }
};

export const updateCategoryViewCount = async ({ categoryLink }) => {
  try {
    const resp = await api.get(`/userlists/categoryViewCount/${categoryLink}`);
    return resp.data;
  } catch (err) {
    return err;
  }
};

export const updateCategoryParticipentsCount = async ({ categoryLink }) => {
  try {
    const resp = await api.get(`/userlists/categoryParticipentsCount/${categoryLink}`);
    return resp.data;
  } catch (err) {
    return err;
  }
};

export const updatePostOrder = async ({ order, userUuid, categoryId }) => {
  try {
    const resp = await api.post(`userlists/userList/updatePostOrder`, { order, userUuid, categoryId });
    return resp;
  } catch (err) {
    return err;
  }
};

export const submitListResponse = async ({ params, categoryId, categoryLink }) => {
  try {
    const resp = await api.post(`/userlists/submitResponse`, {
      postId: categoryId,
      data: {
        created: params.answer.created,
        selected: params.answer.selected,
      },
      addedAnswer: params.addedAnswer,
      uuid: params.uuid,
      categoryLink,
    });
    return resp;
  } catch (err) {
    return err;
  }
};

export const changeListResponse = async ({ params, categoryId, categoryLink }) => {
  try {
    const resp = await api.post(`/userlists/changeAnswer`, {
      postId: categoryId,
      changeAnswerAddedObj: params.answer,
      addedAnswer: params.addedAnswer,
      addedAnswerUuid: params.addedAnswer ? params.uuid : '',
      uuid: params.uuid,
      isAddedAnsSelected: params.isAddedAnsSelected,
      categoryLink,
    });
    return resp;
  } catch (err) {
    return err;
  }
};

export const viewListResults = async ({ categoryId }) => {
  try {
    return await api.get(`/userlists/viewList/${categoryId}/${localStorage.getItem('uuid')}`);
  } catch (err) {
    return err;
  }
};

export const viewListAllResults = async ({ categoryId }) => {
  try {
    return await api.get(`/userlists/viewListAll/${categoryId}/${localStorage.getItem('uuid')}`);
  } catch (err) {
    return err;
  }
};

export const fetchListsExpended = async (domain) => {
  try {
    const resp = await api.get(`/userlists/userList?domain=${domain}&enable=true`);
    return resp.data.userList;
  } catch (err) {
    return err;
  }
};
