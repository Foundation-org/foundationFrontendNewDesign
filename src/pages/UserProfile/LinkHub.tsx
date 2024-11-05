import { useSelector } from 'react-redux';
import HomepageBadge from '../Dashboard/pages/Profile/pages/verification-badges/HomepageBadge';

export default function LinkHub({ linkHub }: { linkHub: any }) {
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const checkPseudoBadge = () => persistedUserInfo?.badges?.some((badge: any) => (badge?.pseudo ? true : false));

  function getBadgeIcon(badge: { title: string; link: string }) {
    const iconMap = {
      twitter: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Twitter-2x.png`,
      farcaster: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/verification-badges/farcaster.svg`,
      github: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Github-2x.png`,
      facebook: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Facebook-2x.png`,
      linkedin: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/LinkedIn-2x.png`,
    };

    const title = badge.title.toLowerCase();
    const link = badge.link.toLowerCase();

    for (const [keyword, icon] of Object.entries(iconMap)) {
      if (title.includes(keyword) || link.includes(keyword)) {
        return icon;
      }
    }

    return `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/default-icon`;
  }

  return (
    <div className="mx-auto flex w-full max-w-[730px] flex-col items-center gap-3 tablet:gap-6">
      <div className="flex h-[25px] w-full items-center justify-between bg-blue-200 px-5 text-[12px] font-medium text-white tablet:h-[43.2px] tablet:px-7 tablet:text-[18px]">
        <h1>Link Hub</h1>
      </div>
      <div className="relative mx-auto flex w-full max-w-[730px] flex-col items-center gap-[6px] rounded-[13.84px] border-2 border-[#D9D9D9] bg-white p-[18px] tablet:gap-[10px] tablet:p-5">
        {linkHub === 'No Link Hub badge added yet!' ? (
          <>
            <h1 className="text-[11px] leading-normal text-[#85898C] tablet:text-[18px]">
              To continue using this wallet, you must <span className="font-semibold">“Add”</span> your{' '}
              <span className="font-semibold">“Ethereum Badge”</span> for secure and verified access. This ensures your
              identity is linked and helps safeguard your assets.
            </h1>
            <HomepageBadge checkPseudoBadge={checkPseudoBadge} isProfile={true} isDomain={false} />
          </>
        ) : (
          <>
            {linkHub?.personal.linkHub?.map((badge: any) => (
              <div
                key={badge.id}
                className="mx-auto flex w-full max-w-[95%] items-center gap-[10px] rounded-[9.228px] border-[2.768px] border-[#DEE6F7] bg-[#FDFDFD] px-3 py-1 tablet:max-w-[80%] tablet:gap-[15px] tablet:px-6"
              >
                <img src={getBadgeIcon(badge)} alt="save icon" className="size-[24.5px] tablet:size-[35px]" />
                <h1 className="text-[12px] font-semibold leading-normal text-[#616161] tablet:text-[18px]">
                  {badge.title}
                </h1>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
