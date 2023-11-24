import api from './Axios';

export const createInfoQuest = async (data) => {
  return await api.post('/infoquestions/createInfoQuestQuest', {
    Question: data.Question,
    whichTypeQuestion: data.whichTypeQuestion,
    usersChangeTheirAns: data.usersChangeTheirAns,
    QuestionCorrect: data.QuestionCorrect, // dataFromReduxSaveData.correctAns === true ? yesSelected === true ? "yes" : "no" : "Not Selected",
    uuid: data.uuid,
  });
};
