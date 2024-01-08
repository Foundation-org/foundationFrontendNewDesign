import { toast } from "sonner";
import Copy from "../../../../../../assets/optionbar/Copy";
import Cookies from "js-cookie";

const CopyDialogue = ({ handleClose, id, createdBy, img, alt, badgeCount }) => {
  const { protocol, host } = window.location;
  let url = `${protocol}//${host}/quest/${id}`;

  const copyToClipboard = async () => {
    const textToCopy = url;

    try {
      await navigator.clipboard.writeText(textToCopy);
      console.log("Text copied to clipboard:", textToCopy);
    } catch (err) {
      console.error("Unable to copy text to clipboard:", err);
    }
  };

  return (
    <div className="relative w-[90vw] pb-[21.37px] pt-3 tablet:pb-[75px] tablet:pt-[37px] laptop:w-[52.6rem]">
      <img
        src="/assets/svgs/close.svg"
        alt="close icon"
        className="absolute right-[11px] top-[10px] h-[0.48rem] w-[0.48rem] cursor-pointer tablet:right-[20px] tablet:top-[17px] tablet:h-[1.37rem] tablet:w-[1.37rem] laptop:right-[26px] laptop:top-[29px]"
        onClick={handleClose}
      />
      <div className="flex flex-col justify-center px-[22px] laptop:px-[81px]">
        {createdBy === Cookies.get("uId") ? (
          <div className="relative flex h-fit w-full items-center justify-center pb-[4.11px] laptop:pb-[15px]">
            <img
              src="/assets/svgs/dashboard/MeBadge.svg"
              alt={alt}
              className="h-[28.379px] w-[22.722px] tablet:h-[106px] tablet:w-[85px]"
            />
            <p className="absolute left-[50%] top-[30%] z-50 -translate-x-[50%] -translate-y-[50%] transform text-[11.3px] font-[400] leading-normal text-[#7A7016] tablet:pb-3 tablet:text-[42.5px] laptop:top-[39%]">
              5
            </p>
          </div>
        ) : (
          <div className="relative flex h-fit w-full items-center justify-center pb-[4.11px] laptop:pb-[15px]">
            <img
              src={img}
              alt={alt}
              className="h-[48.8px] w-[39px] tablet:h-[106px] tablet:w-[85px]"
            />
            <p className="absolute left-[50%] top-[30%] z-50 -translate-x-[50%] -translate-y-[50%] transform text-[19.5px] font-[400] leading-normal text-[#F6F6F6] tablet:top-[42%] tablet:pb-3 tablet:text-[42.5px] laptop:top-[39%]">
              {badgeCount}
            </p>
          </div>
        )}
        <h1 className="mb-[1.15rem] text-center text-[12px] font-semibold text-[#5B5B5B] tablet:mb-[30.8px] tablet:text-[28px]">
          Say Thanks to Contributor
        </h1>
        <p className="mb-[0.48rem] ml-[26px] text-[10px] font-semibold text-[#5B5B5B] tablet:mb-[15px] tablet:text-[22px]">
          Copy Quest Address
        </p>
        <div className="flex">
          <div className="w-full rounded-l-[9.42px] bg-[#F3F3F3] py-[10.51px] pl-[9.43px] pr-[1.58rem] tablet:py-[30px] tablet:pl-[26px] laptop:rounded-l-[26px] laptop:pr-[70px]">
            <p className="w-[56vw] truncate text-[9.42px] font-normal text-[#435059] tablet:text-[26px] laptop:w-[40vw] desktop:w-[32rem]">
              {url}
            </p>
          </div>
          <button
            className="rounded-r-[9.42px] bg-[#DEE6F7] px-[11.7px] py-[6.9px] tablet:px-[30px] laptop:rounded-r-[26px] laptop:py-5"
            onClick={() => {
              copyToClipboard();
              toast.success("Link Copied!");
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
