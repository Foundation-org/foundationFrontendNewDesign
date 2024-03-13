import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { userInfo } from '../../../../../services/api/userAuth';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { addUser } from '../../../../../features/auth/authSlice';
import Button from '../components/Button';
import Loader from '../../../../Signup/components/Loader';
import api from '../../../../../services/api/Axios';

import { LoginSocialFacebook, LoginSocialInstagram, LoginSocialLinkedin } from 'reactjs-social-login';
import { contacts } from '../../../../../constants/varification-badges';
import VerificationPopups from '../components/VerificationPopups';
import BadgeRemovePopup from '../../../../../components/dialogue-boxes/badgeRemovePopup';
import { TwitterAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { authentication } from './firebase-config';
import Personal from './verification-badges/Personal';
import Web3 from './verification-badges/Web3';
import { InstagramLogin } from '@amraneze/react-instagram-login';

const VerificationBadges = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [searchParams] = useSearchParams();
  const [fetchUser, setFetchUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPopup, setIsPopup] = useState(false);
  const [seletedBadge, setSelectedBadge] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState();
  const [pageLoading, setPageLoading] = useState(true);

  const loginInWithInsta = async (code) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/get-insta-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set the correct Content-Type
        },
        body: JSON.stringify({
          clientId: import.meta.env.VITE_INSTAGRAM_CLIENT_ID,
          clientSecret: import.meta.env.VITE_INSTAGRAM_CLIENT_SECRET,
          redirectUri: window.location.href,
          code: code,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        handleAddBadge('instagram', data);
      } else {
        console.error('Error fetching Instagram profile:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching Instagram profile:', error.message);
    }
  };

  const loginWithTwitter = () => {
    const provider = new TwitterAuthProvider();
    console.log(authentication);
    signInWithPopup(authentication, provider)
      .then((data) => {
        setIsLoading(true);
        handleAddBadge('twitter', data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loginWithGithub = () => {
    const provider = new GithubAuthProvider();
    signInWithPopup(authentication, provider)
      .then((data) => {
        setIsLoading(true);
        handleAddBadge('github', data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleBadgesClose = () => setModalVisible(false);

  const onResolve = ({ provider, data }) => {
    // Handle successful login
    handleAddBadge(provider, data);
    console.log(`Login resolved for ${provider}`, data);
  };

  const onReject = (error) => {
    // Handle login rejection
    console.error('Login rejected', error);
  };

  const onLoginStart = useCallback(() => {
    console.log('login start');
  }, []);

  const handleUserInfo = async (id) => {
    try {
      const resp = await userInfo(id);

      if (resp.status === 200) {
        setIsLoading(false);
        dispatch(addUser(resp.data));
      }

      setFetchUser(resp.data);
    } catch (e) {
      toast.error(e.response.data.message.split(':')[1]);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    handleUserInfo();
    if (searchParams.get('social')) {
      handleSocialBadges();
    }
  }, []);

  const checkPersonal = (itemType) => fetchUser?.badges?.some((i) => i.type === itemType);
  const checkSocial = (itemType) => fetchUser?.badges?.some((i) => i.accountName === itemType);

  const handleRemoveBadge = async (accountName) => {
    const findBadge = fetchUser.badges.filter((item) => {
      if (item.accountName === accountName) {
        return item;
      }
    });
    try {
      const removeBadge = await api.post(`/removeBadge`, {
        badgeAccountId: findBadge[0].accountId,
        uuid: fetchUser.uuid,
      });
      if (removeBadge.status === 200) {
        toast.success('Badge Removed Successfully!');
        handleUserInfo();
      }
    } catch (error) {
      toast.error(e.response.data.message.split(':')[1]);
    }
  };

  const handleAddBadge = async (provider, data) => {
    try {
      let id;
      if (provider === 'linkedin') {
        id = provider;
      } else if (provider === 'instagram') {
        id = data.user_id;
      } else if (provider === 'facebook') {
        id = data.userID;
      } else if (provider === 'twitter') {
        id = data.user.uid;
      } else if (provider === 'github') {
        id = data.user.email;
      }

      const addBadge = await api.post(`/addBadge`, {
        data,
        provider,
        badgeAccountId: id,
        uuid: fetchUser.uuid,
      });
      if (addBadge.status === 200) {
        toast.success('Badge Added Successfully!');
        console.log('2', isLoading);
        handleUserInfo();
      }
    } catch (error) {
      toast.error(error.response.data.message.split(':')[1]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestBadgeAdd = () => {
    toast.warning(
      <p>
        Please{' '}
        <span className="cursor-pointer text-[#389CE3] underline" onClick={() => navigate('/guest-signup')}>
          Create an Account
        </span>{' '}
        to unlock this feature
      </p>,
    );
    return;
  };

  const handleClickContactBadgeEmail = (type) => {
    if (persistedUserInfo?.role === 'guest') {
      handleGuestBadgeAdd();
    } else {
      setIsPopup(true);
      setSelectedBadge(type);
    }
  };

  const handleRemoveBadgePopup = (item) => {
    setDeleteModalState(item);
    setModalVisible(true);
  };

  return (
    <>
      {pageLoading ? (
        <div className="flex items-center justify-center">
          <FaSpinner className="animate-spin text-[10vw] text-blue tablet:text-[4vw]" />
        </div>
      ) : (
        <div className="pb-12">
          {isPopup &&
            (seletedBadge === 'personal' ? (
              <VerificationPopups
                isPopup={isPopup}
                setIsPopup={setIsPopup}
                title="Personal Email"
                logo="/assets/profile/Personal-Email-2xa.png"
                placeholder="Personal email here"
                selectedBadge={seletedBadge}
                handleUserInfo={handleUserInfo}
              />
            ) : seletedBadge === 'work' ? (
              <VerificationPopups
                isPopup={isPopup}
                setIsPopup={setIsPopup}
                title="Work Email"
                logo="/assets/profile/Work-Email-2xa.png"
                placeholder="Work email here"
                selectedBadge={seletedBadge}
                handleUserInfo={handleUserInfo}
              />
            ) : seletedBadge === 'education' ? (
              <VerificationPopups
                isPopup={isPopup}
                setIsPopup={setIsPopup}
                title="Education Email"
                logo="/assets/profile/Education-Email-2xa.png"
                placeholder="Educational Email here"
                selectedBadge={seletedBadge}
                handleUserInfo={handleUserInfo}
              />
            ) : null)}

          {/* DELETE MODAL POPUP */}
          {modalVisible && (
            <BadgeRemovePopup
              handleClose={handleBadgesClose}
              modalVisible={modalVisible}
              title={deleteModalState.title}
              image={deleteModalState.image}
              accountName={deleteModalState.accountName}
              fetchUser={fetchUser}
              setFetchUser={setFetchUser}
            />
          )}
          {isLoading && <Loader />}
          <h1 className="ml-[32px] text-[12px] font-semibold leading-[14.52px] text-[#4A8DBD] tablet:ml-[97px] tablet:text-[25px] tablet:font-semibold tablet:leading-[30px] dark:text-[#B8B8B8]">
            My Verification Badges
          </h1>
          <div
            className={`${
              persistedTheme === 'dark' ? 'dark-shadow-inside' : 'verification-badge-boxShadow bg-white'
            } relative mx-6 mb-[140px] mt-[10px] flex flex-col gap-[7px] rounded-[13.7px] px-5 pb-[17.57px] pt-[14px] tablet:mx-[30px] tablet:mb-[10rem] tablet:mt-[35px] tablet:gap-4 tablet:rounded-[45px] tablet:px-[30px] tablet:py-[30px] laptop:mx-[60px] laptop:gap-5 laptop:px-[60px]`}
          >
            <div className="flex flex-col justify-between tablet:flex-row">
              <div className="flex flex-col gap-[7px] tablet:gap-4 laptop:gap-5">
                <h1 className="font-500 font-Inter mb-[3px] text-[9.74px] font-medium text-[#000] tablet:text-[1.7vw] dark:text-white">
                  Contact
                </h1>
                {contacts.map((item, index) => (
                  <div
                    className={`flex items-center justify-center gap-[10px] tablet:justify-start laptop:gap-5 ${item.disabled && 'opacity-[60%]'}`}
                    key={index}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-[6.389vw] w-[6.389vw] tablet:h-[3.48vw] tablet:w-[3.48vw]"
                    />
                    <div
                      className={`${
                        persistedTheme === 'dark' ? 'dark-shadow-input' : ''
                      } flex h-[7.3vw] w-[24vw] items-center justify-center rounded-[1.31vw] border border-[#DEE6F7] text-[2.11vw] font-medium leading-normal text-[#000] tablet:h-[3.48vw] tablet:w-[13.9vw] tablet:rounded-[8px] tablet:border-[3px] tablet:text-[1.38vw] laptop:rounded-[15px] dark:text-[#CACACA]`}
                    >
                      <h1>{item.title}</h1>
                    </div>
                    <Button
                      color={checkPersonal(item.type) ? 'yellow' : item.ButtonColor}
                      onClick={() =>
                        !checkPersonal(item.type) &&
                        item.ButtonColor !== 'gray' &&
                        handleClickContactBadgeEmail(item.type)
                      }
                    >
                      {checkPersonal(item.type) ? 'Added' : item.ButtonText}
                      <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                        {checkPersonal(item.type) ? '' : '(+0.96 FDX)'}
                      </span>
                    </Button>
                  </div>
                ))}
                <div className="hidden flex-col gap-[7px] tablet:flex tablet:gap-4 laptop:gap-5">
                  <h1 className="font-500 font-Inter my-[5px] text-[9.74px] font-medium text-black tablet:text-[1.7vw] dark:text-white">
                    Web 3
                  </h1>
                  <Web3 handleUserInfo={handleUserInfo} fetchUser={fetchUser} />
                </div>
              </div>

              <div className="flex flex-col gap-[7px] tablet:gap-4 laptop:gap-5">
                <h1 className="font-500 font-Inter mb-[5px] mt-3 text-[9.74px] font-medium text-[#000] tablet:text-[1.7vw] dark:text-white">
                  Social
                </h1>
                {/* ...........................Facebook......................  */}
                <div className="flex items-center justify-center gap-[10px] tablet:justify-end laptop:gap-5">
                  <img
                    src="/assets/profile/Facebook-2x.png"
                    alt="Facebook"
                    className="h-[23px] min-h-[6.389vw] w-[23px] min-w-[6.389vw] tablet:h-[3.48vw] tablet:min-h-[3.48vw] tablet:w-[3.48vw] tablet:min-w-[3.48vw]"
                  />
                  <div
                    className={`${
                      persistedTheme === 'dark' ? 'dark-shadow-input' : ''
                    } flex h-[7.3vw] w-[24vw] items-center justify-center rounded-[1.31vw] border border-[#DEE6F7] text-[2.11vw] font-medium leading-normal text-[#000] tablet:h-[3.48vw] tablet:w-[13.9vw] tablet:rounded-[8px] tablet:border-[3px] tablet:text-[1.38vw] laptop:rounded-[15px] dark:text-[#CACACA]`}
                  >
                    <h1>Facebook</h1>
                  </div>
                  {checkSocial('facebook') ? (
                    <Button
                      color={checkSocial('facebook') ? 'red' : 'blue'}
                      onClick={() => {
                        if (persistedUserInfo?.role === 'guest') {
                          handleGuestBadgeAdd();
                        } else {
                          checkSocial('facebook') &&
                            handleRemoveBadgePopup({
                              title: 'facebook',
                              image: '/assets/profile/Facebook-2x.png',
                              accountName: 'facebook',
                            });
                        }
                      }}
                    >
                      {checkSocial('facebook') ? 'Remove' : 'Add New Badge'}
                      <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                        {checkSocial('facebook') ? '' : '(+0.96 FDX)'}
                      </span>
                    </Button>
                  ) : persistedUserInfo?.role === 'guest' ? (
                    <Button color={checkSocial('github') ? 'red' : 'blue'} onClick={handleGuestBadgeAdd}>
                      {checkSocial('facebook') ? 'Remove' : 'Add New Badge'}
                      <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                        {checkSocial('facebook') ? '' : '(+0.96 FDX)'}
                      </span>
                    </Button>
                  ) : (
                    <LoginSocialFacebook
                      appId={import.meta.env.VITE_FB_APP_ID}
                      onResolve={({ provider, data }) => {
                        console.log(provider, data);
                        setIsLoading(true);
                        handleAddBadge(provider, data);
                      }}
                      redirect_uri={window.location.href}
                      onReject={(err) => {
                        toast.error('An error occured while adding badge');
                        setIsLoading(false);
                        console.log(err);
                      }}
                    >
                      <Button color={checkSocial('facebook') ? 'red' : 'blue'}>
                        {checkSocial('facebook') ? '' : 'Add New Badge'}
                        <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                          {checkSocial('facebook') ? '' : '(+0.96 FDX)'}
                        </span>
                      </Button>
                    </LoginSocialFacebook>
                  )}
                </div>

                {/* ...........................LinkedIn......................  */}
                <div className="flex items-center justify-center gap-[10px] opacity-[60%] tablet:justify-end laptop:gap-5">
                  <img
                    src="/assets/profile/LinkedIn-2x.png"
                    alt="LinkedIn"
                    className="h-[23px] min-h-[6.389vw] w-[23px] min-w-[6.389vw] tablet:h-[3.48vw] tablet:min-h-[3.48vw] tablet:w-[3.48vw] tablet:min-w-[3.48vw]"
                  />
                  <div
                    className={`${
                      persistedTheme === 'dark' ? 'dark-shadow-input' : ''
                    } flex h-[7.3vw] w-[24vw] items-center justify-center rounded-[1.31vw] border border-[#DEE6F7] text-[2.11vw] font-medium leading-normal text-[#000] tablet:h-[3.48vw] tablet:w-[13.9vw] tablet:rounded-[8px] tablet:border-[3px] tablet:text-[1.38vw] laptop:rounded-[15px] dark:text-[#CACACA]`}
                  >
                    <h1>Linked In</h1>
                  </div>
                  {checkSocial('linkedin') ? (
                    <>
                      <Button
                        color={checkSocial('linkedin') ? 'red' : 'blue'}
                        onClick={() => {
                          if (persistedUserInfo?.role === 'guest') {
                            toast.warning(
                              <p>
                                Please{' '}
                                <span
                                  className="cursor-pointer text-[#389CE3] underline"
                                  onClick={() => navigate('/guest-signup')}
                                >
                                  Create an Account
                                </span>{' '}
                                to unlock this feature
                              </p>,
                            );
                            return;
                          } else {
                            checkSocial('linkedin') && setModalVisible(true);
                          }
                        }}
                      >
                        {checkSocial('linkedin') ? 'Remove' : 'Add New Badge'}
                        <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                          {checkSocial('linkedin') ? '' : '(+0.96 FDX)'}
                        </span>
                      </Button>
                      <BadgeRemovePopup
                        handleClose={handleBadgesClose}
                        modalVisible={modalVisible}
                        title={'LinkedIn'}
                        image={'/assets/profile/LinkedIn-2x.png'}
                        accountName={'linkedin'}
                        fetchUser={fetchUser}
                        setFetchUser={setFetchUser}
                      />
                    </>
                  ) : persistedUserInfo?.role === 'guest' ? (
                    <Button
                      color={checkSocial('linkedin') ? 'red' : 'blue'}
                      onClick={() => {
                        toast.warning(
                          <p>
                            Please{' '}
                            <span
                              className="cursor-pointer text-[#389CE3] underline"
                              onClick={() => navigate('/guest-signup')}
                            >
                              Create an Account
                            </span>{' '}
                            to unlock this feature
                          </p>,
                        );
                        return;
                      }}
                    >
                      {checkSocial('linkedin') ? 'Remove' : 'Add New Badge'}
                      <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                        {checkSocial('linkedin') ? '' : '(+0.96 FDX)'}
                      </span>
                    </Button>
                  ) : (
                    <LoginSocialLinkedin
                      // isOnlyGetToken
                      client_id={import.meta.env.VITE_LINKEDIN_KEY}
                      client_secret={import.meta.env.VITE_LINKEDIN_SECRET}
                      onResolve={({ provider, data }) => {
                        console.log(provider, data);
                        setIsLoading(true);
                        handleAddBadge(provider, data);
                      }}
                      redirect_uri={window.location.href}
                      onReject={(err) => {
                        toast.error('An error occured while adding badge');
                        setIsLoading(false);
                        console.log(err);
                      }}
                    >
                      <Button
                        // color={checkSocial('linkedin') ? 'red' : 'blue'}
                        disabled={true}
                        color="gray"
                        onClick={() => {
                          checkSocial('linkedin') && handleRemoveBadge('linkedin');
                        }}
                      >
                        {checkSocial('linkedin') ? 'Remove' : 'Add New Badge'}
                        <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                          {checkSocial('linkedin') ? '' : '(+0.96 FDX)'}
                        </span>
                      </Button>
                    </LoginSocialLinkedin>
                  )}
                </div>

                {/* ...........................Twitter......................  */}
                <div className="flex items-center justify-center gap-[10px] tablet:justify-end laptop:gap-5">
                  <img
                    src="/assets/profile/Twitter-2x.png"
                    alt="Twitter"
                    className="h-[23px] min-h-[6.389vw] w-[23px] min-w-[6.389vw] tablet:h-[3.48vw] tablet:min-h-[3.48vw] tablet:w-[3.48vw] tablet:min-w-[3.48vw]"
                  />
                  <div
                    className={`${
                      persistedTheme === 'dark' ? 'dark-shadow-input' : ''
                    } flex h-[7.3vw] w-[24vw] items-center justify-center rounded-[1.31vw] border border-[#DEE6F7] text-[2.11vw] font-medium leading-normal text-[#000] tablet:h-[3.48vw] tablet:w-[13.9vw] tablet:rounded-[8px] tablet:border-[3px] tablet:text-[1.38vw] laptop:rounded-[15px] dark:text-[#CACACA]`}
                  >
                    <h1>Twitter</h1>
                  </div>
                  {checkSocial('twitter') ? (
                    <Button
                      color={checkSocial('twitter') ? 'red' : 'blue'}
                      onClick={() => {
                        if (persistedUserInfo?.role === 'guest') {
                          handleGuestBadgeAdd();
                        } else {
                          checkSocial('twitter') &&
                            handleRemoveBadgePopup({
                              title: 'twitter',
                              image: '/assets/profile/Twitter-2x.png',
                              accountName: 'twitter',
                            });
                        }
                      }}
                    >
                      {checkSocial('twitter') ? 'Remove' : 'Add New Badge'}
                      <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                        {checkSocial('twitter') ? '' : '(+0.96 FDX)'}
                      </span>
                    </Button>
                  ) : persistedUserInfo?.role === 'guest' ? (
                    <Button color={checkSocial('twitter') ? 'red' : 'blue'} onClick={handleGuestBadgeAdd}>
                      {checkSocial('twitter') ? 'Remove' : 'Add New Badge'}
                      <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                        {checkSocial('twitter') ? '' : '(+0.96 FDX)'}
                      </span>
                    </Button>
                  ) : (
                    <Button
                      color={checkSocial('twitter') ? 'red' : 'blue'}
                      onClick={() => {
                        loginWithTwitter();
                      }}
                    >
                      {checkSocial('twitter') ? 'Remove' : 'Add New Badge'}
                      <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                        {checkSocial('twitter') ? '' : '(+0.96 FDX)'}
                      </span>
                    </Button>
                  )}
                </div>

                {/* ...........................Instagram......................  */}
                <div className="flex items-center justify-center gap-[10px] tablet:justify-end laptop:gap-5">
                  <img
                    src="/assets/profile/Instagram-2x.png"
                    alt="Instagram"
                    className="h-[23px] min-h-[6.389vw] w-[23px] min-w-[6.389vw] tablet:h-[3.48vw] tablet:min-h-[3.48vw] tablet:w-[3.48vw] tablet:min-w-[3.48vw]"
                  />
                  <div
                    className={`${
                      persistedTheme === 'dark' ? 'dark-shadow-input' : ''
                    } flex h-[7.3vw] w-[24vw] items-center justify-center rounded-[1.31vw] border border-[#DEE6F7] text-[2.11vw] font-medium leading-normal text-[#000] tablet:h-[3.48vw] tablet:w-[13.9vw] tablet:rounded-[8px] tablet:border-[3px] tablet:text-[1.38vw] laptop:rounded-[15px] dark:text-[#CACACA]`}
                  >
                    <h1>Instagram</h1>
                  </div>
                  {checkSocial('instagram') ? (
                    <>
                      <Button
                        color={checkSocial('instagram') ? 'red' : 'blue'}
                        onClick={() => {
                          if (persistedUserInfo?.role === 'guest') {
                            handleGuestBadgeAdd();
                          } else {
                            checkSocial('instagram') &&
                              handleRemoveBadgePopup({
                                title: 'instagram',
                                image: '/assets/profile/Instagram-2x.png',
                                accountName: 'instagram',
                              });
                          }
                        }}
                      >
                        {checkSocial('instagram') ? 'Remove' : 'Add New Badge'}
                        <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                          {checkSocial('instagram') ? '' : '(+0.96 FDX)'}
                        </span>
                      </Button>
                    </>
                  ) : persistedUserInfo?.role === 'guest' ? (
                    <Button color={checkSocial('instagram') ? 'red' : 'blue'} onClick={handleGuestBadgeAdd}>
                      {checkSocial('instagram') ? 'Remove' : 'Add New Badge'}
                      <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                        {checkSocial('instagram') ? '' : '(+0.96 FDX)'}
                      </span>
                    </Button>
                  ) : (
                    // <LoginSocialInstagram
                    //   client_id={import.meta.env.VITE_INSTAGRAM_CLIENT_ID}
                    //   client_secret={import.meta.env.VITE_INSTAGRAM_CLIENT_SECRET}
                    //   redirect_uri={window.location.href}
                    //   onLoginStart={onLoginStart}
                    //   onResolve={({ provider, data }) => {
                    //     setIsLoading(true);
                    //     handleAddBadge(provider, data);
                    //   }}
                    //   onReject={(err) => {
                    //     toast.error('An error occured while adding badge');
                    //     setIsLoading(false);
                    //     console.log(err);
                    //   }}
                    //   className="container flex w-full"
                    // >
                    //   <Button color={checkSocial('instagram') ? 'red' : 'blue'}>
                    //     {checkSocial('instagram') ? '' : 'Add New Badge'}
                    //     <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                    //       {checkSocial('instagram') ? '' : '(+0.96 FDX)'}
                    //     </span>
                    //   </Button>
                    // </LoginSocialInstagram>
                    <InstagramLogin
                      clientId={import.meta.env.VITE_INSTAGRAM_CLIENT_ID}
                      onSuccess={(code) => {
                        console.log(code), loginInWithInsta(code);
                      }}
                      onFailure={(err) => console.log('error', err)}
                      redirectUri={window.location.href}
                      cssClass={'hideBack'}
                    >
                      <Button color={checkSocial('instagram') ? 'red' : 'blue'}>
                        {checkSocial('instagram') ? '' : 'Add New Badge'}
                        <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                          {checkSocial('instagram') ? '' : '(+0.96 FDX)'}
                        </span>
                      </Button>
                    </InstagramLogin>
                  )}
                </div>

                {/* ............................Github......................... */}
                <div className="flex items-center justify-center gap-[10px] tablet:justify-end laptop:gap-5">
                  <img
                    src="/assets/profile/Github-2x.png"
                    alt="Github"
                    className="h-[23px] min-h-[6.389vw] w-[23px] min-w-[6.389vw] tablet:h-[3.48vw] tablet:min-h-[3.48vw] tablet:w-[3.48vw] tablet:min-w-[3.48vw]"
                  />
                  <div
                    className={`${
                      persistedTheme === 'dark' ? 'dark-shadow-input' : ''
                    } flex h-[7.3vw] w-[24vw] items-center justify-center rounded-[1.31vw] border border-[#DEE6F7] text-[2.11vw] font-medium leading-normal text-[#000] tablet:h-[3.48vw] tablet:w-[13.9vw] tablet:rounded-[8px] tablet:border-[3px] tablet:text-[1.38vw] laptop:rounded-[15px] dark:text-[#CACACA]`}
                  >
                    <h1>Github</h1>
                  </div>
                  {checkSocial('github') ? (
                    <Button
                      color={checkSocial('github') ? 'red' : 'blue'}
                      onClick={() => {
                        if (persistedUserInfo?.role === 'guest') {
                          handleGuestBadgeAdd();
                        } else {
                          checkSocial('github') &&
                            handleRemoveBadgePopup({
                              title: 'github',
                              image: '/assets/profile/Github-2x.png',
                              accountName: 'github',
                            });
                        }
                      }}
                    >
                      {checkSocial('github') ? 'Remove' : 'Add New Badge'}
                      <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                        {checkSocial('github') ? '' : '(+0.96 FDX)'}
                      </span>
                    </Button>
                  ) : persistedUserInfo?.role === 'guest' ? (
                    <Button color={checkSocial('github') ? 'red' : 'blue'} onClick={handleGuestBadgeAdd}>
                      {checkSocial('github') ? 'Remove' : 'Add New Badge'}
                      <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                        {checkSocial('github') ? '' : '(+0.96 FDX)'}
                      </span>
                    </Button>
                  ) : (
                    // <LoginSocialGithub
                    //   client_id={import.meta.env.VITE_GITHUB_CLIENT_ID}
                    //   client_secret={import.meta.env.VITE_GITHUB_CLIENT_SECRET}
                    //   redirect_uri={window.location.href}
                    //   onLoginStart={onLoginStart}
                    //   onResolve={({ provider, data }) => {
                    //     handleAddBadge(provider, data);
                    //   }}
                    //   onReject={(err) => {
                    //     toast.error('An error occured while adding badge');
                    //     setIsLoading(false);
                    //     console.log(err);
                    //   }}
                    //   className="container flex w-full"
                    // >
                    //   <Button color={checkSocial('github') ? 'red' : 'blue'}>
                    //     {checkSocial('github') ? '' : 'Add New Badge'}
                    //     <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                    //       {checkSocial('github') ? '' : '(+0.96 FDX)'}
                    //     </span>
                    //   </Button>
                    // </LoginSocialGithub>
                    <Button
                      color={checkSocial('github') ? 'red' : 'blue'}
                      onClick={() => {
                        loginWithGithub();
                      }}
                    >
                      {checkSocial('github') ? 'Remove' : 'Add New Badge'}
                      <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                        {checkSocial('github') ? '' : '(+0.96 FDX)'}
                      </span>
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-[7px] tablet:hidden tablet:gap-4 laptop:gap-5">
                <h1 className="font-500 font-Inter mb-[5px] mt-3 text-[9.74px] font-medium text-black tablet:text-[1.7vw] dark:text-white">
                  Web 3
                </h1>
                <Web3 handleUserInfo={handleUserInfo} fetchUser={fetchUser} />
              </div>
            </div>

            <h1 className="font-500 font-Inter my-[5px] text-[9.74px] font-medium text-black tablet:text-[1.7vw] dark:text-white">
              Personal
            </h1>
            <Personal handleUserInfo={handleUserInfo} fetchUser={fetchUser} />
          </div>
        </div>
      )}
    </>
  );
};

export default VerificationBadges;
