import { useLocation } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();

  return (
    <div className="flex h-[43px] items-center justify-center bg-white px-4 py-[10px] tablet:hidden tablet:px-[37px] tablet:py-5 laptop:py-[26px]">
      <h1 className="text-[12px] font-semibold leading-normal text-[#7C7C7C]">
        {location.pathname.startsWith('/dashboard/profile') ? 'Profile' : 'Treasury'}
      </h1>
    </div>
  );
};

export default Breadcrumb;
