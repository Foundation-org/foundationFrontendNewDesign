import { useCallback, useState } from 'react';
import { LoginSocialGithub, IResolveParams } from 'reactjs-social-login';

const REDIRECT_URI = window.location.href;

export default function Github() {
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
    <div className={`App ${provider && profile ? 'hide' : ''}`}>
      <LoginSocialGithub
        client_id={'Iv23liGKSHmmsitRKoRy'}
        client_secret={'27118f44ee9156b380da7ea9f469c614eb7bb3c2'}
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
        Login With Github
      </LoginSocialGithub>
    </div>
  );
}
