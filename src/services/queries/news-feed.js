import { useInfiniteQuery } from '@tanstack/react-query';
import api from '../api/Axios';
import { useSelector } from 'react-redux';

const fetchArticles = async (pageNo, limit = 5, sort = 'Newest First', terms = '', pageType = '', uuid) => {
  let params = {
    _page: pageNo,
    _limit: limit,
    sort,
    terms,
    uuid: uuid,
  };

  if (pageType !== '') {
    params.pageType = 'sharedArticles';
  }

  const response = await api.get(`/article/articles`, { params });
  return response.data;
};

export const useFetchNewsFeed = (terms = '', pageType = '') => {
  const persistedUserInfo = useSelector((state) => state.auth.user);

  return useInfiniteQuery({
    queryKey: ['news-feed', terms],
    queryFn: async ({ pageParam = 1 }) => {
      return await fetchArticles(pageParam, 5, 'Newest First', terms, pageType, persistedUserInfo.uuid);
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.data.length ? allPages.length + 1 : undefined;
    },
  });
};
