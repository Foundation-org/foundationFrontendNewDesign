import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { IoIosMail } from 'react-icons/io';
import api from '../../services/api/Axios';

const Unsubscribe = () => {
  const location = useLocation();
  const [message, setMessage] = useState(false);

  const { mutateAsync: handleUnsubscribe } = useMutation({
    mutationFn: async (email: string) => {
      const response = await api.get(`/user/unsubscribe?email=${email}`);
      return response.data;
    },
    onSuccess: (data) => {
      setMessage(true);
    },
    onError: (error) => {
      setMessage(false);
    },
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');

    if (email) {
      handleUnsubscribe(email);
    } else {
      setMessage(false);
    }
  }, [location.search]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-100">
      <div className="flex flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow-lg">
        <IoIosMail className="text-4xl text-blue-100" />
        {message ? (
          <>
            <h1 className="text-2xl font-semibold text-blue-600">You've unsubscribed</h1>
            <p>You'll no longer receive emails from Foundation.io</p>
          </>
        ) : (
          <h1 className="text-2xl font-semibold text-blue-600">Unable to unsubscribe.</h1>
        )}
      </div>
    </div>
  );
};

export default Unsubscribe;
