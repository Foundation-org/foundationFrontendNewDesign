const TermsPrivacyLayout = ({ children, title, timeStamp }) => {
  return (
    <div className="bg-[#F3F3F3] h-full">
      <div className="bg-blue-gradiant flex items-center justify-center py-[14px]">
        <img src="/assets/svgs/logo.svg" alt="logo" className="w-[34.5px] tablet:w-[69.2px] laptop:w-[5.75rem]" />
      </div>
      <div className="bg-white text-[#707175] h-full overflow-y-auto term-privacy-scrollbar mr-1 pt-[2px] tablet:pt-[15px] pb-[10rem] pl-6 pr-5 tablet:px-[46px] ">
        <h1 className="text-[12px] tablet:text-[30px] font-semibold text-[#707175] text-center">{title}</h1>
        <p className="text-[7.5px] tablet:text-[19.36px] font-normal text-[#707175] text-center">{timeStamp}</p>
        {children}
      </div>
    </div>
  );
};

export default TermsPrivacyLayout;
