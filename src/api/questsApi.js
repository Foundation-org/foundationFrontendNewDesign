import api from "./Axios";
import { toast } from "sonner";

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
  try {
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
      QuestTopic: data.QuestTopic,
    });
  } catch (error) {
    toast.error(error.response.data.message.split(":")[1]);
  }
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
export const getTopicOfValidatedQuestion = async ({ validatedQuestion }) => {
  try {
    var response = await api.get(
      `/ai-validation/3?userMessage=${validatedQuestion}`,
    );
    if (response.data.status === "VIOLATION") {
      await updateViolationCounterAPI();
      return { questTopic: null, errorMessage: "VIOLATION" };
    }
    if (response.data.status === "FAIL") {
      return { questTopic: null, errorMessage: "FAIL" };
    }
    if (response.data.status === "ERROR") {
      return { questTopic: null, errorMessage: "ERROR" };
    }
    return { questTopic: response.data.message, errorMessage: null };
  } catch (error) {
    if (error.response.data.status === "VIOLATION") {
      await updateViolationCounterAPI();
    }
    return { validatedQuestion: null, errorMessage: "ERROR" };
  }
};

// Question Validation by GPT-Server
export const questionValidation = async ({ question, queryType }) => {
  try {
    var response = await api.get(
      `/ai-validation/1?userMessage=${question}&queryType=${queryType}`,
    );
    if (response.data.status === "VIOLATION") {
      await updateViolationCounterAPI();
      return { validatedQuestion: null, errorMessage: "VIOLATION" };
    }
    if (response.data.status === "FAIL") {
      return { validatedQuestion: null, errorMessage: "FAIL" };
    }
    if (response.data.status === "ERROR") {
      return { validatedQuestion: null, errorMessage: "ERROR" };
    }
    return { validatedQuestion: response.data.message, errorMessage: null };
  } catch (error) {
    if (error.response.data.status === "VIOLATION") {
      await updateViolationCounterAPI();
    }
    return { validatedQuestion: null, errorMessage: "ERROR" };
  }
};

export const answerValidation = async ({ answer }) => {
  try {
    const response = await api.get(`/ai-validation/2?userMessage=${answer}`);
    if (response.data.status === "VIOLATION") {
      await updateViolationCounterAPI();
      return { validatedAnswer: null, errorMessage: "VIOLATION" };
    }
    if (response.data.status === "FAIL") {
      return { validatedAnswer: null, errorMessage: "FAIL" };
    }
    if (response.data.status === "ERROR") {
      return { validatedAnswer: null, errorMessage: "ERROR" };
    }
    return { validatedAnswer: response.data.message };
  } catch (error) {
    if (error.response.data.status === "VIOLATION") {
      await updateViolationCounterAPI();
    }
    return { validatedAnswer: null, errorMessage: "ERROR" };
  }
};

export const checkAnswerExist = ({ answersArray, answer, index, startQuest }) => {
  return answersArray.some(
    (item, i) =>
    startQuest ? item.label.toLowerCase() === answer.toLowerCase() && i !== index
    : item.question.toLowerCase() === answer.toLowerCase() && i !== index
  );
};

// To check uniqueness of the question
export const checkUniqueQuestion = async (question) => {
  return await api.get(`/infoquestions/constraintForUniqueQuestion`, {
    params: { question },
  });
};

const updateViolationCounterAPI = async () => {
  // Make an API call to update the violation counter
  const response = await api.post("/startQuest/updateViolationCounter", {
    uuid: localStorage.getItem("uId"),
  });
  return response.data;
};
export default updateViolationCounterAPI;
