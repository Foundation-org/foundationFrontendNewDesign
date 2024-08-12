import { useSelector } from 'react-redux';

export default function HideOption() {
  const persistedTheme = useSelector((state) => state.utils.theme);

  return (
    <div className="flex items-center gap-[6.24px] rounded-[6.683px] border-[1.248px] border-white-500 p-[6.24px] text-accent-600 tablet:gap-[15px] tablet:rounded-[16.068px] tablet:border-[3px] tablet:px-4 tablet:py-3 dark:border-gray-100 dark:text-gray-300">
      <div className="w-fit rounded-[6.683px] border-[1.248px] border-white-500 p-[6px] tablet:rounded-[9.23px] tablet:border-[3px] tablet:px-10 tablet:py-3 dark:border-gray-100">
        <h1 className="text-[10px] font-medium leading-[10px] tablet:text-[18px] tablet:leading-[18px]">Hide</h1>
      </div>
      <div className="w-full rounded-[6.683px] border-[1.248px] border-white-500 p-[6px] tablet:rounded-[9.23px] tablet:border-[3px] tablet:px-4 tablet:py-3 dark:border-gray-100">
        <h1 className="text-[10px] font-medium leading-[10px] tablet:text-[18px] tablet:leading-[18px]">
          Technology is diverse
        </h1>
      </div>
      <img
        src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/edit.svg' : 'assets/svgs/edit.svg'}`}
        alt="trash"
        className="size-[12.47px] cursor-pointer tablet:h-[30px] tablet:w-[25px]"
      />
      <img
        src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/trash.svg' : 'assets/svgs/dashboard/trash2.svg'}`}
        alt="trash"
        className="h-[12.47px] w-[9px] cursor-pointer tablet:h-[30px] tablet:w-[25px]"
      />
    </div>
  );
}
