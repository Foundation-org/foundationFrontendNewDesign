import { toast } from 'sonner';
import { useRef, useState } from 'react';
import { Button } from '../ui/Button';
import { FaSpinner } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { calculateRemainingTime } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { resetQuests } from '../../features/quest/questsSlice';
import { getButtonText } from '../../utils/questionCard/SingleQuestCard';
import * as questUtilsActions from '../../features/quest/utilsSlice';
import * as filterActions from '../../features/sidebar/filtersSlice';
import * as filterBookmarkActions from '../../features/sidebar/bookmarkFilterSlice';
import UnHidePostPopup from '../dialogue-boxes/UnHidePostPopup';
import { getConstantsValues } from '../../features/constants/constantsSlice';
import FeedbackAndVisibility from '../../pages/Dashboard/pages/Profile/pages/feedback-given/component/FeedbackAndVisibility';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { hideQuest, updateHiddenQuest } from '../../services/api/questsApi';
import showToast from '../ui/Toast';

const ButtonGroup = ({
  questStartData,
  handleStartTest,
  viewResult,
  handleViewResults,
  setHowManyTimesAnsChanged,
  handleToggleCheck,
  setRankedAnswers,
  answersSelection,
  setAnswerSelection,
  handleSubmit,
  loading,
  startTest,
  setAddOptionField,
  checkOptionStatus,
  postProperties,
  SharedLinkButton,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const persistedContants = useSelector(getConstantsValues);
  const [modalVisible, setModalVisible] = useState({ state: false, type: '' });
  const feedbackAndVisibilityRef = useRef();
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  let filterState;

  if (location.pathname === '/bookmark') {
    filterState = useSelector(filterBookmarkActions.getFilters);
  } else {
    filterState = useSelector(filterActions.getFilters);
  }

  const openFeedbackAndVisiblePopup = () => {
    if (feedbackAndVisibilityRef.current) {
      feedbackAndVisibilityRef.current.showHidePostOpen();
    }
  };

  const showGuestSignUpToastWarning = () => {
    toast.warning(
      <p>
        Please{' '}
        <span className="cursor-pointer text-[#389CE3] underline" onClick={() => navigate('/guest-signup')}>
          Create an Account
        </span>{' '}
        to unlock this feature
      </p>,
    );
  };

  function updateAnswerSelection(apiResponse, answerSelectionArray, type) {
    const data = apiResponse?.startQuestData.data[apiResponse?.startQuestData.data.length - 1];

    answerSelectionArray.forEach((item, index) => {
      if (data.selected.some((selectedItem) => selectedItem.question === item.label)) {
        answerSelectionArray[index].check = true;
      } else {
        answerSelectionArray[index].check = false;
      }

      if (data.contended.some((contendedItem) => contendedItem.question === item.label)) {
        answerSelectionArray[index].contend = true;
      } else {
        answerSelectionArray[index].contend = false;
      }
    });

    const newOption = {
      label: '',
      check: false,
      contend: false,
      addedOptionByUser: true,
      edit: true,
      delete: true,
      uuid: persistedUserInfo.uuid,
    };

    if (type === 'addOption') {
      setAnswerSelection([...answerSelectionArray, newOption]);

      setAddOptionField(1);
      dispatch(questUtilsActions.updateaddOptionLimit());
    } else {
      setAnswerSelection(answerSelectionArray);
    }
  }

  function updateRankSelection(apiResponse, answerSelectionArray, type) {
    const data = apiResponse?.startQuestData.data[apiResponse?.startQuestData.data.length - 1];

    answerSelectionArray.forEach((item, index) => {
      if (data.contended && data.contended?.some((contendedItem) => contendedItem.question === item.label)) {
        answerSelectionArray[index].contend = true;
      }
    });

    const sortedAnswers = answerSelectionArray.sort((a, b) => {
      if (a.label === '') return 1;
      if (b.label === '') return -1;

      const indexA = data.selected.findIndex((item) => item.question === a.label);
      const indexB = data.selected.findIndex((item) => item.question === b.label);

      return indexA - indexB;
    });

    const newOption = {
      label: '',
      check: false,
      contend: false,
      addedOptionByUser: true,
      edit: true,
      delete: true,
      uuid: persistedUserInfo.uuid,
    };

    if (type === 'addOption') {
      setAnswerSelection([...sortedAnswers, newOption]);
      setRankedAnswers([...sortedAnswers, newOption]);
      setAddOptionField(1);
      dispatch(questUtilsActions.updateaddOptionLimit());
    } else {
      setAnswerSelection(sortedAnswers);
      setRankedAnswers(sortedAnswers);
    }
  }

  const handleRemoveItem = () => {
    const updatedAnswerSelection = answersSelection.filter((item) => !item.addedOptionByUser);
    setAnswerSelection([...updatedAnswerSelection]);
    setAddOptionField(0);
  };

  const handleStartChange = (type) => {
    dispatch(questUtilsActions.resetaddOptionLimit());
    if (questStartData.startStatus === '') {
      dispatch(resetQuests());
      handleStartTest(questStartData._id);
    }
    if (questStartData.startStatus === 'change answer') {
      setHowManyTimesAnsChanged(questStartData?.startQuestData.data.length);
      const data = questStartData?.startQuestData.data[questStartData?.startQuestData.data.length - 1];

      if (
        questStartData.whichTypeQuestion === 'agree/disagree' ||
        questStartData.whichTypeQuestion === 'yes/no' ||
        questStartData.whichTypeQuestion === 'like/dislike'
      ) {
        if (data.selected === 'Agree' || data.selected === 'Yes' || data.selected === 'Like') {
          handleToggleCheck(data.selected, true, false);
        }
        if (data.contended === 'Agree' || data.contended === 'Yes' || data.contended === 'Like') {
          handleToggleCheck(data.contended, false, true);
        }
        if (data.contended === 'Disagree' || data.contended === 'No' || data.contended === 'Dislike') {
          handleToggleCheck(data.contended, false, true);
        }
        if (data.selected === 'Disagree' || data.selected === 'No' || data.selected === 'Dislike') {
          handleToggleCheck(data.selected, true, false);
        }
      }
      if (
        questStartData.whichTypeQuestion === 'multiple choise' ||
        questStartData.whichTypeQuestion === 'open choice'
      ) {
        updateAnswerSelection(questStartData, answersSelection, type);
      }
      if (questStartData.whichTypeQuestion === 'ranked choise') {
        updateRankSelection(questStartData, answersSelection, type);
      }
      handleStartTest(questStartData._id);
    }
    if (questStartData.startStatus === 'completed') {
      handleViewResults(questStartData._id);
    }
  };

  const startHiddenTest = () => {
    dispatch(questUtilsActions.resetaddOptionLimit());
    dispatch(resetQuests());
    handleStartTest(questStartData._id);
  };

  const result = calculateRemainingTime(
    questStartData?.updatedAt,
    questStartData?.startQuestData && questStartData?.startQuestData?.data.length,
    questStartData.usersChangeTheirAns,
  );

  // const showHidePostOpen = (type) => setModalVisible({ state: true, type });
  const showHidePostClose = () => setModalVisible({ state: false, type: '' });

  const showDisableSharedLinkPopup = () => {
    dispatch(questUtilsActions.addDisabledPostId(null)),
      dispatch(
        questUtilsActions.updateDialogueBox({
          type: 'Disable',
          status: true,
          link: questStartData.userQuestSetting.link,
          id: questStartData._id,
        }),
      );
  };

  const showEnableSharedLinkPopup = () => {
    dispatch(questUtilsActions.addEnablePostId(null));
    dispatch(
      questUtilsActions.updateDialogueBox({
        type: 'Enable',
        status: true,
        link: questStartData.userQuestSetting.link,
        id: questStartData._id,
      }),
    );
  };

  if (postProperties === 'HiddenPosts') {
    const { mutateAsync: unHidePost, isPending: unHidePostLoading } = useMutation({
      mutationFn: updateHiddenQuest,
      onSuccess: (resp) => {
        showToast('success', 'postUnhidden');
        queryClient.setQueriesData(['hiddenPosts'], (oldData) => {
          return {
            ...oldData,
            pages: oldData?.pages?.map((page) =>
              page.map((item) =>
                item._id === resp.data.data.questForeignKey ? { ...item, userQuestSetting: resp.data.data } : item,
              ),
            ),
          };
        });
      },
      onError: (err) => {
        console.log(err);
        showToast('error', 'error', {}, err.response.data.message.split(':')[1]);
      },
    });

    const { mutateAsync: hidePost, isPending: hidePostLoading } = useMutation({
      mutationFn: hideQuest,
      onSuccess: (resp) => {
        showToast('success', 'postHidden');
        queryClient.setQueriesData(['hiddenPosts'], (oldData) => {
          return {
            ...oldData,
            pages: oldData?.pages?.map((page) =>
              page.map((item) =>
                item._id === resp.data.data.questForeignKey ? { ...item, userQuestSetting: resp.data.data } : item,
              ),
            ),
          };
        });
      },
      onError: (err) => {
        console.log(err);
      },
    });

    return (
      <div>
        {startTest !== questStartData._id ? (
          <div className="flex w-full justify-end gap-2 pr-[14.4px] tablet:gap-[0.75rem] tablet:pr-[3.44rem]">
            <Button
              variant={hidePostLoading || unHidePostLoading ? 'submit-hollow' : 'submit'}
              onClick={() =>
                navigate('/post/isfullscreen', { state: { questId: questStartData._id, questType: 'feedback-given' } })
              }
              disabled={hidePostLoading || unHidePostLoading}
              className={'tablet:min-w-fit tablet:px-[25px] laptop:px-[25px]'}
            >
              View
            </Button>
            {questStartData.userQuestSetting.hidden ? (
              <Button
                variant="danger"
                onClick={() => {
                  unHidePost({
                    uuid: persistedUserInfo?.uuid,
                    questForeignKey: questStartData._id,
                    hidden: false,
                    hiddenMessage: '',
                  });
                }}
                className={'bg-red-400'}
              >
                {unHidePostLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Unhide'}
              </Button>
            ) : (
              <Button
                variant="danger"
                onClick={() => {
                  hidePost({
                    uuid: persistedUserInfo?.uuid,
                    questForeignKey: questStartData._id,
                    hidden: true,
                    hiddenMessage: questStartData.userQuestSetting.feedbackMessage,
                    Question: questStartData.Question,
                  });
                }}
                className={'bg-red-400'}
              >
                {hidePostLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Hide'}
              </Button>
            )}
            {/* <UnHidePostPopup
              handleClose={showHidePostClose}
              modalVisible={modalVisible}
              questStartData={questStartData}
            /> */}
          </div>
        ) : (
          <div className="flex w-full justify-end gap-2 pr-[14.4px] tablet:gap-[0.75rem] tablet:pr-[3.44rem]">
            <Button
              variant="cancel"
              onClick={() => {
                handleViewResults(null);
                handleStartTest('');
              }}
            >
              Go Back
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (postProperties === 'SharedLinks') {
    return (
      <div>
        {startTest !== questStartData._id ? (
          <div className="flex w-full justify-end gap-2 pr-[14.4px] tablet:gap-[0.75rem] tablet:pr-[3.44rem]">
            {getButtonText(questStartData.startStatus) !== 'Completed' ? (
              <Button
                variant={'submit-green'}
                onClick={() => {
                  navigate('/shared-links/result', {
                    state: { questId: questStartData._id, link: questStartData.userQuestSetting.link },
                  });
                }}
                className={'tablet:min-w-fit tablet:px-[25px] laptop:px-[25px]'}
              >
                Show My Link Results
              </Button>
            ) : null}
            {questStartData.userQuestSetting.linkStatus === 'Enable' ? (
              <Button variant="danger" onClick={showDisableSharedLinkPopup} className={'bg-[#DC1010]'}>
                Disable Link
              </Button>
            ) : (
              <Button variant="submit" onClick={showEnableSharedLinkPopup}>
                Enable Link
              </Button>
            )}
            <UnHidePostPopup
              handleClose={showHidePostClose}
              modalVisible={modalVisible}
              questStartData={questStartData}
            />
          </div>
        ) : (
          <div className="flex w-full justify-end gap-2 pr-[14.4px] tablet:gap-[0.75rem] tablet:pr-[3.44rem]">
            <Button
              variant="cancel"
              onClick={() => {
                handleViewResults(null);
                handleStartTest('');
              }}
            >
              Go Back
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (SharedLinkButton === 'shared-links-results-button') {
    return (
      <div className="flex w-full justify-end gap-2 pr-[14.4px] tablet:gap-[0.75rem] tablet:pr-[3.44rem]">
        <Button
          variant="cancel"
          onClick={() => {
            if (persistedUserInfo?.role === 'guest') {
              showGuestSignUpToastWarning();
            } else {
              if (location.pathname === '/shared-list-link/result') {
                navigate('/profile/lists');
              } else {
                navigate('/profile/shared-links');
              }
            }
          }}
        >
          Go Back
        </Button>
      </div>
    );
  }

  if (persistedUserInfo?.role === 'guest') {
    if (
      location.pathname.includes('/p/') ||
      location.pathname.includes('/l/') ||
      location.pathname === '/post/isfullscreen'
    ) {
      return (
        <>
          {questStartData.startStatus === '' ? (
            <div className="flex w-full items-center justify-between pl-7 pr-[14.4px] tablet:pl-[63.04px] tablet:pr-[100.08px]">
              <Button
                variant={'submit'}
                onClick={() => {
                  showGuestSignUpToastWarning();
                }}
                className={'bg-gradient-to-tr from-green-200 to-green-200'}
              >
                Feedback / Hide
                <span className="pl-[5px] text-[7px] font-semibold leading-[1px]  tablet:pl-[10px] tablet:text-[13px]">
                  (+{persistedContants?.QUEST_COMPLETED_AMOUNT} FDX)
                </span>
              </Button>

              <Button
                variant="submit"
                onClick={() => handleSubmit()}
                disabled={
                  loading === true
                    ? true
                    : false || answersSelection.some((item) => item.addedOptionByUser === true) === true
                      ? checkOptionStatus.tooltipName === 'Answer is Verified'
                        ? false
                        : true
                      : false
                }
              >
                {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Submit'}
                {questStartData.startStatus !== 'change answer' && (
                  <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[10px] tablet:text-[13px]">
                    (+{persistedContants?.QUEST_COMPLETED_AMOUNT} FDX)
                  </span>
                )}
              </Button>
            </div>
          ) : questStartData.startStatus === 'change answer' ? (
            <div className="flex justify-end  pr-[14.4px] tablet:pr-[3.44rem]">
              {questStartData.startStatus === 'change answer' && viewResult === questStartData._id ? (
                <Button
                  variant={result === ', you are good to go' ? 'change' : 'change-outline'}
                  disabled={result === ', you are good to go' ? false : true}
                  onClick={() => {
                    showGuestSignUpToastWarning();
                  }}
                >
                  Change
                </Button>
              ) : null}
            </div>
          ) : null}
        </>
      );
    } else {
      return (
        <div className="flex w-full justify-end ">
          {questStartData.startStatus === 'change answer' ? (
            <div className="pl-7 pr-[0.87rem] tablet:pl-[3.19rem] tablet:pr-[3.44rem]">
              {questStartData.startStatus === 'change answer' && viewResult === questStartData._id ? (
                <Button
                  variant={result === ', you are good to go' ? 'change' : 'change-outline'}
                  disabled={result === ', you are good to go' ? false : true}
                  onClick={() => {
                    showGuestSignUpToastWarning();
                  }}
                >
                  Change
                </Button>
              ) : null}
            </div>
          ) : questStartData.startStatus === 'completed' ? null : (
            <div className="flex w-full items-center justify-between pl-7 pr-[14.4px] tablet:pl-[63.04px] tablet:pr-[100.08px]">
              <Button
                variant={'submit'}
                onClick={() => {
                  showGuestSignUpToastWarning();
                }}
                className={'bg-gradient-to-tr from-green-200 to-green-200'}
              >
                Feedback / Hide
                <span className="pl-[5px] text-[7px] font-semibold leading-[1px]  tablet:pl-[10px] tablet:text-[13px]">
                  (+{persistedContants?.QUEST_COMPLETED_AMOUNT} FDX)
                </span>
              </Button>

              <Button
                variant="submit"
                onClick={() => {
                  showGuestSignUpToastWarning();
                }}
                disabled={
                  loading === true
                    ? true
                    : false || answersSelection.some((item) => item.addedOptionByUser === true) === true
                      ? checkOptionStatus.tooltipName === 'Answer is Verified'
                        ? false
                        : true
                      : false
                }
              >
                {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Submit'}{' '}
                {questStartData.startStatus !== 'change answer' && (
                  <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[10px] tablet:text-[13px]">
                    (+{persistedContants?.QUEST_COMPLETED_AMOUNT} FDX)
                  </span>
                )}
              </Button>
            </div>
          )}
        </div>
      );
    }
  }

  /* Participated => Go back - Submit / Not Participated => Submit*/
  if (startTest === questStartData._id) {
    return (
      <div className="flex w-full gap-2 pl-[0.87rem] pr-[0.87rem] tablet:gap-[0.75rem] tablet:pl-[63.04px] tablet:pr-[100.08px]">
        <FeedbackAndVisibility
          ref={feedbackAndVisibilityRef}
          questStartData={questStartData}
          setFeedbackLoading={setFeedbackLoading}
        />
        {questStartData.startStatus === 'change answer' ? (
          <div className="flex w-full gap-[0.69rem] tablet:gap-[0.75rem]">
            <Button
              variant="cancel-full"
              onClick={() => {
                handleViewResults(questStartData._id);
                handleRemoveItem();
              }}
            >
              Go Back
            </Button>
            <Button
              id={`submit-${questStartData._id}`}
              variant="g-submit"
              onClick={() => handleSubmit()}
              disabled={
                loading === true
                  ? true
                  : false || answersSelection.some((item) => item.addedOptionByUser === true) === true
                    ? checkOptionStatus.tooltipName === 'Answer is Verified'
                      ? false
                      : true
                    : false
              }
            >
              {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Submit'}
            </Button>
          </div>
        ) : (
          <>
            {feedbackLoading || loading ? (
              <div className="flex w-full items-center justify-center">
                <FaSpinner className="animate-spin text-center text-[30px] text-blue-100 dark:text-[#EAEAEA]" />
              </div>
            ) : (
              <div className="flex w-full items-center justify-between gap-4">
                <Button variant={'submit'} className={'w-full'} onClick={openFeedbackAndVisiblePopup}>
                  Feedback / Hide
                  <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[10px] tablet:text-[13px]">
                    (+{persistedContants?.QUEST_COMPLETED_AMOUNT} FDX)
                  </span>
                </Button>
                <Button
                  id={`submit-${questStartData._id}`}
                  variant="g-submit"
                  onClick={() => handleSubmit()}
                  // disabled={
                  //   loading === true
                  //     ? true
                  //     : false || answersSelection.some((item) => item.addedOptionByUser === true) === true
                  //       ? checkOptionStatus.tooltipName === 'Answer is Verified'
                  //         ? false
                  //         : true
                  //       : false
                  // }
                >
                  Submit
                  {questStartData.startStatus !== 'change answer' && (
                    <span className="pl-[5px] text-[7px] font-semibold leading-[1px]  tablet:pl-[10px] tablet:text-[13px]">
                      (+{persistedContants?.QUEST_COMPLETED_AMOUNT} FDX)
                    </span>
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  /* Change */
  return (
    <div className="px-[14.4px] tablet:pl-[63.04px] tablet:pr-[100.08px]">
      {questStartData.startStatus === 'change answer' && viewResult === questStartData._id && (
        <div className="flex w-full justify-end">
          <Button
            variant={result === ', you are good to go' ? 'change' : 'change-outline'}
            disabled={result === ', you are good to go' ? false : true}
            onClick={handleStartChange}
          >
            Change
          </Button>
        </div>
      )}
    </div>
  );
};

export default ButtonGroup;
