import api from "./Axios";

// For Search in Feed
export const searchQuestions = async (term,uuid) => {
  if (term !== "") {
    const response = await api.post(`/search/easySearch?term=${term}&uuid=${uuid}`);
    return response.data;
  }
};

// ============ Filters

// For Default
export const getAllQuestsWithDefaultStatus = async (params) => {
  return await api.post("/infoquestions/getAllQuestsWithDefaultStatus", params);
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

// For Correct
export const getAllCorrect = async (params) => {
  return await api.post(`/infoquestions/getAllQuestsWithCorrectStatus`, params);
};

// For InCorrect
export const getAllInCorrect = async (params) => {
  return await api.post(
    `/infoquestions/getAllQuestsWithIncorrectStatus`,
    params,
  );
};

// For Changable
export const getAllChangable = async (params) => {
  console.log("params in api", params);
  return await api.post(
    `/infoquestions/getAllQuestsWithChangeAnsStatus`,
    params,
  );
};

// ================= Bookmark
// Get Bookmarks
export const getAllBookmarkedQuests = async (uuid) => {
  return await api.post(`/bookmarkQuest/getAllBookmarkQuests`, {
    uuid,
  });
};

export const searchBookmarks = async (term,uuid) => {
  if (term !== "") {
    console.log(uuid);
    const response = await api.post(`/search/searchBookmarks?term=${term}&uuid=${uuid}`);
    return response.data;
  }
};
