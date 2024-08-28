import { useMutation, useQueryClient } from '@tanstack/react-query';
import showToast from '../../components/ui/Toast';
import api from '../api/Axios';

// DELETE ANALYZE
export const deleteAnalyze = async ({ userUuid, questForeignKey, type, id }) => {
  return await api.delete(`/infoquestions/deleteAdvanceAnalytics/${userUuid}/${questForeignKey}/${type}/${id}`);
};

// Hide Option POST_PATCH
export const analyze = async ({ userUuid, questForeignKey, hiddenOptionsArray, id }) => {
  return await api.post(`/infoquestions/advanceAnalytics/${userUuid}/${questForeignKey}`, {
    type: 'hide',
    order: 1,
    createdAt: new Date(),
    hiddenOptionsArray,
    id,
  });
};

// Badge Count POST_PATCH
export const analyzeBadge = async ({ userUuid, questForeignKey, operand, range, id }) => {
  return await api.post(`/infoquestions/advanceAnalytics/${userUuid}/${questForeignKey}`, {
    type: 'badgeCount',
    order: 2,
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
}) => {
  return await api.post(`/infoquestions/advanceAnalytics/${userUuid}/${questForeignKey}`, {
    type: 'target',
    order: 3,
    createdAt: new Date(),
    targetedOptionsArray,
    targetedQuestForeignKey,
    id,
  });
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
    mutationFn: async ({ userUuid, questForeignKey, hiddenOptionsArray, id }) => {
      return analyze({ userUuid, questForeignKey, hiddenOptionsArray, id });
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
    mutationFn: async ({ userUuid, questForeignKey, operand, range, id }) => {
      return analyzeBadge({ userUuid, questForeignKey, operand, range, id });
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
    mutationFn: async ({ userUuid, questForeignKey, targetedOptionsArray, targetedQuestForeignKey, id }) => {
      return analyzeTarget({ userUuid, questForeignKey, targetedOptionsArray, targetedQuestForeignKey, id });
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
