import { toast } from 'sonner';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userInfo } from '../../../../../services/api/userAuth';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { addUser } from '../../../../../features/auth/authSlice';
import Button from '../components/Button';
import Loader from '../../../../Signup/components/Loader';
import api from '../../../../../services/api/Axios';
import { ethers } from 'ethers';
import {
  LoginSocialFacebook,
  LoginSocialInstagram,
  LoginSocialLinkedin,
  LoginSocialGithub,
} from 'reactjs-social-login';
import { contacts, web3 } from '../../../../../constants/varification-badges';
import VerificationPopups from '../components/VerificationPopups';
import BadgeRemovePopup from '../../../../../components/dialogue-boxes/badgeRemovePopup';
import Personal from './verification-badges/Personal';
import LoginSocialTwitter from './verification-badges/LoginSocialTwitter';
import { FaSpinner } from 'react-icons/fa';

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

  const handleBadgesClose = () => setModalVisible(false);
  const checkWeb3Badge = (itemType) =>
    fetchUser?.badges?.some((badge) => badge?.web3?.hasOwnProperty(itemType) || false) || false;

  const onResolve = ({ provider, data }) => {
    // Handle successful login
    handleAddBadge(provider, data);
    console.log(`Login resolved for ${provider}`, data);
  };

  const onReject = (error) => {
    // Handle login rejection
    console.error('Login rejected', error);
  };

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

  // const checkSocial = (itemType) => {
  //   console.log("🚀 ~ checkSocial ~ itemType:", itemType)
  //   const check = fetchUser?.badges?.some(i => i.accountName === itemType)
  //   console.log("🚀 ~ checkSocial ~ check:", check)
  // }

  const checkPersonal = (itemType) => fetchUser?.badges?.some((i) => i.type === itemType);
  const checkSocial = (itemType) => fetchUser?.badges?.some((i) => i.accountName === itemType);

  // Handle Remove Badge
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
  // Handle Add Badge
  const handleAddBadge = async (provider, data) => {
    try {
      let id;
      if (provider === 'linkedin') {
        id = provider;
      } else if (provider === 'instagram') {
        id = data.user_id;
      } else if (provider === 'twitter' || provider === 'facebook') {
        id = data.userID;
      } else if (provider === 'github') {
        id = data.email;
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

  const contactBadgeEmail = useRef(null);
  // Use useRef to create a mutable object
  const dataRef = useRef({ data: 'Initial Data' });

  const handleClickContactBadgeEmail = (type) => {
    if (persistedUserInfo?.role === 'guest') {
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
    } else {
      setIsPopup(true);
      setSelectedBadge(type);
    }
    // // console.log('testing.....');
    // dataRef.current.data = type;
    // // Trigger a click event on the first element
    // contactBadgeEmail.current.click();

    // // Force a re-render by updating a dummy state
    // setDummyState({});
  };

  // // Dummy state to force re-render
  // const [, setDummyState] = useState();

  // // Handle Add Contact Badge
  // const handleAddContactBadge = async (provider, data) => {
  //   try {
  //     data['provider'] = provider;
  //     data['type'] = dataRef.current.data;
  //     data['uuid'] = fetchUser.uuid || localStorage.getItem('uuid');
  //     const addBadge = await api.post(`/addBadge/contact`, {
  //       ...data,
  //     });
  //     if (addBadge.status === 200) {
  //       toast.success('Badge Added Successfully!');
  //       handleUserInfo();
  //     }
  //   } catch (error) {
  //     toast.error(error.response.data.message.split(':')[1]);
  //   }
  // };

  const handleRemoveBadgePopup = (item) => {
    setDeleteModalState(item);
    setModalVisible(true);
  };

  const handleWeb3 = async (title, type) => {
    try {
      let value;
      if (title.trim() === 'Ethereum Wallet') {
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const _walletAddress = await signer.getAddress();
          value = _walletAddress;
        } else {
          console.log('Wallet not detected');
          toast.warning('Please install an Ethereum wallet');
          return;
        }
      }
      if (value === '') {
        return;
      }
      const addBadge = await api.post(`/addBadge/web3/add`, {
        web3: {
          [type]: value,
        },
        uuid: fetchUser.uuid,
      });
      if (addBadge.status === 200) {
        toast.success('Badge Added Successfully!');
        handleUserInfo();
      }
    } catch (error) {
      console.log(error);
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
            } relative mx-6 mb-[140px] mt-[10px] flex flex-col gap-[7px] rounded-[13.7px] px-5 pb-[17.57px] pt-[14px] tablet:mx-[97px] tablet:mb-[10rem] tablet:mt-[35px] tablet:gap-4 tablet:rounded-[45px] tablet:px-[90px] tablet:py-[30px] laptop:gap-5`}
          >
            {/* <div className="absolute -top-[1px] left-[50%] mx-auto flex w-[90%] -translate-x-[50%] transform justify-center gap-[21px] tablet:-top-1 tablet:w-[90%] laptop:w-[95%]">
          <div className="h-[2.94px] w-full rounded-[100px] bg-[#4A8DBD] tablet:h-[11.1px]" />
          <div className="h-[2.94px]  w-full rounded-[100px] bg-[#D9D9D9] tablet:h-[11.1px]" />
          <div className="h-[2.94px]  w-full rounded-[100px] bg-[#D9D9D9] tablet:h-[11.1px]" />
          <div className="h-[2.94px]  w-full rounded-[100px] bg-[#D9D9D9] tablet:h-[11.1px]" />
          <div className="h-[2.94px]  w-full rounded-[100px] bg-[#D9D9D9] tablet:h-[11.1px]" />
          <div className="h-[2.94px]  w-full rounded-[100px] bg-[#D9D9D9] tablet:h-[11.1px]" />
        </div> */}
            <h1 className="font-500 font-Inter mb-[3px] text-[9.74px] font-medium text-[#000] tablet:text-[1.7vw] dark:text-white">
              Contact
            </h1>
            {contacts.map((item, index) => (
              <div className={`flex items-center justify-center ${item.disabled && 'opacity-[60%]'}`} key={index}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-[6.389vw] w-[6.389vw] tablet:h-[3.48vw] tablet:w-[3.48vw]"
                />
                <div
                  className={`${
                    persistedTheme === 'dark' ? 'dark-shadow-input' : ''
                  } ml-[10px] mr-2 flex h-[7.3vw] w-[24vw] items-center justify-center rounded-[1.31vw] border border-[#DEE6F7] text-[2.11vw] font-medium leading-normal text-[#000] tablet:mx-[2px] tablet:ml-[30px] tablet:mr-[20px] tablet:h-[3.48vw] tablet:w-[19.9vw] tablet:rounded-[8px] tablet:border-[3px] tablet:text-[1.38vw] laptop:ml-[40px] laptop:mr-[30px] laptop:rounded-[15px] dark:text-[#CACACA]`}
                >
                  <h1>{item.title}</h1>
                </div>
                <Button
                  color={checkPersonal(item.type) ? 'yellow' : item.ButtonColor}
                  onClick={() =>
                    !checkPersonal(item.type) && item.ButtonColor !== 'gray' && handleClickContactBadgeEmail(item.type)
                  }
                >
                  {checkPersonal(item.type) ? 'Added' : item.ButtonText}
                  <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                    {checkPersonal(item.type) ? '' : '(+0.96 FDX)'}
                  </span>
                </Button>
              </div>
            ))}
            <h1 className="font-500 font-Inter my-[3px] text-[9.74px] font-medium text-[#000] tablet:text-[1.7vw] dark:text-white">
              Social
            </h1>
            {/* ...........................Facebook......................  */}
            <div className="flex items-center justify-center">
              <div className="flex items-center justify-center">
                <img
                  src="/assets/profile/Facebook-2x.png"
                  alt="Facebook"
                  className="h-[23px] min-h-[6.389vw] w-[23px] min-w-[6.389vw] tablet:h-[3.48vw] tablet:min-h-[3.48vw] tablet:w-[3.48vw] tablet:min-w-[3.48vw]"
                />
                <div
                  className={`${
                    persistedTheme === 'dark' ? 'dark-shadow-input' : ''
                  } mx-2 flex h-[7.3vw] w-[24vw] min-w-[24vw] items-center justify-center rounded-[1.31vw] border border-[#DEE6F7] text-[2.11vw] font-medium leading-normal text-[#000] tablet:mx-[30px] tablet:h-[3.48vw]  tablet:w-[19.9vw] tablet:min-w-[19.9vw] tablet:rounded-[8px] tablet:border-[3px] tablet:text-[1.38vw] laptop:rounded-[15px] dark:text-[#CACACA]`}
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
                    className="container flex w-full"
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
            </div>
            {/* ...........................LinkedIn......................  */}
            <div className="flex items-center justify-center opacity-[60%]">
              <div className="flex items-center justify-center">
                <img
                  src="/assets/profile/LinkedIn-2x.png"
                  alt="LinkedIn"
                  className="h-[23px] min-h-[6.389vw] w-[23px] min-w-[6.389vw] tablet:h-[3.48vw] tablet:min-h-[3.48vw] tablet:w-[3.48vw] tablet:min-w-[3.48vw]"
                />
                <div
                  className={`${
                    persistedTheme === 'dark' ? 'dark-shadow-input' : ''
                  } mx-2 flex h-[7.3vw] w-[24vw] min-w-[24vw] items-center justify-center rounded-[1.31vw] border border-[#DEE6F7] text-[2.11vw] font-medium leading-normal text-[#000] tablet:mx-[30px] tablet:h-[3.48vw]  tablet:w-[19.9vw] tablet:min-w-[19.9vw] tablet:rounded-[8px] tablet:border-[3px] tablet:text-[1.38vw] laptop:rounded-[15px] dark:text-[#CACACA]`}
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
                    className="container flex w-full"
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
            </div>
            {/* ...........................Twitter......................  */}
            <div className="flex items-center justify-center ">
              <div className="flex items-center justify-center">
                <img
                  src="/assets/profile/Twitter-2x.png"
                  alt="Twitter"
                  className="h-[23px] min-h-[6.389vw] w-[23px] min-w-[6.389vw] tablet:h-[3.48vw] tablet:min-h-[3.48vw] tablet:w-[3.48vw] tablet:min-w-[3.48vw]"
                />
                <div
                  className={`${
                    persistedTheme === 'dark' ? 'dark-shadow-input' : ''
                  } mx-2 flex h-[7.3vw] w-[24vw] min-w-[24vw] items-center justify-center rounded-[1.31vw] border border-[#DEE6F7] text-[2.11vw] font-medium leading-normal text-[#000] tablet:mx-[30px] tablet:h-[3.48vw]  tablet:w-[19.9vw] tablet:min-w-[19.9vw] tablet:rounded-[8px] tablet:border-[3px] tablet:text-[1.38vw] laptop:rounded-[15px] dark:text-[#CACACA]`}
                >
                  <h1>Twitter</h1>
                </div>
                {checkSocial('twitter') ? (
                  <>
                    <Button
                      color={checkSocial('twitter') ? 'red' : 'blue'}
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
                          checkSocial('twitter') && setModalVisible(true);
                        }
                      }}
                    >
                      {checkSocial('twitter') ? 'Remove' : 'Add New Badge'}
                      <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                        {checkSocial('twitter') ? '' : '(+0.96 FDX)'}
                      </span>
                    </Button>
                    <BadgeRemovePopup
                      handleClose={handleBadgesClose}
                      modalVisible={modalVisible}
                      title={'Twitter'}
                      image={'/assets/profile/Twitter-2x.png'}
                      accountName={'twitter'}
                      fetchUser={fetchUser}
                      setFetchUser={setFetchUser}
                    />
                  </>
                ) : persistedUserInfo?.role === 'guest' ? (
                  <Button
                    color={checkSocial('twitter') ? 'red' : 'blue'}
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
                    {checkSocial('twitter') ? 'Remove' : 'Add New Badge'}
                    <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                      {checkSocial('twitter') ? '' : '(+0.96 FDX)'}
                    </span>
                  </Button>
                ) : (
                  // <LoginSocialTwitter
                  //   // isOnlyGetToken
                  //   client_id={import.meta.env.VITE_TWITTER_CONSUMER_KEY}
                  //   onResolve={({ provider, data }) => {
                  //     handleAddBadge(provider, data);
                  //   }}
                  //   redirect_uri={window.location.href}
                  //   scope="users.read%20tweet.read"
                  //   onReject={(err) => {
                  //     toast.error('An error occured while adding badge');
                  //     setIsLoading(false);
                  //     console.log(err);
                  //   }}
                  //   className="container flex w-full"
                  // >
                  //   <Button
                  //     // color={checkSocial('twitter') ? 'red' : 'blue'}
                  //     onClick={() => {
                  //       // setIsLoading(true);
                  //       checkSocial('twitter') && handleRemoveBadge('twitter');
                  //     }}
                  //     disabled={true}
                  //     color="gray"
                  //   >
                  //     {checkSocial('twitter') ? 'Remove' : 'Add New Badge'}
                  //     <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                  //       {checkSocial('twitter') ? '' : '(+0.96 FDX)'}
                  //     </span>
                  //   </Button>
                  // </LoginSocialTwitter>
                  <LoginSocialTwitter
                    client_id={import.meta.env.VITE_TWITTER_CONSUMER_KEY}
                    redirect_uri={window.location.href}
                    onResolve={({ provider, data }) => {
                      console.log(provider, data);
                      setIsLoading(true);
                      handleAddBadge(provider, data);
                    }}
                    onReject={(err) => {
                      toast.error('An error occured while adding badge');
                      setIsLoading(false);
                      console.log(err);
                    }}
                  >
                    <Button
                      color={checkSocial('twitter') ? 'red' : 'blue'}
                      onClick={() => {
                        checkSocial('twitter') && handleRemoveBadge('twitter');
                      }}
                    >
                      {checkSocial('twitter') ? 'Remove' : 'Add New Badge'}
                      <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                        {checkSocial('twitter') ? '' : '(+0.96 FDX)'}
                      </span>
                    </Button>
                  </LoginSocialTwitter>
                )}
              </div>
            </div>
            {/* ...........................Instagram......................  */}
            <div className="flex items-center justify-center">
              <div className="flex items-center justify-center">
                <img
                  src="/assets/profile/Instagram-2x.png"
                  alt="Instagram"
                  className="h-[23px] min-h-[6.389vw] w-[23px] min-w-[6.389vw] tablet:h-[3.48vw] tablet:min-h-[3.48vw] tablet:w-[3.48vw] tablet:min-w-[3.48vw]"
                />
                <div
                  className={`${
                    persistedTheme === 'dark' ? 'dark-shadow-input' : ''
                  } mx-2 flex h-[7.3vw] w-[24vw] min-w-[24vw] items-center justify-center rounded-[1.31vw] border border-[#DEE6F7] text-[2.11vw] font-medium leading-normal text-[#000] tablet:mx-[30px] tablet:h-[3.48vw]  tablet:w-[19.9vw] tablet:min-w-[19.9vw] tablet:rounded-[8px] tablet:border-[3px] tablet:text-[1.38vw] laptop:rounded-[15px] dark:text-[#CACACA]`}
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
                  <LoginSocialInstagram
                    client_id={import.meta.env.VITE_INSTAGRAM_CLIENT_ID}
                    client_secret={import.meta.env.VITE_INSTAGRAM_CLIENT_SECRET}
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
                    className="container flex w-full"
                  >
                    <Button color={checkSocial('instagram') ? 'red' : 'blue'}>
                      {checkSocial('instagram') ? '' : 'Add New Badge'}
                      <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                        {checkSocial('instagram') ? '' : '(+0.96 FDX)'}
                      </span>
                    </Button>
                  </LoginSocialInstagram>
                )}
              </div>
            </div>
            {/* ............................Github......................... */}
            <div className="flex items-center justify-center">
              <div className="flex items-center justify-center">
                <img
                  src="/assets/profile/Github-2x.png"
                  alt="Github"
                  className="h-[23px] min-h-[6.389vw] w-[23px] min-w-[6.389vw] tablet:h-[3.48vw] tablet:min-h-[3.48vw] tablet:w-[3.48vw] tablet:min-w-[3.48vw]"
                />
                <div
                  className={`${
                    persistedTheme === 'dark' ? 'dark-shadow-input' : ''
                  } mx-2 flex h-[7.3vw] w-[24vw] min-w-[24vw] items-center justify-center rounded-[1.31vw] border border-[#DEE6F7] text-[2.11vw] font-medium leading-normal text-[#000] tablet:mx-[30px] tablet:h-[3.48vw]  tablet:w-[19.9vw] tablet:min-w-[19.9vw] tablet:rounded-[8px] tablet:border-[3px] tablet:text-[1.38vw] laptop:rounded-[15px] dark:text-[#CACACA]`}
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
                  <LoginSocialGithub
                    client_id={import.meta.env.VITE_GITHUB_CLIENT_ID}
                    client_secret={import.meta.env.VITE_GITHUB_CLIENT_SECRET}
                    scope="user,email"
                    onResolve={({ provider, data }) => {
                      handleAddBadge(provider, data);
                    }}
                    redirect_uri={window.location.href}
                    onReject={(err) => {
                      toast.error('An error occured while adding badge');
                      setIsLoading(false);
                      console.log(err);
                    }}
                    className="container flex w-full"
                  >
                    <Button color={checkSocial('github') ? 'red' : 'blue'}>
                      {checkSocial('github') ? '' : 'Add New Badge'}
                      <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                        {checkSocial('github') ? '' : '(+0.96 FDX)'}
                      </span>
                    </Button>
                  </LoginSocialGithub>
                )}
              </div>
            </div>
            {/* {socials.map((item, index) => (
          <div className={`flex items-center justify-center  ${item.disabled ? 'opacity-[60%]' : ''}`} key={index}>
            <img
              src={item.image}
              alt={item.title}
              className="h-[6.389vw] w-[6.389vw] tablet:h-[3.48vw] tablet:w-[3.48vw]"
            />
            <div
              className={`${
                persistedTheme === 'dark' ? 'dark-shadow-input' : ''
              } ml-[10px] mr-2 flex h-[7.3vw] w-[24vw] tablet:h-[3.48vw] tablet:w-[19.9vw] items-center justify-center rounded-[1.31vw] tablet:rounded-[8px] laptop:rounded-[15px] text-[2.11vw] tablet:text-[1.38vw] font-medium leading-normal text-[#000] tablet:mx-[30px] dark:text-[#CACACA] border tablet:border-[3px] border-[#DEE6F7]`}
            >
              <h1>{item.title}</h1>
            </div>
            <Button
              color={checkSocial(item.accountName) ? 'red' : item.ButtonColor}
              onClick={() => {
                if (persistedUserInfo?.role === 'guest') {
                  toast.warning(
                    <p>
                      Please{' '}
                      <span
                        className="text-[#389CE3] underline cursor-pointer"
                        onClick={() => navigate('/guest-signup')}
                      >
                        Create an Account
                      </span>{' '}
                      to unlock this feature
                    </p>,
                  );
                  return;
                } else {
                  !checkSocial(item.accountName) && window.open(`${import.meta.env.VITE_API_URL}${item.link}`, '_self');
                  checkSocial(item.accountName) && handleRemoveBadgePopup(item);
                }
              }}
              disabled={item.disabled}
            >
              {checkSocial(item.accountName) ? 'Remove' : item.ButtonText}
              <span className="text-[7px] laptop:text-[13px] font-semibold leading-[1px] pl-[5px] tablet:pl-[3px] laptop:pl-[10px]">
                {checkSocial(item.accountName) ? '' : '(+0.96 FDX)'}
              </span>
            </Button>
          </div>
        ))} */}
            <h1 className="font-500 font-Inter my-[3px] text-[9.74px] font-medium text-[#000] tablet:text-[1.7vw] dark:text-white">
              Web 3
            </h1>
            {web3.map((item, index) => (
              <div className={`flex items-center justify-center  ${item.disabled ? 'opacity-[60%]' : ''}`} key={index}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-[6.389vw] w-[6.389vw] tablet:h-[3.48vw] tablet:w-[3.48vw]"
                />
                <div
                  className={`${
                    persistedTheme === 'dark' ? 'dark-shadow-input' : ''
                  } ml-[10px] mr-2 flex h-[7.3vw] w-[24vw] items-center justify-center rounded-[1.31vw] border border-[#DEE6F7] text-[2.11vw] font-medium leading-normal text-[#000] tablet:mx-[30px] tablet:h-[3.48vw] tablet:w-[19.9vw] tablet:rounded-[8px] tablet:border-[3px] tablet:text-[1.38vw] laptop:rounded-[15px] dark:text-[#CACACA]`}
                >
                  <h1>{item.title}</h1>
                </div>
                <Button
                  color={checkWeb3Badge(item.type) ? 'yellow' : item.ButtonColor}
                  onClick={() => {
                    handleWeb3(item?.title, item?.type);
                  }}
                  // disabled={checkWeb3Badge(item.type)}
                  disabled={true}
                >
                  {checkWeb3Badge(item.type) ? 'Added' : item.ButtonText}
                  {!checkWeb3Badge(item.type) && (
                    <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                      (+0.96 FDX)
                    </span>
                  )}
                </Button>
              </div>
            ))}
            <h1 className="font-500 font-Inter my-[3px] text-[9.74px] font-medium text-[#000] tablet:text-[1.7vw] dark:text-white">
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
