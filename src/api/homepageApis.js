import api from "./Axios";

// For Search in Feed
export const searchQuestions = async (term) => {
  if (term !== "") {
    const response = await api.post(
      `/search/easySearch?term=${term}`,
    );
    return response.data;
  }
};

// To get all topics of preferences
export const getAllTopics = async () => {
  return await api.get("/preferences/getAllTopic");
};

// ============ Filters

// For Default
export const getAllQuestsWithDefaultStatus = async (params) => {
  return await api.post("/infoquestions/getAllQuestsWithDefaultStatus", params);
};

// Get Quest By Id
export const getQuestById = async (id, qId) => {
  return await api.get(`/infoquestions/getQuest/${id}/${qId}`);
};

// For Unanswered
export const getAllUnanswered = async (params) => {
  return await api.post(
    `/infoquestions/getAllQuestsWithOpenInfoQuestStatus`,
    params,
  );
};

// For Answered
export const getAllAnswered = async (params) => {
  return await api.post(
    `/infoquestions/getAllQuestsWithAnsweredStatus`,
    params,
  );
};

// For InCorrect
export const getAllCompleted = async (params) => {
  return await api.post(
    `/infoquestions/getAllQuestsWithCompletedStatus`,
    params,
  );
};

// For Changable
export const getAllChangable = async (params) => {
  return await api.post(
    `/infoquestions/getAllQuestsWithChangeAnsStatus`,
    params,
  );
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
  });
};

// Delete Bookmarks
export const deleteBookmarkById = async (data) => {
  return await api.post(`/bookmarkQuest/deleteBookmarkQuest`, {
    questForeignKey: data.questForeignKey,
  });
};

export const searchBookmarks = async (term) => {
  if (term !== "") {
    const response = await api.post(
      `/search/searchBookmarks?term=${term}`,
    );
    return response.data;
  }
};
