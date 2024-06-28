import { LoginSocialGithub, LoginSocialGoogle, LoginSocialLinkedin } from 'reactjs-social-login';
import { useSelector } from 'react-redux';
import Button from './Button';
import { GithubAuthProvider, TwitterAuthProvider, signInWithPopup } from 'firebase/auth';
import { authentication } from '../pages/Dashboard/pages/Profile/pages/firebase-config';
import { InstagramLogin } from '@amraneze/react-instagram-login';
// import { LoginSocialLinkedin } from '../pages/Dashboard/pages/Profile/pages/ReactLinkedIn';
import { LoginSocialFacebook } from '../pages/Dashboard/pages/Profile/pages/ReactFacebook';
import showToast from './ui/Toast';
import { useRef } from 'react';

// const REDIRECT_URI = window.location.href;

const SocialLogins = ({
  setProvider,
  setProfile,
  handleSignUpSocial,
  handleSignInSocial,
  setIsLoadingSocial,
  handleReferralOpen,
  setClickedButtonName,
  googleRef,
  fbRef,
  linkedInRef,
  instaRef,
  githubRef,
  isLogin,
  triggerLogin,
  RedirectURL,
}) => {
  // const persistedTheme = useSelector((state) => state.utils.theme);

  // const loginWithTwitter = () => {
  //   const provider = new TwitterAuthProvider();
  //   console.log(authentication);
  //   signInWithPopup(authentication, provider)
  //     .then((data) => {
  //       console.log('twitter data', data);
  //       setProvider('twitter');
  //       setProfile(data);
  //       isLogin ? handleSignInSocial(data, 'twitter') : handleSignUpSocial(data, 'twitter');
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  // const loginWithGithub = () => {
  //   const provider = new GithubAuthProvider();
  //   signInWithPopup(authentication, provider)
  //     .then((data) => {
  //       console.log('github data', data);
  //       setProvider('github');
  //       setProfile(data);
  //       isLogin ? handleSignInSocial(data, 'github') : handleSignUpSocial(data, 'github');
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  // const loginInWithInsta = async (code) => {
  //   try {
  //     const response = await fetch(`${import.meta.env.VITE_API_URL}/user/get-insta-token`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         clientId: import.meta.env.VITE_INSTAGRAM_CLIENT_ID,
  //         clientSecret: import.meta.env.VITE_INSTAGRAM_CLIENT_SECRET,
  //         redirectUri: isLogin
  //           ? `${import.meta.env.VITE_CLIENT_URL}/signin`
  //           : `${import.meta.env.VITE_CLIENT_URL}/signup`,
  //         code: code,
  //       }),
  //     });
  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log('instagaram data', data);
  //       setProvider('instagram');
  //       setProfile(data);
  //       isLogin ? handleSignInSocial(data, 'instagram') : handleSignUpSocial(data, 'instagram');
  //     } else {
  //       const data = await response.json();
  //       console.error('Error fetching Instagram profile:', data);
  //     }
  //   } catch (error) {
  //     console.log({ error });
  //     console.error('Error fetching Instagram profile:', error.message);
  //   }
  // };

  return (
    <div className="mb-2 flex flex-col gap-2 rounded-[6.043px] 2xl:rounded-[11.703px] laptop:mb-[1.56rem] laptop:justify-between laptop:gap-[1.56rem]">
      <div ref={googleRef}>
        <LoginSocialGoogle
          // isOnlyGetToken
          client_id={import.meta.env.VITE_GG_APP_ID}
          redirect_uri={RedirectURL}
          scope="openid profile email"
          iscoveryDocs="claims_supported"
          // access_type="offline"
          onResolve={({ provider, data }) => {
            setProvider(provider);
            setProfile(data);
            data['provider'] = provider;
            isLogin ? handleSignInSocial(data, provider) : handleSignUpSocial(data, provider);
          }}
          onReject={(err) => {
            setIsLoadingSocial(false);
            console.log('err', err);
          }}
          className="max-w-auto min-w-[145px] lg:min-w-[305px] "
        ></LoginSocialGoogle>
        <Button
          size="login-btn"
          color="gray"
          onClick={() => {
            if (isLogin) {
              triggerLogin('google');
            } else {
              setClickedButtonName('google');
              handleReferralOpen();
            }
          }}
        >
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/google.svg`}
            className="mr-2 h-[22px] w-[22px] md:h-12 md:w-[32px] lg:mr-3"
          />
          Google
        </Button>
      </div>
      {/* <div ref={fbRef}>

        <LoginSocialFacebook
          // isOnlyGetToken
          client_id={import.meta.env.VITE_FB_APP_ID}
          onResolve={({ provider, data }) => {
            console.log(provider);
            setProvider(provider);
            setProfile(data);
            isLogin ? handleSignInSocial(data, provider) : handleSignUpSocial(data, provider);
          }}
          redirect_uri={RedirectURL}
          onReject={(err) => {
                        setIsLoadingSocial(false);

            console.log(err);
          }}
          className="max-w-auto min-w-[145px] lg:min-w-[305px] "
        >
        </LoginSocialFacebook>

        <Button
          size="login-btn"
          color="gray"
          onClick={() => {
            if (isLogin) {

              triggerLogin('facebook')
            } else {
              setClickedButtonName('facebook');
              handleReferralOpen();
            }
          }}
        >
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/facebook-white.svg`}
            className="mr-2 h-[22px] w-[22px] md:h-12 md:w-[32px] lg:mr-3"
          />
          Facebook
        </Button>

      </div> */}

      {/*<div ref={instaRef}>
       <div className="max-w-auto min-w-[145px] lg:min-w-[305px] ">
        <InstagramLogin
          clientId={import.meta.env.VITE_INSTAGRAM_CLIENT_ID}
          onSuccess={(code) => {
            console.log(code), loginInWithInsta(code);
          }}
          onFailure={(err) =>{
             console.log('error', err)}
                         setIsLoadingSocial(false);
}
          redirectUri={window.location.href}
          cssClass={'hideBack'}
        >
         
        </InstagramLogin>
      </div>
       <Button size="login-btn" color="gray" className="w-full min-w-[145px] lg:min-w-[305px] ">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Instagram-2x.png`}
              className="mr-2 size-[22px] md:size-8 lg:mr-3"
            />
            Instagram
          </Button>
      </div > */}

      {/* <div className="max-w-auto min-w-[145px] lg:min-w-[305px] ">
        <Button
          size="login-btn"
          color="gray"
          onClick={() => {
            if (isLogin) {
              triggerLogin('twitter');
            } else {
              setClickedButtonName('twitter');
              handleReferralOpen();
            }
          }}
        >
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Twitter-2x.png`}
            className="mr-2 size-[22px] md:size-8 lg:mr-3"
          />
          Twitter
        </Button>
      </div> */}
      {/* <div ref={linkedInRef}> */}
      {/* <LoginSocialLinkedin
          // isOnlyGetToken
          client_id={import.meta.env.VITE_LINKEDIN_KEY}
          client_secret={import.meta.env.VITE_LINKEDIN_SECRET}
          onResolve={({ provider, data }) => {
            console.log(provider);
            setProvider(provider);
            setProfile(data);
            isLogin ? handleSignInSocial(data, provider) : handleSignUpSocial(data, provider);
          }}
          redirect_uri={RedirectURL}
          // scope="email,openid,profile,w_member_social"
          onReject={(err) => {
            console.log(err);
            if (err === 'Popup closed without completing login.') {
              setIsLoadingSocial(false);
              return
            }
            setIsLoadingSocial(false);
            console.log('err', err);
            showToast('error', 'generalError');
          }} */}
      {/* ></LoginSocialLinkedin> */}

      {/* <LoginSocialLinkedin
          scope="openid,profile,email"
          client_id={import.meta.env.VITE_LINKEDIN_KEY}
          client_secret={import.meta.env.VITE_LINKEDIN_SECRET}
          onResolve={({ provider, data }) => {
            console.log(provider);
            setProvider(provider);
            setProfile(data);
            isLogin ? handleSignInSocial(data, provider) : handleSignUpSocial(data, provider);
          }}
          redirect_uri={RedirectURL}
          onReject={(err) => {
            setIsLoadingSocial(false);
            console.log('err', err);
            showToast('error', 'generalError');
          }}
        ></LoginSocialLinkedin>

        <Button
          size="login-btn"
          color="gray"
          onClick={() => {
            if (isLogin) {
              triggerLogin('linkedin');
            } else {
              setClickedButtonName('linkedin');
              handleReferralOpen();
            }
          }}
        >
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/LinkedIn-2x.png`}
            alt="LinkedIn"
            className="mr-2 size-[22px] md:size-8 lg:mr-3"
          />
          LinkedIn
        </Button>
      </div> */}
      {/* <div className="max-w-auto min-w-[145px] lg:min-w-[305px] ">
        <Button
          size="login-btn"
          color="gray"
          onClick={() => {
            if (isLogin) {
              triggerLogin('github');
            } else {
              setClickedButtonName('github');
              handleReferralOpen();
            }
          }}
        >
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Github-2x.png`}
            className="mr-2 size-[22px] md:size-8 lg:mr-3"
          />
          Github
        </Button>
      </div> */}

      <div ref={githubRef}>
        <LoginSocialGithub
          client_id={import.meta.env.VITE_GITHUB_CLIENT_ID}
          client_secret={import.meta.env.VITE_GITHUB_CLIENT_SECRET}
          redirect_uri={RedirectURL}
          onResolve={({ provider, data }) => {
            setProvider(provider);
            setProfile(data);
            isLogin ? handleSignInSocial(data, provider) : handleSignUpSocial(data, provider);
          }}
          onReject={(err) => {
            setIsLoadingSocial(false);
            console.log('err', err);
            showToast('error', 'generalError');
          }}
        ></LoginSocialGithub>

        <Button
          size="login-btn"
          color="gray"
          onClick={() => {
            if (isLogin) {
              triggerLogin('github');
            } else {
              setClickedButtonName('github');
              handleReferralOpen();
            }
          }}
        >
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Github-2x.png`}
            alt="Github"
            className="mr-2 size-[22px] md:size-8 lg:mr-3"
          />
          Github
        </Button>
      </div>

      {/* <LoginSocialLinkedin
        // isOnlyGetToken
        client_id={import.meta.env.VITE_LINKEDIN_KEY}
        client_secret={import.meta.env.VITE_LINKEDIN_SECRET}
        onResolve={({ provider, data }) => {
          console.log(provider);
          setProvider(provider);
          setProfile(data);
          isLogin ? handleSignInSocial(data, provider) : handleSignUpSocial(data, provider);
        }}
        // scope="email,openid,profile,w_member_social"
        redirect_uri={RedirectURL}
        onReject={(err) => {
          console.log(err);
        }}
        scope={'email'}
      >
        <Button
          size="login-btn"
          color="gray"
          onClick={() => {
            setIsLoadingSocial(true);
          }}
        >
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/LinkedIn-2x.png`}
            alt="LinkedIn"
            className="mr-2 size-[22px] md:size-8 lg:mr-3"
          />
          Continue with LinkedIn
        </Button>
      </LoginSocialLinkedin> */}
    </div>
  );
};

export default SocialLogins;
