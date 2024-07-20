import { Link } from 'react-router-dom';

const SummarySidebar = ({ userData }) => {
  const yourPosts = [
    { id: 1, title: 'Posts you’ve created', val: (userData && userData?.questsCreated) || 0 },
    { id: 2, title: 'Engagements with your posts', val: (userData && userData?.yourPostEngaged) || 0 },
    { id: 3, title: 'Objections received', val: (userData && userData?.contentionsOnAddedAns) || 0 },
    { id: 4, title: 'Agreements received', val: (userData && userData?.selectionsOnAddedAns) || 0 },
    {
      id: 5,
      title: 'My posts hidden by users',
      val: (userData && userData?.feedBackQuestsStatistics?.otherHidingOurQuestsCount) || 0,
    },
  ];

  const othersPosts = [
    {
      id: 1,
      title: 'Posts you’ve engaged with',
      val: (userData && userData?.questsActivity?.myQuestsEngagementCount) || 0,
    },
    { id: 2, title: 'Options added', val: (userData && userData?.addedAnswers) || 0 },
    { id: 3, title: 'Changing my option', val: (userData && userData?.changedAnswers) || 0 },
    { id: 4, title: 'Objections given', val: (userData && userData?.contentionsGiven) || 0 },
    { id: 5, title: 'Posts I have hidden', val: (userData && userData?.questsActivity?.myHiddenQuestsCount) || 0 },
  ];

  return (
    <div>
      <div className="mr-[31px] mt-[15px] hidden h-fit w-[18.75rem] min-w-[18.75rem] rounded-[15px] bg-white px-6 py-[23px] laptop:block dark:border-gray-100 dark:bg-gray-200 dark:bg-gray-200 tablet:dark:border">
        <h1 className="text-[18px] font-semibold text-blue-200 dark:text-white-100">Your posts</h1>
        <div className="mt-5 flex flex-col gap-[17px]">
          {yourPosts.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-gray-900 dark:text-white-100">
              <p className="max-w-[180px] text-[16px] font-medium leading-[118.75%]">{item.title}</p>
              <p className="text-[16px] font-medium leading-[118.75%]">{item.val}</p>
            </div>
          ))}
          <Link
            to={'/profile/feedback'}
            className="cursor-pointer text-[14px] font-normal leading-[121.4%] text-blue-200 hover:underline tablet:-mt-3 dark:text-blue-600"
          >
            See why your posts were
            <br /> hidden {'>'}
          </Link>
        </div>
      </div>
      {/* Other posts */}
      <div className="mr-[31px] mt-[15px] hidden h-fit w-[18.75rem] min-w-[18.75rem] rounded-[15px] bg-white px-6 py-[23px] laptop:block dark:border-gray-100 dark:bg-gray-200 dark:bg-gray-200 tablet:dark:border">
        <h1 className="text-[18px] font-semibold text-blue-200 dark:text-white-100">Others Posts</h1>
        <div className="mt-5 flex flex-col gap-[17px]">
          {othersPosts.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-gray-900 dark:text-white-100">
              <p className="max-w-[180px] text-[16px] font-medium leading-[118.75%]">{item.title}</p>
              <p className="text-[16px] font-medium leading-[118.75%]">{item.val}</p>
            </div>
          ))}
          <Link
            to={'/profile/hidden-posts'}
            className="cursor-pointer text-[14px] font-normal leading-[121.4%] text-blue-200 hover:underline tablet:-mt-3 dark:text-blue-600"
          >
            View posts you’ve hidden
            <br /> and why {'>'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SummarySidebar;
