import { useCallback, useState } from 'react';
import { LoginSocialLinkedin, IResolveParams } from 'reactjs-social-login';

const REDIRECT_URI = window.location.href;

export default function LinkedIn() {
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
      <LoginSocialLinkedin
        scope="openid,profile,email"
        client_id={'78m35axurl22ym'}
        client_secret={'dn5tIorbCgaqAsKC'}
        redirect_uri={REDIRECT_URI}
        onLoginStart={onLoginStart}
        onResolve={({ provider, data }: IResolveParams) => {
          setProvider(provider);
          setProfile(data);
        }}
        onReject={(err: any) => {
          console.log(err);
        }}
      >
        Login With Linkedin
      </LoginSocialLinkedin>
    </div>
  );
}
