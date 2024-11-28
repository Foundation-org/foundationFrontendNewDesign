import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/Axios';
import showToast from '../../components/ui/Toast';
import { useSelector } from 'react-redux';
import imageCompression from 'browser-image-compression';

const useAddDomainBadge = (domainBadge, edit, setLoading, handleClose, onboarding, handleSkip, prevState) => {
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const compressImage = async (blobOrFile) => {
    // If the input is a Blob, convert it to a File
    const file = blobOrFile instanceof Blob
      ? new File([blobOrFile], 'compressed_image.jpg', { type: blobOrFile.type })
      : blobOrFile;

    // Check if the file size is greater than 1MB (1,024,000 bytes)
    const fileSizeInMB = file.size / (1024 * 1024); // Convert bytes to MB

    if (fileSizeInMB <= 1) {
      console.log('File size is already under 1MB, no compression needed.');
      return file; // Return original file if under 1MB
    }

    const options = {
      maxSizeMB: 1, // Compress to max 1MB if possible
      useWebWorker: true, // Use web workers for faster compression
      maxIteration: 10, // Maximum iterations to ensure good compression
    };

    try {
      const compressedFile = await imageCompression(file, options);
      console.log('Image compressed successfully.');
      return compressedFile;
    } catch (error) {
      console.error('Image compression failed:', error);
      return file; // Return original if compression fails
    }
  };

  return useMutation({
    mutationFn: async () => {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', domainBadge.domain);
      formData.append('title', domainBadge.title);
      formData.append('description', domainBadge.description);
      formData.append('uuid', persistedUserInfo.uuid);

      if (domainBadge.image[0] instanceof Blob) {
        const compressedImage = await compressImage(domainBadge.image[0]);
        formData.append('file16x9', compressedImage, 'seoCroppedImage.png');
        formData.append('coordinate16x9', JSON.stringify(domainBadge.coordinates[0]));
      }
      if (domainBadge.image[1] instanceof Blob) {
        const compressedImage = await compressImage(domainBadge.image[1]);
        formData.append('file1x1', compressedImage, 'profileImage.png');
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

      const blobResponse = await fetch(domainBadge.image[2] && domainBadge.image[2] !== prevState.image[2] ? domainBadge.image[2] : prevState.image[2]);
      const blob = await blobResponse.blob();
      const compressedImage = await compressImage(blob);
      formData.append('originalFile', compressedImage, 'originalImage.png');

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
      queryClient.invalidateQueries({ queryKey: ['userInfo', localStorage.getItem('uuid')] }, { exact: true });
      showToast('success', 'orderUpdated');
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export default useAddDomainBadge;
