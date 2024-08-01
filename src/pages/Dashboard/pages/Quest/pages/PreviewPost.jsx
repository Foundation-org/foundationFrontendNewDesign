import Topbar from '../../../components/Topbar';
import DashboardLayout from '../../../components/DashboardLayout';
import QuestionCardWithToggle from '../../QuestStartSection/components/QuestionCardWithToggle';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../../../../components/ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { getConstantsValues } from '../../../../../features/constants/constantsSlice';
import { hardcodedValues } from '../../../../../constants/dummyPost';
import { createInfoQuest } from '../../../../../services/api/questsApi';
import { addAdultFilterPopup, addPlayerId } from '../../../../../features/quest/utilsSlice';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as filtersActions from '../../../../../features/sidebar/filtersSlice';
import * as createQuestAction from '../../../../../features/createQuest/createQuestSlice';
import * as pictureMediaAction from '../../../../../features/createQuest/pictureMediaSlice';
import { FaSpinner } from 'react-icons/fa';
import Breadcrumb from '../../../../../components/Breadcrumb';

export default function PreviewPost() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const persistedConstants = useSelector(getConstantsValues);
  const filterStates = useSelector(filtersActions.getFilters);

  console.log(state.state);

  const post = {
    ...hardcodedValues,
    ...state.state,
  };

  const { mutateAsync: createQuest, isPending } = useMutation({
    mutationFn: createInfoQuest,
    onSuccess: (resp) => {
      if (resp.status === 201) {
        if (filterStates?.moderationRatingFilter?.initial === 0 && filterStates?.moderationRatingFilter?.final === 0) {
          dispatch(addAdultFilterPopup({ rating: resp.data.moderationRatingCount }));
          dispatch(addPlayerId(resp.data.questID));
        }
        navigate('/');
        queryClient.invalidateQueries(['userInfo']);

        dispatch(createQuestAction.resetCreateQuest());
        dispatch(pictureMediaAction.resetToInitialState());
      }

      queryClient.invalidateQueries('FeedData');
      queryClient.invalidateQueries('treasury');
    },
    onError: (err) => {
      if (err.response) {
        showToast('error', 'error', {}, err.response.data.message.split(':')[1]);
      }

      //   setMultipleOption(false);
      //   setAddOption(false);
      //   setChangedOption('');
      //   setChangeState(false);
    },
  });

  return (
    <>
      <Topbar />
      <div className="w-full bg-[#F2F3F5] dark:bg-black">
        <DashboardLayout>
          <Breadcrumb />
          <div className="mx-auto flex h-[calc(100dvh-91px)] w-full max-w-[1440px] tablet:h-[calc(100vh-96px)] laptop:mx-[331px] laptop:h-[calc(100vh-70px)] laptop:px-4 desktop:mx-auto desktop:px-0">
            <div className="w-full overflow-y-auto py-2 no-scrollbar tablet:px-6 tablet:py-5 laptop:px-0">
              <div className="relative mx-auto max-w-[730px] px-4 tablet:px-0">
                <div className="absolute left-0 top-0 z-20 size-full cursor-default" />
                <QuestionCardWithToggle questStartData={post} />
              </div>
              <div className="mx-auto flex w-full max-w-[730px] justify-between gap-4 px-8 tablet:px-10">
                <Button
                  variant="cancel"
                  className="mt-[10px] w-full max-w-full tablet:mt-[25px] tablet:w-full laptop:w-full"
                  onClick={() => {
                    navigate(state.path);
                  }}
                >
                  Continue Editing
                </Button>
                <Button
                  variant="submit"
                  onClick={() => createQuest(state.state)}
                  className="mt-[10px] w-full tablet:mt-[25px] tablet:w-full"
                  disabled={isPending}
                >
                  {isPending === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Create'}
                  <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[10px] tablet:text-[13px]">
                    (+{persistedConstants?.QUEST_CREATED_AMOUNT} FDX)
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </div>
    </>
  );
}
