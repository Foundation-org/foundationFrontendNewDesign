import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/Button';

export default function Signup() {
  const persistedTheme = useSelector((state) => state.utils.theme);
  const navigate=useNavigate()

  return (
    <div className="flex h-screen w-full flex-col bg-blue text-white lg:flex-row dark:bg-black-200">
      <div
        className={`${
          persistedTheme === 'dark' ? 'bg-dark' : 'bg-blue'
        } flex h-[65px] w-full items-center justify-center bg-[#202329] lg:hidden`}
      >
        <img src="/assets/svgs/logo.svg" alt="logo" className="h-[45px] w-[58px]" />
      </div>
      <div className="hidden h-screen w-fit items-center px-[9.15vw] lg:flex">
        <img src="/assets/svgs/logo.svg" alt="logo" className="h-[20vh] w-[23vw]" />
      </div>

      <div className="flex h-screen w-full flex-col items-center bg-white md:justify-center lg:rounded-bl-[65px] lg:rounded-tl-[65px] dark:bg-dark">
    <div className='flex flex-col items-center justify-center h-full px-[95px] pt-[94px] pb-[174px]'>
          <img src="/assets/welcomePage/welcome.svg" alt="" className='mb-[39px]'/>
          <h1 className='text-[40px] font-bold mb-[14px] text-black'>Welcome to Foundation !</h1>
          <p className='text-center font-Inter text-[23px] font-400 leading-[33px] text-[#707175] mb-[45px]'>
            You're about to embark on a journey where you can build and monetize an anonymous online identity that's
            entirely under your control. As you share your insights by participating and adding verification badges, you
            enhance your ability to monetize your data, all while contributing to a community that values genuine voices
            over trolls and bad actors. Our platform is designed to filter out noise, letting the world’s true insights
            shine without fear of social backlash.
          </p>
          <div className='flex flex-col gap-[15px] h-[165px] w-[600px]'>

          <Button variant='submit' onClick={()=>navigate("/")}>
            Sign In
          </Button>
          <Button variant='hollow-welcome' onClick={()=>navigate("/signup")}>
            Create Account
          </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
