import React from 'react';
import Typography from '../../../components/Typography';
import Anchor from '../../../components/Anchor';

const Form = () => {
  return (
    <div className="flex flex-col gap-[21.7px]">
      <div className="form-control w-full gap-[11.5px]">
        <label className="label p-0">
          <Typography variant="p">Email</Typography>
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Enter your email"
            className="input border-[1.473px] border-[#D0D5DD] dark:border-[#D9D9D9] focus:outline-none w-full bg-white dark:bg-gray-400 text-gray-400 dark:text-white"
          />
          <img
            src="/assets/svgs/XIcon.svg"
            alt="x-icon"
            className="h-[1.625rem] w-[1.625rem] absolute right-2 top-3 cursor-pointer"
          />
        </div>
      </div>
      <div className="form-control w-full gap-[11.5px]">
        <label className="label p-0">
          <Typography variant="p">Password</Typography>
        </label>
        <div className="relative">
          <input
            type="password"
            placeholder="Enter your password"
            className="input border-[1.473px] border-[#D0D5DD] dark:border-[#D9D9D9] focus:outline-none w-full bg-white dark:bg-gray-400 text-gray-400 dark:text-white"
          />
          <img
            src="/assets/svgs/blind-outline.svg"
            alt="x-icon"
            className="h-[1.625rem] w-[1.625rem] absolute right-2 top-3 cursor-pointer"
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="form-control">
          <label className="label cursor-pointer flex gap-[11.5px]">
            <input
              type="checkbox"
              checked=""
              className="checkbox border-[1.437px] border-[#D6D6D6] h-[23px] w-[23px] "
            />
            <span className="label-text">Remember me</span>
          </label>
        </div>
        <Anchor className="dark:text-white cursor-pointer">
          Forgot Password?
        </Anchor>
      </div>
    </div>
  );
};

export default Form;
