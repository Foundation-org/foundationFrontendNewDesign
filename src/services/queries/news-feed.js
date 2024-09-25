import { useInfiniteQuery } from '@tanstack/react-query';
import api from '../api/Axios';

const fetchArticles = async (pageNo, limit = 5, sort = 'Newest First', terms = '') => {
  const response = await api.get(`/article/articles`, {
    params: {
      _page: pageNo,
      _limit: limit,
      sort,
      terms,
    },
  });
  return response.data;
};

export const useFetchNewsFeed = (terms = '') => {
  return useInfiniteQuery({
    queryKey: ['news-feed', terms],
    queryFn: async ({ pageParam = 1 }) => {
      return await fetchArticles(pageParam, 5, 'Newest First', terms);
    },
    getNextPageParam: (lastPage, allPages) => (lastPage.length ? allPages.length + 1 : undefined),
  });
};
