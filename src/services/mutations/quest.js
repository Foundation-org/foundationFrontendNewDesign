import { toast } from 'sonner';
import { createStartQuest, updateChangeAnsStartQuest } from '../api/questsApi';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import showToast from '../../components/ui/Toast';
import api from '../api/Axios';

export function useStartQuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createStartQuest(data),

    onSettled: async (_, error) => {
      if (error) {
        toast.error(error.response.data.message.split(':')[1]);
      } else {
        // toast.success('Successfully Completed');
        await queryClient.invalidateQueries({ queryKey: ['FeedData'] });
      }
    },
  });
}

export function useChangeAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => updateChangeAnsStartQuest(data),

    onSettled: async (_, error) => {
      if (error) {
        showToast('error', 'error', {}, error.response.data.message.split(':')[1]);
      } else {
        // toast.success('Successfully Completed');
        await queryClient.invalidateQueries({ queryKey: ['FeedData'] });
      }
    },
  });
}

const searchPosts = async ({ pageParam, signal, persistedUserInfo, searchData }) => {
  const params = {
    _page: pageParam || 1,
    _limit: 5,
    start: (pageParam - 1) * 5 || 0,
    end: pageParam * 5 || 5,
    uuid: persistedUserInfo.uuid,
    sort: 'Newest First',
    type: 'All',
    filter: false,
    participated: 'All',
    moderationRatingInitial: 0,
    moderationRatingFinal: 100,
    terms: searchData,
    Page: '',
    media: 'All',
  };

  const response = await api.get('/infoquestions/getQuestsAll', { params, signal });
  return response.data.data;
};

export const useSearchPosts = (searchData, persistedUserInfo) => {
  return useInfiniteQuery({
    queryKey: ['searchPosts', searchData, persistedUserInfo],
    queryFn: ({ pageParam, signal }) => searchPosts({ pageParam, signal, persistedUserInfo, searchData }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length ? allPages.length + 1 : undefined;
    },
  });
};
