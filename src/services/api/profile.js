import api from '../api/Axios';
import { useSelector } from 'react-redux';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import showToast from '../../components/ui/Toast';
import axios from 'axios';

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
export const fetchMyProfile = async (domain, viewerUuid) => {
  try {
    const response = await api.get(`/user/fetchUserProfile`, {
      params: {
        domain,
        viewerUuid,
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

export const useFetchMyProfile = (domain, viewerUuid) => {
  return useQuery({
    queryKey: ['my-profile', domain],
    queryFn: async () => {
      return await fetchMyProfile(domain, viewerUuid);
    },
    enabled: !!domain,
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
      showToast('warning', 'spotLightAlreadyExists');
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
