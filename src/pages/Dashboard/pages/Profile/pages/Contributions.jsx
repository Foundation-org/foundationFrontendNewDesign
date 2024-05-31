import { useSelector } from 'react-redux';
import { formatCountNumber } from '../../../../../utils/utils';
import { Link } from 'react-router-dom';

const Contributions = () => {
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const persistedTheme = useSelector((state) => state.utils.theme);

  const list = [
    {
      id: 1,
      icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon1.svg`,
      iconLight: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon11.svg`,
      alt: 'icon1',
      title: 'Posts-Created',
      value: (persistedUserInfo && persistedUserInfo?.questsCreated) || 0,
    },
    {
      id: 2,
      icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon2.svg`,
      iconLight: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon12.svg`,
      alt: 'icon1',
      title: 'Posts-Engaged',
      value: (persistedUserInfo && persistedUserInfo?.yourPostEngaged) || 0,
    },
    {
      id: 3,
      icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/your-post-engaged.svg`,
      iconLight: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/your-post-engaged.svg`,
      alt: 'your-post-engaged',
      title: 'Your Posts-Engaged',
      value: (persistedUserInfo && persistedUserInfo?.usersAnswered) || 0,
    },
    {
      id: 4,
      icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon5.svg`,
      iconLight: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon15.svg`,
      alt: 'icon1',
      title: 'Selections-Changed',
      value: (persistedUserInfo && persistedUserInfo?.changedAnswers) || 0,
    },
    {
      id: 5,
      icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/couter-eye.svg`,
      iconLight: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/couter-eye.svg`,
      alt: 'icon5',
      title: 'Your Posts-Hidden',
      value: (persistedUserInfo && persistedUserInfo?.yourHiddenPostCounter) || 0,
    },
    {
      id: 6,
      icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon6.svg`,
      iconLight: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon16.svg`,
      alt: 'icon1',
      title: 'Options-Added',
      value: (persistedUserInfo && persistedUserInfo?.addedAnswers) || 0,
    },
    {
      id: 7,
      icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon7.svg`,
      iconLight: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon17.svg`,
      alt: 'icon1',
      title: 'Agreement-Received',
      value: (persistedUserInfo && persistedUserInfo?.selectionsOnAddedAns) || 0,
    },
    {
      id: 8,
      icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon8.svg`,
      iconLight: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon18.svg`,
      alt: 'icon1',
      title: 'Objections-Received',
      value: (persistedUserInfo && persistedUserInfo?.contentionsOnAddedAns) || 0,
    },
    {
      id: 9,
      icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon9.svg`,
      iconLight: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon19.svg`,
      alt: 'icon1',
      title: 'Objections-Given',
      value: (persistedUserInfo && persistedUserInfo?.contentionsGiven) || 0,
    },
    {
      id: 10,
      icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/last.svg`,
      iconLight: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon20.svg`,
      alt: 'icon1',
      title: 'Code of-Conduct Fails',
      value: (persistedUserInfo && persistedUserInfo?.violationCounter) || 0,
    },
  ];

  const firstHalf = list.slice(0, Math.ceil(list.length / 2));
  const secondHalf = list.slice(Math.ceil(list.length / 2));

  const yourPosts = [
    {
      id: 1,
      title: 'Posts you’ve created',
      value: 10,
    },
    {
      id: 2,
      title: 'Engagement with your posts',
      value: 10,
    },
    {
      id: 3,
      title: 'Objections received',
      value: 10,
    },
    {
      id: 4,
      title: 'Agreements received',
      value: 10,
    },
    {
      id: 5,
      title: 'Number of posts hidden',
      value: 10,
    },
  ];

  const othersPosts = [
    { id: 1, title: 'Posts you’ve engaged with', val: 0 },
    { id: 2, title: 'Options added', val: 0 },
    { id: 3, title: 'Change of answers', val: 0 },
    { id: 4, title: 'Objections given', val: 0 },
    { id: 5, title: 'Hidden posts', val: 0 },
  ];

  return (
    <div className="mx-[15px] mb-4 flex max-w-[778px] flex-col gap-[15px] overflow-y-auto tablet:mx-6">
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
          {/* <h1 className="text-[14px] font-normal leading-[114%] text-white tablet:text-[18px] tablet:leading-[88%]">
            3/10
          </h1> */}
        </div>
        <div className="rounded-b-[10px] border-[#D9D9D9] bg-[#FDFDFD] px-5 py-[10px] tablet:border-[1.85px] tablet:py-[18.73px]">
          <h1 className="text-[12px] font-medium leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
            Creating posts is a great way to earn FDX. Especially if others engage with them.
          </h1>
          <div className="mt-[10px] flex items-center justify-center gap-2 tablet:mt-4 tablet:gap-6">
            <div className="max-w-28 border-r border-[#707175] pr-3 tablet:max-w-full tablet:pr-6">
              <h1 className="text-center text-[12px] font-semibold leading-[116%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
                Posts you’ve created
              </h1>
              <h5 className="text-center text-[18px] font-normal text-[#85898C]">3</h5>
            </div>
            <div>
              <h1 className="text-center text-[12px] font-semibold leading-[116%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
                Number of engagements
              </h1>
              <h5 className="text-center text-[18px] font-normal text-[#85898C]">10</h5>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {/* <h1 className="mb-[25px] ml-[26px] mt-[6px] text-[12px] font-bold leading-normal text-[#4A8DBD] tablet:mb-[54px] tablet:ml-[46px] tablet:text-[24.99px] tablet:font-semibold laptop:ml-[156px] laptop:text-[32px] dark:text-[#B8B8B8]">
        My Contributions
      </h1> */}
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
                <p className="absolute left-1/2 top-[41%] z-50 -translate-x-1/2 -translate-y-1/2 text-[7.3px] font-normal leading-none text-[#F6F6F6] tablet:top-[40%] tablet:text-[13px]">
                  {persistedUserInfo.badges.length}
                </p>
              </div>
            )}
            <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">Your Posts</h1>{' '}
          </div>
          <h1 className="text-[14px] font-normal leading-[114%] text-white tablet:text-[18px] tablet:leading-[88%]">
            {persistedUserInfo.badges.length}/24
          </h1>
        </div>
        <div className="flex flex-col gap-2 rounded-b-[10px] border-[1.85px] border-[#D9D9D9] bg-[#FDFDFD] px-[15px] py-[10px] tablet:gap-[25px] tablet:p-[25px]">
          {yourPosts.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-[#7C7C7C]">
              <h4 className="text-center text-[12px] font-medium leading-[153%] tablet:text-[18px]">{item.title}</h4>
              <h4 className="text-center text-[12px] font-medium leading-[153%] tablet:text-[18px]">{item.value}</h4>
            </div>
          ))}
          <Link
            to={'/dashboard/profile/feedback'}
            className="font-noraml cursor-pointer text-[9px] leading-[119%] text-[#4A8DBD] hover:underline tablet:text-[14px] tablet:leading-[121.4%]"
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
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/badge.svg`}
                alt={'badge'}
                className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
              />
              <p className="absolute left-1/2 top-[41%] z-50 -translate-x-1/2 -translate-y-1/2 text-[7.3px] font-normal leading-none text-[#F6F6F6] tablet:top-[40%] tablet:text-[13px]">
                {persistedUserInfo.role === 'user' ? 0 : persistedUserInfo.badges.length}
              </p>
            </div>
            <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">Other Posts</h1>{' '}
          </div>
          <h1 className="text-[14px] font-normal leading-[114%] text-white tablet:text-[18px] tablet:leading-[88%]">
            {persistedUserInfo.role === 'user' ? 0 : persistedUserInfo.badges.length}/24
          </h1>
        </div>
        <div className="flex flex-col gap-2 rounded-b-[10px] border-[1.85px] border-[#D9D9D9] bg-[#FDFDFD] px-[15px] py-[10px] tablet:gap-[25px] tablet:p-[25px]">
          {othersPosts.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-[#7C7C7C]">
              <h4 className="text-center text-[12px] font-medium leading-[153%] tablet:text-[18px]">{item.title}</h4>
              <h4 className="text-center text-[12px] font-medium leading-[153%] tablet:text-[18px]">{item.val}</h4>
            </div>
          ))}
          <Link
            to={'/dashboard/profile/feedback'}
            className="font-noraml cursor-pointer text-[9px] leading-[119%] text-[#4A8DBD] hover:underline tablet:text-[14px] tablet:leading-[121.4%]"
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
          <h1 className="text-[14px] font-normal leading-[114%] text-white tablet:text-[18px] tablet:leading-[88%]">
            {persistedUserInfo.badges.length}/24
          </h1>
        </div>
        <div className="flex flex-col gap-2 rounded-b-[10px] border-[1.85px] border-[#D9D9D9] bg-[#FDFDFD] px-[15px] py-[10px] tablet:gap-[25px] tablet:p-[25px]">
          <div className="flex items-center justify-between text-[#7C7C7C]">
            <h4 className="text-center text-[12px] font-medium leading-[153%] tablet:text-[18px]">
              Number of code of conduct violations
            </h4>
            <h4 className="text-center text-[12px] font-medium leading-[153%] tablet:text-[18px]">5</h4>
          </div>
          <Link
            to={'/dashboard/profile/feedback'}
            className="font-noraml cursor-pointer text-[9px] leading-[119%] text-[#4A8DBD] hover:underline tablet:text-[14px] tablet:leading-[121.4%]"
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
