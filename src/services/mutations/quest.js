import { toast } from 'sonner';
import { createStartQuest, updateChangeAnsStartQuest } from '../api/questsApi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import showToast from '../../components/ui/Toast';
import api from '../api/Axios';
import { searchPosts } from '../api/listsApi';

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

export const useSearchPosts = (term, uuid) => {
  return useMutation({
    mutationFn: () => searchPosts(term, uuid),
  });
};
