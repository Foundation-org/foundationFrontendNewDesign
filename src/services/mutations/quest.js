import { toast } from 'sonner';
import { createStartQuest, updateChangeAnsStartQuest } from '../api/questsApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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
        toast.error(error.response.data.message.split(':')[1]);
      } else {
        // toast.success('Successfully Completed');
        await queryClient.invalidateQueries({ queryKey: ['FeedData'] });
      }
    },
  });
}
