import { useQuery } from '@tanstack/react-query';
import { applyFilters, fetchDataByStatus } from '../../utils/questionCard';
import * as HomepageAPIs from '../api/homepageApis';

export function useGetFeedData(filterStates, debouncedSearch, pagination, columns, params) {
  params = applyFilters(params, filterStates, columns);
  console.log('first', params.moderationRatingFilter);
  return useQuery({
    queryFn: async () => {
      if (debouncedSearch === '') {
        const result = await fetchDataByStatus(params, filterStates);
        return result.data;
      } else {
        const result = await HomepageAPIs.searchQuestions(debouncedSearch, params.moderationRatingFilter);
        return result;
      }
    },
    queryKey: ['FeedData', filterStates, debouncedSearch, pagination, columns],
    staleTime: 0,
  });
}

export function useGetHiddenFeedData(filterStates, debouncedSearch, pagination, columns, params) {
  params = applyFilters(params, filterStates, columns);
  return useQuery({
    queryFn: async () => {
      if (debouncedSearch === '') {
        const result = await fetchDataByStatus(params, filterStates);
        return result.data;
      } else {
        const result = await HomepageAPIs.searchHiddenQuestions(debouncedSearch);
        return result;
      }
    },
    queryKey: ['HiddenFeedData', filterStates, debouncedSearch, pagination, columns],
    staleTime: 0,
  });
}

export function useGetBookmarkFeedData(filterStates, debouncedSearch, pagination, columns, params) {
  params = applyFilters(params, filterStates, columns);
  return useQuery({
    queryFn: async () => {
      if (debouncedSearch === '') {
        const result = await fetchDataByStatus(params, filterStates);
        return result.data;
      } else {
        const result = await HomepageAPIs.searchBookmarks(debouncedSearch);
        return result;
      }
    },
    queryKey: ['BookmarkFeedData', filterStates, debouncedSearch, pagination, columns],
    staleTime: 0,
  });
}

export function useGetSingleQuest(uuid, id) {
  return useQuery({
    queryFn: async () => {
      return (await HomepageAPIs.getQuestById(uuid, id)).data.data[0];
    },
    queryKey: ['SingleQuest'],
  });
}

export function useGetBookmarkData() {
  return useQuery({
    queryFn: () => HomepageAPIs.getAllBookmarkedQuests(),
    queryKey: ['getBookmarked'],
  });
}

// GET ALL PREFERENCES
export function useGetAllTopics() {
  return useQuery({
    queryFn: () => HomepageAPIs.getAllTopics(),
    queryKey: ['topicsData'],
  });
}

// SEARCH PREFERENCES
export function useSearchTopics(getPreferences) {
  return useQuery({
    queryFn: async () => {
      if (getPreferences?.topicSearch !== '') {
        const result = await HomepageAPIs.searchTopics(getPreferences?.topicSearch);
        return result;
      } else {
        return [];
      }
    },
    queryKey: ['TopicSearch', getPreferences.topicSearch],
  });
}
