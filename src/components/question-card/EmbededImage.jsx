export const EmbededImage = ({ description, url }) => {
  return (
    <div className="mx-[22px] mb-2 mt-[12px] flex h-[169px] flex-col justify-start rounded-[9.183px] border border-[#DEE6F7] px-[5px] py-2 tablet:mx-[60px] tablet:mb-[14px] tablet:mt-[23px] tablet:h-[420px] tablet:border-[2.755px] tablet:px-2">
      <h2 className="mb-1 ml-[9px] text-[8px] font-medium text-[#7C7C7C] tablet:text-[14.692px]">{description}</h2>
      <img
        src={url}
        className="h-[138px] w-full rounded-[4.098px] object-contain tablet:h-[372px] tablet:rounded-[15px]"
      />
    </div>
  );
};
