export default function ProfileCard() {
  return (
    <div className="relative mx-auto flex max-w-[730px] items-center gap-6 rounded-[13.84px] border-[1.846px] border-[#D9D9D9] bg-white p-5">
      <div className="relative size-[185px] min-w-[185px] rounded-full border-[5px] border-[#C9C8C8]">
        <div className="absolute bottom-0 flex h-[40%] w-full items-center justify-center bg-[#FBFBFB]/50">
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/camera.svg`}
            alt="save icon"
            className="h-[17px] w-[12.7px] cursor-pointer tablet:h-[39px] tablet:w-[45px]"
          />
        </div>
        <img
          src="https://s3-alpha-sig.figma.com/img/63b9/b6ec/fcbbfb89e172228dac9ea0121de7892b?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=WIein3b4GcfnjMwQBT~xMuIVURtjWuo4Seb7w-DW-hltaPmYItAXtxmfWBt2dIO7LVMA2rbKqk3Xy4zIyZD7kab~aZLE7lPJzmALFG3tRPwpp~1KS9U9z-eAe0aiutaiWLHEc79CpO~4LKPnMP0CuJpkzM-c7UJpk4EBldyYNFUnpA3bF~ZoVqwUdd4CMioueASggMZNALD1EeUpJYFsRkFZat6uPsgZ3-BoK5du9RmnO11jdUaPJA1rOl9Tx-irSInZLlFxgbCGDDDfwPvmb0vhy4T4D4fCYveaqCa6EclBaDdeSZMXTYLeSgWY1JwfiYX0xOB7Edjswfvnph97QQ__"
          alt="aa"
          className="size-[175px] rounded-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-4 text-[#7C7C7C]">
        <div>
          <h1 className="text-[20px] font-semibold">Content Writer, CNB</h1>
          <p className="text-[16px] leading-normal">hamza.foundation.io</p>
        </div>
        <p className="text-[18px] leading-normal">
          As a content writer for Foundation, I craft compelling, insightful, and engaging narratives that highlight the
          platform's core mission of leveraging collective human intelligence to uncover the truth.
        </p>
      </div>
      <img
        src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/editIcon.svg`}
        alt="Edit Icon"
        className="absolute right-4 top-4 h-[12px] w-[12px] cursor-pointer tablet:h-[23px] tablet:w-[23px]"
        // onClick={() => {
        //   setFetchingEdit(true), setAddAnotherForm(true), setEdit(true), handleEdit(item.id);
        // }}
      />
    </div>
  );
}
