import { faqData, faqData2 } from '../../../../constants/faq';
import { Button } from '../../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Faq = () => {
  const navigate = useNavigate();
  const [view, setView] = useState(1);

  return (
    <div className="no-scrollbar h-[calc(100dvh-151px)]  w-full overflow-scroll overflow-y-auto bg-white text-[#707175] tablet:h-[calc(100dvh-96px)] laptop:h-[calc(100dvh-70px)]">
      <h1 className="mx-[1.13rem] my-[0.94rem] text-[14px] font-semibold leading-none -tracking-[2%] tablet:mx-[35px] tablet:my-6 tablet:text-[25px]">
        General
      </h1>
      {faqData.map((item) => (
        <div>
          <button
            key={item.id}
            className={`${item.id === view ? 'border-y-[0.5px] tablet:border-y' : 'border-t-[0.5px] tablet:border-t'} flex w-full items-center gap-[5px] border-black px-[1.13rem]`}
            onClick={() => setView(item.id)}
          >
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/faq/arrow.svg`}
              alt="account"
              className={`${item.id === view ? 'rotate-180' : ''} size-5 tablet:size-[1.875rem]`}
            />
            <h1 className="my-[0.94rem] text-start text-[12px] font-medium leading-none tablet:my-6 tablet:text-[22px] tablet:leading-[137.2%]">
              {item.title}
            </h1>
          </button>
          {item.id === view && (
            <div className="flex flex-col gap-2 bg-[#F5F6F8] px-[1.94rem] py-[0.62rem] tablet:gap-4 tablet:px-[50px] tablet:py-[15px]">
              {item.desc.map((i, index) => (
                <p
                  key={index + 1}
                  className="text-[0.75rem] font-normal leading-[125%] tablet:text-[18px] tablet:leading-[167%]"
                >
                  {i}
                </p>
              ))}
            </div>
          )}
        </div>
      ))}
      <h1 className="border-t-[0.5px] border-black px-[1.13rem] py-[0.94rem] text-[14px] font-semibold leading-none -tracking-[2%] tablet:border-t tablet:px-[35px] tablet:py-6 tablet:text-[25px]">
        Posting and features
      </h1>
      {faqData2.map((item) => (
        <div>
          <button
            key={item.id}
            className={`${item.id === view ? 'border-y-[0.5px] tablet:border-y' : 'border-t-[0.5px] tablet:border-t'} flex w-full items-center gap-[5px] border-black px-[1.13rem]`}
            onClick={() => setView(item.id)}
          >
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/faq/arrow.svg`}
              alt="account"
              className={`${item.id === view ? 'rotate-180' : ''} size-5 tablet:size-[1.875rem]`}
            />
            <h1 className="my-[0.94rem] text-start text-[12px] font-medium leading-none tablet:my-6 tablet:text-[22px] tablet:leading-[137.2%]">
              {item.title}
            </h1>
          </button>
          {item.id === view && (
            <div className="flex flex-col gap-2 bg-[#F5F6F8] px-[1.94rem] py-[0.62rem] tablet:gap-4 tablet:px-[50px] tablet:py-[15px]">
              <ul className="ml-3 list-decimal tablet:ml-5">
                {item.steps &&
                  item.steps.length >= 0 &&
                  item.steps.map((i, index) => (
                    <li
                      key={index + 1}
                      className="text-[0.75rem] font-normal leading-[125%] tablet:text-[18px] tablet:leading-[167%]"
                    >
                      {i}
                    </li>
                  ))}
              </ul>
              {item.desc.map((i, index) => (
                <p
                  key={index + 1}
                  className="text-[0.75rem] font-normal leading-[125%] tablet:text-[18px] tablet:leading-[167%]"
                >
                  {i}
                </p>
              ))}
            </div>
          )}
        </div>
      ))}
      <div className="flex w-full flex-col items-center justify-center gap-[1.31rem] bg-[#4A8DBD] py-7 tablet:gap-[35px] tablet:py-[53px]">
        <h1 className="text-[14px] font-bold text-white tablet:text-[22px]">
          Didn’t find the answer you were looking for?
        </h1>
        <button
          className="w-48 rounded-[0.31rem] bg-white py-[0.6rem] text-center text-[0.75rem] font-semibold text-[#4A8DBD] tablet:w-[24.3rem] tablet:rounded-[0.75rem] tablet:py-3 tablet:text-[1.25rem]"
          onClick={() => navigate('/contact-us')}
        >
          Contact Us
        </button>
      </div>
    </div>
  );
};

export default Faq;
