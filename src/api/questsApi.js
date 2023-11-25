import api from "./Axios";

// change ans submit
export const updateChangeAnsStartQuest = async (data) => {
  return await api.post("/startQuest/updateChangeAnsStartQuest", {
    questId: data.questId,
    changeAnswerAddedObj: data.changeAnswerAddedObj,
    addedAnswer: "",
    uuid: data.uuid,
  });
};

// start submit button
export const createStartQuest = async (data) => {
  return await api.post("/startQuest/createStartQuest", {
    questForeignKey: data.Question,
    data: data.whichTypeQuestion,
    addedAnswer: "",
    uuid: data.uuid,
  });
};

// creation of a quest of all types
export const createInfoQuest = async (data) => {
  return await api.post("/infoquestions/createInfoQuestQuest", {
    Question: data.Question,
    whichTypeQuestion: data.whichTypeQuestion, // yes/no
    usersChangeTheirAns: data.usersChangeTheirAns, // screenshot
    QuestionCorrect: data.QuestionCorrect, // dataFromReduxSaveData.correctAns === true ? yesSelected === true ? "yes" : "no" : "Not Selected",
    uuid: data.uuid,
  });
};

// to get selected results
// /startQuest/getStartQuestInfo

// to show percent
// getQuestPercent
