import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { changePassword } from '../../../../../api/userAuth';
import Button from '../components/Button';
import { toast } from 'sonner';

const ChangePassword = () => {
  const mutation = useMutation({mutationFn: changePassword});
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const savePassword = async (event) => {
    event.preventDefault();
  
    const currentPassword = event.target.elements.currentPassword.value;
    const newPassword = event.target.elements.newPassword.value;
    const retypePassword = event.target.elements.retypePassword.value;
  
   
      // Check if new password and retype password match
      if (newPassword === retypePassword) {
        setPasswordsMatch(true);

        const resp= await mutation.mutateAsync({ currentPassword, newPassword, uuid: localStorage.getItem('uId') });
        if (resp.status === 400) {
          toast.warning(resp.data.error);
        } else if (resp.status === 200) {
          toast.success(resp.data.message);
        }
      } else {
        setPasswordsMatch(false);
        console.error("New password and retype password do not match.");
      }
    
  };
  

  return (
    <div>
      <h1 className="text-[#4A8DBD] text-[32px] font-semibold leading-normal mt-[6px] mb-[51.9px] ml-[156px]">
        Change Password
      </h1>
      <form onSubmit={savePassword}>
        <div className="mx-[106px] pt-[50px] pb-[88px] rounded-[45px] shadow-inside h-full relative">
          <div className=" mx-12 flex gap-[100px]">
            <div className="w-full">
              <label className="mb-[21px] ml-[25px] text-[#7C7C7C] text-[30px] font-semibold leading-normal">
                Current Password
              </label>
              <input
                type="password"
                className="rounded-[29px] bg-[#FCFCFD] custom-inset-shadow h-[98px] w-full text-xl px-8 py-2"
                name="currentPassword"
                required
              />
            </div>

            <div className="w-full">
              <label className="mb-[21px] ml-[25px] text-[#7C7C7C] text-[30px] font-semibold leading-normal">
                New Password
              </label>
              <input
                type="password"
                className="rounded-[29px] bg-[#FCFCFD] custom-inset-shadow h-[98px] w-full text-xl px-8 py-2"
                name="newPassword"
                required
              />
            </div>
            <div className="w-full">
              <label className="mb-[21px] ml-[25px] text-[#7C7C7C] text-[30px] font-semibold leading-normal">
                Re-type New Password
              </label>
              <input
                type="password"
                className="rounded-[29px] bg-[#FCFCFD] custom-inset-shadow h-[98px] w-full text-xl px-8 py-2"
                name="retypePassword"
                required
              />
              {!passwordsMatch && (
                <p className="text-red-500 mt-2" style={{ color: '#e53e3e' }}>
                  Passwords do not match. Please re-enter.
                </p>
              )}

            </div>
          </div>
          <div className="absolute right-10 -bottom-12">
            <Button color="blue" type="submit">Change</Button>
          </div>
        </div>
      </form>
      <div className="w-full flex justify-center mt-[77px] mb-24">
        <button className="red-button">Delete Account</button>
      </div>
    </div>
  );
};

export default ChangePassword;
