import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/Axios';
import showToast from '../../components/ui/Toast';
import { useSelector } from 'react-redux';
import { compressImageBlobService } from '../imageProcessing';

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
        const compress16x9 = await compressImageBlobService(
          domainBadge.image[0],
          domainBadge.coordinates[0].width,
          domainBadge.coordinates[0].height
        );
        formData.append('file16x9', compress16x9, 'seoCroppedImage.png');
        formData.append('coordinate16x9', JSON.stringify(domainBadge.coordinates[0]));
      }
      if (domainBadge.image[1] instanceof Blob) {
        const compress1x1 = await compressImageBlobService(
          domainBadge.image[1],
          domainBadge.coordinates[1].width,
          domainBadge.coordinates[1].height
        );
        formData.append('file1x1', compress1x1, 'profileImage.png');
        formData.append('coordinate1x1', JSON.stringify(domainBadge.coordinates[1]));
      }

      if (edit) {
        formData.append('update', true);
      }

      // if (edit) {
      //   if (prevState.image[2] !== domainBadge.image[2]) {
      //     const blobResponse = await fetch(domainBadge.image[2]);
      //     const blob = await blobResponse.blob();
      //     formData.append('originalFile', blob, 'originalImage.png');
      //   }
      // } else {
      //   const blobResponse = await fetch(domainBadge.image[2]);
      //   const blob = await blobResponse.blob();
      //   formData.append('originalFile', blob, 'originalImage.png');
      // }

      const blobResponse = await fetch(
        domainBadge.image[2] && domainBadge.image[2] !== prevState.image[2] ? domainBadge.image[2] : prevState.image[2]
      );
      const blob = await blobResponse.blob();
      formData.append('originalFile', blob, 'originalImage.png');

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
    uuid: localStorage.getItem('uuid'),
  });

  return response.data;
};

export const useReOrderLinHubLinks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reOrderLinHubLinks,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userInfo', localStorage.getItem('uuid')] }, { exact: true });
      showToast('success', 'orderUpdated');
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

const addBadgeHub = async (userUuid, badgeIds) => {
  const response = await api.patch('/addProfileBadges', {
    userUuid,
    badgeIds,
  });

  return response.data;
};

export const useAddBadgeHub = () => {
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);

  return useMutation({
    mutationFn: (selectedIds) => addBadgeHub(persistedUserInfo.uuid, selectedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userInfo', localStorage.getItem('uuid')] }, { exact: true });
      showToast('success', 'orderUpdated');
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

const badgeHubClicksTrack = async (badgeId, clickerUuid) => {
  const response = await api.patch('/badgeHubClicksTrack', {
    badgeId,
    clickerUuid,
    clickerTimestamps: new Date().getTime(),
  });

  return response.data;
};

export const useBadgeHubClicksTrack = () => {
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);

  return useMutation({
    mutationFn: (badgeId) => badgeHubClicksTrack(badgeId, persistedUserInfo.uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userInfo', localStorage.getItem('uuid')] }, { exact: true });
      showToast('success', 'orderUpdated');
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export default useAddDomainBadge;
