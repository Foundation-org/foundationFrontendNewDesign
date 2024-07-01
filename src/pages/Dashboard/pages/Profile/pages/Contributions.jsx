import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
// import { formatCountNumber } from '../../../../../utils/utils';
import { Link } from 'react-router-dom';

const Contributions = () => {
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);

  useEffect(() => {
    queryClient.invalidateQueries(['userInfo']);
  }, []);

  const yourPosts = [
    { id: 1, title: 'Posts you’ve created', val: (persistedUserInfo && persistedUserInfo?.questsCreated) || 0 },
    {
      id: 2,
      title: 'Engagements with your posts',
      val: (persistedUserInfo && persistedUserInfo?.yourPostEngaged) || 0,
    },
    { id: 3, title: 'Objections received', val: (persistedUserInfo && persistedUserInfo?.contentionsOnAddedAns) || 0 },
    { id: 4, title: 'Agreements received', val: (persistedUserInfo && persistedUserInfo?.selectionsOnAddedAns) || 0 },
    {
      id: 5,
      title: 'My posts hidden by users',
      val: (persistedUserInfo && persistedUserInfo?.feedBackQuestsStatistics?.otherHidingOurQuestsCount) || 0,
    },
  ];

  const othersPosts = [
    {
      id: 1,
      title: 'Posts you’ve engaged with',
      val: (persistedUserInfo && persistedUserInfo?.questsActivity?.myQuestsEngagementCount) || 0,
    },
    { id: 2, title: 'Options added', val: (persistedUserInfo && persistedUserInfo?.addedAnswers) || 0 },
    { id: 3, title: 'Changing my option', val: (persistedUserInfo && persistedUserInfo?.changedAnswers) || 0 },
    { id: 4, title: 'Objections given', val: (persistedUserInfo && persistedUserInfo?.contentionsGiven) || 0 },
    {
      id: 5,
      title: 'Posts I have hidden',
      val: (persistedUserInfo && persistedUserInfo?.questsActivity?.myHiddenQuestsCount) || 0,
    },
  ];

  return (
    <div className="mx-4 mb-4 flex max-w-[778px] flex-col gap-[15px] overflow-y-auto tablet:mx-6">
      {/* Summary Section */}
      <div className="mx-auto w-full">
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
          <h1 className="text-[12px] font-medium leading-[13.56px] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
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
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto w-full">
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
                <p className="absolute left-1/2 top-[41%] z-50 -translate-x-1/2 -translate-y-1/2 text-[7.3px] font-normal leading-none text-[#7A7016] tablet:top-[40%] tablet:text-[13px]">
                  {persistedUserInfo.badges.length}
                </p>
              </div>
            )}
            <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">Your Posts</h1>{' '}
          </div>
          {/* <h1 className="text-[14px] font-normal leading-[114%] text-white tablet:text-[18px] tablet:leading-[88%]">
            {persistedUserInfo.badges.length}/22
          </h1> */}
        </div>
        <div className="flex flex-col gap-2 rounded-b-[10px] border-[1.85px] border-[#D9D9D9] bg-[#FDFDFD] px-[15px] py-[10px] tablet:gap-[25px] tablet:p-[25px]">
          {yourPosts.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-[#7C7C7C]">
              <h4 className="text-center text-[12px] font-medium leading-[153%] tablet:text-[18px]">{item.title}</h4>
              <h4 className="text-center text-[12px] font-medium leading-[153%] tablet:text-[18px]">{item.val}</h4>
            </div>
          ))}
          <Link
            to={'/profile/feedback'}
            className="font-noraml -mt-2 cursor-pointer text-[9px] leading-[119%] text-[#4A8DBD] hover:underline tablet:-mt-6 tablet:text-[14px] tablet:leading-[121.4%]"
          >
            See why your posts were hidden {'>'}
          </Link>
        </div>
      </div>
      <div className="mx-auto w-full">
        <div className="flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px]">
          <div className="flex items-center gap-2">
            <div className="relative z-50 h-fit w-fit">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/badge_icon.png`}
                alt={'badge'}
                className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
              />
              {/* <p className="absolute left-1/2 top-[41%] z-50 -translate-x-1/2 -translate-y-1/2 text-[7.3px] font-normal leading-none text-[#F6F6F6] tablet:top-[40%] tablet:text-[13px]">
                {persistedUserInfo.badges.length}aaa
              </p> */}
            </div>
            <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">Other Posts</h1>{' '}
          </div>
          {/* <h1 className="text-[14px] font-normal leading-[114%] text-white tablet:text-[18px] tablet:leading-[88%]">
            {persistedUserInfo.role === 'user' ? 0 : persistedUserInfo.badges.length}/24
          </h1> */}
        </div>
        <div className="flex flex-col gap-2 rounded-b-[10px] border-[1.85px] border-[#D9D9D9] bg-[#FDFDFD] px-[15px] py-[10px] tablet:gap-[25px] tablet:p-[25px]">
          {othersPosts.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-[#7C7C7C]">
              <h4 className="text-center text-[12px] font-medium leading-[153%] tablet:text-[18px]">{item.title}</h4>
              <h4 className="text-center text-[12px] font-medium leading-[153%] tablet:text-[18px]">{item.val}</h4>
            </div>
          ))}
          <Link
            to={'/profile/hidden-posts'}
            className="-mt-2 cursor-pointer text-[9px] font-normal leading-[119%] text-[#4A8DBD] hover:underline tablet:-mt-6 tablet:text-[14px] tablet:leading-[121.4%]"
          >
            View posts you’ve hidden and why {'>'}
          </Link>
        </div>
      </div>
      <div className="mx-auto w-full">
        <div className="flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px]">
          <div className="flex items-center gap-2">
            <div className="relative z-50 h-fit w-fit">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/post-activity/coc-icon.svg`}
                alt={'badge'}
                className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
              />
              <p className="absolute left-1/2 top-[41%] z-50 -translate-x-1/2 -translate-y-1/2 text-[7.3px] font-normal leading-none text-[#F6F6F6] tablet:top-[40%] tablet:text-[13px]">
                {persistedUserInfo.badges.length}
              </p>
            </div>
            <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">
              Code of Conduct
            </h1>{' '}
          </div>
          {/* <h1 className="text-[14px] font-normal leading-[114%] text-white tablet:text-[18px] tablet:leading-[88%]">
            {persistedUserInfo.badges.length}/24
          </h1> */}
        </div>
        <div className="flex flex-col gap-2 rounded-b-[10px] border-[1.85px] border-[#D9D9D9] bg-[#FDFDFD] px-[15px] py-[10px] tablet:gap-[25px] tablet:p-[25px]">
          <div className="flex items-center justify-between text-[#7C7C7C]">
            <h4 className="text-center text-[12px] font-medium leading-[153%] tablet:text-[18px]">
              Number of code of conduct violations
            </h4>
            <h4 className="text-center text-[12px] font-medium leading-[153%] tablet:text-[18px]">
              {(persistedUserInfo && persistedUserInfo?.violationCounter) || 0}
            </h4>
          </div>
          <Link
            to={'/help/terms-of-service'}
            className="-mt-2 cursor-pointer text-[9px] font-normal leading-[119%] text-[#4A8DBD] hover:underline tablet:-mt-6 tablet:text-[14px] tablet:leading-[121.4%]"
          >
            View code of conduct {'>'}
          </Link>
        </div>
      </div>
      {/* <div
        className={`${
          persistedTheme === 'dark' ? 'dark-shadow-inside border-2 border-[#858585] dark:border-white' : 'shadow-inside'
        } relative ml-[42px] mr-[59px] hidden h-[183px] rounded-[45px] laptop:block`}
      >
        <div className="absolute -top-7 left-[50%] flex w-full -translate-x-[50%] transform gap-[10px] px-[10px] 2xl:justify-center">
          {list?.map((item) => (
            <div className="w-full" key={item.id}>
              <div className="flex flex-col items-center justify-center text-[#7C7C7C] dark:text-white">
                <img
                  src={persistedTheme === 'dark' ? item.icon : item.iconLight}
                  alt={item.alt}
                  className="mb-3 h-[49px] w-[49px]"
                />
                <h4 className="text-center text-[14.72px] font-semibold leading-[17.8px]">
                  {item.title.split('-')[0]}
                </h4>
                <h4 className="mb-6 text-center text-[14.72px] font-semibold leading-[17.8px]">
                  {item.title.split('-')[1]}
                </h4>
                <h1 className="text-center text-[28px] font-semibold leading-[11.45px]">
                  {formatCountNumber(item.value)}
                </h1>
              </div>
            </div>
          ))}
        </div>
      </div> */}
      {/* <div className="flex flex-col gap-[30px] tablet:gap-16 laptop:hidden">
        <div
          className={`${
            persistedTheme === 'dark' ? 'dark-shadow-inside border-[1px] border-[#858585]' : 'shadow-inside'
          } relative mx-[18px] h-[82px] rounded-[11.4px] border-[#858585] tablet:mx-[42px] tablet:h-[183px] tablet:rounded-[45px] tablet:border-[2px]`}
        >
          <div className="absolute -top-3 left-[50%] flex w-full -translate-x-[50%] transform gap-2 px-[10px] tablet:-top-7">
            {firstHalf?.map((item) => (
              <div className="w-full" key={item.id}>
                <div className="flex flex-col items-center justify-center">
                  <img
                    src={persistedTheme === 'dark' ? item.icon : item.iconLight}
                    alt={item.alt}
                    className="mb-[7px] h-[23px] w-[23px] tablet:mb-[18px] tablet:h-[60px] tablet:w-[50px]"
                  />
                  <h4 className="text-center text-[8px] font-semibold leading-[9.68px] text-[#7C7C7C] tablet:text-[18px] tablet:leading-[25px] dark:text-[#B8B8B8]">
                    {item.title.split('-')[0]}
                  </h4>
                  <h4 className="mb-[10px] text-center text-[8px] font-semibold leading-[9.68px] text-[#7C7C7C] tablet:mb-6 tablet:text-[18px] tablet:leading-[25px] dark:text-[#B8B8B8]">
                    {item.title.split('-')[1]}
                  </h4>
                  <h1 className="text-center text-[16px] font-semibold leading-[14px] text-[#7C7C7C] 2xl:text-[35px] tablet:text-[24px] dark:text-[#B8B8B8]">
                    {formatCountNumber(item.value)}
                  </h1>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          className={`${
            persistedTheme === 'dark' ? 'dark-shadow-inside border-[1px] border-[#858585]' : 'shadow-inside'
          } relative mx-[18px] h-[82px] rounded-[11.4px] border-[#858585] tablet:mx-[42px] tablet:h-[183px] tablet:rounded-[45px] tablet:border-[2px]`}
        >
          <div className="absolute -top-3 left-[50%] flex w-full -translate-x-[50%] transform gap-2 px-[10px] tablet:-top-7">
            {secondHalf?.map((item) => (
              <div className="w-full" key={item.id}>
                <div className="flex flex-col items-center justify-center">
                  <img
                    src={persistedTheme === 'dark' ? item.icon : item.iconLight}
                    alt={item.alt}
                    className="mb-[7px] h-[23px] w-[23px] tablet:mb-[18px] tablet:h-[60px] tablet:w-[50px]"
                  />
                  <h4 className="text-center text-[8px] font-semibold leading-[9.68px] text-[#7C7C7C] tablet:text-[18px] tablet:leading-[25px] dark:text-[#B8B8B8]">
                    {item.title.split('-')[0]}
                  </h4>
                  <h4 className="mb-[10px] text-center text-[8px] font-semibold leading-[9.68px] text-[#7C7C7C] tablet:mb-6 tablet:text-[18px] tablet:leading-[25px] dark:text-[#B8B8B8]">
                    {item.title.split('-')[1]}
                  </h4>
                  <h1 className="text-center text-[16px] font-semibold leading-[14px] text-[#7C7C7C] 2xl:text-[35px] tablet:text-[24px] dark:text-[#B8B8B8]">
                    {formatCountNumber(item.value)}
                  </h1>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Contributions;
