import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();
  const persistedUserInfo = useSelector((state) => state.auth.user);

  return (
    <div className="bg-white tablet:rounded-t-[0.86513rem]">
      <h1 className="py-3 text-center text-[0.875rem] font-bold leading-[0.875rem] text-[#707175] tablet:pb-[10px] tablet:pt-5 tablet:text-[1.25rem] tablet:leading-[1.25rem]">
        Let your data work for you
      </h1>
      <div className="-mt-[2px] space-y-[0.63rem]  px-8 text-[#7C7C7C] tablet:mt-0 tablet:space-y-2 tablet:px-16">
        {/* <p className="text-center text-[0.6875rem] font-normal leading-[0.6875rem] tablet:text-[1.125rem] tablet:leading-[1.125rem]">
          Unlock the potential of your personal data.
        </p> */}
        <p className="text-[0.6875rem] font-normal leading-[145.455%] tablet:text-[1.125rem] tablet:leading-normal">
          We generate data all the time. Most isn’t worth much on its own. But combine the right pieces at the right
          time, and it can be very valuable. Imagine brands paying you to show you an ad!
        </p>
      </div>
      <div className="mt-4 bg-[#238AD4] px-8 py-[1.3rem] text-white tablet:px-16 tablet:py-6">
        <p className="text-[0.6875rem] font-normal leading-[145.455%] tablet:text-start tablet:text-[1.125rem] tablet:leading-[179.006%]">
          Foundation is a revolutionary data exchange platform that introduces a marketplace where users can monetize
          their personal data, achievements and insights in a secure and anonymous environment.
        </p>
      </div>
      <div className="bg-[#F5F6F8] px-8 py-3 text-[#707175] tablet:px-16 tablet:py-5">
        <h1 className="text-center text-[0.875rem] font-bold leading-[0.875rem] tablet:text-[1.25rem] tablet:leading-[1.25rem]">
          How to get started
        </h1>
        <div className="mt-3 space-y-[15px] tablet:mt-3 tablet:space-y-4">
          <div className="flex items-start gap-[0.8rem] tablet:gap-[1.15rem]">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/about/account.svg`}
              alt="account"
              className="size-5 tablet:size-[1.875rem]"
            />
            <div className="space-y-[0.6rem] tablet:space-y-1">
              <h5 className="text-[0.75rem] font-bold leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-normal">
                Create an account
              </h5>
              <p className="text-[0.75rem] font-normal leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[148%]">
                Build your profile, and start earning FDX
              </p>
            </div>
          </div>
          <div className="flex items-start gap-[0.8rem] tablet:gap-[1.15rem]">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/about/conversation.svg`}
              alt="conversation"
              className="size-5 tablet:h-[1.875rem] tablet:w-[2.13rem]"
            />
            <div className="space-y-[0.6rem] tablet:space-y-1">
              <h5 className="text-[0.75rem] font-bold leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[148%]">
                Start participating
              </h5>
              <p className="text-[0.75rem] font-normal leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[148%]">
                Engage with posts, create your own and more. The more you participate, the stronger your profile of data
                assets. The more you contribute, the more likely you are to start earning from brands who want to market
                to you. Your participation enhances the overall value of the network.
              </p>
              {/* <p className="text-[0.75rem] font-normal leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[148%]">
                Every post is anonymous, so the focus can stay on the conversation, not personal attacks.
              </p> */}
            </div>
          </div>
          <div className="flex items-start gap-[0.8rem] tablet:gap-[1.15rem]">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/about/asset.svg`}
              alt="account"
              className="size-5 tablet:size-[1.875rem]"
            />
            <div className="space-y-[0.6rem] tablet:space-y-1">
              <h5 className="text-[0.75rem] font-bold leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[148%]">
                Strengthen your profile (change to badge icon)
              </h5>
              <p className="text-[0.75rem] font-normal leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[148%]">
                Add badges to increase your verification score and add to the quality of information shared.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-[0.69rem] px-8 py-5 text-[#707175] tablet:gap-5 tablet:px-16 tablet:py-[1.8rem]">
        <img
          src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/about/lock.svg`}
          alt="account"
          className="h-10 w-7 tablet:h-[2.18rem] tablet:w-[1.53rem]"
        />
        <h5 className="text-center text-[0.75rem] font-bold leading-[0.875rem] tablet:text-[1.375rem] tablet:leading-[161%]">
          Safe & secure
        </h5>
        <p className="text-center text-[0.75rem] font-normal leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[161%]">
          Foundation does not own and cannot share any of the personal data you populate. The only time your data is
          shared is when you decide it should be, with the benefit of you monetizing from it.
        </p>
      </div>
      {persistedUserInfo.role !== 'user' && (
        <div className="mt-5 flex flex-col items-center gap-[15px] bg-[#156DB4] px-12 py-[1.3rem] text-white tablet:mt-0 tablet:gap-[1.56rem] tablet:py-[1.92rem]">
          <h1 className="text-center text-[0.875rem] font-normal leading-[161.2%] tablet:text-[1.56rem] tablet:font-bold">
            Join Foundation BETA
          </h1>
          <button
            className="w-48 rounded-[0.31rem] bg-white py-[0.6rem] text-center text-[0.75rem] font-semibold text-[#156DB4] tablet:w-[24.3rem] tablet:rounded-[0.75rem] tablet:py-3 tablet:text-[1.25rem]"
            onClick={() => navigate('/guest-signup')}
          >
            Sign up
          </button>
          <p className="text-center text-[0.75rem] font-normal leading-[161.2%] tablet:text-[1.125rem]">
            Already have an account?{' '}
            <span className="cursor-pointer" onClick={() => navigate('/signin')}>
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
