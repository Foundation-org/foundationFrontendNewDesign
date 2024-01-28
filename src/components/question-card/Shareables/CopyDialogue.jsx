import { toast } from 'sonner';
import Copy from '../../../assets/optionbar/Copy';
import { useSelector } from 'react-redux';
import Close from '../../../assets/Close';
import { IoClose } from 'react-icons/io5';

const CopyDialogue = ({ handleClose, id, createdBy, img, alt, badgeCount }) => {
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const { protocol, host } = window.location;
  let url = `${protocol}//${host}/quest/${id}`;

  const copyToClipboard = async () => {
    const textToCopy = url;

    try {
      await navigator.clipboard.writeText(textToCopy);
      console.log('Text copied to clipboard:', textToCopy);
    } catch (err) {
      console.error('Unable to copy text to clipboard:', err);
    }
  };

  return (
    <div className="relative w-[90vw] laptop:w-[52.6rem]">
      <div className="relative rounded-t-[9.251px] social-blue-gradiant flex gap-[10px] tablet:gap-4 items-center py-1 tablet:py-[8px] px-[15px] tablet:px-[30px] tablet:rounded-t-[26px]">
        <div className="bg-white p-[5px] tablet:p-[10px] rounded-full w-fit">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 31 30"
            fill="none"
            className="w-[14px] h-[14px] tablet:w-[31px] tablet:h-[31px]"
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
        <p className="text-white text-[12px] tablet:text-[20px] font-semibold tablet:font-medium">Copy Link</p>
        <div
          className="absolute right-[12px] top-[14px] cursor-pointer tablet:right-[26px] tablet:top-1/2 tablet:-translate-y-1/2"
          onClick={handleClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 23 23"
            fill="none"
            className="w-[8px] h-[8px] tablet:w-[23px] tablet:h-[23px]"
          >
            <path
              d="M0.742781 4.71145C-0.210937 3.77788 -0.251625 2.22222 0.651895 1.23678C1.55542 0.251347 3.06101 0.209303 4.01472 1.14287L10.9221 7.9044L17.466 0.76724C18.3696 -0.218195 19.8751 -0.260239 20.8289 0.673332C21.7826 1.6069 21.8233 3.16257 20.9197 4.148L14.3759 11.2852L21.2833 18.0467C22.237 18.9803 22.2777 20.5359 21.3742 21.5213C20.4706 22.5068 18.9651 22.5488 18.0113 21.6153L11.1039 14.8537L4.56004 21.9909C3.65651 22.9763 2.15092 23.0184 1.19721 22.0848C0.243494 21.1512 0.202803 19.5956 1.10632 18.6101L7.65021 11.473L0.742781 4.71145Z"
              fill="#F3F3F3"
            />
          </svg>
        </div>
      </div>
      <div className="flex flex-col justify-center px-[40px] laptop:px-[80px] pt-[25px] tablet:pt-4 pb-[21.37px] tablet:pb-[75px]">
        {createdBy === persistedUserInfo?.uuid ? (
          <div className="relative flex h-fit w-full items-center justify-center pb-[4.11px] laptop:pb-[10px]">
            <img
              src="/assets/svgs/dashboard/MeBadge.svg"
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
        </h1>
        <p className="mb-[0.48rem] ml-[26px] text-[10px] font-semibold text-[#5B5B5B] tablet:mb-[15px] tablet:text-[22px]">
          Copy Post Address
        </p>
        <div className="flex">
          <div className="w-full rounded-l-[9.42px] bg-[#F3F3F3] py-[10.51px] pl-[9.43px] pr-[1.58rem] tablet:py-[30px] tablet:pl-[26px] laptop:rounded-l-[26px] laptop:pr-[70px] tablet:leading-[30px]">
            <p className="w-[48vw] truncate text-[9.42px] font-normal text-[#435059] tablet:text-[26px] laptop:w-[32.7vw] desktop:w-[32rem]">
              {url}
            </p>
          </div>
          <button
            className="rounded-r-[9.42px] bg-[#DEE6F7] px-[11.7px] py-[6.9px] tablet:px-[30px] laptop:rounded-r-[26px] laptop:py-5"
            onClick={() => {
              copyToClipboard();
              toast.success('Link Copied!');
            }}
          >
            <Copy color="#8BAAC0" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CopyDialogue;
