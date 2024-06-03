import React from 'react';
import { Link } from 'react-router-dom';

const SummarySidebar = ({ userData }) => {
  const yourPosts = [
    { id: 1, title: 'Posts you’ve created', val: (userData && userData?.questsCreated) || 0 },
    { id: 2, title: 'Engagement with your posts', val: (userData && userData?.yourPostEngaged) || 0 },
    { id: 3, title: 'Objections received', val: (userData && userData?.contentionsOnAddedAns) || 0 },
    { id: 4, title: 'Agreements received', val: (userData && userData?.selectionsOnAddedAns) || 0 },
    { id: 5, title: 'Number of posts hidden', val: (userData && userData?.yourHiddenPostCounter) || 0 },
  ];

  const othersPosts = [
    { id: 1, title: 'Posts you’ve engaged with', val: (userData && userData?.selectionsOnAddedAns) || 0 },
    { id: 2, title: 'Options added', val: (userData && userData?.addedAnswers) || 0 },
    { id: 3, title: 'Change of answers', val: (userData && userData?.changedAnswers) || 0 },
    { id: 4, title: 'Objections given', val: (userData && userData?.contentionsGiven) || 0 },
    { id: 5, title: 'Hidden posts', val: (userData && userData?.violationCounter) || 0 },
  ];

  return (
    <div>
      <div className="mr-[31px] mt-[15px] hidden h-fit w-[18.75rem] min-w-[18.75rem] rounded-[15px] bg-white px-6 py-[23px] laptop:block dark:bg-[#000]">
        <h1 className="text-[18px] font-semibold text-[#4A8DBD]">Your posts</h1>
        <div className="mt-5 flex flex-col gap-[17px]">
          {yourPosts.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-[#7C7C7C]">
              <p className="text-[16px] font-medium leading-[118.75%]">{item.title}</p>
              <p className="text-[16px] font-medium leading-[118.75%]">{item.val}</p>
            </div>
          ))}
          <Link
            to={'/dashboard/profile/feedback'}
            className="font-noraml cursor-pointer text-[14px] leading-[121.4%] text-[#4A8DBD] hover:underline tablet:-mt-3"
          >
            See why your posts were
            <br /> hidden {'>'}
          </Link>
        </div>
      </div>
      {/* Other posts */}
      <div className="mr-[31px] mt-[15px] hidden h-fit w-[18.75rem] min-w-[18.75rem] rounded-[15px] bg-white px-6 py-[23px] laptop:block dark:bg-[#000]">
        <h1 className="text-[18px] font-semibold text-[#4A8DBD]">Others Posts</h1>
        <div className="mt-5 flex flex-col gap-[17px]">
          {othersPosts.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-[#7C7C7C]">
              <p className="text-[16px] font-medium leading-[118.75%]">{item.title}</p>
              <p className="text-[16px] font-medium leading-[118.75%]">{item.val}</p>
            </div>
          ))}
          <Link
            to={'/dashboard/profile/hidden-posts'}
            className="font-noraml cursor-pointer text-[14px] leading-[121.4%] text-[#4A8DBD] hover:underline tablet:-mt-3"
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
