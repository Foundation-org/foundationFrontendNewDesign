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
          Track your engagement and influence within the Foundation community.
        </h1>
        <div className="mt-3 flex items-center justify-center gap-3 tablet:mt-5 tablet:gap-6">
          <div className="max-w-28 border-r border-[#707175] pr-3 dark:border-gray-300 tablet:max-w-full tablet:pr-6">
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Posts you've created
            </h1>
            <h5 className="text-center text-[18px] font-normal">{persistedUserInfo?.questsCreated}</h5>
          </div>
          <div className="max-w-28 border-r border-[#707175] pr-3 dark:border-gray-300 tablet:max-w-full tablet:pr-6">
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Engagements with your posts
            </h1>
            <h5 className="text-center text-[18px] font-normal">{persistedUserInfo?.yourPostEngaged}</h5>
          </div>
          <div className="max-w-28 border-r border-[#707175] pr-3 dark:border-gray-300 tablet:max-w-full tablet:pr-6">
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Posts I've engaged with
            </h1>
            <h5 className="text-center text-[18px] font-normal">
              {persistedUserInfo?.questsActivity?.myQuestsEngagementCount || 0}
            </h5>
          </div>
        </div>

        <div className="mt-3 flex w-full justify-center tablet:mt-5">
          <Button variant={'submit'} onClick={() => navigate('/profile/post-activity')}>
            View all post activity
          </Button>
          {/* <Button variant={'submit'} onClick={() => navigate('/profile/feedback-given')}>
            View all feedback given
          </Button> */}
        </div>
      </SummaryCard>
      <SummaryCard headerIcon="/assets/summary/feedback-given.svg" headerTitle="Feedback Given">
        <h1 className="text-[12px] font-medium leading-[13.56px] tablet:text-[16px] tablet:leading-normal">
          See the feedback you've given on others' posts, including those you've chosen to hide.
        </h1>
        <div className="mt-3 grid grid-cols-2 divide-x divide-[#707175] text-center dark:divide-gray-300 tablet:mt-5">
          <div className="flex w-full justify-end">
            <div className="w-full max-w-28 pr-2 tablet:max-w-[200px] tablet:pr-4">
              <h1 className="text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
                Posts I have given feedback on
              </h1>
              <h5 className="text-[18px] font-normal">{persistedUserInfo?.questsActivity?.feedbackGiven}</h5>
            </div>
          </div>
          <div className="w-full max-w-28 pl-2 tablet:max-w-[200px] tablet:pl-4">
            <h1 className="text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Posts I have hidden
            </h1>
            <h5 className="text-[18px] font-normal">{persistedUserInfo?.questsActivity?.myHiddenQuestsCount}</h5>
          </div>
        </div>
        <div className="mt-3 flex w-full justify-center tablet:mt-5">
          <Button variant={'submit'} onClick={() => navigate('/profile/feedback-given')}>
            View all feedback given
          </Button>
        </div>
      </SummaryCard>
      <SummaryCard headerIcon="/assets/summary/feedback-received.svg" headerTitle="Feedback Received">
        <h1 className="text-[12px] font-medium leading-[13.56px] tablet:text-[16px] tablet:leading-normal">
          Here’s a look at the posts you’ve created that others have provided feedback on, including those they've
          chosen to hide.
        </h1>
        <div className="mt-3 grid grid-cols-2 divide-x divide-[#707175] text-center dark:divide-gray-300 tablet:mt-5">
          <div className="flex w-full justify-end">
            <div className="w-full max-w-28 pr-2 tablet:max-w-[200px] tablet:pr-4">
              <h1 className="text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
                Feedback on my posts
              </h1>
              <h5 className="text-[18px] font-normal">{persistedUserInfo?.questsActivity?.feedbackReceived}</h5>
            </div>
          </div>
          <div className="w-full max-w-28 pl-2 tablet:max-w-[200px] tablet:pl-4">
            <h1 className="text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Hidden Posts
            </h1>
            <h5 className="text-center text-[18px] font-normal">
              {persistedUserInfo?.feedBackQuestsStatistics?.otherHidingOurQuestsCount}
            </h5>
          </div>
        </div>
        <div className="mt-3 flex w-full justify-center tablet:mt-5">
          <Button variant={'submit'} onClick={() => navigate('/profile/feedback')}>
            View all feedback received
          </Button>
        </div>
      </SummaryCard>

      <SummaryCard headerIcon="/assets/summary/share-posts-logo.svg" headerTitle="Shared Posts">
        <h1 className="text-[12px] font-medium leading-[13.56px] tablet:text-[16px] tablet:leading-normal">
          Sharing posts helps broaden your reach. The more engagement your shares receive, the more FDX you earn. Shared
          posts are displayed on your Home Page for all to see.
        </h1>
        <div className="mt-3 flex items-center justify-center gap-3 tablet:mt-5 tablet:gap-6">
          <div className="max-w-28 border-r border-[#707175] pr-3 dark:border-gray-300 tablet:max-w-full tablet:pr-6">
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Posts you’ve shared
            </h1>
            <h5 className="text-center text-[18px] font-normal">
              {persistedUserInfo?.sharedQuestsStatistics?.sharedQuests}
            </h5>
          </div>
          <div className="max-w-28 border-r border-[#707175] pr-3 dark:border-gray-300 tablet:max-w-full tablet:pr-6">
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Total shared link clicks
            </h1>
            <h5 className="text-center text-[18px] font-normal">
              {persistedUserInfo?.sharedQuestsStatistics?.totalQuestsImpression}
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
        <div className="mt-3 flex w-full justify-center tablet:mt-5">
          <Button variant={'submit'} onClick={() => navigate('/profile/shared-links')}>
            View all shared posts
          </Button>
        </div>
      </SummaryCard>
      <SummaryCard headerIcon="/assets/summary/my-list-logo.svg" headerTitle="My Lists">
        <h1 className="text-[12px] font-medium leading-[13.56px] tablet:text-[16px] tablet:leading-normal">
          Creating and sharing lists extends your reach. The more engagement your lists receive, the more FDX you earn.
          Lists you share are displayed on your Home Page for everyone to see.
        </h1>
        <div className="mt-3 flex items-center justify-center gap-2 tablet:mt-5 tablet:gap-6">
          <div className="max-w-28 border-r border-[#707175] pr-3 dark:border-gray-300 tablet:max-w-full tablet:pr-6">
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Lists you’ve shared
            </h1>
            <h5 className="text-center text-[18px] font-normal">
              {persistedUserInfo?.myListStatistics?.totalSharedListsCount}
            </h5>
          </div>
          <div className="max-w-28 border-r border-[#707175] pr-3 dark:border-gray-300 tablet:max-w-full tablet:pr-6">
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
        <div className="mt-3 flex w-full justify-center tablet:mt-5">
          <Button variant={'submit'} onClick={() => navigate('/profile/lists')}>
            View all shared lists
          </Button>
        </div>
      </SummaryCard>
      {/* Other Links */}
      <div className="mt-[2px] flex w-full flex-col gap-3 tablet:gap-[15px]">
        <Link
          to="/profile/user-settings"
          className="text-[12px] font-medium leading-normal text-[#4A8DBD] hover:underline dark:text-blue-600 tablet:text-[16px]"
        >
          User Settings {'>'}
        </Link>
        <Link
          to="/profile/ledger"
          className="text-[12px] font-medium leading-normal text-[#4A8DBD] hover:underline dark:text-blue-600 tablet:text-[16px]"
        >
          My Activity {'>'}
        </Link>
      </div>
    </div>
  );
};

export default Summary;
