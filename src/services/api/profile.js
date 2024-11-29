import api from '../api/Axios';
import { useSelector } from 'react-redux';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import showToast from '../../components/ui/Toast';
import axios from 'axios';
import { toast } from 'sonner';

// FETCH ALL PROFILES
const fetchProfiles = async (pageNo, limit = 5, sort = 'Newest First', terms = '') => {
  const response = await api.get(`/user/searchUsersByDomain`, {
    params: {
      _page: pageNo,
      _limit: limit,
      sort,
      terms,
    },
  });
  return response.data;
};

export const useFetchOtherProfiles = (terms = '') => {
  return useInfiniteQuery({
    queryKey: ['others-profiles', terms],
    queryFn: async ({ pageParam = 1 }) => {
      return await fetchProfiles(pageParam, 5, 'Newest First', terms);
    },
    getNextPageParam: (lastPage, allPages) => (lastPage.length ? allPages.length + 1 : undefined),
  });
};

// FETCH MY PROFILE
const fetchMyProfile = async (domain, viewerUuid, isPublicProfile) => {
  try {
    const response = await api.get(`/user/fetchUserProfile`, {
      params: {
        domain,
        viewerUuid,
        isPublicProfile,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const backendMessage = error.response?.data?.message || error.message;
      throw new Error(backendMessage);
    }
    throw error;
  }
};

export const useFetchMyProfile = (domain, viewerUuid, isPublicProfile) => {
  return useQuery({
    queryKey: ['my-profile', domain, viewerUuid, isPublicProfile],
    queryFn: async () => {
      return await fetchMyProfile(domain, viewerUuid, isPublicProfile);
    },
    enabled: !!domain,
    refetchOnWindowFocus: false,
  });
};

// SPOTLIGHT ADD and REMOVE
const updateSpotLight = async (data) => {
  const response = await api.post('/app/spotLight', data);
  return response.data;
};

export const useUpdateSpotLight = () => {
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const domain = persistedUserInfo.badges.find((badge) => badge.domain)?.domain.name;

  return useMutation({
    mutationFn: updateSpotLight,
    onError: (error) => {
      if (error?.response?.data?.message) toast.warning(error?.response?.data?.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['my-profile', domain] });

      if (data.message === 'Spotlight added successfully') {
        showToast('success', 'spotLightAdded');
      } else {
        showToast('success', 'spotLightRemoved');
      }
    },
  });
};

// Separate verifyIdentity function using useMutation
export const useVerifyIdentity = ({ frontImage, backImage, video, persistedUserInfo, handleClose }) => {
  const queryClient = useQueryClient();

  // The mutation function for submitting the identity verification
  const mutation = useMutation({
    mutationFn: async () => {
      // Create FormData object for the API call
      const formData = new FormData();
      if (frontImage) formData.append('frontImage', frontImage);
      if (backImage) formData.append('backImage', backImage);
      if (video) formData.append('video', video);
      formData.append('uuid', persistedUserInfo.uuid);

      // API request
      const response = await api.post('/verifyIdentity', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Handle the response, throw an error if status is not 200
      if (response.status === 200) {
        return response.data; // Assuming data contains success details
      } else {
        throw new Error('Verification failed');
      }
    },
    onError: (error) => {
      // Handle the error scenario
      showToast('error', error.message || 'Submission failed');
    },
    onSuccess: () => {
      // On successful mutation
      showToast('success', 'Verification successful');
      queryClient.invalidateQueries(['userInfo']); // Refetch user info
      handleClose(); // Close the verification popup/modal
    },
  });

  return mutation;
};
