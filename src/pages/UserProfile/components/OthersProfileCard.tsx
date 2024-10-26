export default function OthersProfileCard(props: { data: any; innerRef: any }) {
  const { data, innerRef } = props;

  return (
    <div
      ref={innerRef}
      className="flex flex-col items-center rounded-[13.84px] border-[1.846px] border-[#D9D9D9] bg-white"
    >
      <div className="flex items-center gap-[14px] p-[18px] tablet:gap-6 tablet:p-5">
        <div>
          <div className="flex size-[60px] min-w-[60px] flex-col gap-[6px] rounded-full border-[5px] border-[#C9C8C8] tablet:size-[185px] tablet:min-w-[185px]">
            <img
              src={data?.domain.s3Urls[0]}
              alt={data?.domain.title}
              className="size-[50px] rounded-full object-cover tablet:size-[175px]"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 text-[#7C7C7C] tablet:gap-4">
          <div>
            <h1 className="text-[12px] font-semibold tablet:text-[20px]">{data?.domain.title}</h1>
            <p className="text-[10px] leading-normal tablet:text-[16px]">{data?.domain.name}</p>
          </div>
          <p className="text-[11px] leading-normal tablet:text-[18px]">{data?.domain.description}</p>
        </div>
      </div>
      <div className="grid w-full grid-cols-2 gap-1 text-[12px] font-semibold tablet:gap-2 tablet:text-[20px]">
        <button className="rounded-bl-[13.84px] bg-gradient-to-tr from-[#6BA5CF] to-[#389CE3] py-3 text-white tablet:py-4">
          Follow
        </button>
        <button className="rounded-br-[13.84px] bg-[#7C7C7C] py-3 text-white tablet:py-4">View Profile</button>
      </div>
    </div>
  );
}
