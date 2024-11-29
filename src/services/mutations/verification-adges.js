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

    const targetSizeKB = 500; // 500 KB target size
    const options = {
      maxSizeMB: 0.5, // Compress to a maximum of 0.5 MB (500 KB)
      useWebWorker: true, // Use web workers for better performance
      maxIteration: 5, // Adjust iterations for compression balance
      initialQuality: 0.8, // Initial compression quality
    };

    try {
      let compressedFile = file;
      let fileSizeKB = compressedFile.size / 1024; // Convert file size to KB

      // Continue compressing if the file is larger than the target size
      while (fileSizeKB > targetSizeKB && options.maxSizeMB > 0.1) {
        // Compress the image using the specified options
        compressedFile = await imageCompression(file, options);
        fileSizeKB = compressedFile.size / 1024; // Update the file size (in KB)

        // Optionally, reduce quality slightly after each iteration
        options.initialQuality = Math.max(0.5, options.initialQuality - 0.1); // Prevent quality from going below 0.5
      }

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
        const compress16x9 = await compressImage(domainBadge.image[0]);
        formData.append('file16x9', compress16x9, 'seoCroppedImage.png');
        formData.append('coordinate16x9', JSON.stringify(domainBadge.coordinates[0]));
      }
      if (domainBadge.image[1] instanceof Blob) {
        const compress1x1 = await compressImage(domainBadge.image[1]);
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

      const blobResponse = await fetch(domainBadge.image[2] && domainBadge.image[2] !== prevState.image[2] ? domainBadge.image[2] : prevState.image[2]);
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
