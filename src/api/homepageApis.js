import api from './Axios';

export const getAllQuestsWithDefaultStatus = async (params) => {
  return await api.post('/infoquestions/getAllQuestsWithDefaultStatus', params);
};

export const searchQuestions = async (searchTerm) => {
  if (searchTerm !== '')
    return await api.post(`/search/easySearch?term=${searchTerm}`);
};

// ============ Filters
// For Unanswered
export const getAllUnanswered = async (searchTerm) => {
  if (searchTerm !== '')
    return await api.post(`/infoquestions/getAllQuestsWithOpenInfoQuestStatus`);
};

// For Answered
export const getAllAnswered = async (searchTerm) => {
  if (searchTerm !== '')
    return await api.post(`/infoquestions/getAllQuestsWithAnsweredStatus`);
};

// For Correct
export const getAllCorrect = async (searchTerm) => {
  if (searchTerm !== '')
    return await api.post(`/infoquestions/getAllQuestsWithCorrectStatus`);
};

// For InCorrect
export const getAllInCorrect = async (searchTerm) => {
  if (searchTerm !== '')
    return await api.post(`/infoquestions/getAllQuestsWithIncorrectStatus`);
};
