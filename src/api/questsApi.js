import api from "./Axios";

// change ans submit
export const updateChangeAnsStartQuest = async (data) => {
  return await api.post("/startQuest/updateChangeAnsStartQuest", {
    questId: data.questId,
    changeAnswerAddedObj: data.answer,
    addedAnswer: data.addedAnswer || "",
    uuid: data.uuid,
  });
};

// start submit button
export const createStartQuest = async (data) => {
  return await api.post("/startQuest/createStartQuest", {
    questForeignKey: data.questId,
    data: data.answer,
    addedAnswer: data.addedAnswer,
    uuid: data.uuid,
  });
};

// creation of a quest of all types
export const createInfoQuest = async (data) => {
  return await api.post("/infoquestions/createInfoQuestQuest", {
    Question: data.Question,
    whichTypeQuestion: data.whichTypeQuestion,
    QuestionCorrect: data.QuestionCorrect,
    QuestAnswers: data.QuestAnswers,
    usersAddTheirAns: data.usersAddTheirAns,
    usersChangeTheirAns: data.usersChangeTheirAns,
    userCanSelectMultiple: data.userCanSelectMultiple,
    QuestAnswersSelected: data.QuestAnswersSelected,
    uuid: data.uuid,
  });
};

// change
// to get selected results
export const getStartQuestInfo = async (data) => {
  return await api.post("/startQuest/getStartQuestInfo", {
    questForeignKey: data.questForeignKey,
    uuid: data.uuid,
  });
};

// result
// to get Start quest percent
export const getStartQuestPercent = async (data) => {
  return await api.post("/startQuest/getStartQuestPercent", {
    questForeignKey: data.questForeignKey,
    uuid: data.uuid,
  });
};

// to get Ranked quest percent
export const getRankedQuestPercent = async (data) => {
  return await api.post("/startQuest/getRankedQuestPercent", {
    questForeignKey: data.questForeignKey,
    // uuid: data.uuid,
  });
};

// Question Validation by GPT-Server
export const questionValidation = async({question, queryType}) => {
  try {
      var response = await api.get(`/ai-validation/1?userMessage=${question}&queryType=${queryType}`)
      if(response.data.status === "VIOLATION") {return { validatedQuestion: null, errorMessage: "VIOLATION" }}
      if(response.data.status === "FAIL") {return { validatedQuestion: null, errorMessage: "FAIL" }}
      if(response.data.status === "ERROR") {return { validatedQuestion: null, errorMessage: "ERROR" }}
      return { validatedQuestion: response.data.message, errorMessage: null}
  } catch (error) {
      return { validatedQuestion: null, errorMessage: "ERROR" }
  }
}

// To check uniqueness of the question
export const checkUniqueQuestion = async(question) => {
  return await api.get(`/infoquestions/constraintForUniqueQuestion`, {
    params: { question },
  });
}