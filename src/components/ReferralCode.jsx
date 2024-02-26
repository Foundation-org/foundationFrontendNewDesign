import { toast } from 'sonner';
import { Button } from './ui/Button';
import { signUp } from '../services/api/userAuth';
import { useMutation } from '@tanstack/react-query';
import { referral } from '../services/api/authentication';
import api from '../services/api/Axios';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import { addUser } from '../features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { useState } from 'react';

const ReferralCode = ({
  handleClose,
  isLoading,
  setIsLoading,
  password,
  reTypePassword,
  email,
  setEmail,
  setPassword,
  referralCode,
  setReferralCode,
  handlePopupOpen,
  setErrorMessage,
  socialAccount,
  setIsLoadingSocial,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [refLoading, setRefLoading] = useState(false);
  const handleInputChange = (e) => {
    setReferralCode(e.target.value);
  };

  const { mutateAsync: userSignup } = useMutation({
    mutationFn: signUp,
  });

  const handleSignup = async () => {
    setIsLoading(true);

    try {
      if (password === reTypePassword) {
        const resp = await userSignup({ email, password });

        if (resp.status === 200) {
          toast.success('A verification email has been sent to your email address. Please check your inbox.');

          setEmail('');
          setPassword('');
        }
      } else {
        toast.warning('Password does not match');
      }
    } catch (e) {
      setErrorMessage(e.response.data.message.split(':')[1]);
      // toast.error(e.response.data.message.split(':')[1]);
      handlePopupOpen();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = async () => {
    try {
      const res = await api.post(`/user/signUpUser/social`, socialAccount.data);
      if (res.status === 200) {
        localStorage.setItem('uuid', res.data.uuid);
        dispatch(addUser(res.data));
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response.data.message.split(':')[1]);
    } finally {
      setRefLoading(false);
    }
  };

  const { mutateAsync: handleReferral } = useMutation({
    mutationFn: referral,
    onSuccess: (resp) => {
      setIsLoadingSocial(false);
      setIsLoading(false);
      toast.success('Referral code verified');
      setRefLoading(false);
      handleClose();
      socialAccount.isSocial ? handleSocialSignup() : handleSignup();
    },
    onError: (err) => {
      console.log(err);
      setRefLoading(false);
      toast.error('Referral code is not valid.');
    },
  });

  return (
    <div className="relative w-[90vw] laptop:w-[52.6rem]">
      <div className="relative rounded-t-[9.251px] social-blue-gradiant flex gap-[10px] tablet:gap-4 items-center py-1 tablet:py-[8px] px-[15px] tablet:px-[30px] tablet:rounded-t-[26px]">
        <div className="bg-white px-[6px] py-[8px] tablet:p-[15px] rounded-full w-fit">
          <svg
            className="w-[13px] h-[9px] tablet:w-[19px] tablet:h-[19px]"
            viewBox="0 0 19 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.00355 18.6818L8.30717 11.9382L2.61825 15.5977L0.87642 12.5614L6.9169 9.47727L0.87642 6.39311L2.61825 3.35689L8.30717 7.01633L8.00355 0.272726H11.4712L11.1676 7.01633L16.8565 3.35689L18.5984 6.39311L12.5579 9.47727L18.5984 12.5614L16.8565 15.5977L11.1676 11.9382L11.4712 18.6818H8.00355Z"
              fill="#161616"
            />
          </svg>
        </div>
        <p className="text-white text-[12px] tablet:text-[20px] font-bold tablet:font-medium">Referral Code</p>
        <div
          className="absolute right-[12px] top-1/2 cursor-pointer tablet:right-[26px] -translate-y-1/2"
          onClick={handleClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 23 23"
            fill="none"
            className="w-[10px] h-[10px] tablet:w-[23px] tablet:h-[23px]"
          >
            <path
              d="M0.742781 4.71145C-0.210937 3.77788 -0.251625 2.22222 0.651895 1.23678C1.55542 0.251347 3.06101 0.209303 4.01472 1.14287L10.9221 7.9044L17.466 0.76724C18.3696 -0.218195 19.8751 -0.260239 20.8289 0.673332C21.7826 1.6069 21.8233 3.16257 20.9197 4.148L14.3759 11.2852L21.2833 18.0467C22.237 18.9803 22.2777 20.5359 21.3742 21.5213C20.4706 22.5068 18.9651 22.5488 18.0113 21.6153L11.1039 14.8537L4.56004 21.9909C3.65651 22.9763 2.15092 23.0184 1.19721 22.0848C0.243494 21.1512 0.202803 19.5956 1.10632 18.6101L7.65021 11.473L0.742781 4.71145Z"
              fill="#F3F3F3"
            />
          </svg>
        </div>
      </div>
      <div className="py-[14px] tablet:py-[25px] px-5 tablet:px-[50px]">
        <h2 className="text-[9px] tablet:text-[20px] font-normal leading-none tablet:leading-6 tracking-[0.15px] text-[#828282]">
          Enter your registration code for completing registration process.
        </h2>
        <h1 className="mt-1 tablet:mt-5 tablet:mb-7 text-[12px] tablet:text-[25px] font-medium leading-normal text-[#7C7C7C]">
          Referral Code
        </h1>
        <input
          type="text"
          placeholder="Enter referal code"
          value={referralCode}
          onChange={handleInputChange}
          className="hide_number_input_arrows hide_number_input_arrows2 autofill_text_color peer w-full rounded-[2px] border-b-[1.4px] border-[#C0C0C0] bg-transparent pr-8 text-[10px] transition-colors focus:border-b-[1.4px] focus:border-[#C0C0C0] focus:outline-none tablet:text-[22.9px] short:py-0 dark:border-white dark:bg-dark dark:focus:border-white"
        />
        <div className="mt-2 tablet:mt-[25px] flex justify-end w-full">
          <Button
            variant="submit"
            onClick={() => {
              setRefLoading(true);
              const data = { code: referralCode };
              handleReferral(data);
            }}
          >
            {refLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReferralCode;
