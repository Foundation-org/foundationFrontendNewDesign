import api from './Axios';

export const getArticles = async (id, userUuid) => {
  try {
    return await api.get(`/article/getArticleById?id=${id}&userUuid=${userUuid}`);
  } catch (error) {
    throw new Error(error);
  }
};

export const updateSources = async ({ id, source }) => {
  try {
    return await api.post(`/article/update`, { id, source });
  } catch (err) {
    console.log(err);
  }
};
export const shareArticles = async (articleId) => {
  try {
    return await api.post(`shareArticles`, { articleId });
  } catch (err) {
    console.log(err);
  }
};
