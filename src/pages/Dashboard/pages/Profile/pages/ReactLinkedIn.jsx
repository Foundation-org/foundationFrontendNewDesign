/* eslint-disable camelcase */
/**
 *
 * LoginSocialLinkedin
 *
 */
// import { PASS_CORS_KEY } from 'helper/constants';
import React, { memo, useCallback, useEffect } from 'react';
import axios from 'axios';
// import { IResolveParams, objectType } from '../';

// interface Props {
//   state?: string;
//   scope?: string;
//   client_id: string;
//   className?: string;
//   redirect_uri: string;
//   client_secret: string;
//   response_type?: string;
//   isOnlyGetCode?: boolean;
//   isOnlyGetToken?: boolean;
//   children?: React.ReactNode;
//   onLoginStart?: () => void;
//   onReject: (reject: string | objectType) => void;
//   onResolve: ({ provider, data }: IResolveParams) => void;
// }

const LINKEDIN_URL = 'https://www.linkedin.com/oauth/v2';
const LINKEDIN_API_URL = 'https://api.linkedin.com';
const PREVENT_CORS_URL = 'https://cors.bridged.cc';
const PASS_CORS_KEY = '875c0462-6309-4ddf-9889-5227b1acc82c';

export const LoginSocialLinkedin = ({
  state = '',
  scope = 'openid,profile,email',
  client_id,
  client_secret,
  className = '',
  redirect_uri,
  response_type = 'code',
  isOnlyGetCode = false,
  isOnlyGetToken = false,
  children,
  onLoginStart,
  onReject,
  onResolve,
}) => {
  useEffect(() => {
    const popupWindowURL = new URL(window.location.href);
    const code = popupWindowURL.searchParams.get('code');
    const statePopup = popupWindowURL.searchParams.get('state');
    if (statePopup?.includes('_linkedin') && code) {
      localStorage.setItem('linkedin', code);
      window.close();
    }
  }, [window.location.href]);

  const getProfile = useCallback(
    (data) => {
      // fetch(
      //   `https://api.allorigins.win/get?url=${encodeURIComponent(
      //     LINKEDIN_API_URL +
      //       '/v2/userinfo?oauth2_access_token=' +
      //       data.access_token +
      //       '&projection=(id,profilePicture(displayImage~digitalmediaAsset:playableStreams),localizedLastName, firstName,lastName,localizedFirstName)',
      //   )}`,
      //   {
      //     method: 'GET',
      //   },
      // )
      fetch(
        // 'https://api.linkedin.com/v2/userinfo'
        `${import.meta.env.VITE_API_URL}/user/getLinkedInUserInfo`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${data.access_token}`,
            'Content-Type': 'application/json', // Specify content type
          },
          body: JSON.stringify({
            // Stringify the body object
            access_token: data.access_token,
          }),
        },
      )
        // axios
        //   .get('https://api.linkedin.com/v2/userinfo', {
        //     headers: {
        //       Authorization: `Bearer ${data.access_token}`,
        //     },
        //   })
        .then((res) => res.json())
        .then((res) => {
          const response = { ...data };
          if (res.contents) {
            const contents = JSON.parse(res.contents);
            if (typeof data === 'object')
              Object.entries(contents).map(([key, value]) => {
                response[key] = value;
              });
          }

          onResolve({ provider: 'linkedin', data: res });
        })
        .catch((err) => {
          onReject(err);
        });
    },
    [onReject, onResolve],
  );

  const getAccessToken = useCallback(
    (code) => {
      if (isOnlyGetCode) onResolve({ provider: 'linkedin', data: { code } });
      else {
        const params = {
          code,
          grant_type: 'authorization_code',
          redirect_uri,
          client_id,
          client_secret,
        };
        // const headers = new Headers({
        //   'Content-Type': 'application/x-www-form-urlencoded',
        //   'x-cors-grida-api-key': PASS_CORS_KEY,
        // });

        // fetch(`${PREVENT_CORS_URL}/${LINKEDIN_URL}/accessToken`, {
        //   method: 'POST',
        //   headers,
        //   body: new URLSearchParams(params),
        // })
        fetch(
          // 'https://api.linkedin.com/v2/userinfo'
          `${import.meta.env.VITE_API_URL}/user/getLinkedInUserInfo`,
          {
            method: 'POST',
            headers: {
              // 'Authorization': `Bearer ${data.access_token}`,
              'Content-Type': 'application/json', // Specify content type
            },
            body: JSON.stringify({
              // Stringify the body object
              ...params,
            }),
          },
        )
          .then((response) => response.json())
          .then((response) => {
            onResolve({ provider: 'linkedin', data: response });
            // else getProfile(response);
          })
          .catch((err) => {
            console.log('before.... error.........');
            onReject(err);
          });
      }
    },
    [onReject, onResolve, client_id, getProfile, redirect_uri, client_secret, isOnlyGetCode, isOnlyGetToken],
  );

  const handlePostMessage = useCallback(
    async ({ type, code, provider }) => type === 'code' && provider === 'linkedin' && code && getAccessToken(code),
    [getAccessToken],
  );

  const onChangeLocalStorage = useCallback(() => {
    const code = localStorage.getItem('linkedin');
    if (code) {
      handlePostMessage({ provider: 'linkedin', type: 'code', code });
      localStorage.removeItem('linkedin');
    }
  }, [handlePostMessage]);
  // const onChangeLocalStorage = useCallback(() => {
  //   window.removeEventListener('storage', onChangeLocalStorage, false);
  //   const code = localStorage.getItem('linkedin');
  //   if (code) {
  //     handlePostMessage({ provider: 'linkedin', type: 'code', code });
  //     localStorage.removeItem('linkedin');
  //   }
  // }, [handlePostMessage]);
  useEffect(() => {
    // Add the event listener when the component mounts
    window.addEventListener('storage', onChangeLocalStorage);

    // Clean up by removing the event listener when the component unmounts
    return () => {
      window.removeEventListener('storage', onChangeLocalStorage);
    };
  }, [onChangeLocalStorage]);

  const onLogin = useCallback(() => {
    onLoginStart && onLoginStart();
    // window.addEventListener('storage', onChangeLocalStorage, false);
    const oauthUrl = `${LINKEDIN_URL}/authorization?response_type=${response_type}&client_id=${client_id}&scope=${scope}&state=${
      state + '_linkedin'
    }&redirect_uri=${redirect_uri}`;
    const width = 450;
    const height = 730;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open(
      oauthUrl,
      'Linkedin',
      'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' +
        width +
        ', height=' +
        height +
        ', top=' +
        top +
        ', left=' +
        left,
    );
  }, [onLoginStart, onChangeLocalStorage, response_type, client_id, scope, state, redirect_uri]);

  return (
    <div className={className} onClick={onLogin}>
      {children}
    </div>
  );
};

export default memo(LoginSocialLinkedin);
