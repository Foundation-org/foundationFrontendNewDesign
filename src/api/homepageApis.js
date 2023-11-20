import api from './Axios';

// For Search
export const searchQuestions = async (term) => {
  if (term !== '') {
    const response = await api.post(`/search/easySearch?term=${term}`);
    return response.data;
  }
};

// ============ Filters

// For Default
export const getAllQuestsWithDefaultStatus = async (params) => {
  return await api.post('/infoquestions/getAllQuestsWithDefaultStatus', params);
};

// For Unanswered
export const getAllUnanswered = async (params) => {
  return await api.post(
    `/infoquestions/getAllQuestsWithOpenInfoQuestStatus`,
    params
  );
};

// For Answered
export const getAllAnswered = async (params) => {
  return await api.post(
    `/infoquestions/getAllQuestsWithAnsweredStatus`,
    params
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
    params
  );
};

// For Changable
export const getAllChangable = async (params) => {
  return await api.post(
    `/infoquestions/getAllQuestsWithChangeAnsStatus`,
    params
  );
};
