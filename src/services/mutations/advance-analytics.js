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

export const analyzeBadge = async ({ userUuid, questForeignKey, operand, range }) => {
  return await api.post(`/infoquestions/analyze?badgeCount=${true}`, {
    userUuid,
    questForeignKey,
    oprend: operand,
    range,
  });
};

export const analyzeTarget = async ({ userUuid, questForeignKey, targetedOptionsArray, targetedQuestForeignKey }) => {
  return await api.post(`/infoquestions/analyze?target=${true}`, {
    userUuid,
    questForeignKey,
    targetedOptionsArray,
    targetedQuestForeignKey,
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
          if (resp.data && resp.data.result[0]) {
            return resp.data.result[0];
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

export const useAnalyzeBadgeMutation = ({ handleClose }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ userUuid, questForeignKey, operand, range }) => {
      return analyzeBadge({ userUuid, questForeignKey, operand, range });
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
          if (resp.data && resp.data.result[0]) {
            return resp.data.result[0];
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

export const useAnalyzeTargetMutation = ({ handleClose }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ userUuid, questForeignKey, targetedOptionsArray, targetedQuestForeignKey }) => {
      return analyzeTarget({ userUuid, questForeignKey, targetedOptionsArray, targetedQuestForeignKey });
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
          if (resp.data && resp.data.result[0]) {
            return resp.data.result[0];
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
