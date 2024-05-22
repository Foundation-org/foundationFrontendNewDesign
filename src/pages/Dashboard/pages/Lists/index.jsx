import { useEffect, useState } from 'react';
import { Button } from '../../../../components/ui/Button';
import { Reorder } from 'framer-motion';
import { useSelector } from 'react-redux';
import Copy from '../../../../assets/Copy';
import BasicModal from '../../../../components/BasicModal';
import CopyDialogue from '../../../../components/question-card/Shareables/CopyDialogue';
import { useQuery } from '@tanstack/react-query';
import { fetchLists } from '../../../../services/api/listsApi';
import { useNavigate } from 'react-router-dom';
import { referralModalStyle } from '../../../../constants/styles';

const Lists = () => {
  const navigate = useNavigate();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const [items, setItems] = useState([]);
  const [copyModal, setCopyModal] = useState(false);

  const handleCopyClose = () => setCopyModal(false);

  const {
    data: listData = [],
    isError,
    isPending,
    isSuccess,
  } = useQuery({
    queryFn: fetchLists,
    queryKey: ['lists'],
  });

  useEffect(() => {
    setItems(listData);
  }, [isSuccess, listData]);

  if (isError) {
    console.log('some eror occur');
  }

  return (
    <div className="no-scrollbar flex h-[calc(100vh-70px)] w-full flex-col gap-2 overflow-y-auto px-4 pb-[10px] tablet:my-[0.94rem] tablet:gap-5 tablet:px-6 tablet:pb-5">
      <Reorder.Group onReorder={setItems} values={items} className="flex flex-col gap-[5.7px] tablet:gap-[10px]">
        {items?.map((item) => (
          <div
            key={item._id}
            className="mx-auto w-full max-w-[730px] rounded-[12.3px] border-2 border-[#D9D9D9] bg-white tablet:rounded-[15px] dark:border-white dark:bg-[#000]"
          >
            <div className="flex items-center justify-between border-b-[0.125rem] border-[#D9D9D9] px-[1.56rem] py-[0.87rem]">
              <h4 className="text-[0.75rem] font-semibold leading-[15px] text-[#7C7C7C] tablet:text-[1.25rem] tablet:leading-[23px]">
                {item.category}
              </h4>
              <img src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/trash-icon.svg`} alt="trash-icon" />
            </div>

            <div className="my-[0.94rem] mr-[2.25rem]">
              <ul className="space-y-[0.69rem]">
                {item.post.length >= 1 &&
                  item.post.map((post) => (
                    <Reorder.Item value={post} key={post._id} className="cursor-pointer">
                      <div className="flex items-center tablet:mr-[52px] tablet:gap-[10px] tablet:pl-[1.75rem]">
                        <div
                          className={`${
                            false
                              ? 'border-[#5FA3D5]'
                              : 'border-[#DEE6F7] bg-white dark:border-[#D9D9D9] dark:bg-[#0D1012]'
                          } flex w-full items-center rounded-[4.7px] border tablet:rounded-[10px] tablet:border-[3px]`}
                        >
                          <div className="flex w-full items-center rounded-[4.734px] bg-[#DEE6F7] dark:bg-[#D9D9D9]">
                            <div
                              className={`${
                                false ? 'border-[#5FA3D5]' : 'border-[#DEE6F7] dark:border-[#D9D9D9]'
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
                                false
                                  ? 'border-[#5FA3D5] bg-[#F2F6FF] dark:bg-[#0D1012]'
                                  : 'border-[#DEE6F7] dark:border-[#D9D9D9]'
                              } flex w-full justify-between rounded-r-[4.7px] bg-white tablet:rounded-r-[10px] dark:bg-[#0D1012]`}
                            >
                              <h1 className="px-2 pb-[5.6px] pt-[5.6px] text-[8.52px] font-normal leading-[10px] text-[#435059] outline-none tablet:py-3 tablet:pl-[18px] tablet:text-[19px] tablet:leading-[19px] dark:text-[#D3D3D3]">
                                {post.questForeginKey.Question}
                              </h1>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Reorder.Item>
                  ))}
              </ul>
              <div className="mt-[1.76rem] flex w-full items-center justify-end gap-[1.4rem]">
                <Button
                  variant="cancel"
                  className="bg-[#A3A3A3]"
                  onClick={() => navigate(`/dashboard/postsbylist/${item._id}`)}
                >
                  Edit
                </Button>
                <Button variant="submit">View</Button>
              </div>
            </div>

            <div className="flex items-center justify-between border-t-[0.125rem] border-[#D9D9D9] px-[1.56rem] py-[0.87rem]">
              <h4 className="text-[0.75rem] font-semibold leading-[15px] text-[#7C7C7C] tablet:text-[1.125rem] tablet:leading-[23px]">
                {item.post.length} Post{item.post.length > 1 ? 's' : ''}
              </h4>
              <div className="flex items-center gap-[0.17rem] tablet:gap-[1.62rem]">
                <div
                  onClick={() => {
                    setCopyModal(true);
                  }}
                  className="cursor-pointer"
                >
                  {persistedTheme === 'dark' ? <Copy /> : <Copy />}
                </div>
                <BasicModal
                  open={copyModal}
                  handleClose={handleCopyClose}
                  customStyle={referralModalStyle}
                  customClasses="rounded-[10px] tablet:rounded-[26px]"
                >
                  <CopyDialogue handleClose={handleCopyClose} />
                </BasicModal>
                <div className="flex items-center gap-[0.56rem]">
                  <img src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/copyblue.svg`} alt="copy icon" />{' '}
                  <h4 className="text-[0.75rem] font-semibold leading-[15px] text-[#389CE3] tablet:text-[1.25rem] tablet:leading-[1.25rem]">
                    Copy Link
                  </h4>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Reorder.Group>
    </div>
  );
};

export default Lists;
