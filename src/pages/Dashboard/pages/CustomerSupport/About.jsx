import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();
  const persistedUserInfo = useSelector((state) => state.auth.user);

  return (
    <div className="bg-white">
      <div className="space-y-[0.63rem] px-8 pt-3 text-[#7C7C7C] tablet:space-y-5 tablet:px-16 tablet:pt-[1.56rem]">
        <h1 className="text-[0.875rem] font-bold leading-[0.875rem] tablet:text-[1.25rem] tablet:leading-[1.25rem]">
          You have data. You can sell it.
        </h1>
        <p className="text-[0.6875rem] font-normal leading-[0.6875rem] tablet:text-[1.125rem] tablet:leading-[1.125rem]">
          Almost every aspect of your life is an asset.
        </p>
        <p className="text-[0.6875rem] font-normal leading-[145.455%] tablet:text-[1.125rem] tablet:leading-normal">
          Your education, eye color, marital status, shopping habits, and even your opinions. All of those attributes
          create personal data that is desired and used by brands and corporations every day, and the only benefit to
          you is more and more targeted ads.
        </p>
      </div>
      <div className="mt-4 bg-[#238AD4] px-8 py-[1.3rem] text-white tablet:px-16 tablet:py-6">
        <p className="text-[0.6875rem] font-normal leading-[145.455%] tablet:text-start tablet:text-[1.125rem] tablet:leading-[179.006%]">
          Foundation is a digital platform that enables you to securely add and monetize your personal data - putting
          the money you earn from sharing your data with companies in your wallet, not someone elses.
        </p>
      </div>
      <div className="bg-[#F5F6F8] px-8 py-5 text-[#707175] tablet:px-16">
        <h1 className="text-center text-[0.875rem] font-bold leading-[0.875rem] tablet:text-[1.375rem] tablet:leading-normal">
          How Foundation works
        </h1>
        <div className="tablet:sapce-y-[2.2rem] mt-5 space-y-6 tablet:mt-[1.6rem]">
          <div className="flex items-start gap-[0.8rem] tablet:gap-[1.15rem]">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/about/account.svg`}
              alt="account"
              className="size-5 tablet:size-[1.875rem]"
            />
            <div className="space-y-[0.6rem] tablet:space-y-4">
              <h5 className="text-[0.75rem] font-bold leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[1.125rem]">
                Create an account
              </h5>
              <p className="text-[0.75rem] font-normal leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[1.125rem]">
                Build your profile, and start earning tokens.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-[0.8rem] tablet:gap-[1.15rem]">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/about/conversation.svg`}
              alt="conversation"
              className="size-5 tablet:h-[1.875rem] tablet:w-[2.13rem]"
            />
            <div className="space-y-[0.6rem] tablet:space-y-4">
              <h5 className="text-[0.75rem] font-bold leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[1.125rem]">
                Use your expertise to add to the conversation
              </h5>
              <p className="text-[0.75rem] font-normal leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[161.2%]">
                Create your own posts or engage with others within the crowd-sourced feed to earn more tokens.
              </p>
              <p className="text-[0.75rem] font-normal leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[161.2%]">
                Every post is anonymous, so the focus can stay on the conversation, not personal attacks.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-[0.8rem] tablet:gap-[1.15rem]">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/about/asset.svg`}
              alt="account"
              className="size-5 tablet:size-[1.875rem]"
            />
            <div className="space-y-[0.6rem] tablet:space-y-4">
              <h5 className="text-[0.75rem] font-bold leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[161.2%]">
                The more you participate, the stronger your profile of data assets,{' '}
                <span className="font-normal">
                  and the more likely you are to start earning from brands and research firms who want to purchase your
                  data.
                </span>
              </h5>
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
          Foundation does not own and will not share any of the personal data you populate. The only time your data is
          shared is when YOU decide it should be, with the benefit of monetizing from it.
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
      <div className="flex flex-col gap-[0.69rem] p-8 text-[#707175] tablet:gap-[1.56rem] tablet:px-16 tablet:pb-[3.12rem] tablet:pt-[1.88rem]">
        <h5 className="text-[0.75rem] font-normal italic leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[161%]">
          “Owning our personal data liberates us from being slaves to the system, giving us the freedom to live life on
          our terms.“
        </h5>
        <h5 className="text-[0.75rem] font-semibold leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[161%]">
          Justin Leffew <br />
          CEO Foundation Internet Organization
        </h5>
      </div>
    </div>
  );
};

export default About;
