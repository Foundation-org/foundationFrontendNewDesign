import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSelector } from 'react-redux';

const ListItem = ({ post, setCategoryId, categoryItem, setPostId, setDeletePostPopup }) => {
  const persistedTheme = useSelector((state) => state.utils.theme);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: post._id });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center tablet:mr-[52px] tablet:gap-[10px] tablet:pl-[1.75rem]"
    >
      <div
        className={`${
          isDragging ? 'border-[#5FA3D5]' : 'border-[#DEE6F7] bg-white dark:border-[#D9D9D9] dark:bg-[#0D1012]'
        } flex w-full items-center rounded-[4.7px] border tablet:rounded-[10px] tablet:border-[3px]`}
      >
        <div className="flex w-full items-center rounded-[4.734px] bg-[#DEE6F7] dark:bg-[#D9D9D9]">
          <div
            className={`${
              isDragging ? 'border-[#5FA3D5]' : 'border-[#DEE6F7] dark:border-[#D9D9D9]'
            } tablet:rounded-x-[10px] flex h-full w-3 items-center rounded-l-[4.734px] bg-contain bg-center bg-no-repeat px-[3.3px] py-[4.6px] tablet:w-[25px] tablet:px-[7px] tablet:py-[10px]`}
            style={{
              backgroundImage: `url(${
                persistedTheme === 'dark'
                  ? `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/six-dots-dark.svg`
                  : `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/six-dots.svg`
              })`,
            }}
          />
          <div
            className={`${
              isDragging ? 'border-[#5FA3D5] bg-[#F2F6FF] dark:bg-[#0D1012]' : 'border-[#DEE6F7] dark:border-[#D9D9D9]'
            } flex w-full justify-between rounded-r-[4.7px] bg-white tablet:rounded-r-[10px] dark:bg-[#0D1012]`}
          >
            <h1 className="px-2 pb-[5.6px] pt-[5.6px] text-[8.52px] font-normal leading-[10px] text-[#435059] outline-none tablet:py-3 tablet:pl-[18px] tablet:text-[19px] tablet:leading-[19px] dark:text-[#D3D3D3]">
              {post?.questForeginKey.Question}
            </h1>
          </div>
        </div>
      </div>
      <img
        src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/trash2.svg`}
        alt="trash"
        className="ml-[11px] h-3 w-[9px] cursor-pointer tablet:h-[33px] tablet:w-[25px]"
        onClick={() => {
          setCategoryId(categoryItem._id), setPostId(post._id), setDeletePostPopup(true);
        }}
      />
    </div>
  );
};

export default ListItem;
