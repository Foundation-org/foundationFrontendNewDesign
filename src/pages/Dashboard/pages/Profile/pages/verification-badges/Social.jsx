import React, { useState } from 'react'
import { socials } from '../../../../../../constants/varification-badges';
import { useSelector } from 'react-redux';
import { Button } from '../../../../../../components/ui/Button';
import { getConstantsValues } from '../../../../../../features/constants/constantsSlice';
import { getAskPassword } from '../../../../../../features/profile/userSettingSlice';

const Social = ({ handleRemoveBadgePopup, handleOpenPasswordConfirmation, checkLegacyBadge,
    checkSocial, checkPrimary }) => {
    const persistedUserInfo = useSelector((state) => state.auth.user);
    const persistedContants = useSelector(getConstantsValues);
    const getAskPasswordFromRedux = useSelector(getAskPassword);
    const [loading, setLoading] = useState(false);

    const handleGuestBadgeAdd = () => {
        toast.warning(
            <p>
                Please{' '}
                <span className="cursor-pointer text-[#389CE3] underline" onClick={() => navigate('/guest-signup')}>
                    Create an Account
                </span>{' '}
                to unlock this feature
            </p>,
        );
        return;
    };



    return (
        <>
            <h1 className="font-Inter text-[9.74px] font-medium text-black tablet:text-[22px] tablet:leading-[18px] dark:text-white">
                Social
            </h1>
            <div className="flex flex-col items-center justify-between rounded-[16.068px] border-[#DEE6F7] bg-[#FDFDFD] tablet:border-[3px] tablet:py-[22px]">
                <div className="flex flex-col gap-[5px] tablet:gap-4">
                    {socials.map((item, index) => (
                        <div
                            className="relative flex items-center justify-between gap-[8.5px] laptop:gap-2 desktop:gap-5"
                            key={index}
                        >
                            <div className="absolute -left-5 tablet:-left-[42px] laptop:-left-[33px] desktop:-left-[42px]">
                                {checkPrimary(item.accountName) && (
                                    <img
                                        src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/primary.svg`}
                                        alt="primary"
                                        className="size-[15px] tablet:size-[30px]"
                                    />
                                )}
                            </div>
                            <img src={item.image} alt={item.title} className="h-[6.389vw] w-[6.389vw] tablet:size-[50px]" />
                            <div
                                className={` flex h-[21.5px] w-[24vw] items-center justify-center rounded-[1.31vw] border border-[#DEE6F7] tablet:h-[50px] tablet:w-[200px] tablet:rounded-[8px] tablet:border-[3px] laptop:w-[180px] laptop:rounded-[15px] desktop:w-[200px]`}
                            >
                                <h1 className="text-[2.11vw] font-medium leading-normal text-[#000] tablet:text-[20px] dark:text-[#CACACA]">
                                    {item.title}
                                </h1>
                            </div>
                            <Button
                                disabled={loading}
                                variant={checkSocial(item.accountName) ? 'verification-badge-remove' : 'submit'}
                                onClick={async () => {
                                    if (persistedUserInfo?.role === 'guest') {
                                        handleGuestBadgeAdd();
                                        return;
                                    }
                                    if (checkSocial(item.accountName)) {
                                        handleRemoveBadgePopup({
                                            title: item.title,
                                            image: item.type,
                                            accountName: item.accountName
                                        })
                                    } else {
                                        if (
                                            (checkLegacyBadge() && !localStorage.getItem('legacyHash')) ||
                                            (checkLegacyBadge() && getAskPasswordFromRedux)
                                        ) {
                                            await handleOpenPasswordConfirmation();
                                        }
                                        setLoading(true);
                                        localStorage.setItem('target-url', `${window.location.href}`);
                                        window.location.href = `${import.meta.env.VITE_API_URL}${item.link}`;
                                    }
                                }}
                            >
                                {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> :
                                    <>
                                        {checkSocial(item.accountName) ? 'Remove' : 'Add'}
                                        <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] laptop:text-[13px]">
                                            {checkSocial(item.accountName) ? '' : `(+${persistedContants?.ACCOUNT_BADGE_ADDED_AMOUNT} FDX)`}
                                        </span>
                                    </>
                                }
                            </Button>
                        </div>

                    ))}
                </div>

            </div>
        </>
    )
}

export default Social;
