import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { createStartQuest, undoFeedback, updateChangeAnsStartQuest } from '../api/questsApi';
import { resetaddOptionLimit } from '../../features/quest/utilsSlice';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitListResponse, updateCategoryParticipentsCount } from '../api/listsApi';
import showToast from '../../components/ui/Toast';

export const useStartGuestListPost = (setLoading) => {
  const location = useLocation();
  const queryClient = useQueryClient();

  const { mutateAsync: startGuestListPost } = useMutation({
    mutationFn: submitListResponse,
    onSuccess: (resp) => {
      if (resp.status === 200) {
        queryClient.invalidateQueries(['userInfo']);
        queryClient.setQueriesData(['postsByCategory'], (oldData) => {
          if (!oldData || !oldData.post) {
            return oldData;
          }

          return {
            ...oldData,
            post: oldData.post.map((item) =>
              item._id === resp.data.category.post._id ? resp.data.category.post : item,
            ),
          };
        });

        setLoading(false);

        if (location.pathname.startsWith('/l/')) {
          updateCategoryParticipentsCount({ categoryLink: location.pathname.split('/')[2] });
        }
      }
    },
    onError: (err) => {
      console.log({ err });
      showToast('error', 'error', {}, err.response.data.message.split(':')[1]);
      setLoading(false);
    },
  });

  return { startGuestListPost };
};

export const useStartPost = (setLoading, setSubmitResponse, handleViewResults, questStartData) => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const { mutateAsync: startPost } = useMutation({
    mutationFn: createStartQuest,
    onSuccess: (resp) => {
      queryClient.invalidateQueries({ queryKey: ['userInfo', localStorage.getItem('uuid')] }, { exact: true });
      queryClient.invalidateQueries({ queryKey: ['postsByCategory'] }, { exact: true });

      if (location.pathname.startsWith('/seldon-ai')) {
        queryClient.setQueryData(['sourcePosts'], (oldData) => {
          return oldData.map((item) => (item._id === resp.data.data._id ? resp.data.data : item));
        });
      } else if (location.pathname.startsWith('/r')) {
        queryClient.invalidateQueries(['sourcePosts']);
      } else {
        queryClient.setQueriesData(['posts'], (oldData) => ({
          ...oldData,
          pages: oldData?.pages?.map((page) =>
            page.map((item) => (item._id === resp.data.data._id ? resp.data.data : item)),
          ),
        }));
      }

      if (resp.data.message === 'Start Quest Created Successfully') {
        setLoading(false);

        queryClient.setQueryData(['questByShareLink'], (oldData) => {
          if (!oldData) return resp.data.data;

          return {
            ...oldData,
            data: {
              ...oldData.data,
              ...resp.data.data,
              data: oldData.data.data.map((item) => (item._id === resp.data.data._id ? resp.data.data : item)),
            },
          };
        });
      }

      if (location.pathname.startsWith('/post/')) {
        setSubmitResponse(resp.data.data);
      }
      if (!location.pathname.startsWith('/p/' || !location.pathname.startsWith('/l'))) {
        handleViewResults(questStartData._id);
      }

      if (location.pathname.startsWith('/l/')) {
        updateCategoryParticipentsCount({ categoryLink: location.pathname.split('/')[2] });
      }
      dispatch(resetaddOptionLimit());
    },
    onError: (err) => {
      console.log(err);
      showToast('error', 'error', {}, err.response.data.message.split(':')[1]);
      if (err.response.data.message === 'Sorry, this post has been deleted by the user who created it.') {
        queryClient.setQueriesData(['posts'], (oldData) => ({
          ...oldData,
          pages: oldData?.pages?.map((page) => page.filter((item) => item._id !== err.response.data._id)),
        }));
        queryClient.setQueriesData({ queryKey: ['questByShareLink'] }, (oldData) => {
          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: oldData.data.data.filter((item) => item._id !== err.response.data._id),
            },
          };
        });
      }
      setLoading(false);
      dispatch(resetaddOptionLimit());
    },
  });

  return { startPost };
};

export const useChangePost = (setLoading, setSubmitResponse, handleViewResults, questStartData) => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const { mutateAsync: changePost } = useMutation({
    mutationFn: updateChangeAnsStartQuest,
    onSuccess: (resp) => {
      if (resp.data.message === 'Answer has not changed') {
        setLoading(false);
        showToast('warning', 'selectedSameOptions');
      }
      if (resp.data.message === 'You can change your answer once every 1 hour') {
        showToast('warning', 'changeOptionTimePeriod');
        setLoading(false);
      }
      if (resp.data.message === 'Start Quest Updated Successfully') {
        queryClient.invalidateQueries({ queryKey: ['userInfo', localStorage.getItem('uuid')] }, { exact: true });
        setLoading(false);
        handleViewResults(questStartData._id);

        if (location.pathname.startsWith('/post/')) {
          setSubmitResponse(resp.data.data);
        }

        if (location.pathname.startsWith('/seldon-ai')) {
          queryClient.setQueryData(['sourcePosts'], (oldData) => {
            return oldData.map((item) => (item._id === resp.data.data._id ? resp.data.data : item));
          });
        } else {
          queryClient.setQueriesData(['posts'], (oldData) => ({
            ...oldData,
            pages: oldData?.pages?.map((page) =>
              page.map((item) => (item._id === resp.data.data._id ? resp.data.data : item)),
            ),
          }));
        }

        if (location.pathname.startsWith('/p/')) {
          queryClient.setQueryData(['questByShareLink'], (oldData) => {
            const newData = resp.data.data;

            // Keep the oldData format, but replace data.data[0]
            return {
              ...oldData,
              data: {
                ...oldData.data,
                data: [newData], // Replace the first item of data.data
              },
            };
          });
        }
      }
      dispatch(resetaddOptionLimit());
    },
    onError: (err) => {
      showToast('error', 'error', {}, err.response.data.message.split(':')[1]);
      setLoading(false);
      dispatch(resetaddOptionLimit());
    },
  });

  return { changePost };
};

export const useUndoFeedBackMutation = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: useUndoFeedback, isPending: isUndoFeedbackPending } = useMutation({
    mutationFn: undoFeedback,
    onSuccess: (resp) => {
      if (resp.status === 200) {
        if (
          resp.data.message === 'Feedback Reverted Successfully!' &&
          location.pathname.includes('/profile/feedback-given')
        ) {
          queryClient.setQueriesData(['posts'], (oldData) => ({
            ...oldData,
            pages: oldData?.pages?.map((page) => page.filter((item) => item._id !== resp.data.data[0]._id)),
          }));
        } else if (location.pathname === '/') {
          queryClient.setQueriesData(['posts'], (oldData) => ({
            ...oldData,
            pages: oldData?.pages?.map((page) =>
              page.map((item) => (item._id === resp.data.data[0]._id ? resp.data.data[0] : item)),
            ),
          }));
        } else {
          queryClient.setQueryData(['questByShareLink'], (oldData) => {
            if (!oldData || !oldData.data || !oldData.data.data) return oldData;

            const updatedData = oldData.data.data.map((item) => {
              if (item._id === resp.data.data[0]._id) {
                return { ...item, ...resp.data.data[0] };
              }
              return item;
            });

            return {
              ...oldData,
              data: {
                ...oldData.data,
                data: updatedData,
              },
            };
          });
        }
      }
    },
    onError: (err) => {
      console.log({ err });
      showToast('error', 'error', {}, err.response.data.message.split(':')[1]);
    },
  });

  return { useUndoFeedback, isUndoFeedbackPending };
};
