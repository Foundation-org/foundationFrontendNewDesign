import React from 'react';

const yourPosts = [
  { id: 1, title: 'Posts you’ve created', val: 10 },
  { id: 1, title: 'Engagement with your posts', val: 10 },
  { id: 1, title: 'Posts you’ve created', val: 10 },
  { id: 1, title: 'Objections received', val: 10 },
  { id: 1, title: 'Number of posts hidden', val: 10 },
];

const othersPosts = [
  { id: 1, title: 'Posts you’ve engaged with', val: 10 },
  { id: 1, title: 'Options added', val: 10 },
  { id: 1, title: 'Change of answers', val: 10 },
  { id: 1, title: 'Objections given', val: 10 },
  { id: 1, title: 'Hidden posts', val: 10 },
];

const SummarySidebar = () => {
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
          <p className="font-noraml cursor-pointer text-[14px] leading-[121.4%] text-[#4A8DBD] hover:underline">
            See why your posts were
            <br /> hidden {'>'}
          </p>
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
          <p className="font-noraml cursor-pointer text-[14px] leading-[121.4%] text-[#4A8DBD] hover:underline">
            View posts you’ve hidden
            <br /> and why {'>'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SummarySidebar;
