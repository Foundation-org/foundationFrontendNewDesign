import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { url } from '../../services/api/Axios';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { userInfo } from '../../services/api/userAuth';
import { addUser } from '../../features/auth/authSlice';

const VerifyCode = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [urlQuery, seturlQuery] = useState('');

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

  // const { mutateAsync: handleVerify } = useMutation({
  //   mutationFn: verifyCode,
  //   onSuccess: (resp) => {
  //     console.log({ resp });
  //     toast.success('E-Mail Account Verified');

  //     if (resp.status === 200) {
  //       handleReferralOpen();
  //     }

  //     //   setTimeout(() => {
  //     //     navigate('/AccountVerification');
  //     //   }, 2000);
  //   },
  //   onError: (err) => {
  //     if (err.response.data.message === 'Invalid Verification Code') {
  //       toast.error('Wrong Verification code, open page from Gmail');
  //     } else if (err.response.data.message === 'Missing Token') {
  //       toast.error('Missing Token, open page from Gmail');
  //     } else if (err.response.data.message.message === 'invalid token') {
  //       toast.error('invalid token, open page from Gmail, or token is expired');
  //     } else {
  //       toast.error('Server Error');
  //     }
  //   },
  // });

  const { mutateAsync: getUserInfo } = useMutation({
    mutationFn: userInfo,
    onSuccess: (res) => {
      console.log('User info fetched:', res.data);
      dispatch(addUser(res.data));
    },
    onError: (error) => {
      console.error('Error fetching user info:', error);
      localStorage.setItem('loggedIn', 'false');
    },
  });

  const handleVerify = async (urlQuery) => {
    const apiUrl = `${url}/user/verify?${urlQuery}`;
    const verificationCode = urlQuery.substr(urlQuery.length - 6);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${urlQuery}`,
        },
        body: JSON.stringify({ verificationCode }),
      });

      if (response.status === 200) {
        toast.success('Email verified successfully.');
        await getUserInfo();

        setTimeout(() => {
          // navigate('/dashboard');
          window.location.href = '/dashboard';
        }, 2000);
      }
    } catch (error) {
      console.log('Error during API request:', error.message);
      throw error;
    }
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
    </div>
  );
};

export default VerifyCode;
