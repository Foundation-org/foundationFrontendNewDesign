import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../../../../components/ui/Button';
import { useEffect } from 'react';
import { badgesTotalLength } from '../../../../../../constants/varification-badges';

const Summary = () => {
  const navigate = useNavigate();
  const persistedUserInfo = useSelector((state) => state.auth.user);

  return (
    <div className=" mx-auto mb-4 flex max-w-[778px] flex-col gap-3 px-4 tablet:mb-8 tablet:gap-6 tablet:px-6">
      {/* Verification Badge Score */}
      <div>
        <div className="flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px]">
          <div className="flex items-center gap-2">
            {persistedUserInfo?.uuid && persistedUserInfo.role === 'user' ? (
              <div className="relative h-fit w-fit">
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/MeBadge.svg`}
                  alt={'badge'}
                  className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
                />
                <p className="absolute left-1/2 top-[41%] z-50 -translate-x-1/2 -translate-y-1/2 text-[7.3px] font-normal leading-none text-[#7A7016] tablet:top-[40%] tablet:text-[13px]">
                  {persistedUserInfo.badges.length}
                </p>
              </div>
            ) : (
              <div className="relative z-50 h-fit w-fit">
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/badge.svg`}
                  alt={'badge'}
                  className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
                />
                <p className="absolute left-1/2 top-[41%] z-50 -translate-x-1/2 -translate-y-1/2 text-[7.3px] font-normal leading-none text-[#F6F6F6] tablet:top-[40%] tablet:text-[13px]">
                  {persistedUserInfo.badges.length}
                </p>
              </div>
            )}
            <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">
              Verification Badge Score
            </h1>{' '}
          </div>
          <h1 className="text-[14px] font-normal leading-[114%] text-white tablet:text-[18px] tablet:leading-[88%]">
            {persistedUserInfo.badges.length}/{badgesTotalLength}
          </h1>
        </div>
        <div className="rounded-b-[10px] border-[#D9D9D9] bg-[#FDFDFD] px-5 py-[10px] tablet:border-[1.85px] tablet:py-[18.73px]">
          <h1 className="text-[12px] font-medium leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
            Have your data be more desirable for brands and research firms to purchase with more verified info and earn
            more FDX while you’re at it!
          </h1>
          <div className="mt-3 flex w-full justify-center tablet:mt-5">
            <Button variant={'submit'} onClick={() => navigate('/dashboard/profile/verification-badges')}>
              Add Badge
            </Button>
          </div>
        </div>
      </div>
      {/* Post Activity */}
      <div>
        <div className="flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px]">
          <div className="flex items-center gap-2">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/summary/post-activity-logo2.svg`}
              alt={'badge'}
              className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
            />
            <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">Post Activity</h1>
          </div>
        </div>
        <div className="rounded-b-[10px] border-[#D9D9D9] bg-[#FDFDFD] px-5 py-[10px] tablet:border-[1.85px] tablet:py-[18.73px]">
          <h1 className="text-[12px] font-medium leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
            Creating posts is a great way to earn FDX. Especially if others engage with them.
          </h1>
          <div className="mt-3 flex items-center justify-center gap-6 tablet:mt-5">
            <div className="max-w-28 border-r border-[#707175] pr-6 tablet:max-w-full">
              <h1 className="text-center text-[12px] font-semibold leading-[116%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
                Posts you've created
              </h1>
              <h5 className="text-center text-[18px] font-normal text-[#85898C]">{persistedUserInfo?.questsCreated}</h5>
            </div>
            <div className="max-w-24 tablet:max-w-full">
              <h1 className="text-center text-[12px] font-semibold leading-[116%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
                Engagements with your posts
              </h1>
              <h5 className="text-center text-[18px] font-normal text-[#85898C]">
                {persistedUserInfo?.yourPostEngaged}
              </h5>
            </div>
          </div>
          <div className="my-3 flex w-full justify-center tablet:my-5 ">
            <Button variant={'submit'} onClick={() => navigate('/dashboard/profile/post-activity')}>
              View all post activity
            </Button>
          </div>
          <h1 className="text-[12px] font-medium leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
            Not every post may be for you - and that’s ok. If you decide to unhide a post, you can earn FDX by engaging
            with it.
          </h1>
          <div className="mt-3 flex items-center justify-center gap-6 tablet:mt-5">
            <div className="">
              <h1 className="text-center text-[12px] font-semibold leading-[116%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
                Posts you’ve hidden
              </h1>
              <h5 className="text-center text-[18px] font-normal text-[#85898C]">
                {persistedUserInfo?.questsActivity?.myHiddenQuestsCount}
              </h5>
            </div>
          </div>
          <div className="mt-3 flex w-full justify-center tablet:mt-5 ">
            <Button variant={'submit'} onClick={() => navigate('/dashboard/profile/hidden-posts')}>
              View hidden posts
            </Button>
          </div>
        </div>
      </div>
      {/* Feedback */}
      <div>
        <div className="flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px]">
          <div className="flex items-center gap-2">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/summary/feedback-logo.svg`}
              alt={'badge'}
              className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
            />
            <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">Post Feedback</h1>
          </div>
        </div>
        <div className="rounded-b-[10px] border-[#D9D9D9] bg-[#FDFDFD] px-5 py-[10px] tablet:border-[1.85px] tablet:py-[18.73px]">
          <h1 className="text-[12px] font-medium leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
            Not everything you post may be everyone’s cup of tea. See what posts you’ve created others have decided to
            hide and why.
          </h1>
          <div className="mt-3 flex items-center justify-center gap-3 tablet:mt-5 tablet:gap-6">
            <div className="max-w-28 border-r border-[#707175] pr-3 tablet:max-w-full tablet:pr-6">
              <h1 className="text-center text-[12px] font-semibold leading-[116%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
                Hidden posts
              </h1>
              <h5 className="text-center text-[18px] font-normal text-[#85898C]">
                {persistedUserInfo?.feedBackQuestsStatistics?.otherHidingOurQuestsCount}
              </h5>
            </div>
            <div>
              <h1 className="text-center text-[12px] font-semibold leading-[116%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
                Supressed posts
              </h1>
              <h5 className="text-center text-[18px] font-normal text-[#85898C]">
                {persistedUserInfo?.feedBackQuestsStatistics?.suppressQuestsCount}
              </h5>
            </div>
          </div>
          <div className="mt-3 flex w-full justify-center tablet:mt-5 ">
            <Button variant={'submit'} onClick={() => navigate('/dashboard/profile/feedback')}>
              View all post feedback
            </Button>
          </div>
        </div>
      </div>

      {/* Shared Posts */}
      <div>
        <div className="flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px]">
          <div className="flex items-center gap-2">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/summary/share-posts-logo.svg`}
              alt={'badge'}
              className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
            />
            <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">Shared Posts</h1>
          </div>
        </div>
        <div className="rounded-b-[10px] border-[#D9D9D9] bg-[#FDFDFD] px-5 py-[10px] tablet:border-[1.85px] tablet:py-[18.73px]">
          <h1 className="text-[12px] font-medium leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
            Sharing posts is a great way to earn FDX - especially if people engage with them.
          </h1>
          <div className="mt-3 flex items-center justify-center gap-3 tablet:mt-5 tablet:gap-6">
            <div className="max-w-28 border-r border-[#707175] pr-3 tablet:max-w-full tablet:pr-6">
              <h1 className="text-center text-[12px] font-semibold leading-[116%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
                Posts you’ve shared
              </h1>
              <h5 className="text-center text-[18px] font-normal text-[#85898C]">
                {persistedUserInfo?.sharedQuestsStatistics.sharedQuests}
              </h5>
            </div>
            <div className="max-w-28 border-r border-[#707175] pr-3 tablet:max-w-full tablet:pr-6">
              <h1 className="text-center text-[12px] font-semibold leading-[116%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
                Total shared link clicks
              </h1>
              <h5 className="text-center text-[18px] font-normal text-[#85898C]">
                {persistedUserInfo?.sharedQuestsStatistics.totalQuestsImpression}
              </h5>
            </div>
            <div>
              <h1 className="text-center text-[12px] font-semibold leading-[116%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
                Total post engagement
              </h1>
              <h5 className="text-center text-[18px] font-normal text-[#85898C]">
                {persistedUserInfo?.sharedQuestsStatistics.totalQuestsCompleted}
              </h5>
            </div>
          </div>
          <div className="mt-3 flex w-full justify-center tablet:mt-5 ">
            <Button variant={'submit'} onClick={() => navigate('/dashboard/profile/shared-links')}>
              View all shared posts
            </Button>
          </div>
        </div>
      </div>
      {/* My Lists */}
      <div>
        <div className="flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px]">
          <div className="flex items-center gap-2">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/summary/my-list-logo.svg`}
              alt={'badge'}
              className="h-[17.5px] w-[14.6px] tablet:h-[29px] tablet:w-[15px]"
            />
            <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">My Lists</h1>
          </div>
        </div>
        <div className="rounded-b-[10px] border-[#D9D9D9] bg-[#FDFDFD] px-5 py-[10px] tablet:border-[1.85px] tablet:py-[18.73px]">
          <h1 className="text-[12px] font-medium leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
            Sharing lists is a great way to earn FDX - especially if people engage with them.
          </h1>
          <div className="mt-3 flex items-center justify-center gap-2 tablet:mt-5 tablet:gap-6">
            <div className="max-w-28 border-r border-[#707175] pr-3 tablet:max-w-full tablet:pr-6">
              <h1 className="text-center text-[12px] font-semibold leading-[116%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
                Lists You’ve Shared
              </h1>
              <h5 className="text-center text-[18px] font-normal text-[#85898C]">
                {persistedUserInfo?.myListStatistics?.totalSharedListsCount}
              </h5>
            </div>
            <div className="max-w-28 border-r border-[#707175] pr-3 tablet:max-w-full tablet:pr-6">
              <h1 className="text-center text-[12px] font-semibold leading-[116%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
                Total Shared List Clicks
              </h1>
              <h5 className="text-center text-[18px] font-normal text-[#85898C]">
                {persistedUserInfo?.myListStatistics?.totalSharedListsClicksCount}
              </h5>
            </div>
            <div>
              <h1 className="text-center text-[12px] font-semibold leading-[116%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
                Total List Engagements
              </h1>
              <h5 className="text-center text-[18px] font-normal text-[#85898C]">
                {persistedUserInfo?.myListStatistics?.totalSharedListsParticipentsCount}
              </h5>
            </div>
          </div>
          <div className="mt-3 flex w-full justify-center tablet:mt-5 ">
            <Button variant={'submit'} onClick={() => navigate('/dashboard/profile/lists')}>
              View all shared lists
            </Button>
          </div>
        </div>
      </div>
      {/* Other Links */}
      <div className="mt-[2px] flex w-full flex-col gap-3 tablet:gap-[15px]">
        <Link
          to="/dashboard/profile/user-settings"
          className="text-[12px] font-medium leading-normal text-[#4A8DBD] hover:underline tablet:text-[16px]"
        >
          User Settings {'>'}
        </Link>
        <Link
          to="/dashboard/profile/ledger"
          className="text-[12px] font-medium leading-normal text-[#4A8DBD] hover:underline tablet:text-[16px]"
        >
          My Activity {'>'}
        </Link>
      </div>
    </div>
  );
};

export default Summary;
