import { useQuery } from '@tanstack/react-query';
import { authSuccess } from '../services/api/authentication';
import { useNavigate } from 'react-router-dom';

const Authenticating = () => {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get('token');

  const {
    data: authSuccessResp,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ['authSuccess'],
    queryFn: authSuccess,
    enabled: token !== null,
  });

  console.log('authSuccess', authSuccessResp);

  if (!isLoading && !isError && isSuccess) {
    const redirectTo = localStorage.getItem('target-url');
    const url = new URL(redirectTo);
    const pathname = url.pathname;
    navigate(pathname);
  }

  if (isError) {
    console.log('error', error);
  }

  return <div>Loading... </div>;
};

export default Authenticating;
