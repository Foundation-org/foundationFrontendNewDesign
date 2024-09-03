import api from './Axios';

// For Search in Feed
export const searchQuestions = async (term, moderationRatingFilter) => {
  if (term !== '') {
    const response = await api.post(`/search/easySearch?term=${term}`, {
      moderationRatingFilter,
    });
    return response.data;
  }
};

// For Search hidden Posts
export const searchHiddenQuestions = async (term) => {
  if (term !== '') {
    const response = await api.post(`/search/searchHiddenQuest?term=${term}`, {});
    return response.data;
  }
};

// To get all topics of preferences
export const getAllTopics = async () => {
  return await api.get('/preferences/getAllTopic');
};

export const searchTopics = async (topicSearch) => {
  return await api.get(`/preferences/searchTopics?search=${topicSearch}`);
};

// ============ Filters

// For Default
export const getAllQuestsWithDefaultStatus = async (params) => {
  return await api.post('/infoquestions/getAllQuestsWithDefaultStatus', params);
};

// Get Quest By Id
export const getQuestById = async (id, qId, sharedLinkRes, link) => {
  if (sharedLinkRes) {
    return await api.get(`/infoquestions/getQuest/${id}/${qId}/SharedLink?postLink=${link}`);
  } else {
    return await api.get(`/infoquestions/getQuest/${id}/${qId}`);
  }
};

export const getSingleQuest = async (id, qId) => {
  return await api.get(`/infoquestions/getQuest/${id}/${qId}/advance-analytics`);
};

// Get Quest By uniqueShareLink
// export const getQuestByUniqueShareLink = async (uniqueShareLink) => {
//   return await api.get(`/infoquestions/getQuest/${uniqueShareLink}`);
// };
export const getQuestByUniqueShareLink = async (uniqueShareLink) => {
  // try {
  return await api.get(`/infoquestions/getQuest/${uniqueShareLink}/`, {
    params: { uuid: localStorage.getItem('uuid') },
  });
  // return response.data.data;
  // } catch (error) {
  //   return error.response?.data?.message || 'An error occurred while fetching the quest.';
  // }
};

// For Unanswered
export const getAllUnanswered = async (params) => {
  return await api.post(`/infoquestions/getAllQuestsWithOpenInfoQuestStatus`, params);
};

// For Answered
export const getAllAnswered = async (params) => {
  return await api.post(`/infoquestions/getAllQuestsWithAnsweredStatus`, params);
};

// For InCorrect
export const getAllCompleted = async (params) => {
  return await api.post(`/infoquestions/getAllQuestsWithCompletedStatus`, params);
};

// For Changable
export const getAllChangable = async (params) => {
  return await api.post(`/infoquestions/getAllQuestsWithChangeAnsStatus`, params);
};

// ================= Bookmark
// Get Bookmarks
export const getAllBookmarkedQuests = async () => {
  return await api.post(`/bookmarkQuest/getAllBookmarkQuests`);
};

// Add Bookmarks
export const createBookmark = async (data) => {
  return await api.post(`/bookmarkQuest/createBookmarkQuest`, {
    questForeignKey: data.questForeignKey,
    whichTypeQuestion: data.whichTypeQuestion,
    Question: data.Question,
    moderationRatingCount: data.moderationRatingCount,
    uuid: data.uuid,
  });
};

// Delete Bookmarks
export const deleteBookmarkById = async (data) => {
  return await api.post(`/bookmarkQuest/deleteBookmarkQuest`, {
    questForeignKey: data.questForeignKey,
    uuid: data.uuid,
  });
};

export const searchBookmarks = async (term, moderationRatingFilter) => {
  if (term !== '') {
    const response = await api.post(`/search/searchBookmarks?term=${term}`, {
      moderationRatingFilter,
    });
    return response.data;
  }
};
