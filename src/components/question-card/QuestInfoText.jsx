const QuestInfoText = ({ questStartData, questType, show }) => {
  const renderQuestInfoText = () => {
    if (show) {
      return (
        <div>
          {questType === 'ranked choise' ? (
            <h4 className="py-[0.38rem] text-center text-[0.48rem] font-normal text-[#85898C] tablet:pb-[0.68rem] tablet:pt-[0.87rem] tablet:text-[1rem] laptop:pb-[0.63rem] laptop:pt-[0.69rem]">
              Drag and drop options in your order of preference
            </h4>
          ) : questType === 'multiple choise' && questStartData.userCanSelectMultiple ? (
            <h4 className="py-[0.38rem] text-center text-[0.48rem] font-normal text-[#85898C] tablet:pb-[0.68rem] tablet:pt-[0.87rem] tablet:text-[1rem] laptop:pb-[0.63rem] laptop:pt-[0.69rem]">
              You can select multiple options
            </h4>
          ) : (
            <h4 className="py-[0.38rem] text-center text-[0.48rem] font-normal text-[#85898C] tablet:pb-[0.68rem] tablet:pt-[0.87rem] tablet:text-[1rem] laptop:pb-[0.63rem] laptop:pt-[0.69rem]">
              &#x200B;
            </h4>
          )}
        </div>
      );
    } else {
      return (
        <h4 className="py-[0.38rem] text-center text-[0.48rem] font-normal text-[#85898C] tablet:pb-[0.68rem] tablet:pt-[0.87rem] tablet:text-[1rem] laptop:pb-[0.63rem] laptop:pt-[0.69rem]">
          &#x200B;
        </h4>
      );
    }
  };

  return renderQuestInfoText();
};

export default QuestInfoText;
