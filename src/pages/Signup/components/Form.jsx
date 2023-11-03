import Input from '../../../components/Input';

const Form = () => {
  return (
    <form className="w-full flex flex-col gap-11 my-6">
      <Input
        type="email"
        id="email"
        label="Email Address"
        className="border-b py-1 focus:outline-none focus:border-white focus:border-b-2 transition-colors peer bg-white dark:bg-dark w-full border-white"
        autoComplete="off"
      />
      <div>
        <div className="relative">
          <Input
            type="password"
            id="password"
            label="Password"
            className="border-b py-1 focus:outline-none focus:border-white focus:border-b-2 transition-colors peer bg-white dark:bg-dark w-full border-white"
            autoComplete="off"
          />
          <img
            src="/assets/svgs/blind.svg"
            alt="blind"
            className="absolute right-2 -top-2"
          />
        </div>
        <div className="w-full bg-gray-200 rounded-full h-[3px] flex gap-2">
          <div className="bg-green h-[3px] w-[25%]"></div>
          <div className="bg-green h-[3px] w-[25%]"></div>
          <div className="bg-green h-[3px] w-[25%]"></div>
          <div className="bg-gray-200 dark:bg-white h-[3px] w-[25%]"></div>
        </div>
        <p className="text-end text-green-200 text-[12px] mt-2 leading-[18px] tracking-[0.048px]">
          Good
        </p>
      </div>
      <div>
        <div className="relative">
          <Input
            type="password"
            id="retype-password"
            label="Re-Type Password"
            className="border-b py-1 focus:outline-none focus:border-white focus:border-b-2 transition-colors peer bg-white dark:bg-dark w-full border-white"
            autoComplete="off"
          />
          <img
            src="/assets/svgs/blind.svg"
            alt="blind"
            className="absolute right-2 -top-2"
          />
        </div>
        <div className="w-full bg-gray-200 rounded-full h-[3px] flex gap-2">
          <div className="bg-green h-[3px] w-[25%]"></div>
          <div className="bg-green h-[3px] w-[25%]"></div>
          <div className="bg-green h-[3px] w-[25%]"></div>
          <div className="bg-gray-200 dark:bg-white h-[3px] w-[25%]"></div>
        </div>
        <p className="text-end text-green-200 text-[12px] mt-2 leading-[18px] tracking-[0.048px]">
          Good
        </p>
      </div>
    </form>
  );
};

export default Form;
