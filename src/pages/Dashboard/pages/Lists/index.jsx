import { useState } from 'react';
import { Button } from '../../../../components/ui/Button';
import { Reorder } from 'framer-motion';
import { useSelector } from 'react-redux';
import Copy from '../../../../assets/Copy';
import BasicModal from '../../../../components/BasicModal';

const initialItems = ['🍅 Tomato', '🥒 Cucumber', '🧀 Cheese', '🥬 Lettuce'];

const Lists = () => {
  const persistedTheme = useSelector((state) => state.utils.theme);
  const [items, setItems] = useState(initialItems);

  return (
    <div className="no-scrollbar flex h-full w-full flex-col gap-2 overflow-y-auto px-4 pb-[10px] tablet:my-[0.94rem] tablet:gap-5 tablet:px-6 tablet:pb-5">
      <div className="mx-auto w-full max-w-[730px] rounded-[12.3px] border-2 border-[#D9D9D9] bg-white tablet:rounded-[15px] dark:border-white dark:bg-[#000] ">
        <div className="flex items-center justify-between border-b-[0.125rem] border-[#D9D9D9] px-[1.56rem] py-[0.87rem]">
          <h4 className="text-[0.75rem] font-semibold leading-[15px] text-[#7C7C7C] tablet:text-[1.25rem] tablet:leading-[23px]">
            Diabetic
          </h4>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="25" viewBox="0 0 20 25" fill="none">
            <path
              d="M17.8397 8.92994L17.4371 21.1174C17.4028 22.1611 16.9631 23.1505 16.2113 23.8754C15.4595 24.6003 14.4548 25.0037 13.4105 25H5.76001C4.71634 25.0037 3.71225 24.6009 2.96058 23.8768C2.20891 23.1528 1.76876 22.1645 1.73344 21.1214L1.33078 8.92994C1.32197 8.66296 1.41958 8.40341 1.60213 8.2084C1.78468 8.01339 2.03723 7.89888 2.3042 7.89007C2.57118 7.88126 2.83073 7.97887 3.02574 8.16142C3.22075 8.34398 3.33526 8.59652 3.34407 8.8635L3.74672 21.0539C3.76677 21.5743 3.98771 22.0667 4.36312 22.4277C4.73853 22.7887 5.23921 22.9901 5.76001 22.9897H13.4105C13.932 22.9901 14.4332 22.7881 14.8087 22.4262C15.1843 22.0644 15.4047 21.571 15.4238 21.0499L15.8264 8.8635C15.8352 8.59652 15.9497 8.34398 16.1448 8.16142C16.3398 7.97887 16.5993 7.88126 16.8663 7.89007C17.1333 7.89888 17.3858 8.01339 17.5684 8.2084C17.7509 8.40341 17.8485 8.66296 17.8397 8.92994ZM19.1715 4.87417C19.1715 5.14115 19.0654 5.39719 18.8767 5.58598C18.6879 5.77476 18.4318 5.88082 18.1649 5.88082H1.00664C0.739664 5.88082 0.483621 5.77476 0.294838 5.58598C0.106056 5.39719 0 5.14115 0 4.87417C0 4.60719 0.106056 4.35115 0.294838 4.16237C0.483621 3.97359 0.739664 3.86753 1.00664 3.86753H4.12723C4.44619 3.86839 4.75405 3.75055 4.99091 3.53695C5.22778 3.32334 5.3767 3.02925 5.40869 2.7119C5.48297 1.96748 5.83174 1.27737 6.38704 0.776038C6.94234 0.274707 7.66439 -0.00193609 8.41251 1.02002e-05H10.758C11.5061 -0.00193609 12.2282 0.274707 12.7835 0.776038C13.3388 1.27737 13.6875 1.96748 13.7618 2.7119C13.7938 3.02925 13.9427 3.32334 14.1796 3.53695C14.4164 3.75055 14.7243 3.86839 15.0433 3.86753H18.1639C18.4308 3.86753 18.6869 3.97359 18.8757 4.16237C19.0644 4.35115 19.1705 4.60719 19.1705 4.87417H19.1715ZM7.15622 3.86753H12.0163C11.884 3.56528 11.7975 3.24501 11.7596 2.91726C11.7347 2.66913 11.6185 2.43909 11.4336 2.27171C11.2488 2.10433 11.0084 2.01153 10.759 2.01128H8.41352C8.16414 2.01153 7.92373 2.10433 7.73887 2.27171C7.55401 2.43909 7.43785 2.66913 7.41291 2.91726C7.37469 3.24506 7.28885 3.56533 7.15622 3.86753ZM8.16991 19.1192V10.5476C8.16991 10.2806 8.06385 10.0246 7.87507 9.83581C7.68629 9.64702 7.43025 9.54097 7.16327 9.54097C6.89629 9.54097 6.64025 9.64702 6.45146 9.83581C6.26268 10.0246 6.15662 10.2806 6.15662 10.5476V19.1232C6.15662 19.3902 6.26268 19.6462 6.45146 19.835C6.64025 20.0238 6.89629 20.1298 7.16327 20.1298C7.43025 20.1298 7.68629 20.0238 7.87507 19.835C8.06385 19.6462 8.16991 19.3902 8.16991 19.1232V19.1192ZM13.0159 19.1192V10.5476C13.0159 10.2806 12.9098 10.0246 12.721 9.83581C12.5323 9.64702 12.2762 9.54097 12.0092 9.54097C11.7423 9.54097 11.4862 9.64702 11.2974 9.83581C11.1087 10.0246 11.0026 10.2806 11.0026 10.5476V19.1232C11.0026 19.3902 11.1087 19.6462 11.2974 19.835C11.4862 20.0238 11.7423 20.1298 12.0092 20.1298C12.2762 20.1298 12.5323 20.0238 12.721 19.835C12.9098 19.6462 13.0159 19.3902 13.0159 19.1232V19.1192Z"
              fill="#818181"
            />
          </svg>
        </div>
        <div className="my-[0.94rem] mr-[2.25rem]">
          <Reorder.Group onReorder={setItems} values={items} className="flex flex-col gap-[5.7px] tablet:gap-[10px]">
            {items.map((item) => (
              <Reorder.Item value={item} key={item} className="cursor-pointer">
                <div className="flex items-center tablet:mr-[52px] tablet:gap-[10px] tablet:pl-[1.75rem]">
                  <div
                    className={`${
                      false ? 'border-[#5FA3D5]' : 'border-[#DEE6F7] bg-white dark:border-[#D9D9D9] dark:bg-[#0D1012]'
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
                          {item}
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
          <div className="mt-[1.76rem] flex w-full items-center justify-end gap-[1.4rem]">
            <Button variant="cancel" className="bg-[#A3A3A3]">
              Edit
            </Button>
            <Button variant="submit">View</Button>
          </div>
        </div>
        <div className="flex items-center justify-between border-t-[0.125rem] border-[#D9D9D9] px-[1.56rem] py-[0.87rem]">
          <h4 className="text-[0.75rem] font-semibold leading-[15px] text-[#7C7C7C] tablet:text-[1.125rem] tablet:leading-[23px]">
            06 Posts
          </h4>
          <div className="flex  items-center gap-[0.17rem]  tablet:gap-[6px]">
            <div
              // onClick={() => {
              //   handleCopyOpen();
              // }}
              className="cursor-pointer"
            >
              {persistedTheme === 'dark' ? <Copy /> : <Copy />}
            </div>
            <BasicModal
              // open={copyModal}
              // handleClose={handleCopyClose}
              // customStyle={customModalStyle}
              customClasses="rounded-[10px] tablet:rounded-[26px]"
            >
              {/* <CopyDialogue handleClose={handleCopyClose} questStartData={questStartData} /> */}
            </BasicModal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lists;
