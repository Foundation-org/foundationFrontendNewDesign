import { useParams } from 'react-router-dom';

import SingleAnswer from '../../../../../components/question-card/options/SingleAnswer';
import SingleAnswerMultipleChoice from '../../../../../components/question-card/options/SingleAnswerMultipleChoice';
import RankedResult from '../../../components/RankedResult';

const Result = (props) => {
  const { isFullScreen } = useParams();

  function findSelectionContentionCheck(array, labelToFind) {
    const foundObject = array.find((obj) => obj.question === labelToFind);
    return !!foundObject;
  }

  const getRankedAnswers = (props) => {
    return props.questStartData.QuestAnswers.sort((a, b) => {
      const indexA = props.questStartData?.startQuestData?.data[
        props.questStartData?.startQuestData?.data.length - 1
      ].selected.findIndex((item) => item.question === a.question);

      const indexB = props.questStartData?.startQuestData?.data[
        props.questStartData?.startQuestData?.data.length - 1
      ].selected.findIndex((item) => item.question === b.question);

      return indexA !== -1 && indexB !== -1 ? indexA - indexB : 0;
    });
  };

  const rankedNewData = getRankedAnswers(props);

  return (
    <div className="flex flex-col gap-[5.7px] tablet:gap-[10px]" style={{ minHeight: `${props.cardSize}px ` }}>
      {props.title === 'Yes/No' || props.title === 'Agree/Disagree' || props.title === 'Like/Dislike' ? (
        <>
          {props.title === 'Yes/No' ? (
            <>
              <SingleAnswer
                number={'#1'}
                answer={'Yes'}
                checkInfo={true}
                percentage={
                  props.questStartData.selectedPercentage && props.questStartData?.selectedPercentage.length > 0
                    ? props.questStartData?.selectedPercentage[props.questStartData?.selectedPercentage.length - 1].Yes
                    : null
                }
                check={props.questSelection['yes/no'].yes.check}
                contend={props.questSelection['yes/no'].yes.check}
                handleToggleCheck={props.handleToggleCheck}
                btnText={'Results'}
                questStartData={props.questStartData}
              />
              <SingleAnswer
                number={'#2'}
                answer={'No'}
                checkInfo={true}
                percentage={
                  props.questStartData.selectedPercentage && props.questStartData?.selectedPercentage.length > 0
                    ? props.questStartData?.selectedPercentage[props.questStartData?.selectedPercentage.length - 1].No
                    : null
                }
                check={props.questSelection['yes/no'].no.check}
                contend={props.questSelection['yes/no'].no.check}
                handleToggleCheck={props.handleToggleCheck}
                btnText={'Results'}
                questStartData={props.questStartData}
              />
            </>
          ) : props.title === 'Agree/Disagree' ? (
            <>
              <SingleAnswer
                number={'#1'}
                answer={'Agree'}
                checkInfo={true}
                percentage={
                  props.questStartData.selectedPercentage && props.questStartData?.selectedPercentage.length > 0
                    ? props.questStartData?.selectedPercentage[props.questStartData?.selectedPercentage.length - 1]
                        .Agree
                    : null
                }
                check={props.questSelection['agree/disagree'].agree.check}
                contend={props.questSelection['agree/disagree'].agree.check}
                handleToggleCheck={props.handleToggleCheck}
                btnText={'Results'}
                questStartData={props.questStartData}
              />
              <SingleAnswer
                number={'#2'}
                answer={'Disagree'}
                checkInfo={true}
                percentage={
                  props.questStartData.selectedPercentage && props.questStartData?.selectedPercentage.length > 0
                    ? props.questStartData?.selectedPercentage[props.questStartData?.selectedPercentage.length - 1]
                        .Disagree
                    : null
                }
                check={props.questSelection['agree/disagree'].disagree.check}
                contend={props.questSelection['agree/disagree'].disagree.check}
                handleToggleCheck={props.handleToggleCheck}
                btnText={'Results'}
                questStartData={props.questStartData}
              />
            </>
          ) : props.title === 'Like/Dislike' ? (
            <>
              <SingleAnswer
                number={'#1'}
                answer={'Like'}
                checkInfo={true}
                percentage={
                  props.questStartData.selectedPercentage && props.questStartData?.selectedPercentage.length > 0
                    ? props.questStartData?.selectedPercentage[props.questStartData?.selectedPercentage.length - 1].Like
                    : null
                }
                check={props.questSelection['like/dislike'].like.check}
                contend={props.questSelection['like/dislike'].like.check}
                handleToggleCheck={props.handleToggleCheck}
                btnText={'Results'}
                questStartData={props.questStartData}
              />
              <SingleAnswer
                number={'#2'}
                answer={'Dislike'}
                checkInfo={true}
                percentage={
                  props.questStartData.selectedPercentage && props.questStartData?.selectedPercentage.length > 0
                    ? props.questStartData?.selectedPercentage[props.questStartData?.selectedPercentage.length - 1]
                        .Dislike
                    : null
                }
                check={props.questSelection['like/dislike'].dislike.check}
                contend={props.questSelection['like/dislike'].dislike.check}
                handleToggleCheck={props.handleToggleCheck}
                btnText={'Results'}
                questStartData={props.questStartData}
              />
            </>
          ) : null}
        </>
      ) : props.title === 'Multiple Choice' || props.title === 'Open Choice' ? (
        <div
          className={`${
            isFullScreen === undefined ? 'quest-scrollbar max-h-[178.2px] min-h-fit overflow-auto md:max-h-[366px]' : ''
          }  mr-1 flex flex-col gap-[5.7px] tablet:gap-[10px]`}
        >
          {props.answers?.map((item, index) => (
            <div key={index + 1}>
              <SingleAnswerMultipleChoice
                number={'#' + (index + 1)}
                answer={item.question}
                addedAnswerUuid={item.uuid}
                title={props.title}
                checkInfo={true}
                selectedPercentages={
                  props.questStartData?.selectedPercentage && props.questStartData.selectedPercentage.length > 0
                    ? props.questStartData.selectedPercentage[props.questStartData.selectedPercentage.length - 1]
                    : null
                }
                contendPercentages={
                  props.questStartData?.contendedPercentage && props.questStartData.contendedPercentage.length > 0
                    ? props.questStartData.contendedPercentage[props.questStartData.contendedPercentage.length - 1]
                    : null
                }
                check={findSelectionContentionCheck(
                  props.questStartData?.startQuestData && props.questStartData.startQuestData.data.length > 0
                    ? props.questStartData?.startQuestData.data[props.questStartData.startQuestData.data.length - 1]
                        .selected
                    : [],
                  item.question,
                )}
                contend={findSelectionContentionCheck(
                  props.questStartData?.startQuestData && props.questStartData.startQuestData.data.length > 0
                    ? props.questStartData?.startQuestData.data[props.questStartData.startQuestData.data.length - 1]
                        .contended
                    : [],
                  item.question,
                )}
                btnText={'Results'}
                answersSelection={props.answersSelection}
                setAnswerSelection={props.setAnswerSelection}
              />
            </div>
          ))}
        </div>
      ) : props.title === 'Ranked Choice' ? (
        <div
          className={`${
            isFullScreen === undefined ? 'quest-scrollbar max-h-[178.2px] min-h-fit overflow-auto md:max-h-[366px]' : ''
          }  mr-[2px] tablet:mr-1 flex flex-col gap-[5.7px] tablet:gap-[10px]`}
        >
          {rankedNewData?.map((item, index) => (
            <div key={index + 1}>
              <RankedResult
                number={'#' + (index + 1)}
                answer={item.question}
                addedAnswerUuid={item.uuid}
                answersSelection={props.answersSelection}
                setAnswerSelection={props.setAnswerSelection}
                title={props.title}
                selectedPercentages={
                  props.questStartData?.selectedPercentage && props.questStartData.selectedPercentage.length > 0
                    ? props.questStartData.selectedPercentage[props.questStartData.selectedPercentage.length - 1]
                    : null
                }
                contendPercentages={
                  props.questStartData?.contendedPercentage && props.questStartData.contendedPercentage.length > 0
                    ? props.questStartData.contendedPercentage[props.questStartData.contendedPercentage.length - 1]
                    : null
                }
                contend={findSelectionContentionCheck(
                  props.questStartData?.startQuestData && props.questStartData.startQuestData.data.length > 0
                    ? props.questStartData?.startQuestData.data[props.questStartData.startQuestData.data.length - 1]
                        .contended
                    : [],
                  item.question,
                )}
                setAddOptionLimit={props.setAddOptionLimit}
                btnText={'Results'}
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Result;
