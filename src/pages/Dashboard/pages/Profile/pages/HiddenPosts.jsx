import { useState } from 'react';
import { GrClose } from 'react-icons/gr';
import UnhindPost from '../../../../../components/dialogue-boxes/UnhindPost';
import { Button } from '../../../../../components/ui/Button';

export default function HiddenPosts() {
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const showHidePostOpen = () => setModalVisible(true);
  const showHidePostClose = () => setModalVisible(false);

  const handleSearch = (e) => setSearch(e.target.value);

  return (
    <div>
      <div className="pt-[5px] ml-[32px] mr-4 tablet:ml-[97px] tablet:mr-[70px] flex justify-between">
        <h1 className=" text-[12px] font-semibold leading-[14.52px] text-[#4A8DBD] tablet:leading-[30px] tablet:font-semibold  tablet:text-[25px] dark:text-[#B8B8B8]">
          Hidden Posts
        </h1>
        <div className="relative">
          <div className="relative h-[15.96px] tablet:h-[45px] w-[128px] tablet:w-[337px]">
            <input
              type="text"
              id="floating_outlined"
              className="dark:focus:border-blue-500 focus:border-blue-600 peer block h-full w-full appearance-none rounded-[3.55px] tablet:rounded-[10px] border-[0.71px] tablet:border-2 border-[#707175] bg-transparent py-2 pl-2 tablet:pl-5 pr-8 leading-[7.25px] text-[#707175] focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-[#707175] text-[6px] tablet:text-[18.23px]"
              value={search}
              placeholder=""
              onChange={handleSearch}
            />
            <label
              htmlFor="floating_outlined"
              className="peer-focus:text-blue-600 peer-focus:dark:text-blue-500 text-[8.33px] leading-[10px] absolute left-[15px] start-1 top-[10px] tablet:top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-[#F3F3F3] px-2  text-[#707175] duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:bg-[#0A0A0C] tablet:text-[18px] tablet:leading-[21.78px]"
            >
              Search
            </label>
            {search && (
              <button
                className="absolute right-1.5 tablet:right-3 top-[55%] tablet:top-1/2 transform -translate-y-1/2 "
                onClick={() => {
                  setSearch('');
                }}
              >
                <GrClose className="h-2 w-2 tablet:h-4 tablet:w-4 text-[#ACACAC] dark:text-white" />
              </button>
            )}
            {!search && (
              <img
                src="/assets/svgs/dashboard/search.svg"
                alt="search"
                className="absolute right-1.5 tablet:right-3 top-[55%] tablet:top-1/2 transform -translate-y-1/2 h-2 w-2 tablet:h-4 tablet:w-4"
              />
            )}
          </div>
        </div>
      </div>

      <Button variant={'submit'} onClick={showHidePostOpen}>
        Open Dialogue
      </Button>
      <UnhindPost handleClose={showHidePostClose} modalVisible={modalVisible} />
    </div>
  );
}
