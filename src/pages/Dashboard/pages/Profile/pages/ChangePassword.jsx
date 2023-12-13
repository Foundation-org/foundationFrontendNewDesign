import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../../../../../api/userAuth";
import { toast } from "sonner";
import Button from "../components/Button";
import { useSelector } from "react-redux";

const ChangePassword = () => {
  const persistedTheme = useSelector((state) => state.utils.theme);
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
      <h1 className="mb-[25px] ml-[26px] mt-[6px] text-[12px] font-bold leading-normal text-[#4A8DBD] tablet:mb-[54px] tablet:ml-[46px] tablet:text-[24.99px] tablet:font-semibold laptop:ml-[156px] laptop:text-[32px]">
        Change Password
      </h1>
      <form onSubmit={savePassword}>
        <div
          className={`${
            persistedTheme === "dark" ? "dark-shadow-inside" : "shadow-inside"
          }  relative mx-6 h-full rounded-[11px] pb-[22.72px] pt-[12.9px] tablet:mx-6 tablet:rounded-[24.8px] tablet:pb-[88px] tablet:pt-[50px] laptop:mx-[106px] laptop:rounded-[45px]`}
        >
          <div className="mx-5 flex flex-col gap-5 tablet:mx-6 tablet:flex-row tablet:gap-6 laptop:mx-12 laptop:gap-[100px]">
            <div className="flex w-full flex-col gap-3 2xl:gap-[21px]">
              <label className="ml-[6.4px] text-[10px] font-semibold leading-normal text-[#7C7C7C] dark:text-[#CBCBCB] 2xl:text-[24px] tablet:ml-[25px] tablet:text-[20px] 3xl:text-[30px]">
                Current Password
              </label>
              <input
                type="password"
                // className="custom-inset-shadow h-[5.8vh] w-full rounded-[7.48px] bg-[#FCFCFD] px-8 py-2 text-xl dark:bg-[#080A0C] 2xl:h-[98px] tablet:h-16 tablet:rounded-[10.11px] laptop:h-[74px] laptop:rounded-[29px]"
                className="custom-inset-shadow h-[5.8vh] w-full rounded-[7.48px] bg-[#FCFCFD] px-8 py-2 text-xl dark:bg-[#080A0C]  tablet:rounded-[10.11px]  laptop:rounded-[29px]"
                name="currentPassword"
                required
              />
            </div>
            <div className="flex w-full flex-col gap-[5.72px] 2xl:gap-[21px] tablet:gap-3">
              <label className="ml-[6.4px] text-[10px] font-semibold leading-normal text-[#7C7C7C] dark:text-[#CBCBCB] 2xl:text-[24px] tablet:ml-[25px] tablet:text-[20px] 3xl:text-[30px]">
                New Password
              </label>
              <input
                type="password"
                className="custom-inset-shadow h-[5.8vh] w-full rounded-[7.48px] bg-[#FCFCFD] px-8 py-2 text-xl dark:bg-[#080A0C] tablet:rounded-[10.11px]  laptop:rounded-[29px]"
                name="newPassword"
                required
              />
            </div>
            <div className="mb-[2.125rem] flex w-full flex-col gap-[5.72px] 2xl:gap-[21px] tablet:gap-3">
              <label className="ml-[6.4px] text-[10px] font-semibold leading-normal text-[#7C7C7C] dark:text-[#CBCBCB] 2xl:text-[24px]  tablet:ml-[25px] tablet:text-[20px] 3xl:text-[30px]">
                Re-type New Password
              </label>
              <input
                type="password"
                className="custom-inset-shadow h-[5.8vh] w-full rounded-[7.48px] bg-[#FCFCFD] px-8 py-2 text-xl dark:bg-[#080A0C] tablet:rounded-[10.11px] laptop:rounded-[29px]"
                name="retypePassword"
                required
              />
            </div>
          </div>
          <div className="absolute -bottom-[14px] right-5 tablet:-bottom-8 tablet:right-10">
            <button className="rounded-[6.45px] bg-gradient-to-r from-[#6BA5CF] to-[#389CE3] px-[12.65px] py-[5.94px] text-[9.08px] font-semibold leading-normal text-white 2xl:text-[32px] tablet:mr-[18.5px] tablet:rounded-[23px] tablet:px-[45px] tablet:py-5 tablet:text-[20px]">
              Save
            </button>
          </div>
        </div>
      </form>
      <div className="mb-24 mt-[19.88px] flex w-full justify-center tablet:mt-[77px]">
        <button className="rounded-[6.45px] bg-gradient-to-r from-[#d61d1d] to-[#e90d0d] px-[12.65px] py-[5.94px] text-[9.03px] font-semibold leading-normal text-white 2xl:text-[35px] tablet:rounded-[23px] tablet:px-[45px] tablet:py-5 tablet:text-[20px] laptop:rounded-[25px]  laptop:px-[49px] laptop:py-[23px] laptop:text-[24px]">
          Delete Account
        </button>
      </div>
    </>
  );
};

export default ChangePassword;
