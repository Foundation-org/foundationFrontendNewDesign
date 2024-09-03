import EmbedParticipate from '../../pages/Embed/EmbedParticipate';

const Spacing = ({ questStartData, show, postProperties }) => {
  const renderQuestInfoText = () => {
    if (show) {
      return (
        // <div className="relative">
        //   {(questStartData?.startQuestData?.isFeedback &&
        //     questStartData.startStatus !== 'continue' &&
        //     questStartData.startStatus !== 'change answer') ||
        //   questStartData.isClosed ? (
        //     <div className="flex h-[23px] items-end justify-center tablet:h-[50px]">
        //       <h4 className="text-center text-[10px] font-semibold leading-[10px] text-red-500 dark:text-accent-300 tablet:py-[10px] tablet:text-[1rem] tablet:leading-[1rem]">
        //         Participation is closed
        //       </h4>{' '}
        //     </div>
        //   ) : questStartData.whichTypeQuestion === 'ranked choise' ? (
        //     <h4 className="max-h-[24.16px] min-h-[24.16px] text-center text-[7.5px] font-normal text-[#85898C] tablet:max-h-[50px] tablet:min-h-[50px] tablet:text-[1rem]">
        //       &#x200B;
        //     </h4>
        //   ) : (questStartData.whichTypeQuestion === 'multiple choise' ||
        //       questStartData.whichTypeQuestion === 'open choice') &&
        //     questStartData.userCanSelectMultiple ? (
        //     <h4 className="max-h-[24.16px] min-h-[24.16px] text-center text-[7.5px] font-normal text-[#85898C] tablet:max-h-[50px] tablet:min-h-[50px] tablet:text-[1rem]">
        //       &#x200B;
        //     </h4>
        //   ) : (
        //     <h4 className="max-h-[24.16px] min-h-[24.16px] text-center text-[7.5px] font-normal text-[#85898C] tablet:max-h-[50px] tablet:min-h-[50px] tablet:text-[1rem]">
        //       &#x200B;
        //     </h4>
        //   )}
        //   {!questStartData.isClosed && questStartData.type === 'embed' && (
        //     <EmbedParticipate postProperties={postProperties} />
        //   )}
        // </div>
        <div className="relative">
          {(questStartData?.startQuestData?.isFeedback &&
            questStartData.startStatus !== 'continue' &&
            questStartData.startStatus !== 'change answer') ||
          questStartData.isClosed ? (
            <div className="flex h-[23px] items-end justify-center tablet:h-[50px]">
              <h4 className="text-center text-[10px] font-semibold leading-[10px] text-red-500 dark:text-accent-300 tablet:py-[10px] tablet:text-[1rem] tablet:leading-[1rem]">
                Participation is closed
              </h4>
            </div>
          ) : (
            <h4
              className={`${questStartData.type === 'embed' ? 'max-h-[35px] min-h-[35px] tablet:max-h-[65px] tablet:min-h-[65px]' : 'max-h-[24.16px] min-h-[24.16px] tablet:max-h-[50px] tablet:min-h-[50px]'} text-center text-[7.5px] font-normal text-[#85898C] tablet:text-[1rem]`}
            >
              &#x200B;
            </h4>
          )}

          {!questStartData.isClosed && questStartData.type === 'embed' && (
            <EmbedParticipate postProperties={postProperties} />
          )}
        </div>
      );
    } else {
      return (
        <div className="relative">
          {questStartData?.startQuestData?.isFeedback ? (
            <h4 className="conditional-text font-semibold text-red-500">Participation is closed</h4>
          ) : (
            <h4 className="py-[5px] text-center text-[7.5px] font-normal text-[#85898C] tablet:py-[9px] tablet:text-[1rem]">
              &#x200B;
            </h4>
          )}
          {!questStartData.isClosed && questStartData.type === 'embed' && (
            <EmbedParticipate postProperties={postProperties} />
          )}
        </div>
      );
    }
  };

  return renderQuestInfoText();
};

export default Spacing;
