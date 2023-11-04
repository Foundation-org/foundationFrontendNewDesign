import Dropdown from '../../../components/Dropdown';

const SidebarLeft = () => {
  return (
    <div className="bg-white dark:bg-[#131417] h-[calc(100vh-96px)] w-[18.25rem] min-w-[18.25rem] pl-[2.18rem] pt-[4.563rem] text-[#535353] dark:text-white ">
      <div className="form-control w-full max-w-[13.25rem]">
        <label className="text-[22px] font-[400] leading-normal pb-[9px] ml-[5px]">
          Search
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search here...."
            className="input border-[1px] dark:border-[#989898] w-full rounded-[18px] bg-[#F6F6F6] dark:bg-[#0F1014] text-gray-400 dark:text-[#E8E8E8] focus:outline-none h-[54px]"
          />
          <img
            src="/assets/svgs/dashboard/search.svg"
            alt="search"
            className="w-6 h-6 absolute top-4 right-3"
          />
        </div>
      </div>
      <h1 className="text-[22px] font-[500] leading-normal text-[#888] dark:text-white pt-[33px] pb-[31px] ml-[5px] flex items-center gap-2">
        <img
          src="/assets/svgs/dashboard/filter.svg"
          alt="filter"
          className="w-[1.188rem] h-[1.188rem]"
        />
        Filters
      </h1>
      <div className="flex flex-col gap-5">
        <Dropdown
          label={'Status'}
          title={'Search'}
          items={['Item 1', 'Item 2']}
        />
        <Dropdown
          label={'Type'}
          title={'Search'}
          items={['Item 1', 'Item 2']}
        />
        <Dropdown
          label={'Scope'}
          title={'Search'}
          items={['Item 1', 'Item 2']}
        />
        <Dropdown
          label={'Sort'}
          title={'Search'}
          items={['Item 1', 'Item 2']}
        />
      </div>
      <button
        className={`${
          import.meta.env.VITE_THEME_SWITCH === 'dark'
            ? 'bg-[#494C52]'
            : 'bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]'
        }  shadow-inner inset-0 rounded-[0.938rem] py-2 px-5 text-white dark:text-[#EAEAEA] text-[1.25rem] font-semibold leading-normal mt-12 ml-[1.125rem]`}
      >
        Clear Filters
      </button>
    </div>
  );
};

export default SidebarLeft;
