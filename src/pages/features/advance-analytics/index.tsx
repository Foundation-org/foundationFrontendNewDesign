import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '../../../components/ui/Button';
import AnalyzeDialogueBox from '../../../components/dialogue-boxes/AnalyzeDialogueBox';
import AnalyticResults from './AnalyticResults';
import ClearAllAnalytics from '../../../components/dialogue-boxes/ClearAllAnalytics';
import { closestCorners, DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useAnalyzeOrderMutation } from '../../../services/mutations/advance-analytics';

export default function AdvanceAnalytics({ questStartData }: any) {
  const persistedTheme = useSelector((state: any) => state.utils.theme);
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const plusImg = `${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/plus.svg' : 'assets/svgs/dashboard/add.svg'}`;
  const [analyzePopup, setAnalyzePopup] = useState(false);
  const [clearAnalyticsPopup, setClearAnalyticsPopup] = useState(false);
  const [analyticResults, setAnalyticResults] = useState(questStartData?.advanceAnalytics || []);
  const mouseSensor = useSensor(MouseSensor);
  const keyboardSensor = useSensor(MouseSensor, { activationConstraint: { distance: 5 } });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 500,
      tolerance: 0,
    },
  });

  useEffect(() => {
    setAnalyticResults(questStartData?.advanceAnalytics || []);
  }, [questStartData?.advanceAnalytics]);

  const { mutateAsync: handleOrderAnalyze } = useAnalyzeOrderMutation();

  const handleAnalyzeClose = () => setAnalyzePopup(false);
  const handleClearAnalyticsClose = () => setClearAnalyticsPopup(false);

  const handleOnDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      let data: any;
      setAnalyticResults((items: any) => {
        const oldIndex = items.findIndex((item: any) => item.id === active.id);
        const newIndex = items.findIndex((item: any) => item.id === over.id);
        arrayMove(items, oldIndex, newIndex);
        data = arrayMove(items, oldIndex, newIndex);
        return data;
      });

      if (data) {
        handleOrderAnalyze({
          userUuid: persistedUserInfo.uuid,
          questForeignKey: questStartData._id,
          payload: data,
        } as any);
      }
    }
  };

  return (
    <div className="mt-2 rounded-[12.3px] border-2 border-white-500 bg-white p-[10px] dark:border-gray-100 dark:bg-gray-200 tablet:mt-[15px] tablet:rounded-[15px] tablet:py-[25px]">
      <h1 className="text-center text-[0.75rem] font-semibold leading-[15px] text-accent-600 dark:text-white-400 tablet:text-[1.25rem] tablet:leading-[1.25rem]">
        Advanced Analytics
      </h1>
      <div className="relative mt-[10px] flex flex-col gap-[10px] tablet:mt-[15px] tablet:gap-[15px]">
        <DndContext
          sensors={[touchSensor, mouseSensor, keyboardSensor]}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          collisionDetection={closestCorners}
          onDragEnd={handleOnDragEnd}
        >
          <SortableContext items={analyticResults}>
            {analyticResults?.map((item: any) => (
              <AnalyticResults key={item.id} item={item} questStartData={questStartData} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
      <div className="mt-[10px] flex items-center justify-between tablet:mx-[36px] tablet:mt-[15px]">
        <Button
          variant={'addOption'}
          onClick={() => {
            setAnalyzePopup(true);
          }}
        >
          <img src={plusImg} alt="add" className="size-[7.398px] tablet:size-[15.6px]" />
          Add Function
        </Button>
        {questStartData?.advanceAnalytics?.length >= 1 && (
          <Button
            variant={'remove'}
            onClick={() => {
              setClearAnalyticsPopup(true);
            }}
          >
            Clear All Analytics
          </Button>
        )}
      </div>
      {analyzePopup && (
        <AnalyzeDialogueBox
          handleClose={handleAnalyzeClose}
          modalVisible={analyzePopup}
          title={'Analyze'}
          image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/analyze-dialogbox.svg`}
          questStartData={questStartData}
          update={false}
        />
      )}
      {clearAnalyticsPopup && (
        <ClearAllAnalytics
          handleClose={handleClearAnalyticsClose}
          modalVisible={clearAnalyticsPopup}
          title={'Clear All Analytics'}
          image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/analyze-dialogbox.svg`}
          id={questStartData?._id}
        />
      )}
    </div>
  );
}
