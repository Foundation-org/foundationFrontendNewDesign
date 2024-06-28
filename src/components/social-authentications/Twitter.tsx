import { useCallback, useState } from 'react';
import { IResolveParams } from 'reactjs-social-login';
import LoginSocialTwitter from './LoginSocialTwitter';

const REDIRECT_URI = window.location.href;

export default function Twitter() {
  const [provider, setProvider] = useState('');
  const [profile, setProfile] = useState<any>();

  const onLoginStart = useCallback(() => {
    alert('login start');
  }, []);

  const onLogoutSuccess = useCallback(() => {
    setProfile(null);
    setProvider('');
    alert('logout success');
  }, []);

  console.log('provider', provider);
  console.log('profile', profile);

  return (
    <LoginSocialTwitter
      client_id={'Y2MyR21TXzBBQWduckZMUmtWNGU6MTpjaQ'}
      //   client_secret={'073UqOiQmb4lltZMk9NvpUg9AaYqwgNBj_L2aPzR6Ej7qvcl0c'}
      redirect_uri={REDIRECT_URI}
      onLoginStart={onLoginStart}
      onLogoutSuccess={onLogoutSuccess}
      onResolve={({ provider, data }: IResolveParams) => {
        setProvider(provider);
        setProfile(data);
      }}
      onReject={(err: any) => {
        console.log(err);
      }}
    >
      Login With Twitter
    </LoginSocialTwitter>
  );
}
