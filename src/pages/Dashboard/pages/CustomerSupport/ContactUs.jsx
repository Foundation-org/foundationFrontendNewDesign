import React from 'react';
import { Button } from '../../../../components/ui/Button';

const ContactUs = () => {
  return (
    <div className="w-full h-screen bg-white">
      <div className="flex flex-col gap-1 tablet:gap-2 bg-[#4A8DBD] text-[#E7E7E7] w-full py-3 tablet:py-[47px]">
        <p className="text-[7px] tablet:text-[11.77px] font-semibold text-center leading-none">Support</p>
        <h1 className="text-[12px] tablet:text-[35.3px] font-semibold text-center -tracking-[2%] leading-none">
          Get in Touch
        </h1>
        <p className="text-[8px] tablet:text-[14.71px] font-normal text-center leading-none">
          Have any questions? We're here to assist you.
        </p>
      </div>
      <div className="bg-white flex flex-col gap-10 laptop:gap-0 laptop:flex-row justify-center items-center py-[30px] px-6 tablet:px-7 tablet:py-12 laptop:p-[100px]">
        <div className="laptop:w-1/2 hidden tablet:block">
          <h1 className=" text-[14px] tablet:text-[40px] font-bold text-center -tracking-[2%] leading-none text-[#292929]">
            Get in Touch With Us
          </h1>
        </div>
        <div className="laptop:w-1/2 tablet:border border-[#CDCDCD] rounded-[15px] tablet:py-[58px] tablet:px-[55px]">
          <input
            type="text"
            placeholder="Email Address*"
            className="border-2 tablet:border-[3px] border-[#DEE6F7] rounded-[10px] text-[10px] tablet:text-[18px] font-normal text-[#909090] leading-[13px] tablet:leading-[23px] bg-[#FDFDFD] focus:outline-none p-[14px] tablet:p-5 w-full"
          />
          <textarea
            placeholder="Your Message*"
            className="border-2 tablet:border-[3px] border-[#DEE6F7] rounded-[10px] text-[10px] tablet:text-[18px] font-normal text-[#909090] leading-[13px] tablet:leading-[23px] bg-[#FDFDFD] focus:outline-none p-[14px] tablet:p-5 w-full mt-3 tablet:mt-5"
          />
          <Button variant={'submit'} className={'py-5 mt-[30px] tablet:mt-[50px]'}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
