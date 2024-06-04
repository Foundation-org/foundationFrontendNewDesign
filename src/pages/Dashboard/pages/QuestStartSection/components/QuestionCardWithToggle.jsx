import { toast } from 'sonner';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { validateInterval } from '../../../../../utils';
import { questSelectionInitial } from '../../../../../constants/quests';
import { resetQuests } from '../../../../../features/quest/questsSlice';
import { getQuestionTitle } from '../../../../../utils/questionCard/SingleQuestCard';
// import { getQuestByUniqueShareLink } from '../../../../../services/api/homepageApis';

import Result from './Result';
import StartTest from './StartTest';
import ButtonGroup from '../../../../../components/question-card/ButtonGroup';
import QuestInfoText from '../../../../../components/question-card/QuestInfoText';
import Spacing from '../../../../../components/question-card/Spacing.jsx';
import QuestCardLayout from '../../../../../components/question-card/QuestCardLayout';

import * as questServices from '../../../../../services/api/questsApi';
import * as questUtilsActions from '../../../../../features/quest/utilsSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../../../../components/ui/Button.jsx';
import { submitListResponse, updateCategoryParticipentsCount } from '../../../../../services/api/listsApi.js';

const QuestionCardWithToggle = (props) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const getQuestUtilsState = useSelector(questUtilsActions.getQuestUtils);

  const { innerRef, questStartData, postProperties, SharedLinkButton } = props;
  const { isSingleQuest, postLink, categoryId } = props;

  let questData;

  if (location.pathname.startsWith('/p/')) {
    questData = 0;
  } else {
    questData = questStartData.QuestAnswers?.some((answer) => {
      return answer.uuid && answer.uuid === persistedUserInfo?.uuid;
    })
      ? 1
      : 0;
  }

  const [howManyTimesAnsChanged, setHowManyTimesAnsChanged] = useState(0);
  const [addOptionField, setAddOptionField] = useState(questData);
  const [openResults, setOpenResults] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [startTest, setStartTest] = useState('');
  const [viewResult, setViewResult] = useState('');
  const [questSelection, setQuestSelection] = useState(questSelectionInitial);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();
  const reset = {
    name: 'Ok',
    color: 'text-[#389CE3]',
    tooltipName: 'Please write something...',
    tooltipStyle: 'tooltip-info',
  };
  const [checkOptionStatus, setCheckOptionStatus] = useState(reset);

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

  const [answersSelection, setAnswerSelection] = useState([]);
  const [rankedAnswers, setRankedAnswers] = useState([]);

  useEffect(() => {
    setAnswerSelection(
      questStartData.QuestAnswers?.map((answer) => ({
        label: answer.question,
        check: false,
        contend: false,
        uuid: answer.uuid,
      })),
    );
    if (questData === 0) {
      setAddOptionField(0);
    }
  }, [questStartData]);

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
        tempSize += index === 0 ? (limit ? 49 : 24) : limit ? 59 : 29.7;
      });

      // Adjust tempSize if the number of elements is greater than 6
      const maxElements = 6;
      if (questStartData.QuestAnswers.length > maxElements) {
        tempSize = maxElements * (limit ? 59 : 29.7);
      }

      if (limit) {
        return tempSize > 336 ? 336 : tempSize;
      } else {
        return tempSize > 187 ? 187 : tempSize;
      }
    }
  }, [questStartData.QuestAnswers, windowWidth]);

  useEffect(() => {
    if (questStartData.url?.length > 0 && !questStartData.url[0]?.includes('flickr') && questStartData.url[0] !== '') {
      dispatch(questUtilsActions.addPlayerId(questStartData._id));
    }

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
    setStartTest(testId);
  };

  const handleViewResults = (testId) => {
    setStartTest('');
    setViewResult(testId);
  };

  // const handleChange = () => {
  //   setOpenResults(false);
  //   // const data = {
  //   //   questForeignKey: questStartData._id,
  //   //   uuid: persistedUserInfo.uuid,
  //   // };

  //   handleStartTest(questStartData._id);
  // };

  const handleAddOption = () => {
    const newOption = {
      label: '',
      check: false,
      contend: false,
      addedOptionByUser: true,
      edit: true,
      delete: true,
      uuid: persistedUserInfo.uuid,
    };

    setAnswerSelection([...answersSelection, newOption]);

    setAddOptionField(1);
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

  // const questByUniqueShareLink = async () => {
  //   const getQuest = await getQuestByUniqueShareLink(location.pathname.split('/').slice(-1)[0]);
  //   props.setSingleQuestResp(getQuest.response.data.data[0]);
  // };

  const { mutateAsync: startGuestListQuest } = useMutation({
    mutationFn: submitListResponse,
    onSuccess: (resp) => {
      if (resp.status === 200) {
        queryClient.setQueriesData(['postsByCategory'], (oldData) => {
          if (!oldData || !oldData.post) {
            return oldData;
          }

          return {
            ...oldData,
            post: oldData.post.map((item) =>
              item._id === resp.data.category.post._id ? resp.data.category.post : item,
            ),
          };
        });

        setLoading(false);

        if (location.pathname.startsWith('/l/')) {
          updateCategoryParticipentsCount({ categoryLink: location.pathname.split('/')[2] });
        }
      }
    },
    onError: (err) => {
      console.log({ err });
      toast.error(err.response.data.message.split(':')[1]);
      setLoading(false);
    },
  });

  const { mutateAsync: startQuest } = useMutation({
    mutationFn: questServices.createStartQuest,
    onSuccess: (resp) => {
      queryClient.setQueriesData(['posts'], (oldData) => ({
        ...oldData,
        pages: oldData?.pages?.map((page) =>
          page.map((item) => (item._id === resp.data.data._id ? resp.data.data : item)),
        ),
      }));

      if (resp.data.message === 'Start Quest Created Successfully') {
        setLoading(false);
        queryClient.invalidateQueries(['userInfo', 'postsByCategory']);

        queryClient.setQueryData(['questByShareLink'], (oldData) => ({
          ...resp.data.data,
        }));

        // queryClient.setQueryData(['postsByCategory'], (oldData) => {
        //   console.log('old', oldData);
        // });

        // postsByCategory;
      }

      // if (persistedUserInfo.role === 'guest') {
      //   questByUniqueShareLink();
      // }
      if (location.pathname.startsWith('/quest/')) {
        props.setSubmitResponse(resp.data.data);
      }
      if (!location.pathname.startsWith('/p/' || !location.pathname.startsWith('/l'))) {
        handleViewResults(questStartData._id);
      }

      if (location.pathname.startsWith('/l/')) {
        updateCategoryParticipentsCount({ categoryLink: location.pathname.split('/')[2] });
      }
    },
    onError: (err) => {
      console.log(err);
      toast.error(err.response.data.message.split(':')[1]);
      setLoading(false);
    },
  });

  const { mutateAsync: changeAnswer } = useMutation({
    mutationFn: questServices.updateChangeAnsStartQuest,
    onSuccess: (resp) => {
      queryClient.invalidateQueries(['userInfo']);
      if (resp.data.message === 'Answer has not changed') {
        setLoading(false);
        toast.warning('You have selected the same option as last time. Your option was not changed.');
      }
      if (resp.data.message === 'You can change your answer once every 1 hour') {
        toast.warning('You can change your option once every 1 hour.');
        setLoading(false);
      }
      if (resp.data.message === 'Start Quest Updated Successfully') {
        setLoading(false);
        handleViewResults(questStartData._id);

        if (location.pathname.startsWith('/quest/')) {
          props.setSubmitResponse(resp.data.data);
        }

        queryClient.setQueriesData(['posts'], (oldData) => ({
          ...oldData,
          pages: oldData?.pages?.map((page) =>
            page.map((item) => (item._id === resp.data.data._id ? resp.data.data : item)),
          ),
        }));
      }
    },
    onError: (err) => {
      toast.error(err.response.data.message.split(':')[1]);
      setLoading(false);
    },
  });

  const handleSubmit = () => {
    if (
      persistedUserInfo.role === 'guest' &&
      !location.pathname.startsWith('/p') &&
      !location.pathname.startsWith('/l')
    ) {
      toast.warning(
        <p>
          Please{' '}
          <span className="cursor-pointer text-[#389CE3] underline" onClick={() => navigate('/guest-signup')}>
            Create an Account
          </span>{' '}
          to unlock this feature
        </p>,
      );
      return;
    }

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
        ans.selected =
          questSelection['yes/no'].yes.check === true
            ? 'Yes'
            : (ans.selected = questSelection['yes/no'].no.check === true ? 'No' : '');
      }

      if (questStartData.whichTypeQuestion === 'agree/disagree') {
        ans.selected =
          questSelection['agree/disagree'].agree.check === true
            ? 'Agree'
            : (ans.selected = questSelection['agree/disagree'].disagree.check === true ? 'Disagree' : '');
      }

      if (questStartData.whichTypeQuestion === 'like/dislike') {
        ans.selected =
          questSelection['like/dislike'].like.check === true
            ? 'Like'
            : (ans.selected = questSelection['like/dislike'].dislike.check === true ? 'Dislike' : '');
      }

      const params = {
        questId: questStartData._id,
        answer: ans,
        addedAnswer: '',
        uuid: persistedUserInfo?.uuid || localStorage.getItem('uuid'),
        ...(isSingleQuest && { isSharedLinkAns: true, postLink }),
      };

      if (!params.answer.selected) {
        toast.warning("Oops! You haven't selected anything yet.");
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
        if (location.pathname.startsWith('/l/')) {
          startGuestListQuest({ params, categoryId, categoryLink: location.pathname.split('/')[2] });
        } else {
          startQuest(params);
        }
      }
    } else if (
      questStartData.whichTypeQuestion === 'multiple choise' ||
      questStartData.whichTypeQuestion === 'open choice'
    ) {
      let answerSelected = [];
      let answerContended = [];
      let addedAnswerValue = '';
      let addedAnswerUuidValue = '';
      let isAddedAnsSelected = '';

      for (let i = 0; i < answersSelection.length; i++) {
        if (answersSelection[i].check) {
          if (answersSelection[i].addedOptionByUser && getQuestUtilsState.addOptionLimit === 1) {
            answerSelected.push({
              question: answersSelection[i].label,
              addedAnswerByUser: true,
              uuid: answersSelection[i].uuid,
            });
            addedAnswerValue = answersSelection[i].label;
            addedAnswerUuidValue = answersSelection[i].uuid;
            isAddedAnsSelected = true;
          } else {
            answerSelected.push({ question: answersSelection[i].label });
          }
        } else if (
          answersSelection[i].check === false &&
          answersSelection[i].addedOptionByUser === true &&
          getQuestUtilsState.addOptionLimit === 1
        ) {
          answerSelected.push({
            question: answersSelection[i].label,
            addedAnswerByUser: true,
            uuid: answersSelection[i].uuid,
          });
          addedAnswerValue = answersSelection[i].label;
          addedAnswerUuidValue = answersSelection[i].uuid;
          isAddedAnsSelected = false;
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
        const timeInterval = validateInterval(questStartData.usersChangeTheirAns);
        if (howManyTimesAnsChanged > 1 && currentDate - new Date(questStartData.lastInteractedAt) < timeInterval) {
          toast.error(`You can change your selection again in ${questStartData.usersChangeTheirAns}`);
          setLoading(false);
        } else {
          const params = {
            questId: questStartData._id,
            answer: dataToSend,
            addedAnswer: addedAnswerValue,
            addedAnswerUuid: addedAnswerUuidValue,
            uuid: persistedUserInfo?.uuid || localStorage.getItem('uuid'),
            isAddedAnsSelected: isAddedAnsSelected,
          };

          const isEmptyQuestion = params.answer.selected.some((item) => item.question.trim() === '');

          if (isEmptyQuestion) {
            toast.error('You cannot leave the added option blank');
            setLoading(false);
            return;
          }

          let length;
          if (isAddedAnsSelected === true || isAddedAnsSelected === '') {
            length = params.answer.selected.length;
          } else {
            length = params.answer.selected.length - 1;
          }

          if (length !== 0) {
            changeAnswer(params); // Change Answer API Call

            const updatedArray = answersSelection.map((item, index) => {
              if (index === answersSelection.length - 1) {
                return {
                  ...item,
                  edit: false,
                  delete: false,
                };
              }
              return item;
            });

            setAnswerSelection(updatedArray);
          } else {
            toast.warning("Oops! You haven't selected anything yet.");
            setLoading(false);
          }
        }
      } else {
        const params = {
          questId: questStartData._id,
          answer: dataToSend,
          addedAnswer: addedAnswerValue,
          addedAnswerUuid: addedAnswerUuidValue,
          uuid: persistedUserInfo?.uuid || localStorage.getItem('uuid'),
          ...(isSingleQuest && { isSharedLinkAns: true, postLink }),
          isAddedAnsSelected: isAddedAnsSelected,
        };

        const isEmptyQuestion = params.answer.selected.some((item) => item.question.trim() === '');

        if (isEmptyQuestion) {
          toast.error('You cannot leave the added option blank');
          setLoading(false);
          return;
        }

        let length;
        if (isAddedAnsSelected === true || isAddedAnsSelected === '') {
          length = params.answer.selected.length;
        } else {
          length = params.answer.selected.length - 1;
        }

        if (length !== 0) {
          if (location.pathname.startsWith('/l/')) {
            startGuestListQuest({ params, categoryId, categoryLink: location.pathname.split('/')[2] });
          } else {
            startQuest(params);
          } // Start Quest API CALL

          const updatedArray = answersSelection.map((item, index) => {
            if (index === answersSelection.length - 1) {
              return {
                ...item,
                edit: false,
                delete: false,
              };
            }
            return item;
          });

          setAnswerSelection(updatedArray);
        } else {
          toast.warning("Oops! You haven't selected anything yet.");
          setLoading(false);
        }
      }
    } else if (questStartData.whichTypeQuestion === 'ranked choise') {
      let addedAnswerValue = '';
      let addedAnswerUuidValue = '';
      let answerSelected = [];
      let answerContended = [];
      let isAddedAnsSelected = '';

      for (let i = 0; i < rankedAnswers.length; i++) {
        if (rankedAnswers[i].addedOptionByUser && getQuestUtilsState.addOptionLimit === 1) {
          // If user Add his own option
          answerSelected.push({
            question: rankedAnswers[i].label,
            addedAnswerByUser: true,
            uuid: rankedAnswers[i].uuid,
          });
          addedAnswerValue = rankedAnswers[i].label;
          addedAnswerUuidValue = rankedAnswers[i].uuid;
          isAddedAnsSelected = true;
        } else {
          answerSelected.push({ question: rankedAnswers[i].label });
        }

        if (rankedAnswers[i].contend) {
          answerContended.push({ question: rankedAnswers[i].label });
        }
      }

      let dataToSend = {
        selected: answerSelected,
        contended: answerContended,
        created: new Date(),
      };
      const currentDate = new Date();

      if (questStartData.startStatus === 'change answer') {
        const timeInterval = validateInterval(questStartData.usersChangeTheirAns);
        // Check if enough time has passed
        if (howManyTimesAnsChanged > 1 && currentDate - new Date(questStartData.lastInteractedAt) < timeInterval) {
          // Alert the user if the time condition is not met
          toast.error(`You can change your selection again in ${questStartData.usersChangeTheirAns}`);
          setLoading(false);
        } else {
          const params = {
            questId: questStartData._id,
            answer: dataToSend,
            addedAnswer: addedAnswerValue,
            addedAnswerUuid: addedAnswerUuidValue,
            uuid: persistedUserInfo?.uuid || localStorage.getItem('uuid'),
            isAddedAnsSelected: isAddedAnsSelected,
          };
          const isEmptyQuestion = params.answer.selected.some((item) => item.question.trim() === '');

          if (isEmptyQuestion) {
            toast.error('You cannot leave the added option blank');
            setLoading(false);
            return;
          }
          changeAnswer(params);

          const updatedArray = rankedAnswers.map((item, index) => {
            if (item?.addedOptionByUser === true) {
              return {
                ...item,
                edit: false,
                delete: false,
              };
            }
            return item;
          });

          setRankedAnswers(updatedArray);
        }
      } else {
        const params = {
          questId: questStartData._id,
          answer: dataToSend,
          addedAnswer: addedAnswerValue,
          addedAnswerUuid: addedAnswerUuidValue,
          uuid: persistedUserInfo?.uuid || localStorage.getItem('uuid'),
          ...(isSingleQuest && { isSharedLinkAns: true, postLink }),
          isAddedAnsSelected: isAddedAnsSelected,
        };

        const isEmptyQuestion = params.answer.selected.some((item) => item.question.trim() === '');

        if (isEmptyQuestion) {
          toast.error('You cannot leave the added option blank');
          setLoading(false);
          return;
        }
        if (location.pathname.startsWith('/l/')) {
          startGuestListQuest({ params, categoryId, categoryLink: location.pathname.split('/')[2] });
        } else {
          startQuest(params);
        }

        const updatedArray = rankedAnswers.map((item, index) => {
          if (item?.addedOptionByUser === true) {
            return {
              ...item,
              edit: false,
              delete: false,
            };
          }
          return item;
        });

        setRankedAnswers(updatedArray);
      }
    }
  };

  useEffect(() => {
    if (SharedLinkButton === 'shared-links-results-button') {
      setOpenResults(true);
      handleViewResults(questStartData._id);
    } else {
      if (questStartData.startStatus === '') {
        dispatch(resetQuests());
        setOpenResults(false);
        handleStartTest(questStartData._id);
      }
      if (questStartData.startStatus === 'change answer') {
        // if (!guestResult) {
        setOpenResults(false);
        handleViewResults(questStartData._id);
        // } else {
        //   navigate('/shared-links/result', {
        //     state: { questId: questStartData._id, link: location.pathname.split('/').pop() },
        //   });
        // }
      }
      if (questStartData.startStatus === 'completed') {
        setOpenResults(true);
        handleViewResults(questStartData._id);
      }
    }
  }, [questStartData]);

  // const updateAnswersSelectionForRanked = (prevAnswers, actionPayload) => {
  //   const { option, label } = actionPayload;

  //   const updatedAnswers = prevAnswers.map((answer) => {
  //     // Check if the label matches the question
  //     if (label.some((item) => item.question === answer.label)) {
  //       return { ...answer, check: true };
  //       return answer;
  //     }
  //   });

  //   return updatedAnswers;
  // };

  // const handleRankedChoice = (option, label) => {
  //   const actionPayload = {
  //     option,
  //     label,
  //   };

  //   setAnswerSelection((prevAnswers) => updateAnswersSelectionForRanked(prevAnswers, actionPayload));
  // };

  const renderQuestContent = () => {
    if (viewResult !== questStartData._id && openResults !== true) {
      return (
        <>
          <Spacing questStartData={questStartData} show={true} />
          <StartTest
            questStartData={questStartData}
            handleToggleCheck={handleToggleCheck}
            answersSelection={answersSelection}
            setAnswerSelection={setAnswerSelection}
            rankedAnswers={rankedAnswers}
            setRankedAnswers={setRankedAnswers}
            loadingDetail={loadingDetail}
            setAddOptionField={setAddOptionField}
            questSelection={questSelection}
            cardSize={cardSize}
            checkOptionStatus={checkOptionStatus}
            setCheckOptionStatus={setCheckOptionStatus}
            postProperties={postProperties}
          />
          <QuestInfoText questStartData={questStartData} show={true} />
        </>
      );
    } else {
      return (
        <>
          <Spacing questStartData={questStartData} show={true} />
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
            postProperties={postProperties}
          />
          <QuestInfoText questStartData={questStartData} show={true} />
        </>
      );
    }
  };

  return (
    <div ref={innerRef} id={questStartData._id === getQuestUtilsState.playerPlayingId ? 'playing-card' : ''}>
      <QuestCardLayout
        questStartData={questStartData}
        playing={props.playing}
        postProperties={postProperties}
        questType={props.questType}
      >
        {renderQuestContent()}
        {props.questType !== 'feedback' ? (
          <ButtonGroup
            questStartData={questStartData}
            handleStartTest={handleStartTest}
            viewResult={viewResult}
            handleViewResults={handleViewResults}
            setHowManyTimesAnsChanged={setHowManyTimesAnsChanged}
            handleToggleCheck={handleToggleCheck}
            setRankedAnswers={setRankedAnswers}
            answersSelection={answersSelection}
            setAnswerSelection={setAnswerSelection}
            handleOpen={handleAddOption}
            title={getQuestionTitle(questStartData.whichTypeQuestion)}
            handleSubmit={handleSubmit}
            loading={loading}
            startTest={startTest}
            addOptionField={addOptionField}
            setAddOptionField={setAddOptionField}
            checkOptionStatus={checkOptionStatus}
            postProperties={postProperties}
            SharedLinkButton={SharedLinkButton}
          />
        ) : (
          <div className="mr-[14.4px] flex justify-end tablet:mr-[3.44rem]">
            <Button variant="cancel" onClick={() => navigate('/dashboard/profile/feedback')}>
              Go Back
            </Button>
          </div>
        )}
      </QuestCardLayout>
    </div>
  );
};

export default QuestionCardWithToggle;
