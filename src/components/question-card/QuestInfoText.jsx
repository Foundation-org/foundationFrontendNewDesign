const QuestInfoText = ({ questStartData, questType, show, postProperties }) => {
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
            <>
              {console.log({ postProperties })}
              {postProperties === 'SharedLinks' ? (
                <div className="my-2 tablet:my-5 ml-10 tablet:ml-[86px] flex gap-1 tablet:gap-20">
                  <div className="flex gap-[1px] tablet:gap-2 items-center">
                    <img src="/assets/svgs/clicks.svg" alt="clicks" className="w-2 h-2 tablet:w-6 tablet:h-6" />
                    <h2 className="text-[8px] tablet:text-[18px] font-semibold text-[#707175] leading-[9.68px] tablet:leading-[21.78px]">
                      30 Clicks
                    </h2>
                  </div>
                  <div className="flex gap-[1px] tablet:gap-2 items-center">
                    <img
                      src="/assets/svgs/participants.svg"
                      alt="participants"
                      className="w-3 h-2 tablet:w-[34px] tablet:h-[26px]"
                    />
                    <h2 className="text-[8px] tablet:text-[18px] font-semibold text-[#707175] leading-[9.68px] tablet:leading-[21.78px]">
                      20 Participations
                    </h2>
                  </div>
                </div>
              ) : (
                <h4 className="py-[0.38rem] text-center text-[7.5px] font-normal text-[#85898C] tablet:py-[10px] tablet:text-[1rem]">
                  &#x200B;
                  {/* You can select only one option */}
                </h4>
              )}
            </>
          )}
        </>
      );
    }
  };

  return renderQuestInfoText();
};

export default QuestInfoText;
