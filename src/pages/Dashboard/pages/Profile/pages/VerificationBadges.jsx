import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/Button';
import { useEffect, useRef, useState } from 'react';
import { addUser } from '../../../../../features/auth/authSlice';
import { userInfo } from '../../../../../services/api/userAuth';
import { useSearchParams } from 'react-router-dom';
import Loader from '../../../../Signup/components/Loader';
import api from '../../../../../services/api/Axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  LoginSocialFacebook,
  LoginSocialInstagram,
  LoginSocialLinkedin,
  LoginSocialTwitter,
  LoginSocialGithub,
} from 'reactjs-social-login';
import PopUp from '../../../../../components/ui/PopUp';
import VerificationPopups from '../components/VerificationPopups';
import BadgeRemovePopup from '../../../../../components/dialogue-boxes/badgeRemovePopup';
import PersonalBadgesPopup from '../../../../../components/dialogue-boxes/PersonalBadgesPopup';

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
  const [deleteModalState, setDeleteModalState] = useState(false);

  // personalBadges
  const [isPersonalPopup, setIsPersonalPopup] = useState(false);
  const [seletedPersonalBadge, setSelectedPersonalBadge] = useState('');

  const handleBadgesClose = () => setModalVisible(false);

  const handleUserInfo = async (id) => {
    try {
      const resp = await userInfo(id);

      if (resp.status === 200) {
        dispatch(addUser(resp.data));
      }

      setFetchUser(resp.data);
    } catch (e) {
      toast.error(e.response.data.message.split(':')[1]);
    }
  };

  const handleSocialBadges = async () => {
    try {
      setIsLoading(true);
      const resp = await api.post('/addBadge/social');
      if (resp.status === 200) {
        handleUserInfo();
        navigate('/profile/verification-badges');
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      navigate('/profile/verification-badges');
      toast.error(e.response.data.message.split(':')[1]);
    }
  };

  useEffect(() => {
    handleUserInfo();
    if (searchParams.get('social')) {
      handleSocialBadges();
    }
  }, []);

  const contacts = [
    {
      image: '/assets/profile/Personal-Email-2xa.png',
      title: 'Personal Email',
      ButtonColor: 'blue',
      ButtonText: 'Add New Badge',
      NoOfButton: 1,
      accountName: 'Gmail',
      type: 'personal',
    },
    {
      image: '/assets/profile/Work-Email-2xa.png',
      title: 'Work Email',
      ButtonColor: 'blue',
      ButtonText: 'Add New Badge',
      NoOfButton: 1,
      accountName: 'Gmail',
      type: 'work',
    },
    {
      image: '/assets/profile/Education-Email-2xa.png',
      title: 'Education Email',
      ButtonColor: 'blue',
      ButtonText: 'Add New Badge',
      NoOfButton: 1,
      accountName: 'Gmail',
      type: 'education',
    },
    {
      image: '/assets/profile/cellphone-1.png',
      title: 'Cell Phone',
      ButtonColor: 'gray',
      ButtonText: 'Add New Badge',
      NoOfButton: 1,
      disabled: true,
    },
  ];

  const socials = [
    {
      image: '/assets/profile/LinkedIn-2x.png',
      title: 'LinkedIn',
      ButtonColor: 'gray',
      ButtonText: 'Add New Badge',
      NoOfButton: 1,
      // link: '/auth/linkedin',
      accountName: 'linkedin',
      disabled: true,
    },
    // {
    //   image: '/assets/profile/Facebook-2x.png',
    //   title: 'Facebook',
    //   ButtonColor: 'blue',
    //   ButtonText: 'Add New Badge',
    //   NoOfButton: 1,
    //   link: '/auth/facebook',
    //   accountName: 'facebook',
    // },
    {
      image: '/assets/profile/Twitter-2x.png',
      title: 'Twitter',
      ButtonColor: 'blue',
      ButtonText: 'Add New Badge',
      NoOfButton: 1,
      link: '/auth/twitter',
      accountName: 'twitter',
    },
    {
      image: '/assets/profile/Instagram-2x.png',
      title: 'Instagram',
      ButtonColor: 'gray',
      ButtonText: 'Add New Badge',
      NoOfButton: 1,
      // link: '/auth/instagram',
      accountName: 'instagram',
      disabled: true,
    },

    {
      image: '/assets/profile/Github-2x.png',
      title: 'Github',
      ButtonColor: 'blue',
      ButtonText: 'Add New Badge',
      NoOfButton: 1,
      link: '/auth/github',
      accountName: 'github',
    },
  ];

  const web3 = [
    {
      image: '/assets/profile/Ethereum-Wallet-2x.png',
      title: 'Ethereum Wallet',
      ButtonColor: 'gray',
      ButtonText: 'Add New Badge',
      NoOfButton: 1,
    },
    {
      image: '/assets/profile/WebAuth-Desktop-2x.png',
      title: 'WebAuth Desktop',
      ButtonColor: 'gray',
      ButtonText: 'Add New Badge',
      NoOfButton: 1,
    },
    {
      image: '/assets/profile/WebAuth-Mobile-2x.png',
      title: 'WebAuth Mobile',
      ButtonColor: 'gray',
      ButtonText: 'Add New Badge',
      NoOfButton: 1,
    },
  ];

  const personal = [
    {
      image: '/assets/profile/firstname.png',
      title: 'First Name',
      ButtonColor: 'blue',
      NoOfButton: 1,
      // NoOfButton: 2,
      ButtonText: 'Add New Badge',
      type: 'firstName',
      disabled: false,
    },
    {
      image: '/assets/profile/lastname.svg',
      title: 'Last Name',
      ButtonColor: 'blue',
      NoOfButton: 1,
      ButtonText: 'Add New Badge',
      type: 'lastName',
      disabled: false,
    },
    {
      image: '/assets/profile/dob.svg',
      title: 'Date of Birth',
      ButtonColor: 'blue',
      NoOfButton: 1,
      ButtonText: 'Add New Badge',
      type: 'dateOfBirth',
      disabled: false,
    },
    {
      image: '/assets/profile/currentcity-1.png',
      title: 'Current City',
      ButtonColor: 'gray',
      ButtonText: 'Add New Badge',
      NoOfButton: 1,
      disabled: true,
    },
    {
      image: '/assets/profile/hometown.svg',
      title: 'Home Town',
      ButtonColor: 'gray',
      ButtonText: 'Add New Badge',
      NoOfButton: 1,
      disabled: true,
    },
    {
      image: '/assets/profile/relationaship-1.png',
      title: 'Relationship Status',
      ButtonColor: 'gray',
      ButtonText: 'Add New Badge',
      NoOfButton: 1,
      disabled: true,
    },
    {
      image: '/assets/profile/work-a.png',
      title: 'Work',
      ButtonColor: 'gray',
      ButtonText: 'Add New Badge',
      NoOfButton: 1,
      disabled: true,
    },
    {
      image: '/assets/profile/education-1.png',
      title: 'Education',
      ButtonColor: 'gray',
      ButtonText: 'Add New Badge',
      NoOfButton: 1,
      disabled: true,
    },
    {
      image: '/assets/profile/Identity-2x-1.png',
      title: 'ID / Passport',
      ButtonColor: 'gray',
      ButtonText: 'Add New Badge',
      NoOfButton: 1,
      disabled: true,
    },
    {
      image: '/assets/profile/Geolocation-2x-1.png',
      title: 'Geolocation',
      ButtonColor: 'gray',
      ButtonText: 'Add New Badge',
      NoOfButton: 1,
      disabled: true,
    },
    {
      image: '/assets/profile/securityquestion-a.png',
      title: 'Security Question',
      ButtonColor: 'gray',
      ButtonText: 'Add New Badge',
      NoOfButton: 1,
      disabled: true,
    },
  ];

  // const checkSocial = (itemType) => {
  //   console.log("🚀 ~ checkSocial ~ itemType:", itemType)
  //   const check = fetchUser?.badges?.some(i => i.accountName === itemType)
  //   console.log("🚀 ~ checkSocial ~ check:", check)
  // }

  const checkPersonal = (itemType) => fetchUser?.badges?.some((i) => i.type === itemType);
  const checkSocial = (itemType) => fetchUser?.badges?.some((i) => i.accountName === itemType);
  const checkPersonalBadge = (itemType) => 
  fetchUser?.badges?.some((badge) => badge?.personal?.hasOwnProperty(itemType) || false) || false;


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
      const addBadge = await api.post(`/addBadge`, {
        data,
        provider,
        badgeAccountId: data.userID,
        uuid: fetchUser.uuid,
      });
      if (addBadge.status === 200) {
        toast.success('Badge Added Successfully!');
        handleUserInfo();
      }
    } catch (error) {
      toast.error(error.response.data.message.split(':')[1]);
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
          <span className="text-[#389CE3] underline cursor-pointer" onClick={() => navigate('/guest-signup')}>
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

  const handleClickPesonalBadges = (type) => {
    if (persistedUserInfo?.role === 'guest') {
      toast.warning(
        <p>
          Please{' '}
          <span className="text-[#389CE3] underline cursor-pointer" onClick={() => navigate('/guest-signup')}>
            Create an Account
          </span>{' '}
          to unlock this feature
        </p>,
      );
      return;
    } else {
      setIsPersonalPopup(true);
      setSelectedPersonalBadge(type);
    }
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

  console.log('first', isPersonalPopup, seletedPersonalBadge);

  return (
    <div className="pb-12">
      {isLoading && <Loader />}
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

      {/* Personal Badges Popup */}
      {isPersonalPopup &&
        (seletedPersonalBadge === 'FirstName' ? (
          <PersonalBadgesPopup
            isPopup={isPersonalPopup}
            setIsPopup={setIsPersonalPopup}
            title="First Name"
            type={'FirstName'}
            logo="/assets/profile/firstname.png"
            placeholder="First Name here"
          />
        ) : seletedPersonalBadge === 'LastName' ? (
          <PersonalBadgesPopup
            isPopup={isPersonalPopup}
            setIsPopup={setIsPersonalPopup}
            title="Last Name"
            type={'LastName'}
            logo="/assets/profile/lastname.png"
            placeholder="Last Name here"
          />
        ) : seletedPersonalBadge === 'DOB' ? (
          <PersonalBadgesPopup
            isPopup={isPersonalPopup}
            setIsPopup={setIsPersonalPopup}
            title="Date of Birth"
            type={'dateOfBirth'}
            logo="/assets/profile/dob.svg"
            placeholder="MM/DD/YYYY"
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

      <h1 className="ml-[32px] text-[12px] font-semibold leading-[14.52px] text-[#4A8DBD] tablet:leading-[30px] tablet:font-semibold tablet:ml-[97px] tablet:text-[25px] dark:text-[#B8B8B8]">
        My Verification Badges
      </h1>
      <div
        className={`${
          persistedTheme === 'dark' ? 'dark-shadow-inside' : 'verification-badge-boxShadow bg-white'
        } relative mx-6 mb-[140px] tablet:mb-[10rem] mt-[10px] flex flex-col gap-[7px] rounded-[13.7px] px-5 pb-[17.57px] pt-[14px] tablet:mt-[35px] tablet:gap-4 laptop:gap-5 tablet:mx-[97px] tablet:rounded-[45px] tablet:px-[90px] tablet:py-[30px]`}
      >
        {/* <div className="absolute -top-[1px] left-[50%] mx-auto flex w-[90%] -translate-x-[50%] transform justify-center gap-[21px] tablet:-top-1 tablet:w-[90%] laptop:w-[95%]">
          <div className="h-[2.94px] w-full rounded-[100px] bg-[#4A8DBD] tablet:h-[11.1px]" />
          <div className="h-[2.94px]  w-full rounded-[100px] bg-[#D9D9D9] tablet:h-[11.1px]" />
          <div className="h-[2.94px]  w-full rounded-[100px] bg-[#D9D9D9] tablet:h-[11.1px]" />
          <div className="h-[2.94px]  w-full rounded-[100px] bg-[#D9D9D9] tablet:h-[11.1px]" />
          <div className="h-[2.94px]  w-full rounded-[100px] bg-[#D9D9D9] tablet:h-[11.1px]" />
          <div className="h-[2.94px]  w-full rounded-[100px] bg-[#D9D9D9] tablet:h-[11.1px]" />
        </div> */}
        <h1 className="font-500 font-Inter text-[9.74px] tablet:text-[1.7vw] font-medium text-[#000] dark:text-white mb-[3px]">
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
              } ml-[10px] mr-2 flex h-[7.3vw] w-[24vw] tablet:h-[3.48vw] tablet:w-[19.9vw] items-center justify-center rounded-[1.31vw] tablet:rounded-[8px] laptop:rounded-[15px] text-[2.11vw] tablet:text-[1.38vw] font-medium leading-normal text-[#000] tablet:mx-[2px] tablet:ml-[30px] tablet:mr-[20px] laptop:ml-[40px] laptop:mr-[30px] dark:text-[#CACACA] border tablet:border-[3px] border-[#DEE6F7]`}
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
              <span className="text-[7px] laptop:text-[13px] font-semibold leading-[1px] pl-[5px] tablet:pl-[3px] laptop:pl-[10px]">
                {checkPersonal(item.type) ? '' : '(+0.96 FDX)'}
              </span>
            </Button>
          </div>
        ))}
        <h1 className="font-500 font-Inter text-[9.74px] tablet:text-[1.7vw] font-medium text-[#000] dark:text-white my-[3px]">
          Social
        </h1>
        {/* ...........................Facebook......................  */}
        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center">
            <img
              src="/assets/profile/Facebook-2x.png"
              alt="Facebook"
              className="min-h-[6.389vw] min-w-[6.389vw] h-[23px] w-[23px] tablet:h-[3.48vw] tablet:w-[3.48vw] tablet:min-w-[3.48vw] tablet:min-h-[3.48vw]"
            />
            <div
              className={`${
                persistedTheme === 'dark' ? 'dark-shadow-input' : ''
              } mx-2 flex h-[7.3vw] w-[24vw] min-w-[24vw] tablet:h-[3.48vw] tablet:min-w-[19.9vw] items-center justify-center rounded-[1.31vw] tablet:rounded-[8px] laptop:rounded-[15px] text-[2.11vw] tablet:text-[1.38vw] tablet:w-[19.9vw] font-medium  leading-normal text-[#000] tablet:mx-[30px] dark:text-[#CACACA] border tablet:border-[3px] border-[#DEE6F7]`}
            >
              <h1>Facebook</h1>
            </div>
            {checkSocial('facebook') ? (
              <>
                <Button
                  color={checkSocial('facebook') ? 'red' : 'blue'}
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
                      checkSocial('facebook') && setModalVisible(true);
                    }
                  }}
                >
                  {checkSocial('facebook') ? 'Remove' : 'Add New Badge'}
                  <span className="text-[7px] laptop:text-[13px] font-semibold leading-[1px] pl-[5px] tablet:pl-[3px] laptop:pl-[10px]">
                    {checkSocial('facebook') ? '' : '(+0.96 FDX)'}
                  </span>
                </Button>
                <BadgeRemovePopup
                  handleClose={handleBadgesClose}
                  modalVisible={modalVisible}
                  title={'Facebook'}
                  image={'/assets/profile/Facebook-2x.png'}
                  accountName={'facebook'}
                  fetchUser={fetchUser}
                  setFetchUser={setFetchUser}
                />
              </>
            ) : persistedUserInfo?.role === 'guest' ? (
              <Button
                color={checkSocial('facebook') ? 'red' : 'blue'}
                onClick={() => {
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
                }}
              >
                {checkSocial('facebook') ? 'Remove' : 'Add New Badge'}
                <span className="text-[7px] laptop:text-[13px] font-semibold leading-[1px] pl-[5px] tablet:pl-[3px] laptop:pl-[10px]">
                  {checkSocial('facebook') ? '' : '(+0.96 FDX)'}
                </span>
              </Button>
            ) : (
              <LoginSocialFacebook
                // isOnlyGetToken
                appId={import.meta.env.VITE_FB_APP_ID}
                onResolve={({ provider, data }) => {
                  handleAddBadge(provider, data);
                }}
                redirect_uri={window.location.href}
                onReject={(err) => {
                  console.log(err);
                }}
                className="container w-full flex"
              >
                <Button
                  color={checkSocial('facebook') ? 'red' : 'blue'}
                  onClick={() => {
                    checkSocial('facebook') && handleRemoveBadge('facebook');
                  }}
                >
                  {checkSocial('facebook') ? 'Remove' : 'Add New Badge'}
                  <span className="text-[7px] laptop:text-[13px] font-semibold leading-[1px] pl-[5px] tablet:pl-[3px] laptop:pl-[10px]">
                    {checkSocial('facebook') ? '' : '(+0.96 FDX)'}
                  </span>
                </Button>
              </LoginSocialFacebook>
            )}
          </div>
        </div>
        {/* ...........................LinkedIn......................  */}
        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center">
            <img
              src="/assets/profile/LinkedIn-2x.png"
              alt="LinkedIn"
              className="min-h-[6.389vw] min-w-[6.389vw] h-[23px] w-[23px] tablet:h-[3.48vw] tablet:w-[3.48vw] tablet:min-w-[3.48vw] tablet:min-h-[3.48vw]"
            />
            <div
              className={`${
                persistedTheme === 'dark' ? 'dark-shadow-input' : ''
              } mx-2 flex h-[7.3vw] w-[24vw] min-w-[24vw] tablet:h-[3.48vw] tablet:min-w-[19.9vw] items-center justify-center rounded-[1.31vw] tablet:rounded-[8px] laptop:rounded-[15px] text-[2.11vw] tablet:text-[1.38vw] tablet:w-[19.9vw] font-medium  leading-normal text-[#000] tablet:mx-[30px] dark:text-[#CACACA] border tablet:border-[3px] border-[#DEE6F7]`}
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
                      checkSocial('linkedin') && setModalVisible(true);
                    }
                  }}
                >
                  {checkSocial('linkedin') ? 'Remove' : 'Add New Badge'}
                  <span className="text-[7px] laptop:text-[13px] font-semibold leading-[1px] pl-[5px] tablet:pl-[3px] laptop:pl-[10px]">
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
                color={checkSocial('facebook') ? 'red' : 'blue'}
                onClick={() => {
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
                }}
              >
                {checkSocial('linkedin') ? 'Remove' : 'Add New Badge'}
                <span className="text-[7px] laptop:text-[13px] font-semibold leading-[1px] pl-[5px] tablet:pl-[3px] laptop:pl-[10px]">
                  {checkSocial('linkedin') ? '' : '(+0.96 FDX)'}
                </span>
              </Button>
            ) : (
              <LoginSocialLinkedin
                // isOnlyGetToken
                client_id={import.meta.env.VITE_LINKEDIN_KEY}
                client_secret={import.meta.env.VITE_LINKEDIN_SECRET}
                onResolve={({ provider, data }) => {
                  handleAddBadge(provider, data);
                }}
                redirect_uri={window.location.href}
                onReject={(err) => {
                  console.log(err);
                }}
                className="container w-full flex"
              >
                <Button
                  color={checkSocial('linkedin') ? 'red' : 'blue'}
                  onClick={() => {
                    checkSocial('linkedin') && handleRemoveBadge('linkedin');
                  }}
                >
                  {console.log(import.meta.env.VITE_LINKEDIN_KEY)}
                  {checkSocial('linkedin') ? 'Remove' : 'Add New Badge'}
                  <span className="text-[7px] laptop:text-[13px] font-semibold leading-[1px] pl-[5px] tablet:pl-[3px] laptop:pl-[10px]">
                    {checkSocial('linkedin') ? '' : '(+0.96 FDX)'}
                  </span>
                </Button>
              </LoginSocialLinkedin>
            )}
          </div>
        </div>
        {/* ...........................Twitter......................  */}
        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center">
            <img
              src="/assets/profile/Twitter-2x.png"
              alt="Twitter"
              className="min-h-[6.389vw] min-w-[6.389vw] h-[23px] w-[23px] tablet:h-[3.48vw] tablet:w-[3.48vw] tablet:min-w-[3.48vw] tablet:min-h-[3.48vw]"
            />
            <div
              className={`${
                persistedTheme === 'dark' ? 'dark-shadow-input' : ''
              } mx-2 flex h-[7.3vw] w-[24vw] min-w-[24vw] tablet:h-[3.48vw] tablet:min-w-[19.9vw] items-center justify-center rounded-[1.31vw] tablet:rounded-[8px] laptop:rounded-[15px] text-[2.11vw] tablet:text-[1.38vw] tablet:w-[19.9vw] font-medium  leading-normal text-[#000] tablet:mx-[30px] dark:text-[#CACACA] border tablet:border-[3px] border-[#DEE6F7]`}
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
                      checkSocial('twitter') && setModalVisible(true);
                    }
                  }}
                >
                  {checkSocial('twitter') ? 'Remove' : 'Add New Badge'}
                  <span className="text-[7px] laptop:text-[13px] font-semibold leading-[1px] pl-[5px] tablet:pl-[3px] laptop:pl-[10px]">
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
                        className="text-[#389CE3] underline cursor-pointer"
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
                <span className="text-[7px] laptop:text-[13px] font-semibold leading-[1px] pl-[5px] tablet:pl-[3px] laptop:pl-[10px]">
                  {checkSocial('twitter') ? '' : '(+0.96 FDX)'}
                </span>
              </Button>
            ) : (
              <LoginSocialTwitter
                // isOnlyGetToken
                client_id={import.meta.env.VITE_TWITTER_CONSUMER_KEY}
                onResolve={({ provider, data }) => {
                  handleAddBadge(provider, data);
                }}
                redirect_uri={window.location.href}
                onReject={(err) => {
                  console.log(err);
                }}
                className="container w-full flex"
              >
                <Button
                  color={checkSocial('twitter') ? 'red' : 'blue'}
                  onClick={() => {
                    checkSocial('twitter') && handleRemoveBadge('twitter');
                  }}
                >
                  {checkSocial('twitter') ? 'Remove' : 'Add New Badge'}
                  <span className="text-[7px] laptop:text-[13px] font-semibold leading-[1px] pl-[5px] tablet:pl-[3px] laptop:pl-[10px]">
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
              className="min-h-[6.389vw] min-w-[6.389vw] h-[23px] w-[23px] tablet:h-[3.48vw] tablet:w-[3.48vw] tablet:min-w-[3.48vw] tablet:min-h-[3.48vw]"
            />
            <div
              className={`${
                persistedTheme === 'dark' ? 'dark-shadow-input' : ''
              } mx-2 flex h-[7.3vw] w-[24vw] min-w-[24vw] tablet:h-[3.48vw] tablet:min-w-[19.9vw] items-center justify-center rounded-[1.31vw] tablet:rounded-[8px] laptop:rounded-[15px] text-[2.11vw] tablet:text-[1.38vw] tablet:w-[19.9vw] font-medium  leading-normal text-[#000] tablet:mx-[30px] dark:text-[#CACACA] border tablet:border-[3px] border-[#DEE6F7]`}
            >
              <h1>Instagram</h1>
            </div>
            {checkSocial('instagram') ? (
              <>
                <Button
                  color={checkSocial('instagram') ? 'red' : 'blue'}
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
                      checkSocial('instagram') && setModalVisible(true);
                    }
                  }}
                >
                  {checkSocial('instagram') ? 'Remove' : 'Add New Badge'}
                  <span className="text-[7px] laptop:text-[13px] font-semibold leading-[1px] pl-[5px] tablet:pl-[3px] laptop:pl-[10px]">
                    {checkSocial('instagram') ? '' : '(+0.96 FDX)'}
                  </span>
                </Button>
                <BadgeRemovePopup
                  handleClose={handleBadgesClose}
                  modalVisible={modalVisible}
                  title={'Instagram'}
                  image={'/assets/profile/Instagram-2x.png'}
                  accountName={'instagram'}
                  fetchUser={fetchUser}
                  setFetchUser={setFetchUser}
                />
              </>
            ) : persistedUserInfo?.role === 'guest' ? (
              <Button
                color={checkSocial('instagram') ? 'red' : 'blue'}
                onClick={() => {
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
                }}
              >
                {checkSocial('instagram') ? 'Remove' : 'Add New Badge'}
                <span className="text-[7px] laptop:text-[13px] font-semibold leading-[1px] pl-[5px] tablet:pl-[3px] laptop:pl-[10px]">
                  {checkSocial('instagram') ? '' : '(+0.96 FDX)'}
                </span>
              </Button>
            ) : (
              <LoginSocialInstagram
                client_id={import.meta.env.VITE_INSTAGRAM_CLIENT_ID}
                client_secret={import.meta.env.VITE_INSTAGRAM_CLIENT_SECRET}
                onResolve={({ provider, data }) => {
                  handleAddBadge(provider, data);
                }}
                redirect_uri={window.location.href}
                onReject={(err) => {
                  console.log(err);
                }}
                className="container w-full flex"
              >
                <Button
                  color={checkSocial('instagram') ? 'red' : 'blue'}
                  onClick={() => {
                    checkSocial('instagram') && handleRemoveBadge('instagram');
                  }}
                >
                  {checkSocial('instagram') ? 'Remove' : 'Add New Badge'}
                  <span className="text-[7px] laptop:text-[13px] font-semibold leading-[1px] pl-[5px] tablet:pl-[3px] laptop:pl-[10px]">
                    {checkSocial('instagram') ? '' : '(+0.96 FDX)'}
                  </span>
                </Button>
              </LoginSocialInstagram>
            )}
          </div>
        </div>
        {/* ...................................5......................... */}
        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center">
            <img
              src="/assets/profile/Github-2x.png"
              alt="Github"
              className="min-h-[6.389vw] min-w-[6.389vw] h-[23px] w-[23px] tablet:h-[3.48vw] tablet:w-[3.48vw] tablet:min-w-[3.48vw] tablet:min-h-[3.48vw]"
            />
            <div
              className={`${
                persistedTheme === 'dark' ? 'dark-shadow-input' : ''
              } mx-2 flex h-[7.3vw] w-[24vw] min-w-[24vw] tablet:h-[3.48vw] tablet:min-w-[19.9vw] items-center justify-center rounded-[1.31vw] tablet:rounded-[8px] laptop:rounded-[15px] text-[2.11vw] tablet:text-[1.38vw] tablet:w-[19.9vw] font-medium  leading-normal text-[#000] tablet:mx-[30px] dark:text-[#CACACA] border tablet:border-[3px] border-[#DEE6F7]`}
            >
              <h1>Github</h1>
            </div>
            {checkSocial('github') ? (
              <>
                <Button
                  color={checkSocial('github') ? 'red' : 'blue'}
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
                      checkSocial('github') && setModalVisible(true);
                    }
                  }}
                >
                  {checkSocial('github') ? 'Remove' : 'Add New Badge'}
                  <span className="text-[7px] laptop:text-[13px] font-semibold leading-[1px] pl-[5px] tablet:pl-[3px] laptop:pl-[10px]">
                    {checkSocial('github') ? '' : '(+0.96 FDX)'}
                  </span>
                </Button>
                <BadgeRemovePopup
                  handleClose={handleBadgesClose}
                  modalVisible={modalVisible}
                  title={'Github'}
                  image={'/assets/profile/Github-2x.png'}
                  accountName={'github'}
                  fetchUser={fetchUser}
                  setFetchUser={setFetchUser}
                />
              </>
            ) : persistedUserInfo?.role === 'guest' ? (
              <Button
                color={checkSocial('github') ? 'red' : 'blue'}
                onClick={() => {
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
                }}
              >
                {checkSocial('github') ? 'Remove' : 'Add New Badge'}
                <span className="text-[7px] laptop:text-[13px] font-semibold leading-[1px] pl-[5px] tablet:pl-[3px] laptop:pl-[10px]">
                  {checkSocial('github') ? '' : '(+0.96 FDX)'}
                </span>
              </Button>
            ) : (
              <LoginSocialGithub
                client_id={import.meta.env.VITE_GITHUB_CLIENT_ID}
                client_secret={import.meta.env.VITE_GITHUB_CLIENT_SECRET}
                onResolve={({ provider, data }) => {
                  handleAddBadge(provider, data);
                }}
                redirect_uri={window.location.href}
                onReject={(err) => {
                  console.log(err);
                }}
                className="container w-full flex"
              >
                <Button
                  color={checkSocial('github') ? 'red' : 'blue'}
                  onClick={() => {
                    checkSocial('github') && handleRemoveBadge('github');
                  }}
                >
                  {checkSocial('github') ? 'Remove' : 'Add New Badge'}
                  <span className="text-[7px] laptop:text-[13px] font-semibold leading-[1px] pl-[5px] tablet:pl-[3px] laptop:pl-[10px]">
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
        <h1 className="font-500 font-Inter text-[9.74px] tablet:text-[1.7vw] font-medium text-[#000] dark:text-white my-[3px]">
          Web 3
        </h1>
        {web3.map((item, index) => (
          <div className="flex items-center justify-center  opacity-[60%]" key={index}>
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
            <Button color={item.ButtonColor}>
              {item.ButtonText}{' '}
              <span className="text-[7px] laptop:text-[13px] font-semibold leading-[1px] pl-[5px] tablet:pl-[3px] laptop:pl-[10px]">
                (+0.96 FDX)
              </span>
            </Button>
          </div>
        ))}
        <h1 className="font-500 font-Inter text-[9.74px] tablet:text-[1.7vw] font-medium text-[#000] dark:text-white my-[3px]">
          Personal
        </h1>
        {personal.map((item, index) => (
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
            {/* {item.NoOfButton !== 1 ? (
              <div className="flex w-[19.9vw] justify-between  tablet:mr-[18.5px]">
                <button className="rounded-[1.31vw] h-[5.8vw] w-[45%] bg-[#FAD308] text-[1.38vw] text-white tablet:rounded-[12.6px] laptop:rounded-[23px] dark:bg-[#FAD308]">
                  Edit
                </button>
                <button className="h-[5.8vw] w-[52%] rounded-[1.31vw]  bg-[#FF4057] text-[1.38vw] text-white tablet:rounded-[12.6px] laptop:rounded-[23px] dark:bg-[#C13232]">
                  Remove
                </button>
              </div>
            ) : (
              <Button color={item.ButtonColor}>{item.ButtonText}</Button>
            )} */}
            <Button
              color={checkPersonalBadge(item.type) ? 'yellow' : item.ButtonColor}
              onClick={() =>
                !checkPersonal(item.type) && item.ButtonColor !== 'gray' && handleClickPesonalBadges(item.type)
              }
            >
              {console.log(item.type)}
              {checkPersonalBadge(item.type) ? 'Added' : item.ButtonText}
              <span className="text-[7px] laptop:text-[13px] font-semibold leading-[1px] pl-[5px] tablet:pl-[3px] laptop:pl-[10px]">
                (+0.96 FDX)
              </span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerificationBadges;
