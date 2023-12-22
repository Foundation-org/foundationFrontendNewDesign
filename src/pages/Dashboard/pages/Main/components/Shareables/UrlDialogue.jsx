const UrlDialogue = ({ handleClose, id, createdBy, img, alt, badgeCount }) => {
  const { protocol, host} = window.location;
  let url = `${protocol}//${host}/quest/${id}`;

  return (
    <div className="relative pb-[75px] pt-[37px]">
      <img
        src="/assets/svgs/close.svg"
        alt="close icon"
        className="absolute right-[26px] top-[29px] cursor-pointer"
        onClick={handleClose}
      />
      <div className="flex flex-col justify-center px-[81px]">
        {createdBy === localStorage.getItem("uId") ? (
          <div className="relative flex h-fit w-full items-center justify-center pb-[15px]">
            <img
              src="/assets/svgs/dashboard/MeBadge.svg"
              alt={alt}
              className="h-[28.379px] w-[22.722px] tablet:h-[106px] tablet:w-[85px]"
            />
            <p className="absolute left-[50%] top-[39%] z-50 -translate-x-[50%] -translate-y-[50%] transform text-[11.3px] font-[400] leading-normal text-[#F6F6F6] tablet:pb-3 tablet:text-[42.5px]">
              Me
            </p>
          </div>
        ) : (
          <div className="relative flex h-fit w-full items-center justify-center pb-[15px]">
            <img
              src={img}
              alt={alt}
              className="h-[28.379px] w-[22.722px] tablet:h-[106px] tablet:w-[85px]"
            />
            <p className="absolute left-[50%] top-[39%] z-50 -translate-x-[50%] -translate-y-[50%] transform text-[11.3px] font-[400] leading-normal text-[#F6F6F6] tablet:pb-3 tablet:text-[42.5px]">
              {badgeCount}
            </p>
          </div>
        )}
        <h1 className="mb-[30.8px] text-center text-[28px] font-semibold text-[#5B5B5B]">
          Say Thanks to Contributor
        </h1>
        <p className="mb-[15px] ml-[26px] text-[22px] font-semibold text-[#5B5B5B]">
          Embeded Link
        </p>
        <div className="flex">
          <div className="rounded-[26px] bg-[#F3F3F3] py-[30px] pl-[26px] pr-[70px]">
            <p className="text-[26px] font-normal text-[#435059]">{url}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrlDialogue;
