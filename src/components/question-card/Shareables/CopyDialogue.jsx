import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createCustomLink, createUpdateUniqueLink, generateImage } from '../../../services/api/questsApi';
import { addSharedLinkPost } from '../../../features/quest/utilsSlice';
import Copy from '../../../assets/optionbar/Copy';
import { Button } from '../../ui/Button';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const CopyDialogue = ({
  handleClose,
  id,
  uniqueShareLink,
  createdBy,
  img,
  alt,
  badgeCount,
  questStartData,
  // getImage,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const { protocol, host } = window.location;
  const [postLink, setPostLink] = useState(questStartData?.userQuestSetting?.link || '');
  let url = `${protocol}//${host}/p/`;

  const [isLoading, setIsLoading] = useState(false);
  const [createCustom, setCreateCustom] = useState(false);
  const [link, setLink] = useState('');

  const copyToClipboard = async () => {
    const textToCopy = url + postLink;

    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch (err) {
      console.error('Unable to copy text to clipboard:', err);
    }
  };

  const { mutateAsync: sendImage } = useMutation({
    mutationFn: generateImage,
  });

  const uniqueLinkQuestSetting = async () => {
    setIsLoading(true);
    const data = {
      uuid: persistedUserInfo?.uuid,
      questForeignKey: questStartData._id,
      Question: questStartData.Question,
    };

    if (!questStartData?.userQuestSetting) {
      data.isGenerateLink = true;
      const resp = await createUpdateUniqueLink(data);

      if (resp.status === 201) {
        if (questStartData.whichTypeQuestion === 'yes/no') {
          sendImage({ questStartData, link: resp.data.data.link });
        }
        setPostLink(resp.data.data.link);
        dispatch(addSharedLinkPost(resp.data.data));
        setIsLoading(false);
      }
    } else if (questStartData?.userQuestSetting && !questStartData?.userQuestSetting?.link) {
      data.isGenerateLink = true;
      const resp = await createUpdateUniqueLink(data);

      if (resp.status === 201) {
        if (questStartData.whichTypeQuestion === 'yes/no') {
          sendImage({ questStartData, link: resp.data.data.link });
        }
        setPostLink(resp.data.data.link);
        dispatch(addSharedLinkPost(resp.data.data));
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    uniqueLinkQuestSetting();
  }, []);

  const { mutateAsync: handleCreateCustomLink } = useMutation({
    mutationFn: createCustomLink,
    onSuccess: (resp) => {
      toast.success('Custom link generated successfully.');
      queryClient.setQueriesData(['posts'], (oldData) => {
        return {
          ...oldData,
          pages: oldData?.pages?.map((page) => {
            const updatedPage = page.map((item) => {
              if (item._id === resp.data.data.questForeignKey) {
                return {
                  ...item,
                  userQuestSetting: {
                    ...item.userQuestSetting,
                    link: resp.data.data.link,
                  },
                };
              }
              return item;
            });
            return updatedPage;
          }),
        };
      });

      setPostLink(resp.data.data.link);
      setCreateCustom(false);
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  return (
    <div className="relative w-[90vw] laptop:w-[52.6rem]">
      <div className="social-blue-gradiant relative flex items-center gap-[10px] rounded-t-[9.251px] px-[15px] py-1 tablet:gap-4 tablet:rounded-t-[26px] tablet:px-[30px] tablet:py-[8px]">
        <div className="w-fit rounded-full bg-white p-[5px] tablet:p-[10px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 31 30"
            fill="none"
            className="h-[14px] w-[14px] tablet:h-[31px] tablet:w-[31px]"
          >
            <path
              d="M24.7022 28.1248H11.1396C9.98347 28.1248 8.87465 27.6803 8.05711 26.8891C7.23956 26.0979 6.78027 25.0249 6.78027 23.906V10.781C6.78027 9.66213 7.23956 8.58907 8.05711 7.7979C8.87465 7.00673 9.98347 6.56226 11.1396 6.56226H24.7022C25.8583 6.56226 26.9672 7.00673 27.7847 7.7979C28.6022 8.58907 29.0615 9.66213 29.0615 10.781V23.906C29.0615 25.0249 28.6022 26.0979 27.7847 26.8891C26.9672 27.6803 25.8583 28.1248 24.7022 28.1248Z"
              fill="#707175"
            />
            <path
              d="M9.68847 4.68799H23.9703C23.6689 3.86606 23.112 3.15452 22.3762 2.65097C21.6404 2.14742 20.7616 1.87654 19.8603 1.87549H6.29785C5.14167 1.87549 4.03285 2.31996 3.21531 3.11113C2.39777 3.9023 1.93848 4.97536 1.93848 6.09424V19.2192C1.93956 20.0914 2.21947 20.9418 2.73981 21.6539C3.26014 22.366 3.9954 22.9049 4.84473 23.1966V9.37549C4.84473 8.13228 5.35505 6.94 6.26343 6.06092C7.17181 5.18185 8.40383 4.68799 9.68847 4.68799Z"
              fill="#707175"
            />
          </svg>
        </div>
        <p className="text-[12px] font-bold text-white tablet:text-[20px] tablet:font-medium">Copy Link</p>
        <div
          className="absolute right-[12px] top-1/2 -translate-y-1/2 cursor-pointer tablet:right-[26px]"
          onClick={handleClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 23 23"
            fill="none"
            className="h-[10px] w-[10px] tablet:h-[23px] tablet:w-[23px]"
          >
            <path
              d="M0.742781 4.71145C-0.210937 3.77788 -0.251625 2.22222 0.651895 1.23678C1.55542 0.251347 3.06101 0.209303 4.01472 1.14287L10.9221 7.9044L17.466 0.76724C18.3696 -0.218195 19.8751 -0.260239 20.8289 0.673332C21.7826 1.6069 21.8233 3.16257 20.9197 4.148L14.3759 11.2852L21.2833 18.0467C22.237 18.9803 22.2777 20.5359 21.3742 21.5213C20.4706 22.5068 18.9651 22.5488 18.0113 21.6153L11.1039 14.8537L4.56004 21.9909C3.65651 22.9763 2.15092 23.0184 1.19721 22.0848C0.243494 21.1512 0.202803 19.5956 1.10632 18.6101L7.65021 11.473L0.742781 4.71145Z"
              fill="#F3F3F3"
            />
          </svg>
        </div>
      </div>
      {/* {createdBy === persistedUserInfo?.uuid ? (
          <div className="relative flex h-fit w-full items-center justify-center pb-[4.11px] laptop:pb-[10px]">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/MeBadge.svg`}
              alt={alt}
              className="h-[50px] w-[48px] tablet:h-[80px] tablet:w-[64px]"
            />
            <p className="absolute left-[50%] top-[37%] z-50 -translate-x-1/2 -translate-y-1/2 transform text-[19px] font-[400] leading-normal text-[#7A7016] tablet:pb-3 tablet:text-[42.5px] laptop:top-[39%]">
              {persistedUserInfo?.badges?.length}
            </p>
          </div>
        ) : (
          <div className="relative flex h-fit w-full items-center justify-center pb-[4.11px] laptop:pb-[15px]">
            <img src={img} alt={alt} className="h-[48.8px] w-[39px] tablet:h-[106px] tablet:w-[85px]" />
            <p className="absolute left-[50%] top-[30%] z-50 -translate-x-[50%] -translate-y-[50%] transform text-[19.5px] font-[400] leading-normal text-[#F6F6F6] tablet:top-[42%] tablet:pb-3 tablet:text-[42.5px] laptop:top-[39%]">
              {badgeCount}
            </p>
          </div>
        )}
        <h1 className="mb-[1.15rem] text-center text-[12px] font-semibold text-[#5B5B5B] tablet:mb-5 tablet:text-[25px]">
          Say Thanks to Contributor
        </h1> */}
      <div className="flex flex-col justify-center py-[15px] tablet:py-[25px]">
        <div className="px-[20px] laptop:px-[80px]">
          <p className="mb-[0.48rem] text-[10px] font-semibold text-[#5B5B5B] tablet:mb-[15px] tablet:text-[22px]">
            {createCustom ? 'Custom Link Address' : 'Copy Post Address'}
          </p>
          <div className="flex rounded-[9.42px] border border-[#DEE6F7] tablet:rounded-[15px] tablet:border-[3px]">
            {createCustom ? (
              <div className="flex h-[62.92px] items-center">
                <p className="pl-[9.43px] text-[9.42px] font-normal leading-[9.42px] text-[#435059] tablet:pl-4 tablet:text-[26px] tablet:leading-[30px]">
                  {url}
                </p>
                <input
                  type="text"
                  className="w-full bg-transparent pr-[1.58rem] text-[9.42px] font-normal text-[#435059] [outline:none] tablet:text-[26px] tablet:leading-[30px]"
                  value={link}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue.length <= 10) {
                      setLink(inputValue);
                    } else {
                      setLink(inputValue.slice(0, 10));
                    }
                  }}
                />
              </div>
            ) : (
              <div className="flex w-full items-center rounded-l-[9.42px] pl-[9.43px] pr-[1.58rem] tablet:pl-4 laptop:rounded-l-[26px] laptop:pr-[70px]">
                <p className="w-[48vw] truncate text-[9.42px] font-normal leading-[9.42px] text-[#435059] tablet:text-[26px] tablet:leading-[30px] laptop:w-[32.7vw] desktop:w-[32rem]">
                  {isLoading ? <p className="italic">Generating link..</p> : url + postLink}
                </p>
              </div>
            )}
            {!createCustom && (
              <button
                className="rounded-r-[9px] bg-[#DEE6F7] px-[11px] py-[6px] tablet:rounded-r-[10px] tablet:px-5 tablet:py-[14px]"
                onClick={() => {
                  copyToClipboard();
                  toast.success('Link Copied!');
                }}
              >
                <Copy color="#8BAAC0" />
              </button>
            )}
          </div>
        </div>
        <div className={'mx-[10px] mt-[0.48rem] flex justify-end gap-4 tablet:mx-[40px] tablet:mt-6 tablet:gap-8'}>
          {!createCustom ? (
            <div className="flex items-center gap-[25px]">
              <Button
                variant={'submit'}
                className={'w-fit min-w-fit whitespace-nowrap'}
                onClick={() => setCreateCustom(true)}
              >
                Create Custom Link
              </Button>
              <Button
                variant={'submit'}
                className={'w-fit min-w-fit whitespace-nowrap'}
                onClick={() => navigate('/dashboard/profile/shared-links')}
              >
                Manage My Shared Links
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-[25px]">
              <Button
                variant={'cancel'}
                className={'w-fit min-w-fit whitespace-nowrap'}
                onClick={() => setCreateCustom(false)}
              >
                Go Back
              </Button>
              <Button
                variant={'submit'}
                className={'w-fit min-w-fit whitespace-nowrap'}
                onClick={() => {
                  handleCreateCustomLink({
                    questStartData,
                    uuid: persistedUserInfo.uuid,
                    link,
                  });
                }}
              >
                Create
                <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[10px] tablet:text-[13px]">
                  (-2.50 FDX)
                </span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CopyDialogue;
//
