import { toast } from 'sonner';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { validateInterval } from '../../../../../utils';
import { userInfo } from '../../../../../services/api/userAuth';
import { addUser } from '../../../../../features/auth/authSlice';
import { questSelectionInitial } from '../../../../../constants/quests';
import { resetQuests } from '../../../../../features/quest/questsSlice';
import { getQuestionTitle } from '../../../../../utils/questionCard/SingleQuestCard';

import Result from './Result';
import StartTest from './StartTest';
import ButtonGroup from '../../../../../components/question-card/ButtonGroup';
import QuestInfoText from '../../../../../components/question-card/QuestInfoText';
import QuestCardLayout from '../../../../../components/question-card/QuestCardLayout';
import ConditionalTextFullScreen from '../../../../../components/question-card/ConditionalTextFullScreen';

import * as questServices from '../../../../../services/api/questsApi';
import * as questUtilsActions from '../../../../../features/quest/utilsSlice';

const QuestionCardWithToggle = (props) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const { questStartData, isBookmarked } = props;

  const [howManyTimesAnsChanged, setHowManyTimesAnsChanged] = useState(0);
  const [addOptionField, setAddOptionField] = useState(0);
  const [addOptionLimit, setAddOptionLimit] = useState(0);
  const [openResults, setOpenResults] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [startTest, setStartTest] = useState('');
  const [viewResult, setViewResult] = useState('');
  const [questSelection, setQuestSelection] = useState(questSelectionInitial);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleQuestSelection = (actionPayload) => {
    setQuestSelection((prevState) => {
      const newState = { ...prevState, id: actionPayload.id };

      if (actionPayload.label === 'yes/no') {
        newState['yes/no'] = {
          ...prevState['yes/no'],
          yes: { check: actionPayload.option === 'Yes' ? true : false },
          no: { check: actionPayload.option === 'No' ? true : false },
        };
      }

      if (actionPayload.label === 'agree/disagree') {
        newState['agree/disagree'] = {
          ...prevState['agree/disagree'],
          agree: { check: actionPayload.option === 'Agree' ? true : false },
          disagree: {
            check: actionPayload.option === 'Disagree' ? true : false,
          },
        };
      }

      if (actionPayload.label === 'like/dislike') {
        newState['like/dislike'] = {
          ...prevState['like/dislike'],
          like: { check: actionPayload.option === 'Like' ? true : false },
          dislike: {
            check: actionPayload.option === 'Dislike' ? true : false,
          },
        };
      }

      return newState;
    });
  };

  const [answersSelection, setAnswerSelection] = useState(
    questStartData.QuestAnswers?.map((answer) => ({
      label: answer.question,
      check: false,
      contend: false,
      uuid: answer.uuid,
    })),
  );

  useEffect(() => {
    setAnswerSelection(
      questStartData.QuestAnswers?.map((answer) => ({
        label: answer.question,
        check: false,
        contend: false,
        uuid: answer.uuid,
      })),
    );
  }, [questStartData.QuestAnswers]);

  const [rankedAnswers, setRankedAnswers] = useState(
    answersSelection?.map((item, index) => ({
      id: `unique-${index}`,
      ...item,
    })),
  );

  const cardSize = useMemo(() => {
    const limit = windowWidth >= 744 ? true : false;
    if (
      questStartData.whichTypeQuestion === 'agree/disagree' ||
      questStartData.whichTypeQuestion === 'like/dislike' ||
      questStartData.whichTypeQuestion === 'yes/no'
    ) {
      return limit ? 108 : 49;
    } else {
      let tempSize = 0;
      questStartData.QuestAnswers.forEach((item, index) => {
        // tempSize += index === 0 ? (limit ? 45 : 24) : limit ? 55 : 29.7;
        tempSize += index === 0 ? (limit ? 49 : 24) : limit ? 59 : 29.7;
      });
      if (limit) {
        return tempSize > 336 ? 336 : tempSize;
      } else {
        return tempSize > 187 ? 187 : tempSize;
      }
    }
  }, [questStartData.QuestAnswers, windowWidth]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setRankedAnswers(
      answersSelection?.map((item, index) => ({
        id: `unique-${index}`,
        ...item,
      })),
    );
  }, [answersSelection]);

  const handleStartTest = (testId) => {
    setViewResult('');
    setStartTest((prev) => (prev === testId ? '' : testId));
  };

  const handleViewResults = (testId) => {
    setStartTest('');
    setViewResult((prev) => (prev === testId ? '' : testId));
  };

  const handleChange = () => {
    setOpenResults(false);
    const data = {
      questForeignKey: questStartData._id,
      uuid: persistedUserInfo.uuid,
    };

    handleStartTest(questStartData._id);
  };

  const handleAddOption = () => {
    const newOption = {
      label: '',
      check: true,
      contend: false,
      addedOptionByUser: true,
      edit: true,
      delete: true,
      uuid: persistedUserInfo.uuid,
    };

    setAnswerSelection([...answersSelection, newOption]);

    setAddOptionField(!addOptionField);
    setAddOptionLimit(1);
    dispatch(questUtilsActions.updateaddOptionLimit());
  };

  const handleToggleCheck = (label, option, check, id) => {
    const actionPayload = {
      label,
      option,
      check,
      id,
    };

    handleQuestSelection(actionPayload);
  };

  useEffect(() => {
    if (questStartData.whichTypeQuestion === 'yes/no') {
      handleToggleCheck(
        questStartData.whichTypeQuestion,
        questStartData?.startQuestData
          ? questStartData?.startQuestData?.data[questStartData?.startQuestData?.data?.length - 1]?.selected === 'Yes'
            ? 'Yes'
            : 'No'
          : null,
        questStartData?.startQuestData
          ? questStartData?.startQuestData?.data[questStartData?.startQuestData?.data?.length - 1]?.selected === 'Yes'
            ? true
            : false
          : null,
        questStartData._id,
      );
    }
    if (questStartData.whichTypeQuestion === 'agree/disagree') {
      handleToggleCheck(
        questStartData.whichTypeQuestion,
        questStartData?.startQuestData
          ? questStartData?.startQuestData?.data[questStartData?.startQuestData?.data?.length - 1]?.selected === 'Agree'
            ? 'Agree'
            : 'Disagree'
          : null,
        questStartData?.startQuestData
          ? questStartData?.startQuestData?.data[questStartData?.startQuestData?.data?.length - 1]?.selected === 'Agree'
            ? true
            : true
          : null,
        questStartData._id,
      );
    }
    if (questStartData.whichTypeQuestion === 'like/dislike') {
      handleToggleCheck(
        questStartData.whichTypeQuestion,

        questStartData?.startQuestData
          ? questStartData?.startQuestData?.data[questStartData?.startQuestData?.data?.length - 1]?.selected === 'Like'
            ? 'Like'
            : 'Dislike'
          : null,
        questStartData?.startQuestData
          ? questStartData?.startQuestData?.data[questStartData?.startQuestData?.data?.length - 1]?.selected === 'Like'
            ? true
            : false
          : null,
        questStartData._id,
      );
    }
  }, [questStartData]);

  const { mutateAsync: startQuest } = useMutation({
    mutationFn: questServices.createStartQuest,
    onSuccess: (resp) => {
      if (resp.data.message === 'Start Quest Created Successfully') {
        // toast.success('Successfully Completed');
        setLoading(false);
        queryClient.invalidateQueries('FeedData');
      }
      handleViewResults(questStartData._id);
      userInfo(persistedUserInfo?.uuid).then((resp) => {
        if (resp.status === 200) {
          dispatch(addUser(resp.data));
        }
      });
    },
    onError: (err) => {
      toast.error(err.response.data.message.split(':')[1]);
      setLoading(false);
    },
  });

  const { mutateAsync: changeAnswer } = useMutation({
    mutationFn: questServices.updateChangeAnsStartQuest,
    onSuccess: (resp) => {
      if (resp.data.message === 'Answer has not changed') {
        setLoading(false);
        toast.warning('You have selected the same option as last time. Your option was not changed.');
      }
      if (resp.data.message === 'You can change your answer once every 1 hour') {
        toast.warning('You can change your option once every 1 hour.');
        setLoading(false);
      }
      if (resp.data.message === 'Start Quest Updated Successfully') {
        // toast.success('Successfully Changed');
        setLoading(false);
        handleViewResults(questStartData._id);
      }
      userInfo(persistedUserInfo?.uuid).then((resp) => {
        if (resp.status === 200) {
          dispatch(addUser(resp.data));
        }
      });
      queryClient.invalidateQueries('FeedData');
    },
    onError: (err) => {
      toast.error(err.response.data.message.split(':')[1]);
      setLoading(false);
    },
  });

  const handleSubmit = () => {
    setLoading(true);
    if (
      questStartData.whichTypeQuestion === 'agree/disagree' ||
      questStartData.whichTypeQuestion === 'yes/no' ||
      questStartData.whichTypeQuestion === 'like/dislike'
    ) {
      let ans = {
        created: new Date(),
      };
      if (questStartData.whichTypeQuestion === 'yes/no') {
        ans.selected = questSelection['yes/no'].yes.check === true ? 'Yes' : 'No';
      }

      if (questStartData.whichTypeQuestion === 'agree/disagree') {
        ans.selected = questSelection['agree/disagree'].agree.check === true ? 'Agree' : 'Disagree';
      }

      if (questStartData.whichTypeQuestion === 'like/dislike') {
        ans.selected = questSelection['like/dislike'].like.check === true ? 'Like' : 'Dislike';
      }

      const params = {
        questId: questStartData._id,
        answer: ans,
        addedAnswer: '',
        uuid: persistedUserInfo?.uuid,
      };

      if (!params.answer.selected) {
        toast.warning('You cannot submit without answering');
        setLoading(false);
        return;
      }

      if (questStartData.startStatus === 'change answer') {
        const currentDate = new Date();

        const timeInterval = validateInterval(questStartData.usersChangeTheirAns);
        if (howManyTimesAnsChanged > 1 && currentDate - new Date(questStartData.lastInteractedAt) < timeInterval) {
          toast.error(`You can change your selection again in ${questStartData.usersChangeTheirAns}`);
          setLoading(false);
        } else {
          changeAnswer(params);
        }
      } else {
        startQuest(params);
      }
    } else if (questStartData.whichTypeQuestion === 'multiple choise') {
      let answerSelected = [];
      let answerContended = [];
      let addedAnswerValue = '';
      let addedAnswerUuidValue = '';

      for (let i = 0; i < answersSelection.length; i++) {
        if (answersSelection[i].check) {
          if (answersSelection[i].addedOptionByUser) {
            answerSelected.push({
              question: answersSelection[i].label,
              addedAnswerByUser: true,
              uuid: answersSelection[i].uuid,
            });
            addedAnswerValue = answersSelection[i].label;
            addedAnswerUuidValue = answersSelection[i].uuid;
          } else {
            answerSelected.push({ question: answersSelection[i].label });
          }
        } else if (answersSelection[i].check === false && answersSelection[i].addedOptionByUser === true) {
          addedAnswerValue = answersSelection[i].label;
          addedAnswerUuidValue = answersSelection[i].uuid;
        }

        if (answersSelection[i].contend) {
          answerContended.push({ question: answersSelection[i].label });
        }
      }

      let dataToSend = {
        selected: answerSelected,
        contended: answerContended,
        created: new Date(),
      };
      const currentDate = new Date();

      if (questStartData.startStatus === 'change answer') {
        const timeInterval = validateInterval();
        if (howManyTimesAnsChanged > 1 && currentDate - new Date(questStartData.lastInteractedAt) < timeInterval) {
          toast.error(`You can change your selection again in ${questStartData.usersChangeTheirAns}`);
          setLoading(false);
        } else {
          const params = {
            questId: questStartData._id,
            answer: dataToSend,
            uuid: persistedUserInfo?.uuid,
          };

          if (params.answer.selected.length !== 0) {
            changeAnswer(params);
          } else {
            toast.warning('You cannot submit without answering');
            setLoading(false);
          }
        }
      } else {
        const params = {
          questId: questStartData._id,
          answer: dataToSend,
          addedAnswer: addedAnswerValue,
          addedAnswerUuid: addedAnswerUuidValue,
          uuid: persistedUserInfo?.uuid,
        };

        // && params.answer.contended.length === 0
        if (params.answer.selected.length === 0) {
          toast.warning('You cannot submit without answering');
          setLoading(false);
          return;
        }
        const isEmptyQuestion = params.answer.selected.some((item) => item.question.trim() === '');

        if (isEmptyQuestion) {
          toast.error('You cannot leave the added option blank');
          setLoading(false);
          return;
        }

        if (!isSubmit) setLoading(false);

        startQuest(params);
      }
    } else if (questStartData.whichTypeQuestion === 'ranked choise') {
      let addedAnswerValue = '';
      let addedAnswerUuidValue = '';
      let answerSelected = [];

      for (let i = 0; i < rankedAnswers.length; i++) {
        if (rankedAnswers[i].addedOptionByUser) {
          // If user Add his own option

          answerSelected.push({
            question: rankedAnswers[i].label,
            addedAnswerByUser: true,
          });
          addedAnswerValue = rankedAnswers[i].label;
          addedAnswerUuidValue = answersSelection[i].uuid;
        } else {
          answerSelected.push({ question: rankedAnswers[i].label });
        }
      }

      let dataToSend = {
        selected: answerSelected,
        contended: '',
        created: new Date(),
      };
      const currentDate = new Date();

      if (questStartData.startStatus === 'change answer') {
        const timeInterval = validateInterval(questStartData.usersChangeTheirAns);
        if (howManyTimesAnsChanged > 1 && currentDate - new Date(questStartData.lastInteractedAt) < timeInterval) {
          toast.error(`You can change your selection again in ${questStartData.usersChangeTheirAns}`);
          setLoading(false);
        } else {
          const params = {
            questId: questStartData._id,
            answer: dataToSend,
            uuid: persistedUserInfo?.uuid,
          };

          changeAnswer(params);
        }
      } else {
        const params = {
          questId: questStartData._id,
          answer: dataToSend,
          addedAnswer: addedAnswerValue,
          addedAnswerUuid: addedAnswerUuidValue,
          uuid: persistedUserInfo?.uuid,
        };

        startQuest(params);
      }
    }
    setLoadingDetail(false);
  };

  useEffect(() => {
    if (questStartData.startStatus === '') {
      dispatch(resetQuests());
      setOpenResults(false);
      handleStartTest(questStartData._id);
    }
    if (questStartData.startStatus === 'change answer') {
      setOpenResults(false);
      handleViewResults(questStartData._id);
    }
    if (questStartData.startStatus === 'completed') {
      setOpenResults(true);
      handleViewResults(questStartData._id);
    }
  }, []);

  const updateAnswersSelectionForRanked = (prevAnswers, actionPayload) => {
    const { option, label } = actionPayload;

    const updatedAnswers = prevAnswers.map((answer) => {
      // Check if the label matches the question
      if (label.some((item) => item.question === answer.label)) {
        return { ...answer, check: true }; // Set check to true for matching question
      } else {
        return answer;
      }
    });

    return updatedAnswers;
  };

  const handleRankedChoice = (option, label) => {
    const actionPayload = {
      option,
      label,
    };

    setAnswerSelection((prevAnswers) => updateAnswersSelectionForRanked(prevAnswers, actionPayload));
  };

  const renderQuestContent = () => {
    if (viewResult !== questStartData._id && openResults !== true) {
      return (
        <>
          <QuestInfoText questStartData={questStartData} show={true} questType={questStartData.whichTypeQuestion} />
          <StartTest
            questStartData={questStartData}
            handleToggleCheck={handleToggleCheck}
            answersSelection={answersSelection}
            setAnswerSelection={setAnswerSelection}
            rankedAnswers={rankedAnswers}
            setRankedAnswers={setRankedAnswers}
            setIsSubmit={setIsSubmit}
            loadingDetail={loadingDetail}
            setAddOptionField={setAddOptionField}
            questSelection={questSelection}
            cardSize={cardSize}
          />
          <ConditionalTextFullScreen questStartData={questStartData} show={true} />
        </>
      );
    } else {
      return (
        <>
          <QuestInfoText questStartData={questStartData} show={false} questType={questStartData.whichTypeQuestion} />
          <Result
            questStartData={questStartData}
            id={questStartData._id}
            title={getQuestionTitle(questStartData.whichTypeQuestion)}
            handleToggleCheck={handleToggleCheck}
            answers={questStartData.QuestAnswers}
            btnText={questStartData.startStatus}
            whichTypeQuestion={questStartData.whichTypeQuestion}
            setHowManyTimesAnsChanged={setHowManyTimesAnsChanged}
            answersSelection={answersSelection}
            addOptionField={addOptionField}
            setAnswerSelection={setAnswerSelection}
            rankedAnswers={rankedAnswers}
            setRankedAnswers={setRankedAnswers}
            questSelection={questSelection}
            cardSize={cardSize}
          />
          <ConditionalTextFullScreen questStartData={questStartData} show={true} />
        </>
      );
    }
  };

  return (
    <QuestCardLayout questStartData={questStartData} isBookmarked={isBookmarked} handleStartTest={handleStartTest}>
      {renderQuestContent()}
      <ButtonGroup
        questStartData={questStartData}
        id={questStartData._id}
        btnText={questStartData.startStatus}
        handleStartTest={handleStartTest}
        handleViewResults={handleViewResults}
        setHowManyTimesAnsChanged={setHowManyTimesAnsChanged}
        whichTypeQuestion={questStartData.whichTypeQuestion}
        handleToggleCheck={handleToggleCheck}
        handleRankedChoice={handleRankedChoice}
        rankedAnswers={rankedAnswers}
        setRankedAnswers={setRankedAnswers}
        answersSelection={answersSelection}
        setAnswerSelection={setAnswerSelection}
        startStatus={questStartData.startStatus}
        setLoadingDetail={setLoadingDetail}
        handleOpen={handleAddOption}
        usersAddTheirAns={questStartData.usersAddTheirAns}
        answers={questStartData.QuestAnswers}
        title={getQuestionTitle(questStartData.whichTypeQuestion)}
        viewResult={viewResult}
        handleSubmit={handleSubmit}
        loading={loading}
        startTest={startTest}
        handleChange={handleChange}
        addOptionField={addOptionField}
      />
    </QuestCardLayout>
  );
};

export default QuestionCardWithToggle;
