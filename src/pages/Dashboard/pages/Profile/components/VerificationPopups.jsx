import { LoginSocialGoogle } from 'reactjs-social-login';
import PopUp from '../../../../../components/ui/PopUp';
import { Button } from '../../../../../components/ui/Button';
import api from '../../../../../services/api/Axios';
import { toast } from 'sonner';
import { useState } from 'react';

const REDIRECT_URI = window.location.href;
const VerificationPopups = ({ isPopup, setIsPopup, title, logo, placeholder, selectedBadge, handleUserInfo }) => {
    const [email, setEmail] = useState('')
  const handleClose = () => {
    setIsPopup(false);
  };

    // Handle Add Contact Badge
    const handleAddContactBadge = async ({provider, data, legacy}) => {
      try {
        let addBadge;
        if(legacy) {
          if(email === "") return toast.warning("Please enter your email address")
          addBadge = await api.post(`/addBadge/contact`, {
            legacy,
            email,
            uuid: localStorage.getItem('uuid'),
            type: selectedBadge,
          });
        } else {
          data['provider'] = provider;
          data['type'] = selectedBadge;
          data['uuid'] = localStorage.getItem('uuid');
          addBadge = await api.post(`/addBadge/contact`, {
            ...data,
          });
        }
        if (addBadge.status === 200) {
          toast.success('Badge Added Successfully!');
          handleClose()
          handleUserInfo();
          setEmail("")
        }
        if (addBadge.status === 201) {
          toast.success('Email Send Successfully!');
          handleClose()
          handleUserInfo();
          setEmail("")
        }
      } catch (error) {
        toast.error(error.response.data.message.split(':')[1]);
        handleClose()
        setEmail("");
      }
    };

  return (
    <div>
      <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo}>
        <div className="pt-2 pb-[15px] tablet:pt-[30px] tablet:pb-5">
          <LoginSocialGoogle
            // isOnlyGetToken
            client_id={import.meta.env.VITE_GG_APP_ID}
            redirect_uri={REDIRECT_URI}
            scope="openid profile email"
            iscoveryDocs="claims_supported"
            // access_type="offline"
            onResolve={({ provider, data }) => {
              //   setProvider(provider);
              //   setProfile(data);
              //   data['provider'] = provider;
              //   isLogin ? handleSignInSocial(data) : handleSignUpSocialAfterReferral(data);
              handleAddContactBadge({provider, data})
            }}
            onReject={(err) => {
              console.log(err);
            }}
            className="w-full flex justify-center"
          >
            <Button
              variant="social-btn"
              // onClick={() => window.open(`${import.meta.env.VITE_API_URL}/auth/google`, '_self')}
            >
              <img src="/assets/svgs/google.svg" className="mr-2 h-[22px] w-[22px] md:h-12 md:w-[32px] " /> Continue
              with Google
            </Button>
          </LoginSocialGoogle>
          <div className=" px-5 tablet:px-[60px] laptop:px-[80px]">
            <h1 className="text-[#707175] text-[10px] tablet:text-[25px] font-medium leading-[12.1px] tablet:leading-[30px] text-center my-2 tablet:my-[15px]">
              -OR-
            </h1>
            <p
              htmlFor="email"
              className="text-[#7C7C7C] text-[9.28px] tablet:text-[20px] leading-[11.23px] tablet:leading-[24.2px] font-medium"
            >
              {title}
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              className="w-full text-[9.28px] tablet:text-[18px] leading-[11.23px] tablet:leading-[21px] font-medium text-[#B6B4B4] border tablet:border-[3px] border-[#DEE6F7] bg-[#FBFBFB] rounded-[8.62px] tablet:rounded-[15px] py-2 tablet:py-[18px] px-[16px] focus:outline-none mt-1 tablet:mt-[15px] mb-[10px] tablet:mb-5"
            />
            <div className="flex justify-end" onClick={() => handleAddContactBadge({legacy: true})}>
              <Button variant="submit">Verify Email</Button>
            </div>
          </div>
        </div>
      </PopUp>
    </div>
  );
};

export default VerificationPopups;
