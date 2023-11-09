import { useState } from 'react';
import { Switch } from '@headlessui/react';
import Options from '../components/Options';

const YesNo = () => {
  const [enabled, setEnabled] = useState(false);

  return (
    <div>
      <h4 className="text-[#ACACAC] text-[25px] font-medium leading-normal text-center mt-[47px]">
        Ask a question that allows for diverse responses and multiple answer
        options.
      </h4>
      <div className="bg-[#F3F3F3] rounded-[26px] py-[42px] max-w-[979px] mx-auto my-10">
        <h1 className="text-[#7C7C7C] text-[32px] font-semibold leading-normal text-center">
          Create Quest
        </h1>
        <h3 className="text-[#C5C5C5] text-[25px] font-normal leading-normal mt-[38px] ml-[104px]">
          Make a statement
        </h3>
        <div className="bg-[#FCFCFC] rounded-2xl py-[18px] pl-[30px] max-w-[838px] mx-auto mt-[22px]">
          <h3 className="text-[#7C7C7C] text-[30px] font-semibold leading-normal">
            Technology is highly diverse and versatile?
          </h3>
        </div>
        <div className="mt-10 flex flex-col gap-[30px]">
          <Options number={'#1'} answer={'Yes'} />
          <Options number={'#2'} answer={'No'} />
        </div>
        <h3 className="text-[#C5C5C5] text-[25px] font-normal leading-normal mt-[50px] mb-[32px] ml-[104px]">
          Customize your Quest
        </h3>
        <div className="bg-[#FCFCFC] rounded-[16px] max-w-[838px] mx-auto py-[35px] flex flex-col gap-7">
          <h5 className="text-[#435059] text-[30px] font-medium leading-normal text-center">
            Settings
          </h5>
          <div className="bg-[#F4F4F4] rounded-[16px] mx-[51px] py-[34px] px-7 flex justify-between items-center">
            <h5 className="text-[#7C7C7C] text-[28px] font-normal leading-normal">
              This Quest has a Correct Option.
            </h5>
            <Switch
              checked={enabled}
              onChange={setEnabled}
              className={`${enabled ? 'bg-[#7EEAAF]' : 'bg-[#D9D9D9]'}
      relative inline-flex items-center h-[20px] w-[50px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
            >
              <span className="sr-only">Use setting</span>
              <span
                aria-hidden="true"
                className={`${
                  enabled
                    ? 'translate-x-6 bg-[#0DA65D]'
                    : '-translate-x-[7px] bg-[#707070]'
                }
        pointer-events-none inline-block h-[30px] w-[30px] transform rounded-full  shadow-lg ring-0 transition duration-200 ease-in-out`}
              />
            </Switch>
          </div>
          <div className="bg-[#F4F4F4] rounded-[16px] mx-[51px] py-[34px] px-7 flex justify-between items-center">
            <h5 className="text-[#7C7C7C] text-[28px] font-normal leading-normal">
              This Quest has a Correct Option.
            </h5>
            <Switch
              checked={enabled}
              onChange={setEnabled}
              className={`${enabled ? 'bg-[#7EEAAF]' : 'bg-[#D9D9D9]'}
      relative inline-flex items-center h-[20px] w-[50px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
            >
              <span className="sr-only">Use setting</span>
              <span
                aria-hidden="true"
                className={`${
                  enabled
                    ? 'translate-x-6 bg-[#0DA65D]'
                    : '-translate-x-[7px] bg-[#707070]'
                }
        pointer-events-none inline-block h-[30px] w-[30px] transform rounded-full  shadow-lg ring-0 transition duration-200 ease-in-out`}
              />
            </Switch>
          </div>
        </div>
        <div className="w-full flex justify-end">
          <button className="mt-[60px] mr-[70px] bg-gradient-to-tr from-[#6BA5CF] to-[#389CE3] w-fit py-3 px-[60px] text-white text-[31.5px] font-semibold leading-normal rounded-[23.6px]">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default YesNo;
