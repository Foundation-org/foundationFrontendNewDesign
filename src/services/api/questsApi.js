import { soundcloudUnique } from '../../constants/addMedia';
import { extractPartFromUrl } from '../../utils/embeddedutils';
import api from './Axios';
import { toast } from 'sonner';

// change ans submit
export const updateChangeAnsStartQuest = async (data) => {
  return await api.post('/startQuest/updateChangeAnsStartQuest', {
    questId: data.questId,
    changeAnswerAddedObj: data.answer,
    addedAnswer: data.addedAnswer,
    addedAnswerUuid: data.addedAnswerUuid,
    uuid: data.uuid,
    isAddedAnsSelected: data.isAddedAnsSelected,
  });
};

// start submit button
export const createStartQuest = async (data) => {
  return await api.post('/startQuest/createStartQuest', {
    questForeignKey: data.questId,
    data: data.answer,
    addedAnswer: data.addedAnswer,
    addedAnswerUuid: data.addedAnswerUuid,
    uuid: data.uuid,
    isAddedAnsSelected: data.isAddedAnsSelected,
    isSharedLinkAns: data.isSharedLinkAns,
    postLink: data.postLink,
  });
};

// creation of a quest of all types
export const createInfoQuest = async (data) => {
  try {
    return await api.post('/infoquestions/createInfoQuestQuest', {
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
      moderationRatingCount: data.moderationRatingCount,
      url: data.url,
      description: data.description,
    });
  } catch (error) {
    toast.error(error.response.data.message.split(':')[1]);
  }
};

// change
// to get selected results
export const getStartQuestInfo = async (data) => {
  return await api.post('/startQuest/getStartQuestInfo', {
    questForeignKey: data.questForeignKey,
    uuid: data.uuid,
  });
};

// result
// to get Start quest percent
export const getStartQuestPercent = async (data) => {
  return await api.post('/startQuest/getStartQuestPercent', {
    questForeignKey: data.questForeignKey,
    uuid: data.uuid,
  });
};

// to get Ranked quest percent
export const getRankedQuestPercent = async (data) => {
  return await api.post('/startQuest/getRankedQuestPercent', {
    questForeignKey: data.questForeignKey,
    // uuid: data.uuid,
  });
};

// Question Validation by GPT-Server
export const getTopicOfValidatedQuestion = async ({ validatedQuestion }) => {
  try {
    var response = await api.get(`/ai-validation/3?userMessage=${validatedQuestion}`);
    if (response.data.status === 'VIOLATION') {
      await updateViolationCounterAPI();
      return { questTopic: null, errorMessage: 'VIOLATION' };
    }
    if (response.data.status === 'FAIL') {
      return { questTopic: null, errorMessage: 'FAIL' };
    }
    if (response.data.status === 'ERROR') {
      return { questTopic: null, errorMessage: 'ERROR' };
    }
    return { questTopic: response.data.message, errorMessage: null };
  } catch (error) {
    if (error.response.data.status === 'VIOLATION') {
      await updateViolationCounterAPI();
    }
    return { validatedQuestion: null, errorMessage: 'ERROR' };
  }
};

// Question Validation by GPT-Server
export const questionValidation = async ({ question, queryType }) => {
  try {
    // To check uniqueness of the question
    const constraintResponses = await checkUniqueQuestion(question);
    if (!constraintResponses.data.isUnique) {
      return { validatedQuestion: question, errorMessage: 'DUPLICATION' };
    }
    var response = await api.get(`/ai-validation/1?userMessage=${question}&queryType=${queryType}`);
    if (response.data.status === 'VIOLATION') {
      await updateViolationCounterAPI();
      return { validatedQuestion: null, errorMessage: 'VIOLATION' };
    }
    if (response.data.status === 'FAIL') {
      return { validatedQuestion: null, errorMessage: 'FAIL' };
    }
    if (response.data.status === 'ERROR') {
      return { validatedQuestion: null, errorMessage: 'ERROR' };
    }
    // To check uniqueness of the question
    const constraintResponse = await checkUniqueQuestion(response.data.message);
    if (!constraintResponse.data.isUnique) {
      return { validatedQuestion: response.data.message, errorMessage: 'DUPLICATION' };
    }
    return { validatedQuestion: response.data.message, errorMessage: null };
  } catch (error) {
    if (error.response.data.status === 'VIOLATION') {
      await updateViolationCounterAPI();
    }
    return { validatedQuestion: null, errorMessage: 'ERROR' };
  }
};

export const answerValidation = async ({ answer }) => {
  try {
    const response = await api.get(`/ai-validation/2?userMessage=${answer}`);
    if (response.data.status === 'VIOLATION') {
      await updateViolationCounterAPI();
      return { validatedAnswer: null, errorMessage: 'VIOLATION' };
    }
    if (response.data.status === 'FAIL') {
      return { validatedAnswer: null, errorMessage: 'FAIL' };
    }
    if (response.data.status === 'ERROR') {
      return { validatedAnswer: null, errorMessage: 'ERROR' };
    }
    return { validatedAnswer: response.data.message };
  } catch (error) {
    if (error.response.data.status === 'VIOLATION') {
      await updateViolationCounterAPI();
    }
    return { validatedAnswer: null, errorMessage: 'ERROR' };
  }
};

async function checkVideoAgeRestriction(videoId) {
  const apiKey = import.meta.env.VITE_GG_API_KEY;
  const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=contentDetails`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function getFullSoundcloudUrlFromShortUrl(url) {
  try {
    const response = await api.get(`infoquestions/getFullSoundcloudUrlFromShortUrl?shortUrl=${url}`);

    return response.data.finalUrl;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export const urlDuplicateCheck = async ({ id, url }) => {
  let linkId = id;
  try {
    let apiResp;
    if (url.includes(soundcloudUnique)) {
      apiResp = await getFullSoundcloudUrlFromShortUrl(url);

      if (apiResp) {
        const soundcloudId = extractPartFromUrl(apiResp);
        linkId = soundcloudId;
      }
    }

    const constraintResponses = await api.get(`/infoquestions/checkMediaDuplicateUrl/${linkId}`);

    let response = await checkVideoAgeRestriction(linkId);

    const contentRating = response?.items[0]?.contentDetails?.contentRating?.ytRating;
    const isAdultContent = contentRating === 'ytAgeRestricted';

    if (isAdultContent === false) {
      if (apiResp) {
        return { message: constraintResponses.data.message, errorMessage: null, url: apiResp };
      }
      return { message: constraintResponses.data.message, errorMessage: null, url: url };
    } else {
      return { message: 'It is an adult video', errorMessage: 'ADULT' };
    }
  } catch (error) {
    console.log({ error });
    if (error.response.data.duplicate === true) {
      return { message: error.response.data.error, errorMessage: 'DUPLICATION' };
    } else {
      toast.error(error.response.data.error);
      return;
    }
  }
};

export const pictureUrlCheck = async ({ url }) => {
  // console.log('url', url);
  // let linkId = id;
  try {
    // let apiResp;
    // if (url.includes(soundcloudUnique)) {
    //   apiResp = await getFullSoundcloudUrlFromShortUrl(url);

    //   if (apiResp) {
    //     const soundcloudId = extractPartFromUrl(apiResp);
    //     linkId = soundcloudId;
    //   }
    // }

    const constraintResponses = await api.get(`/infoquestions/getFlickerUrl?url=${url}`);

    let urlId = constraintResponses.data.imageUrl.split('/')[4];
    let beforeDot = urlId.split('.')[0];

    const checkDuplicate = await api.get(`/infoquestions/checkMediaDuplicateUrl/${beforeDot}`);

    if (checkDuplicate.status === 200 && constraintResponses) {
      return { message: 'Success', errorMessage: null, url: constraintResponses?.data.imageUrl };
    }

    // let response = await checkVideoAgeRestriction(linkId);

    // const contentRating = response?.items[0]?.contentDetails?.contentRating?.ytRating;
    // const isAdultContent = contentRating === 'ytAgeRestricted';

    // if (isAdultContent === false) {
    //   if (apiResp) {
    //     return { message: constraintResponses.data.message, errorMessage: null, url: apiResp };
    //   }
    //   return { message: constraintResponses.data.message, errorMessage: null, url: url };
    // } else {
    //   return { message: 'It is an adult video', errorMessage: 'ADULT' };
    // }
  } catch (error) {
    console.log({ error });
    if (error.response.data.duplicate === true) {
      return { message: error.response.data.error, errorMessage: 'DUPLICATION' };
    }
    if (error.response.status === 500) {
      return { message: error.response.data.message, errorMessage: 'ERROR' };
    }
  }
};

export const moderationRating = async ({ validatedQuestion }) => {
  try {
    const response = await api.post(`/ai-validation/moderator?userMessage=${validatedQuestion}`);
    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const checkAnswerExistCreateQuest = ({ answersArray, answer, index, startQuest }) => {
  return answersArray.some((item, i) =>
    startQuest
      ? item.label.toLowerCase() === answer.toLowerCase() && i !== index
      : item?.question?.toLowerCase() === answer.toLowerCase() && i !== index,
  );
};

export const checkAnswerExist = ({ answersArray, answer, index, startQuest }) => {
  return answersArray.some(
    (item, i) =>
      i !== index &&
      ((startQuest && item.label.toLowerCase() === answer.toLowerCase()) ||
        (!startQuest && item?.question?.toLowerCase() === answer.toLowerCase())),
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
  const response = await api.post('/startQuest/updateViolationCounter');
  return response.data;
};
export default updateViolationCounterAPI;

// HIDE POST API CALLS
export const hideQuest = async (data) => {
  return await api.post('/userQuestSetting/create', {
    uuid: data.uuid,
    questForeignKey: data.questForeignKey,
    hidden: data.hidden,
    hiddenMessage: data.hiddenMessage,
    Question: data.Question,
  });
};

export const updateHiddenQuest = async (data) => {
  return await api.post('/userQuestSetting/update', {
    uuid: data.uuid,
    questForeignKey: data.questForeignKey,
    hidden: data.hidden,
    hiddenMessage: data.hiddenMessage,
  });
};

// HIDE POST API CALLS
export const createUpdateUniqueLink = async (data) => {
  return await api.post('/userQuestSetting/link', {
    uuid: data.uuid,
    questForeignKey: data.questForeignKey,
    uniqueLink: true,
    Question: data.Question,
    linkStatus: 'Enable',
    isGenerateLink: data.isGenerateLink,
    sharedTime: new Date(),
  });
};

export const questImpression = async (data) => {
  return await api.post(`/userQuestImpression/${data}`);
};

export const suppressPost = async (data) => {
  return await api.post(`infoQuestions/supressPost/${data}`);
};
// UPDATE SHAREDLINK STATUS
export const updateSharedLinkStatus = async ({ link, data }) => {
  console.log('api', link, data);
  return await api.post(`/linkStatus/${link}`, {
    status: data,
  });
};
