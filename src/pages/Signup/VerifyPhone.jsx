import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { url } from '../../services/api/Axios';
import { useNavigate } from 'react-router-dom';
import { addUser } from '../../features/auth/authSlice';
import { Button as UiButton } from '../../components/ui/Button';
import showToast from '../../components/ui/Toast';
import { setAskPassword } from '../../features/profile/userSettingSlice';
import AddCellPhonePopup from '../../components/dialogue-boxes/AddCellPhonePopup';

const VerifyPhone = () => {
  const [isPopup, setIsPopup] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/signin');
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-white  px-4 py-12">
      <AddCellPhonePopup
        isPopup={isPopup}
        setIsPopup={setIsPopup}
        title="Phone Number"
        logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/cellphone-1.png`}
        selectedBadge={'cell-phone'}
        handleClose={handleClose}
        type={'cell-phone'}
        verification={true}
      />
    </div>
  );
};

export default VerifyPhone;
