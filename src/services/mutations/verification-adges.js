import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/Axios';
import showToast from '../../components/ui/Toast';
import { useSelector } from 'react-redux';

const useAddDomainBadge = (domainBadge, edit, setLoading, handleClose) => {
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

      // Convert the Blob URL to a Blob
      if (domainBadge.croppedImage) {
        const blobResponse = await fetch(domainBadge.croppedImage);
        const blob = await blobResponse.blob();
        formData.append('files', blob, 'croppedImage.png');
      }
      if (edit) {
        formData.append('update', true);
      }

      if (domainBadge.image.length !== 2) {
        formData.append('files', domainBadge.image);
      }

      return api.post(`/addDomainBadge`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: (data) => {
      if (data.status === 200) {
        showToast('success', 'badgeAdded');
        setLoading(false);
        queryClient.invalidateQueries(['userInfo']);
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

export default useAddDomainBadge;
