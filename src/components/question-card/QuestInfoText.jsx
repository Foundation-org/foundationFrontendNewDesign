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
                You can select <strong>multiple</strong> options
              </h4>
            ) : (
              <h4 className="py-[0.38rem] text-center text-[7.5px] font-normal text-[#85898C] tablet:py-[10px] tablet:text-[1rem]">
                You can select only <strong>one</strong> option
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
            postProperties === 'SharedLinks' ? (
              <div className="my-2 ml-10 flex gap-1 tablet:my-5 tablet:ml-[86px] tablet:gap-20">
                <div className="flex items-center gap-[1px] tablet:gap-2">
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/clicks.svg`}
                    alt="clicks"
                    className="h-2 w-2 tablet:h-6 tablet:w-6"
                  />
                  <h2 className="text-[8px] font-semibold leading-[9.68px] text-[#707175] tablet:text-[18px] tablet:leading-[21.78px]">
                    {questStartData.userQuestSetting.questImpression} Impressions{' '}
                  </h2>
                </div>
                <div className="flex items-center gap-[1px] tablet:gap-2">
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/participants.svg`}
                    alt="participants"
                    className="h-2 w-3 tablet:h-[26px] tablet:w-[34px]"
                  />
                  <h2 className="text-[8px] font-semibold leading-[9.68px] text-[#707175] tablet:text-[18px] tablet:leading-[21.78px]">
                    {questStartData.userQuestSetting.questsCompleted} Completed{' '}
                  </h2>
                </div>
              </div>
            ) : (
              <h4 className="py-[0.38rem] text-center text-[7.5px] font-normal text-[#85898C] tablet:py-[10px] tablet:text-[1rem]">
                &#x200B;
                {/* You can select only one option */}
              </h4>
            )
          ) : (
            <>
              {postProperties === 'SharedLinks' ? (
                <div className="my-2 ml-10 flex gap-1 tablet:my-5 tablet:ml-[86px] tablet:gap-20">
                  <div className="flex items-center gap-[1px] tablet:gap-2">
                    <img
                      src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/clicks.svg`}
                      alt="clicks"
                      className="h-2 w-2 tablet:h-6 tablet:w-6"
                    />
                    <h2 className="text-[8px] font-semibold leading-[9.68px] text-[#707175] tablet:text-[18px] tablet:leading-[21.78px]">
                      {questStartData.userQuestSetting.questImpression} Impressions{' '}
                    </h2>
                  </div>
                  <div className="flex items-center gap-[1px] tablet:gap-2">
                    <img
                      src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/participants.svg`}
                      alt="participants"
                      className="h-2 w-3 tablet:h-[26px] tablet:w-[34px]"
                    />
                    <h2 className="text-[8px] font-semibold leading-[9.68px] text-[#707175] tablet:text-[18px] tablet:leading-[21.78px]">
                      {questStartData.userQuestSetting.questsCompleted} Completed{' '}
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
