import { useMutation, useQueryClient } from '@tanstack/react-query';
import showToast from '../../components/ui/Toast';
import api from '../api/Axios';

export const analyze = async ({ userUuid, questForeignKey, hiddenOptionsArray }) => {
  return await api.post(`/infoquestions/analyze?hide=${true}`, {
    userUuid,
    questForeignKey,
    hiddenOptionsArray,
  });
};

export const useAnalyzePostMutation = ({ handleClose }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ userUuid, questForeignKey, hiddenOptionsArray }) => {
      return analyze({ userUuid, questForeignKey, hiddenOptionsArray });
    },
    onSuccess: (resp, variables) => {
      const { actionType } = variables;

      if (resp.status === 200) {
        if (actionType === 'create') {
          showToast('success', 'hideOption');
        } else if (actionType === 'delete') {
          showToast('success', 'hideOptionDeleted');
        }

        // Pessimistic Update
        queryClient.setQueryData(['SingleQuest'], (oldData) => {
          if (resp.data && resp.data.result && resp.data.result.result[0]) {
            return resp.data.result.result[0];
          } else {
            return oldData;
          }
        });

        // Optionally close the modal or perform other UI updates
        handleClose();
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
