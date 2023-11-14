import Button from '../components/Button';

const VerificationBadges = () => {
  return (
    <div>
      <h1 className="text-[#4A8DBD] text-[32px] font-semibold leading-normal mt-[56px] ml-[156px]">
        My Verification Badges
      </h1>
      <div className="mx-[106px] rounded-[45px] shadow-inside pt-[104px] pb-[66.8px] px-[60px] flex flex-col gap-[23px] my-[54px] relative">
        <div className="flex gap-[21px] absolute -top-1 left-[50%] transform -translate-x-[50%]">
          <div className="bg-[#4A8DBD] h-[11.1px] w-[175.1px] rounded-[100px]" />
          <div className="bg-[#D9D9D9] h-[11.1px] w-[175.1px] rounded-[100px]" />
          <div className="bg-[#D9D9D9] h-[11.1px] w-[175.1px] rounded-[100px]" />
          <div className="bg-[#D9D9D9] h-[11.1px] w-[175.1px] rounded-[100px]" />
          <div className="bg-[#D9D9D9] h-[11.1px] w-[175.1px] rounded-[100px]" />
          <div className="bg-[#D9D9D9] h-[11.1px] w-[175.1px] rounded-[100px]" />
        </div>
        <div className="flex">
          <img src="/assets/svgs/dashboard/mail1.svg" alt="mail1" />
          <div className="mx-[30px] rounded-[18.335px] shadow-inside w-full">
            <h1 className="text-[#000] text-[24px] font-medium leading-normal py-[26px] pl-[50px]">
              Personal Email
            </h1>
          </div>
          <Button color="gray">Add</Button>
          <Button color="red">Remove</Button>
        </div>
        <div className="flex">
          <img src="/assets/svgs/dashboard/mail1.svg" alt="mail1" />
          <div className="mx-[30px] rounded-[18.335px] shadow-inside w-full">
            <h1 className="text-[#000] text-[24px] font-medium leading-normal py-[26px] pl-[50px]">
              Personal Email
            </h1>
          </div>
          <Button color="blue">Add</Button>
          <Button color="red">Remove</Button>
        </div>
      </div>
    </div>
  );
};

export default VerificationBadges;
