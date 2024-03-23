import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { userInfo } from '../../../../../services/api/userAuth';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { addUser } from '../../../../../features/auth/authSlice';
import Button from '../components/Button';
import Loader from '../../../../Signup/components/Loader';
import api from '../../../../../services/api/Axios';

import { LoginSocialFacebook } from 'reactjs-social-login';
import { LoginSocialLinkedin } from './ReactLinkedIn';
import { contacts } from '../../../../../constants/varification-badges';
import VerificationPopups from '../components/VerificationPopups';
import BadgeRemovePopup from '../../../../../components/dialogue-boxes/badgeRemovePopup';
import { TwitterAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { authentication } from './firebase-config';
import Personal from './verification-badges/Personal';
import Web3 from './verification-badges/Web3';
import { InstagramLogin } from '@amraneze/react-instagram-login';
import Contact from './verification-badges/Contact';
import { useErrorBoundary } from 'react-error-boundary';

const VerificationBadges = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showBoundary } = useErrorBoundary();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [searchParams] = useSearchParams();
  const [fetchUser, setFetchUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState();
  const [pageLoading, setPageLoading] = useState(true);

  const loginWithYoutube = () => { };
  const handleSoundCloud = () => { };

  const handleLinkedIn = async () => {
    const resp = await fetch(
      `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${import.meta.env.VITE_LINKEDIN_KEY}&redirect_uri=${window.location.href}&state=foobar&scope=liteprofile%20emailaddress%20w_member_social`,
    );
    console.log(resp);
  };
  // const handleSoundCloud=()=>{
  //   window.location.href = `https://secure.soundcloud.com/authorize?client_id=${'clientId'}&redirect_uri=${'redirectUri'}&response_type=code`;
  // }
  const loginInWithInsta = async (code) => {
    try {
      // return
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
        showBoundary(response);
        console.error('Error fetching Instagram profile:', response);
      }
    } catch (error) {
      showBoundary(error);
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
        showBoundary(err);
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
        showBoundary(err);
        console.log(err);
      });
  };

  const handleBadgesClose = () => setModalVisible(false);

  const handleUserInfo = async (id) => {
    try {
      const resp = await userInfo(id);

      if (resp.status === 200) {
        setIsLoading(false);
        dispatch(addUser(resp.data));
      }

      setFetchUser(resp.data);
    } catch (e) {
      showBoundary(e);
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

  const checkSocial = (name) => fetchUser?.badges?.some((i) => i.accountName === name);

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
    } catch (e) {
      console.log(e);
    }
  };

  const handleAddBadge = async (provider, data) => {
    try {
      let id;
      if (provider === 'linkedin') {
        id = data.sub;
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
      showBoundary(error);
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
          {/* DELETE MODAL POPUP */}
          {modalVisible && (
            <BadgeRemovePopup
              handleClose={handleBadgesClose}
              modalVisible={modalVisible}
              title={deleteModalState?.title}
              image={deleteModalState?.image}
              accountName={deleteModalState?.accountName}
              type={deleteModalState?.type}
              badgeType={deleteModalState?.badgeType}
              fetchUser={fetchUser}
              setFetchUser={setFetchUser}
            />
          )}
          {isLoading && <Loader />}
          <h1 className="ml-[32px] text-[12px] font-semibold leading-[14.52px] text-[#4A8DBD] tablet:ml-[97px] tablet:text-[25px] tablet:font-semibold tablet:leading-[30px] dark:text-[#B8B8B8]">
            My Verification Badges
          </h1>
          <div
            className={`${persistedTheme === 'dark' ? 'dark-shadow-inside' : 'verification-badge-boxShadow bg-white'
              } relative mx-6 mb-[140px] mt-[10px] flex flex-col gap-[7px] rounded-[13.7px] px-5 pb-[17.57px] pt-[14px] tablet:mx-[30px] tablet:mb-[10rem] tablet:mt-[35px] tablet:gap-4 tablet:rounded-[45px] tablet:px-[30px] tablet:py-[30px] laptop:mx-[45px] laptop:gap-5 laptop:px-[40px]`}
          >
            <Contact
              handleUserInfo={handleUserInfo}
              fetchUser={fetchUser}
              handleRemoveBadgePopup={handleRemoveBadgePopup}
            />

            <h1 className="font-500 font-Inter mb-[5px] mt-3 text-[9.74px] font-medium text-[#000] tablet:text-[1.7vw] dark:text-white">
              Social
            </h1>

            <div className="hidden flex-col justify-between gap-[7px] rounded-2xl border-[3px] border-[#DEE6F7] p-[17px] tablet:flex tablet:flex-row tablet:gap-5 laptop:gap-6">
              <div className="flex flex-col gap-[7px] tablet:gap-4 laptop:gap-5">
                {/* ...........................Facebook......................  */}
                <div className="flex items-center gap-[10px] laptop:gap-5">
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Facebook-2x.png`}
                    alt="Facebook"
                    className="h-[23px] min-h-[6.389vw] w-[23px] min-w-[6.389vw] tablet:h-[3.48vw] tablet:min-h-[3.48vw] tablet:w-[3.48vw] tablet:min-w-[3.48vw]"
                  />
                  <div
                    className={`${persistedTheme === 'dark' ? 'dark-shadow-input' : ''
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
                              image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Facebook-2x.png`,
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
                <div className="flex items-center gap-[10px] opacity-[100%] laptop:gap-5">
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/LinkedIn-2x.png`}
                    alt="LinkedIn"
                    className="h-[23px] min-h-[6.389vw] w-[23px] min-w-[6.389vw] tablet:h-[3.48vw] tablet:min-h-[3.48vw] tablet:w-[3.48vw] tablet:min-w-[3.48vw]"
                  />
                  <div
                    className={`${persistedTheme === 'dark' ? 'dark-shadow-input' : ''
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
                            handleGuestBadgeAdd();
                          } else {
                            checkSocial('linkedin') &&
                              handleRemoveBadgePopup({
                                title: 'Linkedin',
                                image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/LinkedIn-2x.png`,
                                accountName: 'linkedin',
                              });
                          }
                        }}
                      >
                        {checkSocial('linkedin') ? 'Remove' : 'Add New Badge'}
                        <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                          {checkSocial('linkedin') ? '' : '(+0.96 FDX)'}
                        </span>
                      </Button>
                    </>
                  ) : persistedUserInfo?.role === 'guest' ? (
                    <Button color={checkSocial('twitter') ? 'red' : 'blue'} onClick={handleGuestBadgeAdd}>
                      {checkSocial('twitter') ? 'Remove' : 'Add New Badge'}
                      <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                        {checkSocial('twitter') ? '' : '(+0.96 FDX)'}
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
                      // scope="email,openid,profile,w_member_social"
                      onReject={(err) => {
                        toast.error('An error occured while adding badge');
                        setIsLoading(false);
                        console.log(err);
                      }}
                    >
                      <Button
                        color={checkSocial('linkedin') ? 'red' : 'blue'}
                        // disabled={true}
                        // color="gray"
                        onClick={() => {
                          checkSocial('linkedin') ? handleRemoveBadge('linkedin') : handleLinkedIn();
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
                <div className="flex items-center gap-[10px] laptop:gap-5">
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Twitter-2x.png`}
                    alt="Twitter"
                    className="h-[23px] min-h-[6.389vw] w-[23px] min-w-[6.389vw] tablet:h-[3.48vw] tablet:min-h-[3.48vw] tablet:w-[3.48vw] tablet:min-w-[3.48vw]"
                  />
                  <div
                    className={`${persistedTheme === 'dark' ? 'dark-shadow-input' : ''
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
                              image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Twitter-2x.png`,
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

                {/* Instagram  */}
                <div className="flex items-center gap-[10px] laptop:gap-5">
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Instagram-2x.png`}
                    alt="Instagram"
                    className="h-[23px] min-h-[6.389vw] w-[23px] min-w-[6.389vw] tablet:h-[3.48vw] tablet:min-h-[3.48vw] tablet:w-[3.48vw] tablet:min-w-[3.48vw]"
                  />
                  <div
                    className={`${persistedTheme === 'dark' ? 'dark-shadow-input' : ''
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
                                image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Instagram-2x.png`,
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
              </div>
              <div className="w-2 rounded-[16px] border-[3px] border-[#DEE6F7] bg-[#FDFDFD]" />
              <div className="flex flex-col gap-[7px] tablet:gap-4 laptop:gap-5">
                {/* ............................Github......................... */}
                <div className="flex items-center gap-[10px] laptop:gap-5">
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Github-2x.png`}
                    alt="Github"
                    className="h-[23px] min-h-[6.389vw] w-[23px] min-w-[6.389vw] tablet:h-[3.48vw] tablet:min-h-[3.48vw] tablet:w-[3.48vw] tablet:min-w-[3.48vw]"
                  />
                  <div
                    className={`${persistedTheme === 'dark' ? 'dark-shadow-input' : ''
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
                              image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Github-2x.png`,
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
                {/* Youtube  */}
                <div className="flex items-center gap-[10px] opacity-[60%] laptop:gap-5">
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/youtube.svg`}
                    alt="Twitter"
                    className="h-[23px] min-h-[6.389vw] w-[23px] min-w-[6.389vw] tablet:h-[3.48vw] tablet:min-h-[3.48vw] tablet:w-[3.48vw] tablet:min-w-[3.48vw]"
                  />
                  <div
                    className={`${persistedTheme === 'dark' ? 'dark-shadow-input' : ''
                      } flex h-[7.3vw] w-[24vw] items-center justify-center rounded-[1.31vw] border border-[#DEE6F7] text-[2.11vw] font-medium leading-normal text-[#000] tablet:h-[3.48vw] tablet:w-[13.9vw] tablet:rounded-[8px] tablet:border-[3px] tablet:text-[1.38vw] laptop:rounded-[15px] dark:text-[#CACACA]`}
                  >
                    <h1>Youtube</h1>
                  </div>
                  {checkSocial('youtube') ? (
                    <Button
                      color={checkSocial('youtube') ? 'red' : 'blue'}
                      onClick={() => {
                        if (persistedUserInfo?.role === 'guest') {
                          handleGuestBadgeAdd();
                        } else {
                          checkSocial('youtube') &&
                            handleRemoveBadgePopup({
                              title: 'youtube',
                              image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/youtube.svg`,
                              accountName: 'youtube',
                            });
                        }
                      }}
                    >
                      {checkSocial('youtube') ? 'Remove' : 'Add New Badge'}
                      <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                        {checkSocial('youtube') ? '' : '(+0.96 FDX)'}
                      </span>
                    </Button>
                  ) : persistedUserInfo?.role === 'guest' ? (
                    <Button color={checkSocial('youtube') ? 'red' : 'blue'} onClick={handleGuestBadgeAdd}>
                      {checkSocial('youtube') ? 'Remove' : 'Add New Badge'}
                      <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                        {checkSocial('youtube') ? '' : '(+0.96 FDX)'}
                      </span>
                    </Button>
                  ) : (
                    <Button
                      // color={checkSocial('youtube') ? 'red' : 'blue'}
                      color={'gray'}
                      onClick={() => {
                        loginWithYoutube();
                      }}
                      disabled={true}
                    >
                      {checkSocial('youtube') ? 'Remove' : 'Add New Badge'}
                      <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                        {checkSocial('youtube') ? '' : '(+0.96 FDX)'}
                      </span>
                    </Button>
                  )}
                </div>
                {/* SoundCloud */}

                <div className="flex items-center gap-[10px] opacity-[60%] laptop:gap-5">
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/soundCloud.svg`}
                    alt="Sound Cloud"
                    className="h-[23px] min-h-[6.389vw] w-[23px] min-w-[6.389vw] tablet:h-[3.48vw] tablet:min-h-[3.48vw] tablet:w-[3.48vw] tablet:min-w-[3.48vw]"
                  />
                  <div
                    className={`${persistedTheme === 'dark' ? 'dark-shadow-input' : ''
                      } flex h-[7.3vw] w-[24vw] items-center justify-center rounded-[1.31vw] border border-[#DEE6F7] text-[2.11vw] font-medium leading-normal text-[#000] tablet:h-[3.48vw] tablet:w-[13.9vw] tablet:rounded-[8px] tablet:border-[3px] tablet:text-[1.38vw] laptop:rounded-[15px] dark:text-[#CACACA]`}
                  >
                    <h1>Sound Cloud</h1>
                  </div>
                  {checkSocial('soundcloud') ? (
                    <>
                      <Button
                        color={checkSocial('soundcloud') ? 'red' : 'blue'}
                        onClick={() => {
                          if (persistedUserInfo?.role === 'guest') {
                            handleGuestBadgeAdd();
                          } else {
                            checkSocial('soundcloud') &&
                              handleRemoveBadgePopup({
                                title: 'soundcloud',
                                image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/soundCloud.png`,
                                accountName: 'soundcloud',
                              });
                          }
                        }}
                      >
                        {checkSocial('soundcloud') ? 'Remove' : 'Add New Badge'}
                        <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                          {checkSocial('soundcloud') ? '' : '(+0.96 FDX)'}
                        </span>
                      </Button>
                    </>
                  ) : persistedUserInfo?.role === 'guest' ? (
                    <Button color={checkSocial('soundcloud') ? 'red' : 'blue'} onClick={handleGuestBadgeAdd}>
                      {checkSocial('soundcloud') ? 'Remove' : 'Add New Badge'}
                      <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                        {checkSocial('soundcloud') ? '' : '(+0.96 FDX)'}
                      </span>
                    </Button>
                  ) : (
                    <Button
                      color={'gray'}
                      // color={checkSocial('soundcloud') ? 'red' : 'blue'}
                      onClick={handleSoundCloud}
                      disabled={true}
                    >
                      {checkSocial('soundcloud') ? '' : 'Add New Badge'}
                      <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                        {checkSocial('soundcloud') ? '' : '(+0.96 FDX)'}
                      </span>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* all */}
            <div className="flex flex-col items-center gap-[7px] tablet:hidden tablet:gap-4 laptop:gap-5">
              {/* ...........................Facebook......................  */}
              <div className="flex items-center gap-[10px] laptop:gap-5">
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Facebook-2x.png`}
                  alt="Facebook"
                  className="h-[23px] min-h-[6.389vw] w-[23px] min-w-[6.389vw] tablet:h-[3.48vw] tablet:min-h-[3.48vw] tablet:w-[3.48vw] tablet:min-w-[3.48vw]"
                />
                <div
                  className={`${persistedTheme === 'dark' ? 'dark-shadow-input' : ''
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
                            image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Facebook-2x.png`,
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
              <div className="flex items-center gap-[10px] opacity-[100%] laptop:gap-5">
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/LinkedIn-2x.png`}
                  alt="LinkedIn"
                  className="h-[23px] min-h-[6.389vw] w-[23px] min-w-[6.389vw] tablet:h-[3.48vw] tablet:min-h-[3.48vw] tablet:w-[3.48vw] tablet:min-w-[3.48vw]"
                />
                <div
                  className={`${persistedTheme === 'dark' ? 'dark-shadow-input' : ''
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
                          handleGuestBadgeAdd();
                        } else {
                          checkSocial('linkedin') &&
                            handleRemoveBadgePopup({
                              title: 'LinkedIn',
                              image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/LinkedIn-2x.png`,
                              accountName: 'linkedin',
                            });
                        }
                      }}
                    >
                      {checkSocial('linkedin') ? 'Remove' : 'Add New Badge'}
                      <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                        {checkSocial('linkedin') ? '' : '(+0.96 FDX)'}
                      </span>
                    </Button>
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
                    // scope="email,openid,profile,w_member_social"
                    onReject={(err) => {
                      toast.error('An error occured while adding badge');
                      setIsLoading(false);
                      console.log(err);
                    }}
                  >
                    <Button
                      color={checkSocial('linkedin') ? 'red' : 'blue'}
                      // disabled={true}
                      // color="gray"
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
              <div className="flex items-center gap-[10px] laptop:gap-5">
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Twitter-2x.png`}
                  alt="Twitter"
                  className="h-[23px] min-h-[6.389vw] w-[23px] min-w-[6.389vw] tablet:h-[3.48vw] tablet:min-h-[3.48vw] tablet:w-[3.48vw] tablet:min-w-[3.48vw]"
                />
                <div
                  className={`${persistedTheme === 'dark' ? 'dark-shadow-input' : ''
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
                            image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Twitter-2x.png`,
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
              {/* Instagram  */}
              <div className="flex items-center gap-[10px] laptop:gap-5">
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Instagram-2x.png`}
                  alt="Instagram"
                  className="h-[23px] min-h-[6.389vw] w-[23px] min-w-[6.389vw] tablet:h-[3.48vw] tablet:min-h-[3.48vw] tablet:w-[3.48vw] tablet:min-w-[3.48vw]"
                />
                <div
                  className={`${persistedTheme === 'dark' ? 'dark-shadow-input' : ''
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
                              image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Instagram-2x.png`,
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
              <div className="flex items-center gap-[10px] laptop:gap-5">
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Github-2x.png`}
                  alt="Github"
                  className="h-[23px] min-h-[6.389vw] w-[23px] min-w-[6.389vw] tablet:h-[3.48vw] tablet:min-h-[3.48vw] tablet:w-[3.48vw] tablet:min-w-[3.48vw]"
                />
                <div
                  className={`${persistedTheme === 'dark' ? 'dark-shadow-input' : ''
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
                            image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Github-2x.png`,
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

              {/* Youtube  */}
              <div className="flex items-center gap-[10px] opacity-[60%] laptop:gap-5">
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/youtube.svg`}
                  alt="Twitter"
                  className="h-[23px] min-h-[6.389vw] w-[23px] min-w-[6.389vw] tablet:h-[3.48vw] tablet:min-h-[3.48vw] tablet:w-[3.48vw] tablet:min-w-[3.48vw]"
                />
                <div
                  className={`${persistedTheme === 'dark' ? 'dark-shadow-input' : ''
                    } flex h-[7.3vw] w-[24vw] items-center justify-center rounded-[1.31vw] border border-[#DEE6F7] text-[2.11vw] font-medium leading-normal text-[#000] tablet:h-[3.48vw] tablet:w-[13.9vw] tablet:rounded-[8px] tablet:border-[3px] tablet:text-[1.38vw] laptop:rounded-[15px] dark:text-[#CACACA]`}
                >
                  <h1>Youtube</h1>
                </div>
                {checkSocial('youtube') ? (
                  <Button
                    color={checkSocial('youtube') ? 'red' : 'blue'}
                    onClick={() => {
                      if (persistedUserInfo?.role === 'guest') {
                        handleGuestBadgeAdd();
                      } else {
                        checkSocial('youtube') &&
                          handleRemoveBadgePopup({
                            title: 'youtube',
                            image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/youtube.svg`,
                            accountName: 'youtube',
                          });
                      }
                    }}
                  >
                    {checkSocial('youtube') ? 'Remove' : 'Add New Badge'}
                    <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                      {checkSocial('youtube') ? '' : '(+0.96 FDX)'}
                    </span>
                  </Button>
                ) : persistedUserInfo?.role === 'guest' ? (
                  <Button color={checkSocial('youtube') ? 'red' : 'blue'} onClick={handleGuestBadgeAdd}>
                    {checkSocial('youtube') ? 'Remove' : 'Add New Badge'}
                    <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                      {checkSocial('youtube') ? '' : '(+0.96 FDX)'}
                    </span>
                  </Button>
                ) : (
                  <Button
                    // color={checkSocial('youtube') ? 'red' : 'blue'}
                    color={'gray'}
                    onClick={() => {
                      loginWithYoutube();
                    }}
                    disabled={true}
                  >
                    {checkSocial('youtube') ? 'Remove' : 'Add New Badge'}
                    <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                      {checkSocial('youtube') ? '' : '(+0.96 FDX)'}
                    </span>
                  </Button>
                )}
              </div>
              {/* SoundCloud */}

              <div className="flex items-center gap-[10px] opacity-[60%] laptop:gap-5">
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/soundCloud.svg`}
                  alt="Sound Cloud"
                  className="h-[23px] min-h-[6.389vw] w-[23px] min-w-[6.389vw] tablet:h-[3.48vw] tablet:min-h-[3.48vw] tablet:w-[3.48vw] tablet:min-w-[3.48vw]"
                />
                <div
                  className={`${persistedTheme === 'dark' ? 'dark-shadow-input' : ''
                    } flex h-[7.3vw] w-[24vw] items-center justify-center rounded-[1.31vw] border border-[#DEE6F7] text-[2.11vw] font-medium leading-normal text-[#000] tablet:h-[3.48vw] tablet:w-[13.9vw] tablet:rounded-[8px] tablet:border-[3px] tablet:text-[1.38vw] laptop:rounded-[15px] dark:text-[#CACACA]`}
                >
                  <h1>Sound Cloud</h1>
                </div>
                {checkSocial('soundcloud') ? (
                  <>
                    <Button
                      color={checkSocial('soundcloud') ? 'red' : 'blue'}
                      onClick={() => {
                        if (persistedUserInfo?.role === 'guest') {
                          handleGuestBadgeAdd();
                        } else {
                          checkSocial('soundcloud') &&
                            handleRemoveBadgePopup({
                              title: 'soundcloud',
                              image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/soundCloud.png`,
                              accountName: 'soundcloud',
                            });
                        }
                      }}
                    >
                      {checkSocial('soundcloud') ? 'Remove' : 'Add New Badge'}
                      <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                        {checkSocial('soundcloud') ? '' : '(+0.96 FDX)'}
                      </span>
                    </Button>
                  </>
                ) : persistedUserInfo?.role === 'guest' ? (
                  <Button color={checkSocial('soundcloud') ? 'red' : 'blue'} onClick={handleGuestBadgeAdd}>
                    {checkSocial('soundcloud') ? 'Remove' : 'Add New Badge'}
                    <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                      {checkSocial('soundcloud') ? '' : '(+0.96 FDX)'}
                    </span>
                  </Button>
                ) : (
                  <Button color={'gray'} onClick={handleSoundCloud} disabled={true}>
                    {checkSocial('soundcloud') ? '' : 'Add New Badge'}
                    <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                      {checkSocial('soundcloud') ? '' : '(+0.96 FDX)'}
                    </span>
                  </Button>
                )}
              </div>
            </div>

            <Web3
              handleUserInfo={handleUserInfo}
              fetchUser={fetchUser}
              handleRemoveBadgePopup={handleRemoveBadgePopup}
            />
            <Personal
              handleUserInfo={handleUserInfo}
              fetchUser={fetchUser}
              handleRemoveBadgePopup={handleRemoveBadgePopup}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default VerificationBadges;
