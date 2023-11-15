import Button from '../components/Button';

const ChangePassword = () => {
  return (
    <div>
      <h1 className="text-[#4A8DBD] text-[32px] font-semibold leading-normal mt-[6px] mb-[51.9px] ml-[156px]">
        Change Password
      </h1>
      <div className="mx-[106px] pt-[50px] pb-[88px] rounded-[45px] shadow-inside h-full relative">
        <div className=" mx-12 flex gap-[100px]">
          <div className="w-full">
            <label className="mb-[21px] ml-[25px] text-[#7C7C7C] text-[30px] font-semibold leading-normal">
              New Password
            </label>
            <input
              type="text"
              className="rounded-[29px] bg-[#FCFCFD] custom-inset-shadow h-[98px] w-full"
            />
          </div>
          <div className="w-full">
            <label className="mb-[21px] ml-[25px] text-[#7C7C7C] text-[30px] font-semibold leading-normal">
              Re-type New Password
            </label>
            <input
              type="text"
              className="rounded-[29px] bg-[#FCFCFD] custom-inset-shadow h-[98px] w-full"
            />
          </div>
        </div>
        <div className="absolute right-10 -bottom-12">
          <Button color="blue">Save</Button>
        </div>
      </div>
      <div className="w-full flex justify-center mt-[77px] mb-24">
        <button className="red-button">Delete Account</button>
      </div>
    </div>
  );
};

export default ChangePassword;
