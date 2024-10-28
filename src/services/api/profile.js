import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import api from '../api/Axios';

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
const fetchMyProfile = async (domain) => {
  const response = await api.get(`/user/fetchUserProfile`, {
    params: {
      domain,
    },
  });
  return response.data;
};

export const useFetchMyProfile = (domain) => {
  return useQuery({
    queryKey: ['my-profile', domain],
    queryFn: async () => {
      return await fetchMyProfile(domain);
    },
  });
};

const updateSpotLight = async (data) => {
  const response = await api.post('/app/spotLight', data);
  return response.data;
};

export const useUpdateSpotLight = () => {
  return useMutation({
    mutationFn: updateSpotLight,
    onError: (error) => {
      console.error('Error creating spotLight:', error);
    },
    onSuccess: (data) => {
      console.log('SpotLight created successfully:', data);
    },
  });
};
