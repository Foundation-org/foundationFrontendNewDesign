import { Button } from '../ui/Button';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { badgesTotalLength } from '../../constants/varification-badges';

export default function VerificationBadgeScore({ isMobile, children }) {
  const navigate = useNavigate();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const location = useLocation();

  return (
    <div className={`${isMobile ? 'mx-4 tablet:mx-6 ' : ''}`}>
      <div
        className={`flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px] ${isMobile ? 'tablet:hidden' : ''}`}
      >
        <div className="flex items-center gap-2">
          {persistedUserInfo?.uuid && persistedUserInfo.role === 'user' ? (
            <div className="relative h-fit w-fit">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/MeBadge.svg`}
                alt={'badge'}
                className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
              />
              <p className="absolute left-1/2 top-[41%] z-50 -translate-x-1/2 -translate-y-1/2 text-[7.3px] font-normal leading-none text-[#7A7016] tablet:top-[40%] tablet:text-[13px]">
                {persistedUserInfo.badges.length}
              </p>
            </div>
          ) : (
            <div className="relative z-50 h-fit w-fit">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/badge.svg`}
                alt={'badge'}
                className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
              />
              <p className="absolute left-1/2 top-[41%] z-50 -translate-x-1/2 -translate-y-1/2 text-[7.3px] font-normal leading-none text-[#F6F6F6] tablet:top-[40%] tablet:text-[13px]">
                {persistedUserInfo.badges.length}
              </p>
            </div>
          )}
          <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">
            Verification Badge Score
          </h1>
        </div>
        <h1 className="text-[14px] font-normal leading-[114%] text-white tablet:text-[18px] tablet:leading-[88%]">
          {persistedUserInfo.badges.length}/{badgesTotalLength}
        </h1>
      </div>
      <div
        className={`border-[#D9D9D9] bg-[#FDFDFD] px-5 py-[10px] tablet:border-[1.85px] tablet:py-[18.73px] ${isMobile ? 'rounded-[10px]' : 'rounded-b-[10px]'}`}
      >
        <h1
          className={`text-[12px] font-medium leading-[13.56px] text-[#85898C] tablet:text-[16px] tablet:leading-normal ${isMobile ? 'tablet:hidden' : ''}`}
        >
          Have your data be more desirable for brands and research firms to purchase with more verified info and earn
          more FDX while you’re at it!
        </h1>
        {location.pathname === '/profile' && (
          <div className="mt-3 flex w-full justify-center tablet:mt-5">
            <Button variant={'submit'} onClick={() => navigate('/profile/verification-badges')}>
              Add badge
            </Button>
          </div>
        )}
        {location.pathname === '/profile/verification-badges' && isMobile && children}
      </div>
    </div>
  );
}
