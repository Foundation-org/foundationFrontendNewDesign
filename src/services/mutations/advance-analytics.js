import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import showToast from '../../components/ui/Toast';
import api from '../api/Axios';
import { useNavigate } from 'react-router-dom';

export const analyze = async ({ userUuid, questForeignKey, hiddenOptionsArray }) => {
  return await api.post('/infoquestions/analyze', {
    userUuid,
    questForeignKey,
    hiddenOptionsArray,
  });
};

export const useAnalyzePostMutation = () => {
  //   const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: analyze,
    onSuccess: (resp) => {
      console.log('resp', resp);

      showToast('success', 'deleteList');

      // Optionally update the cache data or invalidate queries
      // queryClient.setQueriesData(['lists'], (oldData) => {
      //   return oldData?.map((page) => page.filter((item) => item._id !== categoryId));
      // });

      // queryClient.invalidateQueries(['lists']);

      // Optionally close the modal or perform other UI updates
      // handleClose();
      navigate('/post/isfullscreen', {
        state: { questId: resp.data.questForeignKey },
      });
    },
    onError: (error) => {
      console.log(error);
      // Show error message in a toast
      // toast.warning(error.response.data.message);
    },
  });

  return mutation;
};
