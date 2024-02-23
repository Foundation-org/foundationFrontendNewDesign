const QuestInfoText = ({ questStartData, questType, show }) => {
  const renderQuestInfoText = () => {
    if (show) {
      return (
        <>
          {questType === 'ranked choise' ? (
            <h4 className="py-[0.38rem] text-center text-[7.5px] font-normal text-[#85898C] tablet:py-[10px] tablet:text-[1rem]">
              Drag and drop options in your order of preference
            </h4>
          ) : questType === 'multiple choise' || questType === 'open choice' ? (
            questStartData.userCanSelectMultiple ? (
              <h4 className="py-[0.38rem] text-center text-[7.5px] font-normal text-[#85898C] tablet:py-[10px] tablet:text-[1rem]">
                You can select multiple options
              </h4>
            ) : (
              <h4 className="py-[0.38rem] text-center text-[7.5px] font-normal text-[#85898C] tablet:py-[10px] tablet:text-[1rem]">
                You can select only one option
              </h4>
            )
          ) : (
            <h4 className="py-[0.38rem] text-center text-[7.5px] font-normal text-[#85898C] tablet:py-[10px] tablet:text-[1rem]">
              &#x200B;
            </h4>
          )}
        </>
      );
    } else {
      return (
        <>
          {questType === 'ranked choise' ? (
            <h4 className="py-[0.38rem] text-center text-[7.5px] font-normal text-[#85898C] tablet:py-[10px] tablet:text-[1rem]">
              &#x200B;
              {/* You can select only one option */}
            </h4>
          ) : (
            <h4 className="py-[0.38rem] text-center text-[7.5px] font-normal text-[#85898C] tablet:py-[10px] tablet:text-[1rem]">
              &#x200B;
              {/* You can select only one option */}
            </h4>
          )}
        </>
      );
    }
  };

  return renderQuestInfoText();
};

export default QuestInfoText;
