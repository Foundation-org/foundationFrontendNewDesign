import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentialLogin, setCredentialRegister } from '../../../../features/extras/extrasSlice';

const About = () => {
  const navigate = useNavigate();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);

  return (
    <div className="bg-white dark:border-gray-100 dark:bg-gray-200 tablet:rounded-b-[0.86513rem] tablet:rounded-t-[0.86513rem] tablet:dark:border-[2.56px]">
      <div className="-mt-[2px] space-y-[0.63rem] bg-[#238AD4] px-8 py-[1.3rem] text-white dark:bg-silver-200 dark:text-gray-300 tablet:mt-0 tablet:space-y-2 tablet:rounded-t-[0.86513rem] tablet:px-16 tablet:py-6">
        <h1 className="pb-3 text-center text-[0.875rem] font-bold leading-[0.875rem] dark:text-gray-300 tablet:pb-[10px] tablet:text-[1.25rem] tablet:leading-[1.25rem]">
          What Is Foundation?
        </h1>
        {/* <p className="text-center text-[0.6875rem] font-normal leading-[0.6875rem] tablet:text-[1.125rem] tablet:leading-[1.125rem]">
          Unlock the potential of your personal data.
        </p> */}
        <p className="text-[0.6875rem] font-normal leading-[145.455%] tablet:text-[1.125rem] tablet:leading-normal">
          Foundation is a new kind of anonymous social platform designed to help you figure out what's true. By
          leveraging collective human intelligence and trusted data in a unique new way, when you benefit, we all
          benefit.
        </p>
        {/* <p className="text-[0.6875rem] font-normal leading-[145.455%] tablet:text-[1.125rem] tablet:leading-normal">
          We wanted to create a rewards based platform that lets you own the content you create - putting the value of
          your data back in your hands.
        </p> */}
      </div>
      {/* <div className="mt-4 bg-[#238AD4] px-8 py-[1.3rem] text-white dark:border-gray-100 dark:bg-silver-200 tablet:px-16 tablet:py-6 tablet:dark:border-y-[2.56px]">
        <p className="text-[0.6875rem] font-normal leading-[145.455%] tablet:text-start tablet:text-[1.125rem] tablet:leading-[179.006%]">
          Foundation is a revolutionary data exchange platform where users can monetize their personal data, insights
          and achievements in a secure and anonymous environment. Imagine brands paying you to show you an ad!
        </p>
      </div> */}
      <div className="bg-[#F5F6F8] px-8 py-[1.3rem] text-[#707175] dark:border-gray-100 dark:bg-silver-300 dark:text-gray-300 tablet:px-16 tablet:py-6 tablet:dark:border-b-[2.56px]">
        <h1 className="text-center text-[0.875rem] font-bold leading-[0.875rem] tablet:text-[1.25rem] tablet:leading-[1.25rem]">
          How to get started
        </h1>
        <div className="mt-[1.425rem] space-y-[15px] tablet:mt-[1.125rem] tablet:space-y-4">
          {/* <div className="flex items-start gap-[0.8rem] tablet:gap-[1.15rem]"> 
           <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/addUser.svg' : 'assets/about/account.svg'}`}
              alt="account"
              className="size-5 tablet:size-[1.875rem]"
            /> */}
          <div className="w-full space-y-[0.6rem] text-center tablet:space-y-1">
            <h5 className="text-[0.75rem] font-bold leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-normal">
              Step 1
            </h5>
            <p className="text-[0.75rem] font-normal leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[148%]">
              Build Your Profile - Create an anonymous profile on Foundation. Give your profile trust by adding
              verification badges. These will come in handy later.
            </p>
          </div>
          {/* </div> */}
          {/*<div className="flex items-start gap-[0.8rem] tablet:gap-[1.15rem]">
             <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/chat.svg' : 'assets/about/conversation.svg'}`}
              alt="conversation"
              className="size-5 tablet:h-[1.875rem] tablet:w-[2.13rem]"
            /> */}
          <div className="w-full space-y-[0.6rem] text-center tablet:space-y-1">
            <h5 className="text-[0.75rem] font-bold leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[148%]">
              Step 2
            </h5>
            <p className="text-[0.75rem] font-normal leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[148%]">
              Participate - Respond to posts, create posts, give feedback and share your thoughts safely while staying
              anonymous and verified.
            </p>
            {/* <p className="text-[0.75rem] font-normal leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[148%]">
                Every post is anonymous, so the focus can stay on the conversation, not personal attacks.
              </p> */}
            {/* </div> */}
          </div>
          {/*<div className="flex items-start gap-[0.8rem] tablet:gap-[1.15rem]">
             <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/dollar.svg' : 'assets/about/asset.svg'}`}
              alt="account"
              className="size-5 tablet:size-[1.875rem]"
            /> */}
          <div className="w-full space-y-[0.6rem] text-center tablet:space-y-1">
            <h5 className="text-[0.75rem] font-bold leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[148%]">
              Step 3
            </h5>
            <p className="text-[0.75rem] font-normal leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[148%]">
              Earn rewards - Gain FDX tokens and receive relevant paid offers from companies.
            </p>
          </div>
          <div className="w-full space-y-[0.6rem] text-center tablet:space-y-1">
            <h5 className="text-[0.75rem] font-bold leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[148%]">
              Step 4
            </h5>
            <p className="text-[0.75rem] font-normal leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[148%]">
              Influence the Future - Your contributions help shape decisions by providing valuable insights to
              researchers, companies, and policymakers. In the future, businesses will be able to market to you directly
              based on your data.
            </p>
          </div>
        </div>
        {/* </div> */}
      </div>
      <div className="space-y-[0.63rem] bg-[#238AD4] px-8 py-[1.3rem] text-white dark:bg-silver-200 dark:text-gray-300 tablet:mt-0 tablet:space-y-2 tablet:rounded-b-[0.86513rem] tablet:px-16 tablet:py-6">
        {/* <img
          src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/lock.svg' : 'assets/about/lock.svg'}`}
          alt="account"
          className="h-10 w-7 tablet:h-[2.18rem] tablet:w-[1.53rem]"
        /> */}
        <h5 className="pb-3 text-center text-[0.875rem] font-bold leading-[0.875rem] dark:text-gray-300 tablet:pb-[10px] tablet:text-[1.25rem] tablet:leading-[1.25rem]">
          Safe & secure
        </h5>
        <p className="text-[0.6875rem] font-normal leading-[145.455%] tablet:text-[1.125rem] tablet:leading-normal">
          Foundation does not own and cannot share any of the personal data you populate. You choose what data you want
          to share and, in the future, at what price.
        </p>
      </div>
      {persistedUserInfo.role !== 'user' && (
        <div className="mt-5 flex flex-col items-center gap-[15px] bg-[#156DB4] px-12 py-[1.3rem] text-white dark:border-gray-100 dark:bg-silver-200 tablet:mt-5 tablet:gap-[1.56rem] tablet:rounded tablet:py-[1.92rem] tablet:dark:border-t-[2.56px]">
          <h1 className="text-center text-[0.875rem] font-normal leading-[161.2%] tablet:text-[1.56rem] tablet:font-bold">
            Join Foundation
          </h1>
          <button
            className="w-48 rounded-[0.31rem] bg-white py-[0.6rem] text-center text-[0.75rem] font-semibold text-[#156DB4] tablet:w-[24.3rem] tablet:rounded-[0.75rem] tablet:py-3 tablet:text-[1.25rem]"
            onClick={() => {
              dispatch(setCredentialRegister(true));
            }}
          >
            Sign up
          </button>
          <p className="text-center text-[0.75rem] font-normal leading-[161.2%] tablet:text-[1.125rem]">
            Already have an account?{' '}
            <span
              className="cursor-pointer"
              onClick={() => {
                dispatch(setCredentialLogin(true));
              }}
            >
              Log in
            </span>
          </p>
        </div>
      )}

      {/* <div className="flex flex-col gap-[0.69rem] p-8 text-[#707175] tablet:gap-[1.56rem] tablet:px-16 tablet:pb-[3.12rem] tablet:pt-[1.88rem]">
        <h5 className="text-[0.75rem] font-normal italic leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[161%]">
          “Owning our personal data liberates us from being slaves to the system, giving us the freedom to live life on
          our terms.“
        </h5>
        <h5 className="text-[0.75rem] font-semibold leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[161%]">
          Justin Leffew <br />
          CEO Foundation Internet Organization
        </h5>
      </div> */}
    </div>
  );
};

export default About;
