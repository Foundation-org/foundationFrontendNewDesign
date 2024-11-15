import { useSelector } from 'react-redux';
import HomepageBadge from '../Dashboard/pages/Profile/pages/verification-badges/HomepageBadge';
import SummaryCard from '../../components/SummaryCard';
import { Button } from '../../components/ui/Button';
import LinkHubPopup from '../../components/dialogue-boxes/LinkHubPopup';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '../../services/api/Axios';
import { formatCountNumber } from '../../utils/utils';

export default function LinkHub({ linkHub, domain }: { linkHub: any; domain: string }) {
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const checkPseudoBadge = () => persistedUserInfo?.badges?.some((badge: any) => (badge?.pseudo ? true : false));
  const isPublicProfile = location.pathname.startsWith('/h/');
  const persistedTheme = useSelector((state: any) => state.utils.theme);
  const [isPersonalPopup, setIsPersonalPopup] = useState(false);
  const [showAll, setShowAll] = useState(false);

  function getBadgeIcon(badge: { title: string; link: string }) {
    const iconMap = {
      twitter: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Twitter-2x.png`,
      farcaster: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/verification-badges/farcaster.svg`,
      github: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Github-2x.png`,
      facebook: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Facebook-2x.png`,
      linkedin: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/LinkedIn-2x.png`,
      instagram: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Instagram-2x.png`,
    };

    const title = badge.title.toLowerCase();
    const link = badge.link.toLowerCase();

    for (const [keyword, icon] of Object.entries(iconMap)) {
      if (title.includes(keyword) || link.includes(keyword)) {
        return icon;
      }
    }

    return `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/default-link.svg`;
  }

  const linkHubInc = async ({
    domainName,
    badgeLinkId,
    viewerUuid,
  }: {
    domainName: string;
    badgeLinkId: string;
    viewerUuid: string;
  }) => {
    const response = await api.post('/linkhubInc', {
      domainName,
      badgeLinkId,
      viewerUuid,
    });

    return response.data;
  };

  const { mutateAsync: handleLinkHubIncrement } = useMutation({
    mutationFn: linkHubInc,
    onError: (err) => {
      console.log(err.message);
    },
  });

  const displayedBadges = showAll ? linkHub?.personal?.linkHub : linkHub?.personal?.linkHub?.slice(0, 5);

  const totalViewerCount =
    linkHub?.personal?.linkHub?.reduce((sum: number, item: { viewerCount: any[] }) => {
      return sum + (Array.isArray(item.viewerCount) ? item.viewerCount.length : 0);
    }, 0) || 0;

  return (
    <>
      {/* @ts-ignore */}
      <LinkHubPopup
        isPopup={isPersonalPopup}
        setIsPopup={setIsPersonalPopup}
        title="Link Hub"
        logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/linkhub.svg`}
        type={'linkHub'}
        setIsPersonalPopup={setIsPersonalPopup}
      />
      <SummaryCard headerIcon="/assets/svgs/linkhub-logo.svg" headerTitle="Link Hub" isPublicProfile={isPublicProfile}>
        {!isPublicProfile && (
          <>
            <h1 className="text-[12px] font-medium leading-[13.56px] text-[#85898C] dark:text-white-400 tablet:text-[16px] tablet:leading-normal">
              Put all your essential links in one place on your Home Page, making it easier for others to find and
              connect with you across platforms
            </h1>
            <div className="mt-3 flex items-center justify-center gap-3 tablet:mt-5 tablet:gap-6">
              <div className="max-w-28 border-r border-[#707175] pr-3 dark:border-gray-300 tablet:max-w-full tablet:pr-6">
                <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
                  Shared Links
                </h1>
                <h5 className="text-center text-[18px] font-normal">{linkHub?.personal?.linkHub?.length || 0}</h5>
              </div>
              <div>
                <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
                  Total views
                </h1>

                <h5 className="text-center text-[18px] font-normal">{totalViewerCount}</h5>
              </div>
            </div>
            <div className="mt-3 flex w-full justify-center tablet:mt-5">
              <Button variant={'submit'} onClick={() => setIsPersonalPopup(true)}>
                Manage shared links
              </Button>
            </div>
          </>
        )}
      </SummaryCard>
      <div className="mx-auto flex w-full max-w-[730px] flex-col items-center gap-3 tablet:gap-6">
        <div className="relative mx-auto flex w-full max-w-[730px] flex-col items-center gap-[6px] rounded-[13.84px] border-2 border-[#D9D9D9] bg-white p-[18px] dark:border-gray-100 dark:bg-gray-200 tablet:gap-[10px] tablet:p-5">
          {linkHub === 'No Link Hub badge added yet!' ? (
            <>
              <h1 className="text-[11px] leading-normal text-[#85898C] dark:text-[#f1f1f1] tablet:text-[18px]">
                You must add 'Link Hub' Badge to view this.
                {/* To continue using this wallet, you must <span className="font-semibold">“Add”</span> your{' '}
              <span className="font-semibold">“Ethereum Badge”</span> for secure and verified access. This ensures your
              identity is linked and helps safeguard your assets. */}
              </h1>
              <HomepageBadge checkPseudoBadge={checkPseudoBadge} isProfile={true} isDomain={false} />
            </>
          ) : (
            <>
              {displayedBadges?.map((badge: any) => (
                <button
                  key={badge.id}
                  className="mx-auto flex w-full max-w-[95%] items-center justify-between rounded-[9.228px] border-[2.768px] border-[#DEE6F7] bg-[#FDFDFD] px-3 py-1 dark:border-gray-100 dark:bg-gray-200 tablet:max-w-[80%] tablet:px-6"
                  onClick={() => {
                    handleLinkHubIncrement({
                      domainName: domain,
                      badgeLinkId: badge.id,
                      viewerUuid: persistedUserInfo?.uuid,
                    });
                    let link = null;
                    if (badge.link.includes('https://')) {
                      link = badge.link;
                    } else {
                      link = `https://${badge.link}`;
                    }
                    window.open(link, '_blank');
                  }}
                >
                  <div className="flex items-center gap-[10px] tablet:gap-[15px]">
                    <img src={getBadgeIcon(badge)} alt="save icon" className="size-[24.5px] tablet:size-[35px]" />
                    <h1 className="text-[12px] font-semibold leading-normal text-[#616161] dark:text-[#f1f1f1] tablet:text-[18px]">
                      {badge.title}
                    </h1>
                  </div>
                  {!isPublicProfile && (
                    <div className="flex items-center justify-center gap-2">
                      <img
                        src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/clicks.svg' : 'assets/svgs/clicks.svg'}`}
                        alt="clicks"
                        className="h-3 w-3 tablet:h-6 tablet:w-6"
                      />
                      <h1 className="text-[12px] leading-normal text-[#616161] dark:text-[#f1f1f1] tablet:text-[16px]">
                        {formatCountNumber(badge?.viewerCount?.length || 0)}
                      </h1>
                    </div>
                  )}
                </button>
              ))}
              {!showAll && linkHub?.personal.linkHub?.length > 5 && (
                <Button variant="submit" onClick={() => setShowAll(true)}>
                  See All Links
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
