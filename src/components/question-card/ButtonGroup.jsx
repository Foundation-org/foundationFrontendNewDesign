import { toast } from 'sonner';
import { Button } from '../ui/Button';
import { FaSpinner } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { calculateRemainingTime } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { resetQuests } from '../../features/quest/questsSlice';
import { getStartQuestInfo } from '../../services/api/questsApi';
import { getButtonText, getButtonVariants } from '../../utils/questionCard/SingleQuestCard';

import * as questUtilsActions from '../../features/quest/utilsSlice';
import * as filterActions from '../../features/sidebar/filtersSlice';
import * as filterBookmarkActions from '../../features/sidebar/bookmarkFilterSlice';
import UnHidePostPopup from '../dialogue-boxes/UnHidePostPopup';
import { useState } from 'react';

const ButtonGroup = ({
  usersAddTheirAns,
  title,
  id,
  btnText,
  handleStartTest,
  handleViewResults,
  answersSelection,
  setHowManyTimesAnsChanged,
  whichTypeQuestion,
  handleToggleCheck,
  setAnswerSelection,
  rankedAnswers,
  setRankedAnswers,
  startStatus,
  setLoadingDetail,
  answers,
  handleOpen,
  viewResult,
  openResults,
  setOpenResults,
  handleSubmit,
  loading,
  addOptionField,
  questStartData,
  startTest,
  handleChange,
  checkOptionStatus,
  postProperties,
  setAddOptionField,
  SharedLinkButton
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const persistedTheme = useSelector((state) => state.utils.theme);
  const [modalVisible, setModalVisible] = useState(false);
  const getQuestUtilsState = useSelector(questUtilsActions.getQuestUtils);

  let filterState;

  if (location.pathname === '/dashboard/bookmark') {
    filterState = useSelector(filterBookmarkActions.getFilters);
  } else {
    filterState = useSelector(filterActions.getFilters);
  }

  const uuidExists = answers
    ? answers?.some((item) => item.uuid === persistedUserInfo?.uuid || item.uuid === localStorage.getItem('uId'))
    : false;

  function updateAnswerSelection(apiResponse, answerSelectionArray) {
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

    setAnswerSelection(answerSelectionArray);
  }

  function updateRankSelection(apiResponse, answerSelectionArray) {
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

    setAnswerSelection(sortedAnswers);
    setRankedAnswers(sortedAnswers);
  }

  // const { mutateAsync: getStartQuestDetail } = useMutation({
  //   mutationFn: getStartQuestInfo,
  //   onSuccess: (res) => {
  //     setHowManyTimesAnsChanged(res.data.data.length);
  //     if (
  //       whichTypeQuestion === 'agree/disagree' ||
  //       whichTypeQuestion === 'yes/no' ||
  //       whichTypeQuestion === 'like/dislike'
  //     ) {
  //       if (
  //         res?.data.data[res.data.data.length - 1].selected === 'Agree' ||
  //         res?.data.data[res.data.data.length - 1].selected === 'Yes' ||
  //         res?.data.data[res.data.data.length - 1].selected === 'Like'
  //       ) {
  //         handleToggleCheck(res.data.data[res.data.data.length - 1].selected, true, false);
  //       }
  //       if (
  //         res?.data.data[res.data.data.length - 1].contended === 'Agree' ||
  //         res?.data.data[res.data.data.length - 1].contended === 'Yes' ||
  //         res?.data.data[res.data.data.length - 1].contended === 'Like'
  //       ) {
  //         handleToggleCheck(res.data.data[res.data.data.length - 1].contended, false, true);
  //       }
  //       if (
  //         res?.data.data[res.data.data.length - 1].contended === 'Disagree' ||
  //         res?.data.data[res.data.data.length - 1].contended === 'No' ||
  //         res?.data.data[res.data.data.length - 1].contended === 'Dislike'
  //       ) {
  //         handleToggleCheck(res.data.data[res.data.data.length - 1].contended, false, true);
  //       }
  //       if (
  //         res?.data.data[res.data.data.length - 1].selected === 'Disagree' ||
  //         res?.data.data[res.data.data.length - 1].selected === 'No' ||
  //         res?.data.data[res.data.data.length - 1].selected === 'Dislike'
  //       ) {
  //         handleToggleCheck(res.data.data[res.data.data.length - 1].selected, true, false);
  //       }
  //     }
  //     if (whichTypeQuestion === 'multiple choise' || whichTypeQuestion === 'open choice') {
  //       updateAnswerSelection(res?.data.data[res.data.data.length - 1], answersSelection);
  //     }
  //     if (whichTypeQuestion === 'ranked choise') {
  //       updateRankSelection(res?.data.data[res.data.data.length - 1], rankedAnswers);
  //     }
  //     // setLoadingDetail(false);
  //   },
  //   onError: (err) => {
  //     toast.error(err.response?.data);
  //     console.log('Mutation Error', err);
  //     // setLoadingDetail(false);
  //   },
  // });

  const handleRemoveItem = () => {
    const updatedAnswerSelection = answersSelection.filter((item) => !item.addedOptionByUser);
    setAnswerSelection([...updatedAnswerSelection]);
    setAddOptionField(0);
  };

  const handleStartChange = () => {
    dispatch(questUtilsActions.resetaddOptionLimit());
    if (btnText === '') {
      dispatch(resetQuests());
      handleStartTest(id);
    }
    if (btnText === 'change answer') {
      setHowManyTimesAnsChanged(questStartData?.startQuestData.data.length);
      const data = questStartData?.startQuestData.data[questStartData?.startQuestData.data.length - 1];

      if (
        whichTypeQuestion === 'agree/disagree' ||
        whichTypeQuestion === 'yes/no' ||
        whichTypeQuestion === 'like/dislike'
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
      if (whichTypeQuestion === 'multiple choise' || whichTypeQuestion === 'open choice') {
        updateAnswerSelection(questStartData, answersSelection);
      }
      if (whichTypeQuestion === 'ranked choise') {
        updateRankSelection(questStartData, answersSelection);
      }
      handleStartTest(id);
    }
    if (btnText === 'completed') {
      handleViewResults(id);
    }
  };

  const startHiddenTest = () => {
    dispatch(questUtilsActions.resetaddOptionLimit());
    dispatch(resetQuests());
    handleStartTest(id);
  };

  const result = calculateRemainingTime(
    questStartData?.updatedAt,
    questStartData?.startQuestData && questStartData?.startQuestData.data.length,
    questStartData.usersChangeTheirAns,
  );

  const showHidePostOpen = () => setModalVisible(true);
  const showHidePostClose = () => setModalVisible(false);

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
    return (
      <div>
        {startTest !== questStartData._id ? (
          <div className="flex w-full justify-end gap-2 pr-[14.4px] tablet:gap-[0.75rem] tablet:pr-[3.44rem]">
            {getButtonText(btnText) !== 'Completed' ? (
              <Button
                variant={'submit'}
                onClick={startHiddenTest}
                className={'tablet:min-w-fit tablet:px-[25px] laptop:px-[25px]'}
              >
                View
              </Button>
            ) : null}
            <Button variant="danger" onClick={showHidePostOpen} className={'bg-[#FF4057]'}>
              Unhide
            </Button>
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

  if (postProperties === 'SharedLinks') {
    return (
      <div>
        {startTest !== questStartData._id ? (
          <div className="flex w-full justify-end gap-2 pr-[14.4px] tablet:gap-[0.75rem] tablet:pr-[3.44rem]">
            {getButtonText(btnText) !== 'Completed' ? (
              <Button
                variant={'submit-green'}
                // onClick={() => {
                //   navigate('/shared-links/result', {
                //     state: { questId: questStartData._id, link: questStartData.userQuestSetting.link },
                //   });
                // }}
                onClick={() => {
                  toast.success("Feature coming soon")
                  
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

  if ( SharedLinkButton === 'shared-links-results-button') {
    return (
      <div className="flex w-full justify-end gap-2 pr-[14.4px] tablet:gap-[0.75rem] tablet:pr-[3.44rem]">
        <Button
          variant="cancel"
          onClick={() => {
            navigate('/profile/shared-links');
          }}
        >
          Go Back
        </Button>
      </div>
    );
  }

  if (persistedUserInfo?.role === 'guest') {
    if (location.pathname.includes('/p/') || location.pathname === '/quest/isfullscreen') {
      return (
        <>
          {btnText === '' ? (
            <div className="flex w-full justify-between pl-7 pr-[14.4px] tablet:pl-[3.19rem] tablet:pr-[3.44rem]">
              {startTest === questStartData._id && questStartData.usersAddTheirAns ? (
                title === 'Yes/No' || title === 'Agree/Disagree' || title === 'Like/Dislike' ? null : (
                  <Button
                    onClick={() => {
                      toast.warning(
                        <p>
                          Please{' '}
                          <span
                            className="cursor-pointer text-[#389CE3] underline"
                            onClick={() => navigate('/guest-signup')}
                          >
                            Create an Account
                          </span>{' '}
                          to unlock this feature
                        </p>,
                      );
                    }}
                    variant={'addOption'}
                  >
                    {persistedTheme === 'dark' ? (
                      <img
                        src="/assets/svgs/dashboard/add-dark.svg"
                        alt="add"
                        className="h-[7.398px] w-[7.398px] tablet:h-[15.6px] tablet:w-[15.6px]"
                      />
                    ) : (
                      <img
                        src="/assets/svgs/dashboard/add.svg"
                        alt="add"
                        className="h-[7.398px] w-[7.398px] tablet:h-[15.6px] tablet:w-[15.6px]"
                      />
                    )}
                    Add Option
                  </Button>
                )
              ) : (
                <div></div>
              )}
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
                {btnText !== 'change answer' && (
                  <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[10px] tablet:text-[13px]">
                    (+0.96 FDX)
                  </span>
                )}
              </Button>
            </div>
          ) : btnText === 'change answer' ? (
            <div className="flex justify-end  pr-[14.4px] tablet:pr-[3.44rem]">
              {btnText === 'change answer' && viewResult === questStartData._id ? (
                <Button
                  variant={result === ', you are good to go' ? 'change' : 'change-outline'}
                  disabled={result === ', you are good to go' ? false : true}
                  onClick={() => {
                    toast.warning(
                      <p>
                        Please{' '}
                        <span
                          className="cursor-pointer text-[#389CE3] underline"
                          onClick={() => navigate('/guest-signup')}
                        >
                          Create an Account
                        </span>{' '}
                        to unlock this feature
                      </p>,
                    );
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
      if (filterState.expandedView === true) {
        return (
          <div className="flex w-full justify-between pl-7 pr-[0.87rem] tablet:pl-[3.19rem] tablet:pr-[3.44rem]">
            {startTest === questStartData._id && questStartData.usersAddTheirAns ? (
              title === 'Yes/No' || title === 'Agree/Disagree' || title === 'Like/Dislike' ? null : (
                <Button
                  onClick={() => {
                    toast.warning(
                      <p>
                        Please{' '}
                        <span
                          className="cursor-pointer text-[#389CE3] underline"
                          onClick={() => navigate('/guest-signup')}
                        >
                          Create an Account
                        </span>{' '}
                        to unlock this feature
                      </p>,
                    );
                  }}
                  variant={'addOption'}
                >
                  {persistedTheme === 'dark' ? (
                    <img
                      src="/assets/svgs/dashboard/add-dark.svg"
                      alt="add"
                      className="h-[7.398px] w-[7.398px] tablet:h-[15.6px] tablet:w-[15.6px]"
                    />
                  ) : (
                    <img
                      src="/assets/svgs/dashboard/add.svg"
                      alt="add"
                      className="h-[7.398px] w-[7.398px] tablet:h-[15.6px] tablet:w-[15.6px]"
                    />
                  )}
                  Add Option
                </Button>
              )
            ) : (
              <div></div>
            )}
            {btnText === 'change answer' ? (
              <div>
                {btnText === 'change answer' && viewResult === questStartData._id ? (
                  <Button
                    variant={result === ', you are good to go' ? 'change' : 'change-outline'}
                    disabled={result === ', you are good to go' ? false : true}
                    onClick={() => {
                      toast.warning(
                        <p>
                          Please{' '}
                          <span
                            className="cursor-pointer text-[#389CE3] underline"
                            onClick={() => navigate('/guest-signup')}
                          >
                            Create an Account
                          </span>{' '}
                          to unlock this feature
                        </p>,
                      );
                    }}
                  >
                    Change
                  </Button>
                ) : null}
              </div>
            ) : btnText === 'completed' ? null : (
              <Button
                variant="submit"
                onClick={() => {
                  toast.warning(
                    <p>
                      Please{' '}
                      <span
                        className="cursor-pointer text-[#389CE3] underline"
                        onClick={() => navigate('/guest-signup')}
                      >
                        Create an Account
                      </span>{' '}
                      to unlock this feature
                    </p>,
                  );
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
                {btnText !== 'change answer' && (
                  <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[10px] tablet:text-[13px]">
                    (+0.96 FDX)
                  </span>
                )}
              </Button>
            )}
          </div>
        );
      } else {
        if (startTest === questStartData._id) {
          return (
            <div className="flex w-full justify-between gap-2 pl-[0.87rem] pr-[0.87rem] tablet:gap-[0.75rem] tablet:pl-[3.44rem] tablet:pr-[3.44rem]">
              {questStartData.usersAddTheirAns ? (
                title === 'Yes/No' || title === 'Agree/Disagree' || title === 'Like/Dislike' ? null : (
                  <Button
                    onClick={() => {
                      toast.warning(
                        <p>
                          Please{' '}
                          <span
                            className="cursor-pointer text-[#389CE3] underline"
                            onClick={() => navigate('/guest-signup')}
                          >
                            Create an Account
                          </span>{' '}
                          to unlock this feature
                        </p>,
                      );
                    }}
                    variant={'addOption'}
                  >
                    {persistedTheme === 'dark' ? (
                      <img
                        src="/assets/svgs/dashboard/add-dark.svg"
                        alt="add"
                        className="h-[7.398px] w-[7.398px] tablet:h-[15.6px] tablet:w-[15.6px]"
                      />
                    ) : (
                      <img
                        src="/assets/svgs/dashboard/add.svg"
                        alt="add"
                        className="h-[7.398px] w-[7.398px] tablet:h-[15.6px] tablet:w-[15.6px]"
                      />
                    )}
                    Add Option
                  </Button>
                )
              ) : (
                <div></div>
              )}

              {/* Go back / Submit */}
              <div>
                <div className="flex gap-[0.69rem] tablet:gap-[0.75rem]">
                  {!filterState.expandedView ? (
                    <Button
                      variant="cancel"
                      onClick={() => {
                        handleStartTest('');
                      }}
                    >
                      Go Back
                    </Button>
                  ) : null}
                  {startStatus === 'change answer' && viewResult === null && openResults === false && (
                    <Button
                      variant="cancel"
                      onClick={() => {
                        handleViewResults(questStartData._id), setOpenResults(true);
                      }}
                    >
                      Go Back
                    </Button>
                  )}
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
                  </Button>
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div className="flex w-full justify-end pr-[0.87rem] tablet:pr-[3.44rem]">
              {btnText === '' ? (
                <Button
                  variant={`${result === ', you are good to go' ? getButtonVariants(btnText) : 'change-outline'}`}
                  onClick={handleStartChange}
                  disabled={result === ', you are good to go' ? false : true}
                >
                  {getButtonText(btnText)}
                </Button>
              ) : viewResult !== questStartData._id ? (
                <Button
                  variant="result"
                  onClick={() => {
                    if (btnText !== '') {
                      handleViewResults(id);
                    } else {
                      toast.error('First give your response to see Results');
                    }
                  }}
                >
                  Results
                </Button>
              ) : (
                <Button
                  variant="cancel"
                  onClick={() => {
                    handleViewResults(questStartData._id);
                    handleStartTest(false);
                  }}
                >
                  Go Back
                </Button>
              )}
            </div>
          );
        }
      }
    }
  }

  if (filterState.expandedView === false) {
    if (startTest === questStartData._id) {
      return (
        <div className="flex w-full justify-between gap-2 pl-[0.87rem] pr-[0.87rem] tablet:gap-[0.75rem] tablet:pl-[3.44rem] tablet:pr-[3.44rem]">
          {/* Add Options */}
          {getQuestUtilsState.addOptionLimit === 0 ? (
            <div className="flex items-center justify-center">
              {usersAddTheirAns && uuidExists === false ? (
                <div>
                  {title === 'Yes/No' || title === 'Agree/Disagree' || title === 'Like/Dislike' ? null : (
                    <Button onClick={handleOpen} variant={'addOption'}>
                      {persistedTheme === 'dark' ? (
                        <img
                          src="/assets/svgs/dashboard/add-dark.svg"
                          alt="add"
                          className="h-[7.398px] w-[7.398px] tablet:h-[15.6px] tablet:w-[15.6px]"
                        />
                      ) : (
                        <img
                          src="/assets/svgs/dashboard/add.svg"
                          alt="add"
                          className="h-[7.398px] w-[7.398px] tablet:h-[15.6px] tablet:w-[15.6px]"
                        />
                      )}
                      Add Option
                    </Button>
                  )}
                </div>
              ) : null}
            </div>
          ) : (
            <div></div>
          )}

          {/* Go back / Submit */}
          <div
          // className={`${
          //   title === 'Multiple Choice' ? '' : addOptionField === 1 ? 'mt-[4rem] tablet:mt-[10rem]' : ''
          // }`}
          >
            <div className="flex gap-[0.69rem] tablet:gap-[0.75rem]">
              {!filterState.expandedView ? (
                <Button
                  variant="cancel"
                  onClick={() => {
                    handleStartTest('');
                    handleRemoveItem();
                  }}
                >
                  Go Back
                </Button>
              ) : null}
              {startStatus === 'change answer' && viewResult === null && openResults === false && (
                <Button
                  variant="cancel"
                  onClick={() => {
                    handleViewResults(questStartData._id), setOpenResults(true);
                  }}
                >
                  Go Back
                </Button>
              )}
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
                {btnText !== 'change answer' && (
                  <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[10px] tablet:text-[13px]">
                    (+0.96 FDX)
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      );
    }
  } else {
    if (startTest === questStartData._id) {
      return (
        <div className="flex w-full justify-between gap-2  pl-[0.87rem] pr-[0.87rem] tablet:gap-[0.75rem] tablet:pl-[3.44rem] tablet:pr-[3.44rem]">
          {/* Add Option - Go back - Submit / add Option - Submit*/}
          {btnText === 'change answer' ? (
            <>
              {addOptionField === 0 ? (
                <div className="flex items-center justify-center">
                  {usersAddTheirAns && uuidExists === false ? (
                    <div>
                      {title === 'Yes/No' || title === 'Agree/Disagree' || title === 'Like/Dislike' ? null : (
                        <Button onClick={handleOpen} variant={'addOption'}>
                          {persistedTheme === 'dark' ? (
                            <img
                              src="/assets/svgs/dashboard/add-dark.svg"
                              alt="add"
                              className="h-[7.398px] w-[7.398px] tablet:h-[15.6px] tablet:w-[15.6px]"
                            />
                          ) : (
                            <img
                              src="/assets/svgs/dashboard/add.svg"
                              alt="add"
                              className="h-[7.398px] w-[7.398px] tablet:h-[15.6px] tablet:w-[15.6px]"
                            />
                          )}
                          Add Option
                        </Button>
                      )}
                    </div>
                  ) : null}
                </div>
              ) : (
                <div></div>
              )}
              <div
              // className={`${
              //   title === 'Multiple Choice' ? '' : addOptionField === 1 ? 'mt-[4rem] tablet:mt-[10rem]' : ''
              // }`}
              >
                <div className="flex gap-[0.69rem] tablet:gap-[0.75rem]">
                  <Button
                    variant="cancel"
                    onClick={() => {
                      handleViewResults(questStartData._id);
                      handleRemoveItem();
                    }}
                  >
                    Go Back
                  </Button>
                  <Button
                    id={`submit-${questStartData._id}`}
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
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex w-full justify-between">
              {questStartData.usersAddTheirAns && addOptionField === 0 ? (
                title === 'Yes/No' || title === 'Agree/Disagree' || title === 'Like/Dislike' ? null : (
                  <Button onClick={handleOpen} variant={'addOption'}>
                    {persistedTheme === 'dark' ? (
                      <img
                        src="/assets/svgs/dashboard/add-dark.svg"
                        alt="add"
                        className="h-[7.398px] w-[7.398px] tablet:h-[15.6px] tablet:w-[15.6px]"
                      />
                    ) : (
                      <img
                        src="/assets/svgs/dashboard/add.svg"
                        alt="add"
                        className="h-[7.398px] w-[7.398px] tablet:h-[15.6px] tablet:w-[15.6px]"
                      />
                    )}
                    Add Option
                  </Button>
                )
              ) : (
                <div></div>
              )}
              <Button
                id={`submit-${questStartData._id}`}
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
                {btnText !== 'change answer' && (
                  <span className="pl-[5px] text-[7px] font-semibold leading-[1px]  tablet:pl-[10px] tablet:text-[13px]">
                    (+0.96 FDX)
                  </span>
                )}
              </Button>
            </div>
          )}
        </div>
      );
    }
  }

  return (
    <>
      {/* Start / Change and  Result / Result Outline*/}
      {filterState.expandedView === false ? (
        viewResult !== questStartData._id ? (
          <div className="flex w-full justify-end gap-2 pr-[14.4px] tablet:gap-[0.75rem] tablet:pr-[3.44rem]">
            {getButtonText(btnText) !== 'Completed' ? (
              <Button
                // variant={getButtonVariants(btnText)}
                variant={`${result === ', you are good to go' ? getButtonVariants(btnText) : 'change-outline'}`}
                onClick={handleStartChange}
                disabled={result === ', you are good to go' ? false : true}
              >
                {getButtonText(btnText)}
              </Button>
            ) : null}
            {startStatus?.trim() !== '' ? (
              <Button
                variant="result"
                onClick={() => {
                  if (btnText !== '') {
                    handleViewResults(id);
                  } else {
                    toast.error('First give your response to see Results');
                  }
                }}
              >
                Results
              </Button>
            ) : (
              ''
            )}
          </div>
        ) : (
          // Go Back
          <div className="flex w-full justify-end gap-2 pr-[14.4px] tablet:gap-[0.75rem] tablet:pr-[3.44rem]">
            <Button
              variant="cancel"
              onClick={() => {
                handleViewResults(null);
                handleStartTest('');
                // setStartTest(false);
                // setOpenResults(true);
              }}
            >
              Go Back
            </Button>
          </div>
        )
      ) : (
        <>
          <div className="flex">
            {/* Add Options / Go Back / Submit */}
            {btnText === 'change answer' && startTest === questStartData._id && (
              <div className="flex w-full justify-between pl-7 pr-[14.4px] tablet:pl-[3.19rem] tablet:pr-[3.44rem]">
                <Button onClick={handleOpen} variant={'addOption'}>
                  {persistedTheme === 'dark' ? (
                    <img
                      src="/assets/svgs/dashboard/add-dark.svg"
                      alt="add"
                      className="h-[7.398px] w-[7.398px] tablet:h-[15.6px] tablet:w-[15.6px]"
                    />
                  ) : (
                    <img
                      src="/assets/svgs/dashboard/add.svg"
                      alt="add"
                      className="h-[7.398px] w-[7.398px] tablet:h-[15.6px] tablet:w-[15.6px]"
                    />
                  )}
                  Add Option
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="cancel"
                    onClick={() => {
                      handleViewResults(questStartData._id);
                      handleStartTest(false);
                    }}
                  >
                    Go Back
                  </Button>
                  {viewResult !== questStartData._id && (
                    <Button variant="submit" onClick={() => handleSubmit()} disabled={loading === true ? true : false}>
                      {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Submit'}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Change Add Options Submit */}
          <div className="flex w-full justify-end pr-[14.4px] tablet:pr-[3.44rem]">
            {btnText === 'change answer' && viewResult === questStartData._id ? (
              <Button
                variant={result === ', you are good to go' ? 'change' : 'change-outline'}
                disabled={result === ', you are good to go' ? false : true}
                onClick={handleStartChange}
              >
                Change
              </Button>
            ) : (
              startStatus !== 'completed' && (
                <div className="flex w-full justify-between pl-7 tablet:pl-[3.19rem]">
                  {questStartData.usersAddTheirAns && addOptionField === 0 ? (
                    title === 'Yes/No' || title === 'Agree/Disagree' || title === 'Like/Dislike' ? null : (
                      <Button onClick={handleOpen} variant={'addOption'}>
                        {persistedTheme === 'dark' ? (
                          <img
                            src="/assets/svgs/dashboard/add-dark.svg"
                            alt="add"
                            className="h-[7.398px] w-[7.398px] tablet:h-[15.6px] tablet:w-[15.6px]"
                          />
                        ) : (
                          <img
                            src="/assets/svgs/dashboard/add.svg"
                            alt="add"
                            className="h-[7.398px] w-[7.398px] tablet:h-[15.6px] tablet:w-[15.6px]"
                          />
                        )}
                        Add Option
                      </Button>
                    )
                  ) : (
                    <div></div>
                  )}
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
                  </Button>
                </div>
              )
            )}
          </div>
        </>
      )}
    </>
  );
};

export default ButtonGroup;
