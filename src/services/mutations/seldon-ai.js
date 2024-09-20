import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/Axios';
import showToast from '../../components/ui/Toast';
import { toast } from 'sonner';

export const chatGptData = async ({ params }) => {
  const queryString = new URLSearchParams(params).toString();
  return await api.post(`/chatbot/chatGptData?${queryString}`);
};

export const useChatGptDataMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ params }) => {
      return chatGptData({ params });
    },
    onSuccess: (resp) => {
      if (resp.status === 200) {
        // Pessimistic Update
        // queryClient.setQueryData(['SingleQuest'], (oldData) => {
        //   return resp.data?.data[0] || oldData;
        // });
      }
    },
    onError: (error) => {
      console.log(error);
      // Show error message in a toast
      // toast.warning(error.response.data.message);
    },
  });

  return mutation;
};

export const publishArticle = async ({ userUuid, body, source, suggestion, title }) => {
  return await api.post(`/article/create`, {
    userUuid,
    body,
    source,
    suggestion,
    title,
  });
};

export const usePublishArticleMutation = () => {
  const mutation = useMutation({
    mutationFn: async ({ userUuid, body, source, suggestion, title }) => {
      return publishArticle({ userUuid, body, source, suggestion, title });
    },
    onSuccess: (resp) => {
      if (resp.status === 201) {
        showToast('success', 'articlePublished');
      }
    },
    onError: (error) => {
      console.log(error);
      // Show error message in a toast
      toast.warning(error.response.data.message);
    },
  });

  return mutation;
};
