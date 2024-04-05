import { toast } from 'sonner';
import { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { LoginSocialGoogle } from 'reactjs-social-login';
import { useErrorBoundary } from 'react-error-boundary';
import { Button } from '../ui/Button';
import api from '../../services/api/Axios';
import PopUp from '../ui/PopUp';

const REDIRECT_URI = window.location.href;

const AddCellPhonePopup = ({ isPopup, setIsPopup, title, logo, selectedBadge, handleUserInfo }) => {
  const { showBoundary } = useErrorBoundary();
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
        if (email === '') return toast.warning('Please enter your email address');
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
        handleClose();
        handleUserInfo();
        setEmail('');
      }
      if (addBadge.status === 201) {
        toast.success('Please check your Email to verify');
        handleClose();
        handleUserInfo();
        setEmail('');
      }
    } catch (error) {
      showBoundary(error);
      toast.error(error.response.data.message.split(':')[1]);
      handleClose();
      setEmail('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo}>
        <div className="pb-[15px] pt-2 tablet:py-[25px]">
          <div className=" px-5 tablet:px-[60px] laptop:px-[80px]">
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
              placeholder={'Phone Number here'}
              className="mb-[10px] mt-1 w-full rounded-[8.62px] border border-[#DEE6F7] bg-[#FBFBFB] px-[16px] py-2 text-[9.28px] font-medium leading-[11.23px] text-[#B6B4B4] focus:outline-none tablet:mb-5 tablet:mt-[15px] tablet:rounded-[15px] tablet:border-[3px] tablet:py-[18px] tablet:text-[18px] tablet:leading-[21px]"
            />
            <div className="flex justify-end" onClick={() => handleAddContactBadge({ legacy: true })}>
              <Button variant="submit" disabled={loading}>
                {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Send OTP'}
              </Button>
            </div>
          </div>
        </div>
      </PopUp>
    </div>
  );
};

export default AddCellPhonePopup;
