const TermsPrivacyLayout = ({ children }) => {
  return (
    <div className="bg-[#F3F3F3] min-h-screen h-full">
      <div className="bg-blue-gradiant h-[194px] flex items-center justify-center">
        <img src="/assets/svgs/logo.svg" alt="logo" className="w-[34.5px] tablet:w-[69.2px] laptop:w-[5.75rem]" />
      </div>
      <div className="bg-white w-[90%] mx-auto rounded-[26px] border-[3px] border-[#DEE6F7] text-[#707175]">
        {children}
      </div>
    </div>
  );
};

export default TermsPrivacyLayout;
