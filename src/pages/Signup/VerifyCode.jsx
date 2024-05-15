import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { url } from '../../services/api/Axios';
import { useNavigate } from 'react-router-dom';
import { addUser } from '../../features/auth/authSlice';
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
    <div className="bg-gray-50 relative flex min-h-screen flex-col justify-center overflow-hidden bg-[#F2F3F5] px-4 py-12">
      {showDialogBox ? (
        <div className="relative mx-auto w-full max-w-lg rounded-2xl bg-white px-5 pb-9 pt-10 shadow-xl tablet:px-6">
          <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
            <div className="flex flex-col items-center justify-center space-y-2 text-center">
              <div className="text-3xl font-semibold">
                <p>Verify your account</p>
              </div>
              <div className="flex flex-row text-sm font-medium text-gray-400">
                <p>Please check the verification code</p>
              </div>
            </div>
            <div>
              <div className="flex flex-col space-y-16">
                <div className="mx-auto flex w-full max-w-[25rem] flex-row items-center justify-between">
                  <div className="h-11 w-11 tablet:h-16 tablet:w-16 ">
                    <input
                      className="focus:bg-gray-50 ring-blue-700 flex h-full w-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-1 text-center text-lg outline-none focus:ring-1 tablet:px-5"
                      type="text"
                      name=""
                      id="istBox"
                      value={verificationCode[0]}
                    />
                  </div>
                  <div className="h-11 w-11 tablet:h-16 tablet:w-16 ">
                    <input
                      className="tablet:px-5outline-none focus:bg-gray-50 ring-blue-700 flex h-full w-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-1 text-center text-lg focus:ring-1"
                      type="text"
                      name=""
                      id="sndBox"
                      value={verificationCode[1]}
                    />
                  </div>
                  <div className="h-11 w-11 tablet:h-16 tablet:w-16 ">
                    <input
                      className="focus:bg-gray-50 ring-blue-700 flex h-full w-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-1 text-center text-lg outline-none focus:ring-1 tablet:px-5"
                      type="text"
                      name=""
                      id="trdBox"
                      value={verificationCode[2]}
                    />
                  </div>
                  <div className="h-11 w-11 tablet:h-16 tablet:w-16 ">
                    <input
                      className="focus:bg-gray-50 ring-blue-700 flex h-full w-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-1 text-center text-lg outline-none focus:ring-1 tablet:px-5"
                      type="text"
                      name=""
                      id="frtBox"
                      value={verificationCode[3]}
                    />
                  </div>
                  <div className="h-11 w-11 tablet:h-16 tablet:w-16 ">
                    <input
                      className="focus:bg-gray-50 ring-blue-700 flex h-full w-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-1 text-center text-lg outline-none focus:ring-1 tablet:px-5"
                      type="text"
                      name=""
                      id="fifBox"
                      value={verificationCode[4]}
                    />
                  </div>
                  <div className="h-11 w-11 tablet:h-16 tablet:w-16 ">
                    <input
                      className="focus:bg-gray-50 ring-blue-700 flex h-full w-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-1 text-center text-lg outline-none focus:ring-1 tablet:px-5"
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
                      className="flex w-full flex-row items-center justify-center rounded-xl border border-none bg-[#389CE3] py-5 text-center text-sm text-white shadow-sm outline-none"
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
        <div className="relative mx-auto w-full max-w-lg rounded-2xl bg-white px-5 pb-9 pt-10 shadow-xl tablet:px-6">
          <p className="text-[9px] font-medium text-black tablet:text-[20px]">{msg}</p>
          <div className="mt-[25px] flex w-full justify-end">
            <UiButton
              className="mt-[25px] flex w-full justify-end"
              onClick={() => {
                navigate('/signin');
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
