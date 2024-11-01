import PopUp from '../../../../../../components/ui/PopUp';
import { Button } from '../../../../../../components/ui/Button';
import { FaSpinner } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import showToast from '../../../../../../components/ui/Toast';
import { useQueryClient } from '@tanstack/react-query';
import api from '../../../../../../services/api/Axios';
import { CanAdd } from './badgeUtils';
import { useState } from 'react';
import { useSDK } from '@metamask/sdk-react';
import ProgressBar from '../../../../../../components/ProgressBar';

const getSummaryText = {
  etheriumWallet:
    'Your verified Ethereum address unlocks deposits and withdrawals to and from your Foundation wallet to your wallet on the Base network.',
};

const Web3ConnectPopup = ({ isPopup, setIsPopup, title, logo, type, handleSkip, onboarding, progress }) => {
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const queryClient = useQueryClient();
  const { sdk } = useSDK();
  const [loading, setIsLoading] = useState(false);

  const handleClose = () => setIsPopup(false);

  const handleWeb3 = async (accounts) => {
    setIsLoading(true);
    try {
      const payload = {
        web3: {
          ['etherium-wallet']: accounts,
        },
        uuid: persistedUserInfo.uuid,
      };
      if (localStorage.getItem('legacyHash')) {
        payload.infoc = localStorage.getItem('legacyHash');
      }

      const addBadge = await api.post(`/addBadge/web3/add`, payload);
      if (addBadge.status === 200) {
        showToast('success', 'badgeAdded');
        queryClient.invalidateQueries(['userInfo']);
        setIsLoading(false);
        handleClose();
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const connect = async () => {
    try {
      const accounts = await sdk?.connect();
      handleWeb3(accounts[0]);
    } catch (err) {
      console.warn('failed to connect..', err);
    }
  };

  const handleConnect = () => {
    const timeRemaining = CanAdd(persistedUserInfo, type, 'etherium-wallet');
    if (timeRemaining === true || checkPseudoBadge()) {
      connect();
    } else {
      toast.warning(`You need to wait just ${timeRemaining} more days before you can unlock this badge.`);
    }
  };

  return (
    <>
      <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo}>
        <div className="flex flex-col gap-[10px] px-5 py-[15px] tablet:gap-4 tablet:px-[60px] tablet:py-[25px] laptop:px-[80px]">
          <h1 className="text-[12px] font-medium leading-[13.56px] text-[#85898C] dark:text-white-400 tablet:text-[16px] tablet:leading-normal">
            {getSummaryText['etheriumWallet']}
          </h1>
          {loading === true ? (
            <FaSpinner className="animate-spin text-[#EAEAEA]" />
          ) : (
            <Button variant="submit" onClick={handleConnect}>
              Connect
            </Button>
          )}
        </div>
        {onboarding && <ProgressBar progress={progress} handleSkip={handleSkip} />}
      </PopUp>
    </>
  );
};

export default Web3ConnectPopup;
