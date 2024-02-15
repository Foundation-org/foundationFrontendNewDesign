import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { url } from '../../services/api/Axios';
import { useNavigate } from 'react-router-dom';
// import { useMutation } from '@tanstack/react-query';
// import { userInfo, userInfoById } from '../../services/api/userAuth';
import { addUser } from '../../features/auth/authSlice';
// import PopUp from '../../components/ui/PopUp';
import { Button as UiButton } from '../../components/ui/Button';

const VerifyCode = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [urlQuery, seturlQuery] = useState('');
  const [showDialogBox, setShowDialogBox] = useState(false);
  const [verificationCode, setVerificationCode] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    let urlQuery = window.location.search.slice(1);
    seturlQuery(urlQuery);

    fetch(`${url}/user/authenticateJWT`, {
      method: 'POST',
      headers: {
        Authorization: `${urlQuery}`,
        'Content-Type': 'application/json',
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (data.message === 'Continue') {
          setShowDialogBox(true);
          if (urlQuery.length > 120) {
            let verificationToken = urlQuery.substr(urlQuery.length - 6);
            setVerificationCode(Array.from(verificationToken)); // Create an array from the token
          } else {
            toast.error('Please Open the verification Page from the email');
          }

          // Attach the event listener to the whole document
          document.addEventListener('keypress', handleKeyPress);

          return () => {
            // Remove the event listener when the component unmounts
            document.removeEventListener('keypress', handleKeyPress);
          };
        }
        if (data.message === 'jwt expired') {
          setMsg('It seems that your verification code has expired. Kindly log in to get a new verification code.');
        }
        if (data.message === 'Already Verified') {
          setMsg('You are already Verified.Please Proceed to Login');
        }
      })
      .catch((error) => {
        console.error('Error:', error.message);
      });
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

  // const { mutateAsync: getUserInfo } = useMutation({
  //   mutationFn: userInfo,
  //   onSuccess: (res) => {
  //     console.log('User info fetched:', res.data);
  //     dispatch(addUser(res.data));
  //   },
  //   onError: (error) => {
  //     console.error('Error fetching user info:', error);
  //     localStorage.setItem('loggedIn', 'false');
  //   },
  // });

  // const { mutateAsync: getUserInfo } = useMutation({
  //   mutationFn: userInfo,
  // });

  // const handleUserInfo = async () => {
  //   try {
  //     const resp = await getUserInfo();

  //     if (resp?.status === 200) {
  //       // Cookie Calling
  //       if (resp.data) {
  //         dispatch(addUser(resp?.data));
  //         // Set into local storage
  //         if (!localStorage.getItem('uuid')) {
  //           localStorage.setItem('uuid', resp.data.uuid);
  //         }
  //       }

  //       // LocalStorage Calling
  //       if (!resp.data) {
  //         const res = await userInfoById(localStorage.getItem('uuid'));
  //         dispatch(addUser(res?.data));
  //         // if (res?.data?.requiredAction) {
  //         //   setModalVisible(true);
  //         // }
  //       }

  //       // if (resp?.data?.requiredAction) {
  //       //   setModalVisible(true);
  //       // }
  //     }

  //     // setResponse(resp?.data);
  //   } catch (e) {
  //     console.log({ e });
  //     // toast.error(e.response.data.message.split(':')[1]);
  //   }
  // };

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

        // await handleUserInfo();

        const data = await response.json();
        dispatch(addUser(data));
        localStorage.setItem('uuid', data.uuid);
        navigate('/dashboard');
      }
    } catch (error) {
      console.log('Error during API request:', error.message);
      throw error;
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-12 bg-[#F3F3F3] px-4">
      {showDialogBox ? (
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
                      value={verificationCode[0]}
                    />
                  </div>
                  <div className="w-11 h-11 tablet:w-16 tablet:h-16 ">
                    <input
                      className="w-full h-full flex flex-col items-center justify-center text-center px-1 tablet:px-5outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                      type="text"
                      name=""
                      id="sndBox"
                      value={verificationCode[1]}
                    />
                  </div>
                  <div className="w-11 h-11 tablet:w-16 tablet:h-16 ">
                    <input
                      className="w-full h-full flex flex-col items-center justify-center text-center px-1 tablet:px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                      type="text"
                      name=""
                      id="trdBox"
                      value={verificationCode[2]}
                    />
                  </div>
                  <div className="w-11 h-11 tablet:w-16 tablet:h-16 ">
                    <input
                      className="w-full h-full flex flex-col items-center justify-center text-center px-1 tablet:px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                      type="text"
                      name=""
                      id="frtBox"
                      value={verificationCode[3]}
                    />
                  </div>
                  <div className="w-11 h-11 tablet:w-16 tablet:h-16 ">
                    <input
                      className="w-full h-full flex flex-col items-center justify-center text-center px-1 tablet:px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                      type="text"
                      name=""
                      id="fifBox"
                      value={verificationCode[4]}
                    />
                  </div>
                  <div className="w-11 h-11 tablet:w-16 tablet:h-16 ">
                    <input
                      className="w-full h-full flex flex-col items-center justify-center text-center px-1 tablet:px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                      type="text"
                      name=""
                      id="sixBox"
                      value={verificationCode[5]}
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
      ) : (
        <div className="relative bg-white px-5 tablet:px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
          <p className="text-[9px] tablet:text-[20px] text-black font-medium">{msg}</p>
          <div className="w-full flex justify-end mt-[25px]">
            <UiButton
              className="w-full flex justify-end mt-[25px]"
              onClick={() => {
                navigate('/');
              }}
              variant={'submit'}
            >
              Login
            </UiButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyCode;
