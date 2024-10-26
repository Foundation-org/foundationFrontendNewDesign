export default function OthersProfileCard() {
  return (
    <div className="mx-auto flex max-w-[730px] flex-col items-center rounded-[13.84px] border-[1.846px] border-[#D9D9D9] bg-white">
      <div className="flex items-center gap-[14px] p-[18px] tablet:gap-6 tablet:p-5">
        <div>
          <div className="flex size-[60px] min-w-[60px] flex-col gap-[6px] rounded-full border-[5px] border-[#C9C8C8] tablet:size-[185px] tablet:min-w-[185px]">
            <img
              src="https://s3-alpha-sig.figma.com/img/63b9/b6ec/fcbbfb89e172228dac9ea0121de7892b?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=WIein3b4GcfnjMwQBT~xMuIVURtjWuo4Seb7w-DW-hltaPmYItAXtxmfWBt2dIO7LVMA2rbKqk3Xy4zIyZD7kab~aZLE7lPJzmALFG3tRPwpp~1KS9U9z-eAe0aiutaiWLHEc79CpO~4LKPnMP0CuJpkzM-c7UJpk4EBldyYNFUnpA3bF~ZoVqwUdd4CMioueASggMZNALD1EeUpJYFsRkFZat6uPsgZ3-BoK5du9RmnO11jdUaPJA1rOl9Tx-irSInZLlFxgbCGDDDfwPvmb0vhy4T4D4fCYveaqCa6EclBaDdeSZMXTYLeSgWY1JwfiYX0xOB7Edjswfvnph97QQ__"
              alt="aa"
              className="size-[50px] rounded-full object-cover tablet:size-[175px]"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 text-[#7C7C7C] tablet:gap-4">
          <div>
            <h1 className="text-[12px] font-semibold tablet:text-[20px]">Content Writer, CNB</h1>
            <p className="text-[10px] leading-normal tablet:text-[16px]">hamza.foundation.io</p>
          </div>
          <p className="text-[11px] leading-normal tablet:text-[18px]">
            As a content writer for Foundation, I craft compelling, insightful, and engaging narratives that highlight
            the platform's core mission of leveraging collective human intelligence to uncover the truth.
          </p>
        </div>
      </div>
      <div className="grid w-full grid-cols-2 gap-1 text-[12px] font-semibold tablet:gap-2 tablet:text-[20px]">
        <button className="rounded-bl-[13.84px] bg-gradient-to-tr from-[#6BA5CF] to-[#389CE3] py-3 text-white tablet:py-4">
          Follow
        </button>
        <button className="rounded-br-[13.84px] bg-[#7C7C7C] py-3 text-white tablet:py-4">Follow</button>
      </div>
    </div>
  );
}
