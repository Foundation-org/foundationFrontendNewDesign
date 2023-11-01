import Dropdown from '../../../components/Dropdown';
import Button from '../../../components/Button';

const SidebarLeft = () => {
  return (
    <div className="w-[18.25rem] min-w-[18.25rem] bg-[#131417] text-white h-[calc(100vh-96px)] pl-[2.18rem] pt-[4.563rem]">
      <div className="form-control w-full max-w-[13.25rem]">
        <label className="text-[22px] font-[400] leading-normal pb-[9px] ml-[5px]">
          Search
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search here...."
            className="input border-[1px] border-[#989898] w-full rounded-[18px] bg-[#0F1014] text-[#E8E8E8] focus:outline-none h-[54px]"
          />
          <img
            src="/assets/svgs/dashboard/search.svg"
            alt="search"
            className="w-6 h-6 absolute top-4 right-3"
          />
        </div>
      </div>
      <h1 className="text-[22px] font-[500] leading-normal pt-[33px] pb-[31px] ml-[5px]">
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
      <button className="bg-[#494C52] shadow-inner inset-0 rounded-[15px] py-2 px-5 text-[#EAEAEA] text-[20px] font-semibold leading-normal mt-12 ml-[18px]">
        Clear Filters
      </button>
    </div>
  );
};

export default SidebarLeft;
