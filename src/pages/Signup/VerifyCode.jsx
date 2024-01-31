import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { verifyCode } from '../../services/api/authentication';
import { useMutation } from '@tanstack/react-query';
import BasicModal from '../../components/BasicModal';
import ReferralCode from '../../components/ReferralCode';

const staticCode = 'jan2024';

const VerifyCode = () => {
  const navigate = useNavigate();
  const [urlQuery, seturlQuery] = useState('');

  const [isReferral, setIsReferral] = useState(false);
  const [referralCode, setReferralCode] = useState(null);

  const handleReferralOpen = () => setIsReferral(true);
  const handleReferralClose = () => setIsReferral(false);

  useEffect(() => {
    let urlQuery = window.location.search.slice(1);
    seturlQuery(urlQuery);

    if (urlQuery.length > 120) {
      let verificationToken = urlQuery.substr(urlQuery.length - 6);
      document.getElementById('istBox').value = verificationToken.slice(0, 1);
      document.getElementById('sndBox').value = verificationToken.slice(1, 2);
      document.getElementById('trdBox').value = verificationToken.slice(2, 3);
      document.getElementById('frtBox').value = verificationToken.slice(3, 4);
      document.getElementById('fifBox').value = verificationToken.slice(4, 5);
      document.getElementById('sixBox').value = verificationToken.slice(5, 6);
    } else {
      toast.error('Please Open the verification Page from the email');
    }

    // Attach the event listener to the whole document
    document.addEventListener('keypress', handleKeyPress);

    return () => {
      // Remove the event listener when the component unmounts
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleVerify();
    }
  };

  const { mutateAsync: handleVerify } = useMutation({
    mutationFn: verifyCode,
    onSuccess: (resp) => {
      console.log(resp);
      toast.success('E-Mail Account Verified');

      if (resp.status === 200) {
        handleReferralOpen();
      }

      //   setTimeout(() => {
      //     navigate('/AccountVerification');
      //   }, 2000);
    },
    onError: (err) => {
      if (err.response.data.message === 'Invalid Verification Code') {
        toast.error('Wrong Verification code, open page from Gmail');
      } else if (err.response.data.message === 'Missing Token') {
        toast.error('Missing Token, open page from Gmail');
      } else if (err.response.data.message.message === 'invalid token') {
        toast.error('invalid token, open page from Gmail, or token is expired');
      } else {
        toast.error('Server Error');
      }
    },
  });

  const customModalStyle = {
    backgroundColor: '#FCFCFD',
    boxShadow: 'none',
    border: '0px',
    outline: 'none',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-12 bg-[#F3F3F3] px-4">
      <div className="relative bg-white px-5 tablet:px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="font-semibold text-3xl">
              <p>Verify your account</p>
            </div>
            <div className="flex flex-row text-sm font-medium text-gray-400">
              <p>Please check the verification code</p>
            </div>
          </div>
          <div>
            <div className="flex flex-col space-y-16">
              <div className="flex flex-row items-center justify-between mx-auto w-full max-w-[25rem]">
                <div className="w-11 h-11 tablet:w-16 tablet:h-16 ">
                  <input
                    className="w-full h-full flex flex-col items-center justify-center text-center px-1 tablet:px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                    type="text"
                    name=""
                    id="istBox"
                  />
                </div>
                <div className="w-11 h-11 tablet:w-16 tablet:h-16 ">
                  <input
                    className="w-full h-full flex flex-col items-center justify-center text-center px-1 tablet:px-5outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                    type="text"
                    name=""
                    id="sndBox"
                  />
                </div>
                <div className="w-11 h-11 tablet:w-16 tablet:h-16 ">
                  <input
                    className="w-full h-full flex flex-col items-center justify-center text-center px-1 tablet:px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                    type="text"
                    name=""
                    id="trdBox"
                  />
                </div>
                <div className="w-11 h-11 tablet:w-16 tablet:h-16 ">
                  <input
                    className="w-full h-full flex flex-col items-center justify-center text-center px-1 tablet:px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                    type="text"
                    name=""
                    id="frtBox"
                  />
                </div>
                <div className="w-11 h-11 tablet:w-16 tablet:h-16 ">
                  <input
                    className="w-full h-full flex flex-col items-center justify-center text-center px-1 tablet:px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                    type="text"
                    name=""
                    id="fifBox"
                  />
                </div>
                <div className="w-11 h-11 tablet:w-16 tablet:h-16 ">
                  <input
                    className="w-full h-full flex flex-col items-center justify-center text-center px-1 tablet:px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                    type="text"
                    name=""
                    id="sixBox"
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-5">
                <div>
                  <button
                    className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-[#389CE3] border-none text-white text-sm shadow-sm"
                    onClick={() => {
                      handleVerify(urlQuery);
                    }}
                  >
                    Verify Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BasicModal
        open={isReferral}
        handleClose={handleReferralClose}
        customStyle={customModalStyle}
        customClasses="rounded-[10px] tablet:rounded-[26px]"
      >
        <ReferralCode handleClose={handleReferralClose} referralCode={referralCode} setReferralCode={setReferralCode} />
      </BasicModal>
    </div>
  );
};

export default VerifyCode;
