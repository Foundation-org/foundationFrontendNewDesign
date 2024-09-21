import api from './Axios';

export const getArticles = async (id) => {
  try {
    return await api.get(`/article/getArticleById?id=${id}`);
  } catch (err) {
    console.log(err);
  }
};
