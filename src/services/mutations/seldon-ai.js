import { useMutation, useQueryClient } from '@tanstack/react-query';
import showToast from '../../components/ui/Toast';
import api from '../api/Axios';

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
        showToast('success', 'resultsUpdatedSuccess');

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
