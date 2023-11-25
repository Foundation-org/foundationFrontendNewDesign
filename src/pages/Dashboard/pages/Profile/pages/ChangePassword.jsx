import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../../../../../api/userAuth";
import { toast } from "sonner";
import Button from "../components/Button";

const ChangePassword = () => {
  const mutation = useMutation({ mutationFn: changePassword });

  const savePassword = async (event) => {
    event.preventDefault();

    const currentPassword = event.target.elements.currentPassword.value;
    const newPassword = event.target.elements.newPassword.value;
    const retypePassword = event.target.elements.retypePassword.value;

    if (newPassword === retypePassword) {
      try {
        const resp = await mutation.mutateAsync({
          currentPassword,
          newPassword,
          uuid: localStorage.getItem("uId"),
        });

        if (resp.status === 200) {
          toast.success(resp.data.message);
        }
      } catch (err) {
        toast.error(err.response.data.error);
      }
    } else {
      toast.warning(
        "Passwords do not match. Please make sure the new password and retype password match.",
      );
    }
  };

  return (
    <>
      <h1 className="text-[#4A8DBD] text-[32px] font-semibold leading-normal mt-[6px] mb-[51.9px] ml-[156px]">
        Change Password
      </h1>
      <form onSubmit={savePassword}>
        <div className="mx-[106px] pt-[50px] pb-[88px] rounded-[45px] shadow-inside h-full relative">
          <div className=" mx-12 flex gap-[100px]">
            <div className="w-full flex flex-col gap-3 2xl:gap-[21px]">
              <label className="ml-[25px] text-[#7C7C7C] text-[20px] 2xl:text-[24px] 3xl:text-[30px] font-semibold leading-normal">
                Current Password
              </label>
              <input
                type="password"
                className="rounded-[29px] bg-[#FCFCFD] custom-inset-shadow h-[74px] 2xl:h-[98px] w-full text-xl px-8 py-2"
                name="currentPassword"
                required
              />
            </div>
            <div className="w-full flex flex-col gap-3 2xl:gap-[21px]">
              <label className="ml-[25px] text-[#7C7C7C] text-[20px] 2xl:text-[24px] 3xl:text-[30px] font-semibold leading-normal">
                New Password
              </label>
              <input
                type="password"
                className="rounded-[29px] bg-[#FCFCFD] custom-inset-shadow h-[74px] 2xl:h-[98px] w-full text-xl px-8 py-2"
                name="newPassword"
                required
              />
            </div>
            <div className="w-full flex flex-col gap-3 2xl:gap-[21px]">
              <label className="ml-[25px] text-[#7C7C7C] text-[20px] 2xl:text-[24px] 3xl:text-[30px] font-semibold leading-normal">
                Re-type New Password
              </label>
              <input
                type="password"
                className="rounded-[29px] bg-[#FCFCFD] custom-inset-shadow h-[74px] 2xl:h-[98px] w-full text-xl px-8 py-2"
                name="retypePassword"
                required
              />
            </div>
          </div>
          <div className="absolute right-10 -bottom-8">
            <button className="py-5 px-[45px] text-[20px] 2xl:text-[32px] font-semibold leading-normal mr-[18.5px] bg-gradient-to-r from-[#6BA5CF] to-[#389CE3] text-white rounded-[23px]">
              Change
            </button>
          </div>
        </div>
      </form>
      <div className="w-full flex justify-center mt-[77px] mb-24">
        <button className="bg-gradient-to-r from-[#d61d1d] to-[#e90d0d] text-white rounded-[25px] text-[24px] 2xl:text-[35px] font-semibold leading-normal py-[23px] px-[49px]">
          Delete Account
        </button>
      </div>
    </>
  );
};

export default ChangePassword;
