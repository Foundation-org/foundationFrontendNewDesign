import { toast } from 'sonner';
import { useState } from 'react';
import { Button } from '../ui/Button';

import PopUp from '../ui/PopUp';
import api from '../../services/api/Axios';

const FirstNamePopup = ({ isPopup, setIsPopup, title, logo, placeholder }) => {
  const [email, setEmail] = useState('');
  const handleClose = () => {
    setIsPopup(false);
  };

  // Handle Add Contact Badge
  //   const handleAddContactBadge = async ({ provider, data, legacy }) => {
  //     try {
  //       let addBadge;
  //       if (legacy) {
  //         if (email === '') return toast.warning('Please enter your email address');
  //         addBadge = await api.post(`/addBadge/contact`, {
  //           legacy,
  //           email,
  //           uuid: localStorage.getItem('uuid'),
  //           type: selectedBadge,
  //         });
  //       } else {
  //         data['provider'] = provider;
  //         data['type'] = selectedBadge;
  //         data['uuid'] = localStorage.getItem('uuid');
  //         addBadge = await api.post(`/addBadge/contact`, {
  //           ...data,
  //         });
  //       }
  //       if (addBadge.status === 200) {
  //         toast.success('Badge Added Successfully!');
  //         handleClose();
  //         handleUserInfo();
  //         setEmail('');
  //       }
  //       if (addBadge.status === 201) {
  //         toast.success('Email Send Successfully!');
  //         handleClose();
  //         handleUserInfo();
  //         setEmail('');
  //       }
  //     } catch (error) {
  //       toast.error(error.response.data.message.split(':')[1]);
  //       handleClose();
  //       setEmail('');
  //     }
  //   };

  return (
    <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo}>
      <div className="pt-2 pb-[15px] tablet:py-[25px] px-5 tablet:px-[60px] laptop:px-[80px]">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className="w-full text-[9.28px] tablet:text-[18px] leading-[11.23px] tablet:leading-[21px] font-medium text-[#B6B4B4] border tablet:border-[3px] border-[#DEE6F7] bg-[#FBFBFB] rounded-[8.62px] tablet:rounded-[15px] py-2 tablet:py-[18px] px-[16px] focus:outline-none mb-[10px] tablet:mb-5"
        />
        <div className="flex justify-end" onClick={() => handleAddContactBadge({ legacy: true })}>
          <Button variant="submit">Add</Button>
        </div>
      </div>
    </PopUp>
  );
};

export default FirstNamePopup;
