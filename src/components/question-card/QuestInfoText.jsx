const QuestInfoText = ({ questType }) => {
  return (
    <div>
      {questType === "ranked" || questType === "multiple choice" ? (
        <h4 className="pb-2 pl-[2.19rem] pt-[0.53rem] text-[0.5625rem] font-normal text-[#85898C] tablet:pb-[0.68rem] tablet:pl-[5.06rem] tablet:pt-[0.87rem] tablet:text-[1rem] laptop:pb-[0.63rem] laptop:pl-[4.81rem] laptop:pt-[0.69rem]">
          You can select multiple options
        </h4>
      ) : (
        <h4 className="mb-2 ml-[2.19rem] mt-[0.53rem] text-[0.5625rem] font-normal text-[#85898C] tablet:mb-[0.68rem] tablet:ml-[5.06rem] tablet:mt-[0.87rem] tablet:text-[1rem] laptop:mb-[0.63rem] laptop:ml-[4.81rem] laptop:mt-[0.69rem]">
          &#x200B;
        </h4>
      )}
    </div>
  );
};

export default QuestInfoText;
