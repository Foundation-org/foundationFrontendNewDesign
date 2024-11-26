import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/Axios';
import showToast from '../../components/ui/Toast';
import { useSelector } from 'react-redux';

const useAddDomainBadge = (domainBadge, edit, setLoading, handleClose, onboarding, handleSkip, prevState) => {
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);

  return useMutation({
    mutationFn: async () => {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', domainBadge.domain);
      formData.append('title', domainBadge.title);
      formData.append('description', domainBadge.description);
      formData.append('uuid', persistedUserInfo.uuid);

      if (domainBadge.image[0] instanceof Blob) {
        formData.append('file16x9', domainBadge.image[0], 'seoCroppedImage.png');
        formData.append('coordinate16x9', JSON.stringify(domainBadge.coordinates[0]));
      }
      if (domainBadge.image[1] instanceof Blob) {
        formData.append('file1x1', domainBadge.image[1], 'profileImage.png');
        formData.append('coordinate1x1', JSON.stringify(domainBadge.coordinates[1]));
      }

      if (edit) {
        formData.append('update', true);
      }

      if (edit) {
        if (prevState.image[2] !== domainBadge.image[2]) {
          const blobResponse = await fetch(domainBadge.image[2]);
          const blob = await blobResponse.blob();
          formData.append('originalFile', blob, 'originalImage.png');
        }
      } else {
        const blobResponse = await fetch(domainBadge.image[2]);
        const blob = await blobResponse.blob();
        formData.append('originalFile', blob, 'originalImage.png');
      }

      return api.post(`/addDomainBadge`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: (data) => {
      if (data.status === 200) {
        if (edit) {
          showToast('success', 'badgeUpdated');
        } else {
          showToast('success', 'badgeAdded');
        }
        if (onboarding) {
          handleSkip();
          return;
        }

        setLoading(false);
        queryClient.invalidateQueries(['userInfo', { exact: true }]);
        handleClose();
      }
    },
    onError: (error) => {
      console.error(error);
      setLoading(false);
      handleClose();
    },
  });
};

const reOrderLinHubLinks = async (data) => {
  const response = await api.post('/updateBadgeDataArray', {
    type: 'linkHub',
    data,
  });

  return response.data;
};

export const useReOrderLinHubLinks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reOrderLinHubLinks,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['userInfo', { exact: true }]);
      showToast('success', 'orderUpdated');
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export default useAddDomainBadge;
