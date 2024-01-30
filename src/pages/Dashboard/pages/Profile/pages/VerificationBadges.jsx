import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/Button';
import { useEffect, useState } from 'react';
import { addUser } from '../../../../../features/auth/authSlice';
import { userInfo } from '../../../../../services/api/userAuth';
import { useSearchParams } from 'react-router-dom';
import Loader from '../../../../Signup/components/Loader';
import api from '../../../../../services/api/Axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { LoginSocialFacebook } from 'reactjs-social-login';

const VerificationBadges = () => {
  const navigate = useNavigate();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [fetchUser, setFetchUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
      image: '/assets/profile/Personal-Email-2x.png',
      title: 'Personal Email',
      ButtonColor: 'blue',
      ButtonText: 'Add New Badge',
      NoOfButton: 1,
      accountName: 'Gmail',
      type: 'personal',
    },
    {
      image: '/assets/profile/Work-Email-2x.png',
      title: 'Work Email',
      ButtonColor: 'blue',
      ButtonText: 'Add New Badge',
      NoOfButton: 1,
      accountName: 'Gmail',
      type: 'work',
    },
    {
      image: '/assets/profile/Education-Email-2x.png',
      title: 'Education Email',
      ButtonColor: 'blue',
      ButtonText: 'Add New Badge',
      NoOfButton: 1,
      accountName: 'Gmail',
      type: 'education',
    },
    {
      image: '/assets/profile/cellphone.png',
      title: 'Cell Phone',
      ButtonColor: 'blue',
      ButtonText: 'Add New Badge',
      NoOfButton: 1,
    },
  ];
  const socials = [
    {
      image: '/assets/profile/LinkedIn-2x.png',
      title: 'LinkedIn',
      ButtonColor: 'blue',
      ButtonText: 'Add New Badge',
      NoOfButton: 1,
      link: '/auth/linkedin',
      accountName: 'linkedin',
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
      ButtonColor: 'blue',
      ButtonText: 'Add New Badge',
      NoOfButton: 1,
      link: '/auth/instagram',
      accountName: 'instagram',
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
      ButtonColor: 'blue',
      ButtonText: 'Add New Badge',
      NoOfButton: 1,
    },
    {
      image: '/assets/profile/WebAuth-Desktop-2x.png',
      title: 'WebAuth Desktop',
      ButtonColor: 'blue',
      ButtonText: 'Add New Badge',
      NoOfButton: 1,
    },
    {
      image: '/assets/profile/WebAuth-Mobile-2x.png',
      title: 'WebAuth Mobile',
      ButtonColor: 'blue',
      ButtonText: 'Add New Badge',
      NoOfButton: 1,
    },
  ];

  const personal = [
    {
      image: '/assets/profile/firstname.png',
      title: 'First Name',
      NoOfButton: 2,
    },
    {
      image: '/assets/profile/lastname.svg',
      title: 'Last Name',
      NoOfButton: 2,
    },
    {
      image: '/assets/profile/currentcity.png',
      title: 'Current City',
      ButtonColor: 'blue',
      ButtonText: 'Add New Badge',
      NoOfButton: 1,
    },
    {
      image: '/assets/profile/hometown.svg',
      title: 'Home Town',
      ButtonColor: 'blue',
      ButtonText: 'Add New Badge',
      NoOfButton: 1,
    },
    {
      image: '/assets/profile/relationaship.png',
      title: 'Relationship Status',
      ButtonColor: 'blue',
      ButtonText: 'Add New Badge',
      NoOfButton: 1,
    },
    {
      image: '/assets/profile/work.png',
      title: 'Work',
      ButtonColor: 'blue',
      ButtonText: 'Add New Badge',
      NoOfButton: 1,
    },
    {
      image: '/assets/profile/education.png',
      title: 'Education',
      ButtonColor: 'blue',
      ButtonText: 'Add New Badge',
      NoOfButton: 1,
    },
    {
      image: '/assets/profile/Identity-2x.png',
      title: 'ID / Passport',
      ButtonColor: 'blue',
      ButtonText: 'Add New Badge',
      NoOfButton: 1,
    },
    {
      image: '/assets/profile/Geolocation-2x.png',
      title: 'Geolocation',
      ButtonColor: 'blue',
      ButtonText: 'Add New Badge',
      NoOfButton: 1,
    },
    {
      image: '/assets/profile/securityquestion.png',
      title: 'Security Question',
      ButtonColor: 'blue',
      ButtonText: 'Add New Badge',
      NoOfButton: 1,
    },
  ];

  const checkPersonal = (itemType) => fetchUser?.badges?.some((i) => i.type === itemType);

  // const checkSocial = (itemType) => {
  //   console.log("🚀 ~ checkSocial ~ itemType:", itemType)
  //   const check = fetchUser?.badges?.some(i => i.accountName === itemType)
  //   console.log("🚀 ~ checkSocial ~ check:", check)
  // }

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
  return (
    <div className="pb-12">
      {isLoading && <Loader />}
      <h1 className="mb-[25px] ml-[26px] mt-[6px] text-[12px] font-bold leading-normal text-[#4A8DBD] tablet:mb-[54px] tablet:ml-[46px] tablet:text-[24.99px] tablet:font-semibold laptop:ml-[156px] laptop:text-[32px] dark:text-[#B8B8B8]">
        My Verification Badges
      </h1>
      <div
        className={`${
          persistedTheme === 'dark' ? 'dark-shadow-inside' : 'shadow-inside'
        } relative mx-6 mb-[54px] mt-4 flex flex-col gap-[5.91px] rounded-[11.918px] px-[14.3px] pb-[17.57px] pt-[23px] tablet:mx-6 tablet:my-[54px] tablet:gap-[23px] tablet:rounded-[24.8px] tablet:px-[29.7px] tablet:py-[48.4px] laptop:mx-[106px] laptop:rounded-[45px] laptop:px-[60px] laptop:pb-[66.8px] laptop:pt-[104px]`}
      >
        <div className="absolute -top-[3px] left-[50%] mx-auto flex w-[90%] -translate-x-[50%] transform justify-center gap-[21px] tablet:-top-1 tablet:w-[90%] laptop:w-[95%]">
          <div className="h-[2.94px] w-full rounded-[100px] bg-[#4A8DBD] tablet:h-[11.1px]" />
          <div className="h-[2.94px]  w-full rounded-[100px] bg-[#D9D9D9] tablet:h-[11.1px]" />
          <div className="h-[2.94px]  w-full rounded-[100px] bg-[#D9D9D9] tablet:h-[11.1px]" />
          <div className="h-[2.94px]  w-full rounded-[100px] bg-[#D9D9D9] tablet:h-[11.1px]" />
          <div className="h-[2.94px]  w-full rounded-[100px] bg-[#D9D9D9] tablet:h-[11.1px]" />
          <div className="h-[2.94px]  w-full rounded-[100px] bg-[#D9D9D9] tablet:h-[11.1px]" />
        </div>
        <h1 className="font-500 font-Inter ml-[3.5vw] text-[2.22vw] font-normal text-[#000] dark:text-white">
          Contact
        </h1>
        {contacts.map((item, index) => (
          <div className="flex items-center justify-center gap-[5px] tablet:gap-[10.59px]" key={index}>
            <img
              src={item.image}
              alt={item.title}
              className="h-[19.4px] w-[19.4px] tablet:h-[40.6px] tablet:w-[40.6px] laptop:h-[74px] laptop:w-[74px]"
            />
            <div
              className={`${
                persistedTheme === 'dark' ? 'dark-shadow-input' : 'shadow-inside'
              } mx-2  flex h-[5.8vw] w-[19.9vw] items-center justify-center rounded-[1.31vw] text-[1.73vw]  font-medium  leading-normal text-[#000] tablet:mx-[2px] laptop:mx-[30px] dark:text-[#CACACA] `}
            >
              <h1>{item.title}</h1>
            </div>
            <Button color={checkPersonal(item.type) ? 'yellow' : item.ButtonColor}>
              {checkPersonal(item.type) ? 'Primary' : item.ButtonText}
            </Button>
          </div>
        ))}
        <h1 className="font-500 font-Inter ml-[3.5vw] text-[2.22vw] font-normal text-[#000] dark:text-white">Social</h1>
        <div className="flex items-center justify-center">
          <div className="flex gap-[5px] tablet:gap-[10.59px] items-end justify-center">
            <img
              src="/assets/profile/Facebook-2x.png"
              alt={'Facebook'}
              className="h-[19.4px] w-[19.4px] tablet:h-[40.6px] tablet:w-[40.6px] laptop:h-[74px] laptop:w-[74px]"
            />
            <div
              className={`${
                persistedTheme === 'dark' ? 'dark-shadow-input' : 'shadow-inside'
              } mx-2  flex h-[5.8vw] min-w-[19.9vw] items-center justify-center rounded-[1.31vw] text-[1.73vw]  font-medium  leading-normal text-[#000] tablet:mx-[2px] laptop:mx-[30px] dark:text-[#CACACA] `}
            >
              <h1>{'Facebook'}</h1>
            </div>
            {checkSocial('facebook') ? (
              <Button
                color={checkSocial('facebook') ? 'red' : 'blue'}
                onClick={() => {
                  checkSocial('facebook') && handleRemoveBadge('facebook');
                }}
              >
                {checkSocial('facebook') ? 'Remove' : 'Add New Badge'}
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
                className="container w-full"
              >
                <Button
                  color={checkSocial('facebook') ? 'red' : 'blue'}
                  onClick={() => {
                    checkSocial('facebook') && handleRemoveBadge('facebook');
                  }}
                >
                  {checkSocial('facebook') ? 'Remove' : 'Add New Badge'}
                </Button>
              </LoginSocialFacebook>
            )}
          </div>
        </div>

        {socials.map((item, index) => (
          <div className="flex items-center justify-center gap-[5px] tablet:gap-[10.59px]" key={index}>
            <img
              src={item.image}
              alt={item.title}
              className="h-[19.4px] w-[19.4px] tablet:h-[40.6px] tablet:w-[40.6px] laptop:h-[74px] laptop:w-[74px]"
            />
            <div
              className={`${
                persistedTheme === 'dark' ? 'dark-shadow-input' : 'shadow-inside'
              } mx-2  flex h-[5.8vw] w-[19.9vw] items-center justify-center rounded-[1.31vw] text-[1.73vw]  font-medium  leading-normal text-[#000] tablet:mx-[2px] laptop:mx-[30px] dark:text-[#CACACA] `}
            >
              <h1>{item.title}</h1>
            </div>
            <Button
              color={checkSocial(item.accountName) ? 'red' : item.ButtonColor}
              onClick={() => {
                !checkSocial(item.accountName) && window.open(`${import.meta.env.VITE_API_URL}${item.link}`, '_self');
                checkSocial(item.accountName) && handleRemoveBadge(item.accountName);
              }}
            >
              {checkSocial(item.accountName) ? 'Remove' : item.ButtonText}
            </Button>
          </div>
        ))}
        <h1 className="font-500 font-Inter ml-[3.5vw] text-[2.22vw] font-normal text-[#000] dark:text-white">Web 3</h1>
        {web3.map((item, index) => (
          <div className="flex items-center justify-center gap-[5px] tablet:gap-[10.59px]" key={index}>
            <img
              src={item.image}
              alt={item.title}
              className="h-[19.4px] w-[19.4px] tablet:h-[40.6px] tablet:w-[40.6px] laptop:h-[74px] laptop:w-[74px]"
            />
            <div
              className={`${
                persistedTheme === 'dark' ? 'dark-shadow-input' : 'shadow-inside'
              } mx-2  flex h-[5.8vw] w-[19.9vw] items-center justify-center rounded-[1.31vw] text-[1.73vw]  font-medium  leading-normal text-[#000] tablet:mx-[2px] laptop:mx-[30px] dark:text-[#CACACA] `}
            >
              <h1>{item.title}</h1>
            </div>
            <Button color={item.ButtonColor}>{item.ButtonText}</Button>
          </div>
        ))}
        <h1 className="font-500 font-Inter ml-[3.5vw] text-[2.22vw] font-normal text-[#000] dark:text-white ">
          Personal
        </h1>
        {personal.map((item, index) => (
          <div className="flex items-center justify-center gap-[5px] tablet:gap-[10.59px]" key={index}>
            <img
              src={item.image}
              alt={item.title}
              className="h-[19.4px] w-[19.4px] tablet:h-[40.6px] tablet:w-[40.6px] laptop:h-[74px] laptop:w-[74px]"
            />
            <div
              className={`${
                persistedTheme === 'dark' ? 'dark-shadow-input' : 'shadow-inside'
              } mx-2  flex h-[5.8vw] w-[19.9vw] items-center justify-center rounded-[1.31vw] text-[1.73vw]  font-medium  leading-normal text-[#000] tablet:mx-[2px] laptop:mx-[30px] dark:text-[#CACACA] `}
            >
              <h1>{item.title}</h1>
            </div>
            {item.NoOfButton !== 1 ? (
              <div className="flex w-[19.9vw] justify-between  tablet:mr-[18.5px]">
                <button className="rounded-[1.31vw]] h-[5.8vw] w-[45%] bg-[#FAD308] text-[1.73vw] text-white tablet:rounded-[12.6px] laptop:rounded-[23px] dark:bg-[#FAD308]">
                  Edit
                </button>
                <button className="h-[5.8vw] w-[52%] rounded-[1.31vw]  bg-[#FF4057] text-[1.73vw] text-white tablet:rounded-[12.6px] laptop:rounded-[23px] dark:bg-[#C13232]">
                  Remove
                </button>
              </div>
            ) : (
              <Button color={item.ButtonColor}>{item.ButtonText}</Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerificationBadges;
