import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { getStartQuestInfo } from '../../services/api/questsApi';
import { resetQuests } from '../../features/quest/questsSlice';
import { getButtonText, getButtonVariants } from '../../utils/questionCard/SingleQuestCard';
import { Button } from '../ui/Button';
import { FaSpinner } from 'react-icons/fa';
import { calculateRemainingTime } from '../../utils';

import * as questUtilsActions from '../../features/quest/utilsSlice';
import * as filterActions from '../../features/sidebar/filtersSlice';
import * as filterBookmarkActions from '../../features/sidebar/bookmarkFilterSlice';
import { useLocation } from 'react-router-dom';

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
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const persistedTheme = useSelector((state) => state.utils.theme);

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
    answerSelectionArray.forEach((item, index) => {
      if (apiResponse.selected.some((selectedItem) => selectedItem.question === item.label)) {
        answerSelectionArray[index].check = true;
      }

      if (apiResponse.contended.some((contendedItem) => contendedItem.question === item.label)) {
        answerSelectionArray[index].contend = true;
      }
    });
    setAnswerSelection(answerSelectionArray);
  }

  function updateRankSelection(apiResponse, answerSelectionArray) {
    answerSelectionArray.forEach((item, index) => {
      // Check in contended array
      if (
        apiResponse.contended &&
        apiResponse.contended?.some((contendedItem) => contendedItem.question === item.label)
      ) {
        answerSelectionArray[index].contend = true;
      }
    });

    answerSelectionArray.sort((a, b) => {
      let percentageA = parseFloat(questStartData.selectedPercentage[0][a.label].replace('%', ''));
      let percentageB = parseFloat(questStartData.selectedPercentage[0][b.label].replace('%', ''));

      return percentageB - percentageA;
    });

    setRankedAnswers(answerSelectionArray);
  }

  const { mutateAsync: getStartQuestDetail } = useMutation({
    mutationFn: getStartQuestInfo,
    onSuccess: (res) => {
      setHowManyTimesAnsChanged(res.data.data.length);
      if (
        whichTypeQuestion === 'agree/disagree' ||
        whichTypeQuestion === 'yes/no' ||
        whichTypeQuestion === 'like/dislike'
      ) {
        if (
          res?.data.data[res.data.data.length - 1].selected === 'Agree' ||
          res?.data.data[res.data.data.length - 1].selected === 'Yes' ||
          res?.data.data[res.data.data.length - 1].selected === 'Like'
        ) {
          handleToggleCheck(res.data.data[res.data.data.length - 1].selected, true, false);
        }
        if (
          res?.data.data[res.data.data.length - 1].contended === 'Agree' ||
          res?.data.data[res.data.data.length - 1].contended === 'Yes' ||
          res?.data.data[res.data.data.length - 1].contended === 'Like'
        ) {
          handleToggleCheck(res.data.data[res.data.data.length - 1].contended, false, true);
        }
        if (
          res?.data.data[res.data.data.length - 1].contended === 'Disagree' ||
          res?.data.data[res.data.data.length - 1].contended === 'No' ||
          res?.data.data[res.data.data.length - 1].contended === 'Dislike'
        ) {
          handleToggleCheck(res.data.data[res.data.data.length - 1].contended, false, true);
        }
        if (
          res?.data.data[res.data.data.length - 1].selected === 'Disagree' ||
          res?.data.data[res.data.data.length - 1].selected === 'No' ||
          res?.data.data[res.data.data.length - 1].selected === 'Dislike'
        ) {
          handleToggleCheck(res.data.data[res.data.data.length - 1].selected, true, false);
        }
      }
      if (whichTypeQuestion === 'multiple choise') {
        updateAnswerSelection(res?.data.data[res.data.data.length - 1], answersSelection);
      }
      if (whichTypeQuestion === 'ranked choise') {
        updateRankSelection(res?.data.data[res.data.data.length - 1], rankedAnswers);
      }
      setLoadingDetail(false);
    },
    onError: (err) => {
      toast.error(err.response?.data);
      console.log('Mutation Error', err);
      setLoadingDetail(false);
    },
  });

  const handleStartChange = () => {
    dispatch(questUtilsActions.resetaddOptionLimit());
    if (btnText === '') {
      dispatch(resetQuests());
      handleStartTest(id);
    }
    if (btnText === 'change answer') {
      setLoadingDetail(true);
      const data = { questForeignKey: id, uuid: persistedUserInfo?.uuid };
      getStartQuestDetail(data);
      handleStartTest(id);
    }
    if (btnText === 'completed') {
      setLoadingDetail(true);
      handleViewResults(id);
    }
  };

  const result = calculateRemainingTime(
    questStartData?.updatedAt,
    questStartData?.startQuestData && questStartData?.startQuestData.data.length,
    questStartData.usersChangeTheirAns,
  );

  if (persistedUserInfo?.role === 'guest') {
    if (location.pathname.includes('/p/') || location.pathname === '/quest/isfullscreen') {
      return (
        <div className="flex justify-between w-full pl-7 tablet:pl-[3.19rem] pr-[14.4px] tablet:pr-[3.44rem]">
          {startTest === questStartData._id && questStartData.usersAddTheirAns ? (
            title === 'Yes/No' || title === 'Agree/Disagree' || title === 'Like/Dislike' ? null : (
              <Button
                onClick={() => {
                  toast.warning('Please Signup to use this feature');
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
          {btnText === '' && (
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
          )}
        </div>
      );
    } else {
      if (filterState.expandedView === true) {
        return (
          <div className="w-full flex justify-between pl-7 tablet:pl-[3.19rem] pr-[0.87rem] tablet:pr-[3.44rem]">
            {startTest === questStartData._id && questStartData.usersAddTheirAns ? (
              title === 'Yes/No' || title === 'Agree/Disagree' || title === 'Like/Dislike' ? null : (
                <Button
                  onClick={() => {
                    toast.warning('Please Signup to use this feature');
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
                      toast.warning('Please Signup to use this feature');
                    }}
                  >
                    Change
                  </Button>
                ) : null}
              </div>
            ) : (
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
            )}
          </div>
        );
      } else {
        if (startTest === questStartData._id) {
          return (
            <div className="flex w-full justify-between gap-2 pl-7 pr-[0.87rem] tablet:gap-[0.75rem] tablet:pl-[3.19rem] tablet:pr-[3.44rem]">
              {questStartData.usersAddTheirAns ? (
                title === 'Yes/No' || title === 'Agree/Disagree' || title === 'Like/Dislike' ? null : (
                  <Button
                    onClick={() => {
                      toast.warning('Please Signup to use this feature');
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
            <div className="w-full flex justify-end pr-[0.87rem] tablet:pr-[3.44rem]">
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
        <div className="flex w-full justify-between gap-2 pl-7 pr-[0.87rem] tablet:gap-[0.75rem] tablet:pl-[3.19rem] tablet:pr-[3.44rem]">
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
    }
  } else {
    if (startTest === questStartData._id) {
      return (
        <div className="flex w-full justify-between gap-2 pl-7 pr-[0.87rem] tablet:gap-[0.75rem] tablet:pl-[3.19rem] tablet:pr-[3.44rem]">
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
                    }}
                  >
                    Go Back
                  </Button>
                  <Button
                    id={questStartData._id}
                    tabIndex="0"
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
            <div className="flex justify-between w-full">
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
