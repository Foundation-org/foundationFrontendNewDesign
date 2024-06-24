import { toast } from 'sonner';
import { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { LoginSocialGoogle } from 'reactjs-social-login';
import { Button } from '../../../../../components/ui/Button';
import api from '../../../../../services/api/Axios';
import PopUp from '../../../../../components/ui/PopUp';
import { useQueryClient } from '@tanstack/react-query';
import showToast from '../../../../../components/ui/Toast';
const REDIRECT_URI = window.location.href;
const VerificationPopups = ({ isPopup, setIsPopup, title, logo, placeholder, selectedBadge }) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const handleClose = () => {
    setIsPopup(false);
  };

  // Handle Add Contact Badge
  const handleAddContactBadge = async ({ provider, data, legacy }) => {
    setLoading(true);
    try {
      let addBadge;
      if (legacy) {
        if (email === '') return showToast('warning', 'emptyEmail');
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
        if (localStorage.getItem('legacyHash')) {
          data['infoc'] = localStorage.getItem('legacyHash');
        }
        addBadge = await api.post(`/addBadge/contact`, {
          ...data,
        });
      }
      if (addBadge.status === 200) {
        showToast('success', 'badgeAdded');
        queryClient.invalidateQueries(['userInfo']);
        handleClose();
        setEmail('');
      }
      if (addBadge.status === 201) {
        showToast('success', 'verifyEmail');
        queryClient.invalidateQueries(['userInfo']);
        handleClose();
        setEmail('');
      }
    } catch (error) {
      showToast('error', 'error', {}, error.response.data.message.split(':')[1]);
      handleClose();
      setEmail('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo}>
        <div className="pb-[15px] pt-2 tablet:pb-5 tablet:pt-[30px]">
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
              handleAddContactBadge({ provider, data });
            }}
            onReject={(err) => {
              console.log(err);
            }}
            className="flex w-full justify-center"
          >
            <Button
              variant="social-btn"
              // onClick={() => window.open(`${import.meta.env.VITE_API_URL}/auth/google`, '_self')}
            >
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/google.svg`}
                className="mr-2 h-[22px] w-[22px] md:h-12 md:w-[32px] "
              />{' '}
              Continue with Google
            </Button>
          </LoginSocialGoogle>
          <div className=" px-5 tablet:px-[60px] laptop:px-[80px]">
            <h1 className="my-2 text-center text-[10px] font-medium leading-[12.1px] text-[#707175] tablet:my-[15px] tablet:text-[25px] tablet:leading-[30px]">
              -OR-
            </h1>
            <p
              htmlFor="email"
              className="text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:text-[20px] tablet:leading-[24.2px]"
            >
              {title}
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              className="verification_badge_input mb-[10px] mt-1 tablet:mb-5 tablet:mt-[15px]"
            />
            <div className="flex justify-end" onClick={() => handleAddContactBadge({ legacy: true })}>
              <Button variant="submit" disabled={loading}>
                {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Verify Email'}
              </Button>
            </div>
          </div>
        </div>
      </PopUp>
    </div>
  );
};

export default VerificationPopups;
