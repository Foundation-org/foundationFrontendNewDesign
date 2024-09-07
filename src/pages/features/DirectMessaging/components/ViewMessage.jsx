export default function ViewMessage({ setViewMsg, viewMessageData, filter }) {
  const calculateTimeAgo = (time) => {
    let timeAgo;
    const currentDate = new Date();
    const createdAtDate = new Date(time);

    if (isNaN(createdAtDate.getTime())) {
      return (timeAgo = 'Invalid date');
    }
    console.log(viewMessageData, filter);
    const timeDifference = currentDate - createdAtDate;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      timeAgo = `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else if (hours > 0) {
      timeAgo = `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (minutes > 0) {
      timeAgo = `${minutes} ${minutes === 1 ? 'min' : 'mins'} ago`;
    } else {
      timeAgo = `${seconds} ${seconds === 1 ? 'sec' : 'secs'} ago`;
    }
    return timeAgo;
  };

  return (
    <div className="mx-[13px] h-fit w-full rounded-[15px] border-2 border-[#D9D9D9] bg-white tablet:mx-0">
      <div className="relative flex items-center justify-between gap-2 border-b-2 border-[#D9D9D9] p-2 tablet:border-b-4 tablet:px-8 tablet:py-4">
        <button
          className="cursor-pointer text-[10px] font-semibold leading-[10px] text-[#9A9A9A] tablet:text-[20px] tablet:leading-[32px]"
          onClick={() => setViewMsg(false)}
        >
          Back
        </button>
        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2">
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/directMessaging/foundation-logo.svg`}
            alt="logo"
            className="size-[15px] tablet:size-8"
          />
          <h1 className="text-[9.37px] font-semibold leading-[9.37px] text-[#7C7C7C] tablet:text-[20px] tablet:leading-[20px]">
            {filter !== 'sent' ? 'Foundation-IO.com' : viewMessageData.to}
          </h1>
        </div>
        <div className="flex items-center gap-1 tablet:gap-2">
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/directMessaging/clock.svg`}
            alt="clock"
            className="size-[13.56px] tablet:size-[22px]"
          />
          <h2 className="text-[8.835px] font-normal leading-[8.835px] text-[#9C9C9C] tablet:text-[21.211px] tablet:leading-[21.211px]">
            {calculateTimeAgo(viewMessageData?.createdAt)}
          </h2>
        </div>
      </div>
      <h1 className="mx-[12px] mb-4 mt-2 text-[12px] font-semibold leading-[12px] text-[#7C7C7C] tablet:mx-[33px] tablet:mb-[35px] tablet:mt-3 tablet:text-[22px] tablet:leading-[22px]">
        {viewMessageData?.subject}
      </h1>
      <div className="mb-4 px-3 tablet:mb-8 tablet:px-12">
        <p className="text-[10px] font-medium leading-[10px] text-[#9A9A9A] tablet:text-[20px] tablet:leading-[32px]">
          {/* Hi User, */}
        </p>
        <p className="text-[10px] font-medium leading-[16px] text-[#9A9A9A] tablet:text-[20px] tablet:leading-[32px]">
          {filter !== 'sent' ? viewMessageData?.shortMessage : viewMessageData.message}
        </p>
        <p className="mt-[17px] text-[10px] font-medium leading-[10px] text-[#9A9A9A] tablet:mt-[30px] tablet:text-[20px] tablet:leading-[32px]">
          {/* From Foundation. */}
        </p>
      </div>
    </div>
  );
}
