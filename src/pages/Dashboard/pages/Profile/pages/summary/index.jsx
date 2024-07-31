import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../../../../components/ui/Button';
import VerificationBadgeScore from '../../../../../../components/summary/VerificationBadgeScore';
import SummaryCard from '../../../../../../components/SummaryCard';

const Summary = () => {
  const navigate = useNavigate();
  const persistedUserInfo = useSelector((state) => state.auth.user);

  return (
    <div className="mx-auto mb-4 flex max-w-[778px] flex-col gap-3 px-4 tablet:mb-8 tablet:gap-6 tablet:px-6">
      <VerificationBadgeScore />
      <SummaryCard headerIcon="/assets/summary/post-activity-logo2.svg" headerTitle="Post Activity">
        <h1 className="text-[12px] font-medium leading-[13.56px] tablet:text-[16px] tablet:leading-normal">
          Creating posts is a great way to earn FDX. Especially if others engage with them.
        </h1>
        <div className="mt-3 flex items-center justify-center gap-6 tablet:mt-5">
          <div className="max-w-28 border-r border-[#707175] pr-6 tablet:max-w-full dark:border-gray-300">
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Posts you've created
            </h1>
            <h5 className="text-center text-[18px] font-normal">{persistedUserInfo?.questsCreated}</h5>
          </div>
          <div className="max-w-24 tablet:max-w-full">
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Engagements with your posts
            </h1>
            <h5 className="text-center text-[18px] font-normal">{persistedUserInfo?.yourPostEngaged}</h5>
          </div>
        </div>
        <div className="my-3 flex w-full justify-center tablet:my-5 ">
          <Button variant={'submit'} onClick={() => navigate('/profile/post-activity')}>
            View all post activity
          </Button>
        </div>
        <h1 className="text-[12px] font-medium leading-[13.56px] tablet:text-[16px] tablet:leading-normal">
          Not every post may be for you - and that’s ok. If you decide to unhide a post, you can earn FDX by engaging
          with it.
        </h1>
        <div className="mt-3 flex items-center justify-center gap-6 tablet:mt-5">
          <div className="max-w-28 border-r border-[#707175] pr-6 tablet:max-w-full dark:border-gray-300">
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Posts you've given feedback
            </h1>
            <h5 className="text-center text-[18px] font-normal">
              {persistedUserInfo?.questsActivity?.feedbackGiven || 0}
            </h5>
          </div>
          <div className="max-w-24 tablet:max-w-full">
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Posts you’ve hidden
            </h1>
            <h5 className="text-center text-[18px] font-normal">
              {persistedUserInfo?.questsActivity?.myHiddenQuestsCount}
            </h5>{' '}
          </div>
        </div>
        <div className="mt-3 flex w-full justify-center tablet:mt-5 ">
          <Button variant={'submit'} onClick={() => navigate('/profile/feedback-given')}>
            View all feedback given
          </Button>
        </div>
      </SummaryCard>
      <SummaryCard headerIcon="/assets/summary/feedback-logo.svg" headerTitle="Feedback">
        <h1 className="text-[12px] font-medium leading-[13.56px] tablet:text-[16px] tablet:leading-normal">
          Not everything you post may be everyone’s cup of tea. See what posts you’ve created others have decided to
          hide and why.
        </h1>
        <div className="mt-3 flex items-center justify-center gap-3 tablet:mt-5 tablet:gap-6">
          <div className="max-w-28 border-r border-[#707175] pr-3 tablet:max-w-full tablet:pr-6 dark:border-gray-300">
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Hidden posts
            </h1>
            <h5 className="text-center text-[18px] font-normal">
              {persistedUserInfo?.feedBackQuestsStatistics?.otherHidingOurQuestsCount}
            </h5>
          </div>
          <div>
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Supressed posts
            </h1>
            <h5 className="text-center text-[18px] font-normal">
              {persistedUserInfo?.feedBackQuestsStatistics?.suppressQuestsCount}
            </h5>
          </div>
        </div>
        <div className="mt-3 flex w-full justify-center tablet:mt-5 ">
          <Button variant={'submit'} onClick={() => navigate('/profile/feedback')}>
            View all feedback received
          </Button>
        </div>
      </SummaryCard>
      <SummaryCard headerIcon="/assets/summary/share-posts-logo.svg" headerTitle="Shared Posts">
        <h1 className="text-[12px] font-medium leading-[13.56px] tablet:text-[16px] tablet:leading-normal">
          Sharing posts is a great way to earn FDX - especially if people engage with them.
        </h1>
        <div className="mt-3 flex items-center justify-center gap-3 tablet:mt-5 tablet:gap-6">
          <div className="max-w-28 border-r border-[#707175] pr-3 tablet:max-w-full tablet:pr-6 dark:border-gray-300">
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Posts you’ve shared
            </h1>
            <h5 className="text-center text-[18px] font-normal">
              {persistedUserInfo?.sharedQuestsStatistics.sharedQuests}
            </h5>
          </div>
          <div className="max-w-28 border-r border-[#707175] pr-3 tablet:max-w-full tablet:pr-6 dark:border-gray-300">
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Total shared link clicks
            </h1>
            <h5 className="text-center text-[18px] font-normal">
              {persistedUserInfo?.sharedQuestsStatistics.totalQuestsImpression}
            </h5>
          </div>
          <div>
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Total post engagement
            </h1>
            <h5 className="text-center text-[18px] font-normal">
              {persistedUserInfo?.sharedQuestsStatistics.totalQuestsCompleted}
            </h5>
          </div>
        </div>
        <div className="mt-3 flex w-full justify-center tablet:mt-5 ">
          <Button variant={'submit'} onClick={() => navigate('/profile/shared-links')}>
            View all shared posts
          </Button>
        </div>
      </SummaryCard>
      <SummaryCard headerIcon="/assets/summary/my-list-logo.svg" headerTitle="My Lists">
        <h1 className="text-[12px] font-medium leading-[13.56px] tablet:text-[16px] tablet:leading-normal">
          Sharing lists is a great way to earn FDX - especially if people engage with them.
        </h1>
        <div className="mt-3 flex items-center justify-center gap-2 tablet:mt-5 tablet:gap-6">
          <div className="max-w-28 border-r border-[#707175] pr-3 tablet:max-w-full tablet:pr-6 dark:border-gray-300">
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Lists you’ve shared
            </h1>
            <h5 className="text-center text-[18px] font-normal">
              {persistedUserInfo?.myListStatistics?.totalSharedListsCount}
            </h5>
          </div>
          <div className="max-w-28 border-r border-[#707175] pr-3 tablet:max-w-full tablet:pr-6 dark:border-gray-300">
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Total shared list clicks
            </h1>
            <h5 className="text-center text-[18px] font-normal">
              {persistedUserInfo?.myListStatistics?.totalSharedListsClicksCount}
            </h5>
          </div>
          <div>
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Total list engagements
            </h1>
            <h5 className="text-center text-[18px] font-normal">
              {persistedUserInfo?.myListStatistics?.totalSharedListsParticipentsCount}
            </h5>
          </div>
        </div>
        <div className="mt-3 flex w-full justify-center tablet:mt-5 ">
          <Button variant={'submit'} onClick={() => navigate('/profile/lists')}>
            View all shared lists
          </Button>
        </div>
      </SummaryCard>
      {/* Other Links */}
      <div className="mt-[2px] flex w-full flex-col gap-3 tablet:gap-[15px]">
        <Link
          to="/profile/user-settings"
          className="text-[12px] font-medium leading-normal text-[#4A8DBD] hover:underline tablet:text-[16px] dark:text-blue-600"
        >
          User Settings {'>'}
        </Link>
        <Link
          to="/profile/ledger"
          className="text-[12px] font-medium leading-normal text-[#4A8DBD] hover:underline tablet:text-[16px] dark:text-blue-600"
        >
          My Activity {'>'}
        </Link>
      </div>
    </div>
  );
};

export default Summary;
