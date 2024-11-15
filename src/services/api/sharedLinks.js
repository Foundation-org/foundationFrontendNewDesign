import api from './Axios';
import { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

const useFetchSharedLinks = (searchData, persistedUserInfo) => {
  const fetchPosts = async ({ pageParam = 1 }) => {
    const params = {
      _page: pageParam,
      _limit: 5,
      start: (pageParam - 1) * 5,
      end: pageParam * 5,
      uuid: persistedUserInfo.uuid,
      sort: 'Newest First',
      Page: 'SharedLink',
      terms: searchData,
      type: 'All',
      moderationRatingInitial: 0,
      moderationRatingFinal: 100,
    };

    const response = await api.get('/infoquestions/getQuestsAll', { params });
    return response.data.data;
  };

  const { data, status, error, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['sharedLink', searchData],
    queryFn: fetchPosts,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => (lastPage.length ? allPages.length + 1 : undefined),
  });

  return useMemo(
    () => ({
      data,
      status,
      error,
      fetchNextPage,
      hasNextPage,
      isFetching,
    }),
    [data, status, error, fetchNextPage, hasNextPage, isFetching]
  );
};

export default useFetchSharedLinks;
