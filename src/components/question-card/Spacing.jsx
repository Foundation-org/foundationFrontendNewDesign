const Spacing = ({ questStartData, show }) => {
  const renderQuestInfoText = () => {
    if (show) {
      return (
        <>
          {questStartData.whichTypeQuestion === 'ranked choise' ? (
            <h4 className="max-h-5 min-h-5 text-center text-[7.5px] font-normal text-[#85898C] tablet:max-h-[40px] tablet:min-h-[40px] tablet:text-[1rem]">
              &#x200B;
            </h4>
          ) : (questStartData.whichTypeQuestion === 'multiple choise' ||
              questStartData.whichTypeQuestion === 'open choice') &&
            questStartData.userCanSelectMultiple ? (
            <h4 className="max-h-5 min-h-5 text-center text-[7.5px] font-normal text-[#85898C]  tablet:max-h-[40px] tablet:min-h-[40px] tablet:text-[1rem]">
              &#x200B;
            </h4>
          ) : (
            <h4 className="max-h-5 min-h-5 text-center text-[7.5px] font-normal text-[#85898C]  tablet:max-h-[40px] tablet:min-h-[40px] tablet:text-[1rem]">
              &#x200B;
            </h4>
          )}
        </>
      );
    } else {
      return (
        <h4 className="py-[5px] text-center text-[7.5px] font-normal text-[#85898C] tablet:py-[9px] tablet:text-[1rem]">
          &#x200B;
        </h4>
      );
    }
  };

  return renderQuestInfoText();
};

export default Spacing;
