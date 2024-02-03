const TermsPrivacyLayout = ({ children }) => {
  return (
    <div className="bg-[#F3F3F3] h-full">
      <div className="bg-blue-gradiant h-[194px] flex items-center justify-center">
        <img src="/assets/svgs/logo.svg" alt="logo" className="w-[34.5px] tablet:w-[69.2px] laptop:w-[5.75rem]" />
      </div>
      <div className="bg-white w-[90%] mx-auto rounded-[26px] border-[3px] border-[#DEE6F7] text-[#707175] h-full overflow-y-auto mt-[-2.5rem] custom-scrollbar pb-[2rem]">
        {children}
      </div>
    </div>
  );
};

export default TermsPrivacyLayout;
