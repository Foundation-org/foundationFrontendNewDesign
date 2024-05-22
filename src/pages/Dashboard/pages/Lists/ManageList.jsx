import { useSelector } from 'react-redux';
import { TextareaAutosize } from '@mui/material';
import { Button } from '../../../../components/ui/Button';
import { useQuery } from '@tanstack/react-query';
import { findPostsByCategoryId } from '../../../../services/api/listsApi';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

const ManageList = () => {
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  let { categoryId } = useParams();

  const [addPost, setAddPost] = useState(false);

  const {
    data: listData,
    isError,
    isPending,
    isSuccess,
  } = useQuery({
    queryFn: async () => {
      return await findPostsByCategoryId({ userUuid: persistedUserInfo.uuid, categoryId });
    },
    queryKey: ['postsByCategory', categoryId, persistedUserInfo.uuid],
  });
  console.log('🚀 ~ ManageList ~ listData:', listData);

  return (
    <div className="my-[15px] ml-[31px] hidden h-fit w-[18.75rem] min-w-[18.75rem] cursor-pointer rounded-[15px] bg-white px-[1.13rem] py-[1.5rem] laptop:block dark:bg-[#000]">
      <div className="mb-5 flex">
        <TextareaAutosize
          // id="input-2"
          // aria-label="multiple choice question"
          // onChange={handleQuestionChange}
          // onBlur={(e) => e.target.value.trim() !== '' && questionVerification(e.target.value.trim())}
          value={listData?.category}
          // placeholder={
          //   quest === 'M/R' || quest === 'OpenChoice'
          //     ? 'Make a statement or pose a question'
          //     : quest === 'Statement'
          //       ? 'Make a statement'
          //       : 'Pose a question'
          // }
          // tabIndex={3}
          // onKeyDown={(e) => e.key === 'Tab' || (e.key === 'Enter' && handleTab(2, 'Enter'))}
          className="w-full resize-none rounded-l-[5.128px] border-y border-l border-[#DEE6F7] bg-white px-[9.24px] pb-2 pt-[7px] text-[0.625rem] font-medium leading-[13px] text-[#7C7C7C] focus-visible:outline-none tablet:rounded-l-[10.3px] tablet:border-y-[3px] tablet:border-l-[3px] tablet:px-[18px] tablet:py-[10px] tablet:text-[18px] tablet:leading-[18px] laptop:rounded-l-[0.625rem] dark:border-[#0D1012] dark:bg-[#0D1012] dark:text-[#7C7C7C]"
        />
        <button
          id="new"
          className={`relative rounded-r-[5.128px] border-y border-r border-[#DEE6F7] bg-white text-[0.5rem] font-semibold leading-none tablet:rounded-r-[10.3px] tablet:border-y-[3px] tablet:border-r-[3px] tablet:text-[1rem] laptop:rounded-r-[0.625rem] laptop:text-[1.25rem] dark:border-[#0D1012] dark:bg-[#0D1012]`}
        >
          <div className="flex h-[75%] w-[50px] items-center justify-center border-l-[0.7px] border-[#DEE6F7] text-[#0FB063] tablet:w-[100px] tablet:border-l-[3px] laptop:w-[60px]">
            OK
            {/* {createQuestSlice.questionTyping ? `${createQuestSlice.question.length}/350` : questionStatus.name} */}
          </div>
          {/* <Tooltip optionStatus={questionStatus} /> */}
        </button>
      </div>
      <div className="flex flex-col gap-[15px]">
        {listData?.post.map((item) => (
          <div
            key={item._id}
            className="flex w-full items-center rounded-r-[0.33rem] bg-transparent tablet:w-full tablet:rounded-[10px]"
          >
            <div
              className={`${
                false ? 'border-[#5FA3D5]' : 'border-[#DEE6F7] dark:border-[#D9D9D9]'
              } dragIconWrapper border-y border-s tablet:border-y-[3px] tablet:border-s-[3px]`}
            >
              {persistedTheme === 'dark' ? (
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/six-dots-dark.svg`}
                  alt="six dots"
                  className="h-[8.8px] tablet:h-[18px]"
                />
              ) : (
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/six-dots.svg`}
                  alt="six dots"
                  className="h-[8.8px] tablet:h-[18px]"
                />
              )}
            </div>
            <TextareaAutosize
              // id={`input-${number}`}
              // onChange={(e) => handleChange(e.target.value)}
              // onBlur={(e) => e.target.value.trim() !== '' && answerVerification(e.target.value)}
              value={item.questForeginKey.Question}
              placeholder="Add your own option"
              // tabIndex={number + 2}
              // autoFocus={number >= 5 ? true : false}
              // onKeyDown={(e) =>
              //   (e.key === 'Tab' && handleTab(number)) || (e.key === 'Enter' && handleTab(number, 'Enter'))
              // }
              className={`${
                false
                  ? 'border-[#5FA3D5] bg-[#F2F6FF]'
                  : 'border-[#DEE6F7] bg-white dark:border-[#0D1012] dark:bg-[#0D1012]'
              } box-border flex w-full resize-none items-center border-y pr-2 text-[0.625rem] font-normal leading-[0.625rem] text-[#7C7C7C] focus-visible:outline-none tablet:rounded-r-[10px] tablet:border-y-[3px] tablet:border-r-[3px] tablet:px-[11px] tablet:py-[10px] tablet:text-[18px] tablet:leading-[18px] dark:text-[#7C7C7C]`}
            />
            <div
              className="ml-[11px]"
              // onClick={() => {
              //   removeOption(id, number);
              // }}
            >
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/trash2.svg`}
                alt="trash"
                className="h-3 w-[9px] cursor-pointer tablet:h-[33px] tablet:w-[25px]"
              />
            </div>
          </div>
        ))}
        {addPost && (
          <div className="flex w-full items-center rounded-r-[0.33rem] bg-transparent tablet:w-full tablet:rounded-[10px]">
            <div
              className={`${
                false ? 'border-[#5FA3D5]' : 'border-[#DEE6F7] dark:border-[#D9D9D9]'
              } dragIconWrapper border-y border-s tablet:border-y-[3px] tablet:border-s-[3px]`}
            >
              {persistedTheme === 'dark' ? (
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/six-dots-dark.svg`}
                  alt="six dots"
                  className="h-[8.8px] tablet:h-[18px]"
                />
              ) : (
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/six-dots.svg`}
                  alt="six dots"
                  className="h-[8.8px] tablet:h-[18px]"
                />
              )}
            </div>
            <TextareaAutosize
              // id={`input-${number}`}
              // onChange={(e) => handleChange(e.target.value)}
              // onBlur={(e) => e.target.value.trim() !== '' && answerVerification(e.target.value)}
              // value={item.questForeginKey.Question}
              placeholder=""
              // tabIndex={number + 2}
              // autoFocus={number >= 5 ? true : false}
              // onKeyDown={(e) =>
              //   (e.key === 'Tab' && handleTab(number)) || (e.key === 'Enter' && handleTab(number, 'Enter'))
              // }
              className={`${
                false
                  ? 'border-[#5FA3D5] bg-[#F2F6FF]'
                  : 'border-[#DEE6F7] bg-white dark:border-[#0D1012] dark:bg-[#0D1012]'
              } box-border flex w-full resize-none items-center border-y pr-2 text-[0.625rem] font-normal leading-[0.625rem] text-[#7C7C7C] focus-visible:outline-none tablet:rounded-r-[10px] tablet:border-y-[3px] tablet:border-r-[3px] tablet:px-[11px] tablet:py-[10px] tablet:text-[18px] tablet:leading-[18px] dark:text-[#7C7C7C]`}
            />
            <div className="ml-[11px]" onClick={() => setAddPost(false)}>
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/trash2.svg`}
                alt="trash"
                className="h-3 w-[9px] cursor-pointer tablet:h-[33px] tablet:w-[25px]"
              />
            </div>
          </div>
        )}
      </div>

      <Button variant={'addOption-fit'} className="mt-[25px]" onClick={() => setAddPost(true)}>
        + Add Post
      </Button>
      <div className="mt-[37px] flex items-center justify-end gap-[1.56rem]">
        <Button variant="submit-fit" className="w-fit">
          Save
        </Button>
        <Button variant="cancel-fit">Cancel</Button>
      </div>
    </div>
  );
};

export default ManageList;
