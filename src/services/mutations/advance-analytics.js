import { useMutation, useQueryClient } from '@tanstack/react-query';
import showToast from '../../components/ui/Toast';
import api from '../api/Axios';

// DELETE All ANALYZE
export const deleteAllAnalyze = async ({ userUuid, questForeignKey }) => {
  return await api.delete(`/infoquestions/deleteAllAdvanceAnalytics/${userUuid}/${questForeignKey}`);
};

// DELETE ANALYZE
export const deleteAnalyze = async ({ userUuid, questForeignKey, type, id }) => {
  return await api.delete(`/infoquestions/deleteAdvanceAnalytics/${userUuid}/${questForeignKey}/${type}/${id}`);
};

// Hide Option POST_PATCH
export const analyze = async ({ userUuid, questForeignKey, hiddenOptionsArray, id, order }) => {
  return await api.post(`/infoquestions/advanceAnalytics/${userUuid}/${questForeignKey}`, {
    type: 'hide',
    order,
    createdAt: new Date(),
    hiddenOptionsArray,
    id,
  });
};

// Badge Count POST_PATCH
export const analyzeBadge = async ({ userUuid, questForeignKey, operand, range, id, order }) => {
  return await api.post(`/infoquestions/advanceAnalytics/${userUuid}/${questForeignKey}`, {
    type: 'badgeCount',
    order,
    createdAt: new Date(),
    oprend: operand,
    range,
    id,
  });
};

// Target Option POST_PATCH
export const analyzeTarget = async ({
  userUuid,
  questForeignKey,
  targetedOptionsArray,
  targetedQuestForeignKey,
  id,
  order,
}) => {
  return await api.post(`/infoquestions/advanceAnalytics/${userUuid}/${questForeignKey}`, {
    type: 'target',
    order,
    createdAt: new Date(),
    targetedOptionsArray,
    targetedQuestForeignKey,
    id,
  });
};

// Activity POST_PATCH
export const analyzeActivity = async ({ userUuid, questForeignKey, allParams, id, order }) => {
  return await api.post(`/infoquestions/advanceAnalytics/${userUuid}/${questForeignKey}`, {
    type: 'activity',
    order,
    createdAt: new Date(),
    allParams: allParams,
    id,
  });
};

export const useDeleteAllAnalyzeMutation = ({ handleClose }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ userUuid, questForeignKey }) => {
      return deleteAllAnalyze({ userUuid, questForeignKey });
    },
    onSuccess: (resp, variables) => {
      // const { actionType } = variables;

      if (resp.status === 200) {
        showToast('success', 'deleteAllAnalytics');

        // Pessimistic Update
        // queryClient.setQueryData(['SingleQuest'], (oldData) => {
        //   if (resp.data && resp.data.result[0]) {
        //     return resp.data.result[0];
        //   } else {
        //     return oldData;
        //   }
        // });

        queryClient.invalidateQueries({ queryKey: ['SingleQuest'] });

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

export const useDeleteAnalyzeMutation = ({ handleClose }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ userUuid, questForeignKey, type, id }) => {
      return deleteAnalyze({ userUuid, questForeignKey, type, id });
    },
    onSuccess: (resp, variables) => {
      // const { actionType } = variables;

      if (resp.status === 200) {
        // if (actionType === 'delete') {
        showToast('success', 'hideOptionDeleted');
        // }

        // Pessimistic Update
        // queryClient.setQueryData(['SingleQuest'], (oldData) => {
        //   if (resp.data && resp.data.result[0]) {
        //     return resp.data.result[0];
        //   } else {
        //     return oldData;
        //   }
        // });

        queryClient.invalidateQueries({ queryKey: ['SingleQuest'] });

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

export const useAnalyzePostMutation = ({ handleClose }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ userUuid, questForeignKey, hiddenOptionsArray, id, order }) => {
      return analyze({ userUuid, questForeignKey, hiddenOptionsArray, id, order });
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
        // queryClient.setQueryData(['SingleQuest'], (oldData) => {
        //   if (resp.data && resp.data.result[0]) {
        //     return resp.data.result[0];
        //   } else {
        //     return oldData;
        //   }
        // });

        queryClient.invalidateQueries({ queryKey: ['SingleQuest'] });

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
    mutationFn: async ({ userUuid, questForeignKey, operand, range, id, order }) => {
      return analyzeBadge({ userUuid, questForeignKey, operand, range, id, order });
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
        // queryClient.setQueryData(['SingleQuest'], (oldData) => {
        //   if (resp.data && resp.data.result[0]) {
        //     return resp.data.result[0];
        //   } else {
        //     return oldData;
        //   }
        // });
        queryClient.invalidateQueries({ queryKey: ['SingleQuest'] });

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
    mutationFn: async ({ userUuid, questForeignKey, targetedOptionsArray, targetedQuestForeignKey, id, order }) => {
      return analyzeTarget({ userUuid, questForeignKey, targetedOptionsArray, targetedQuestForeignKey, id, order });
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
        // queryClient.setQueryData(['SingleQuest'], (oldData) => {
        //   if (resp.data && resp.data.result[0]) {
        //     return resp.data.result[0];
        //   } else {
        //     return oldData;
        //   }
        // });
        queryClient.invalidateQueries({ queryKey: ['SingleQuest'] });

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

export const useAnalyzeActivityMutation = ({ handleClose }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ userUuid, questForeignKey, allParams, id, order }) => {
      return analyzeActivity({ userUuid, questForeignKey, allParams, id, order });
    },
    onSuccess: (resp, variables) => {
      const { actionType } = variables;

      if (resp.status === 200) {
        if (actionType === 'create') {
          showToast('success', 'hideOption');
        } else if (actionType === 'delete') {
          showToast('success', 'hideOptionDeleted');
        }
        queryClient.invalidateQueries({ queryKey: ['SingleQuest'] });

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
