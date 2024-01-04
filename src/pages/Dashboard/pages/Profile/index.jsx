import { useState } from "react";
import { Switch } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { changeTheme } from "../../../../features/utils/utilsSlice";
import Topbar from "../../components/Topbar";
import Tabs from "./components/Tabs";
import Contributions from "./pages/Contributions";
import VerificationBadges from "./pages/VerificationBadges";
import Ledger from "./pages/Ledger";
import ChangePassword from "./pages/ChangePassword";

const Profile = () => {
  const dispatch = useDispatch();
  const [checkState, setCheckState] = useState(
    localStorage.getItem("theme") === "dark" ? true : false,
  );
  const persistedTheme = useSelector((state) => state.utils.theme);
  const [selectedTab, setSelectedTab] = useState(1);

  useEffect(() => {
    if (persistedTheme === "light") {
      setCheckState(false);
      localStorage.setItem("theme", "light");
    } else {
      setCheckState(true);
      localStorage.setItem("theme", "dark");
    }
  }, [persistedTheme]);

  const handleTheme = () => {
    dispatch(changeTheme());
    setCheckState((prevCheckState) => !prevCheckState);
  };

  const handleSelectedTab = (id) => setSelectedTab(id);

  return (
    <div>
      <Topbar />
      <div className="h-[calc(100vh-96px)] overflow-y-auto bg-white dark:bg-[#0A0A0C]">
        <div className="laptop::mt-12 mr-5 mt-5 flex justify-end gap-[5.16px] tablet:mr-11 tablet:mt-[14px] tablet:gap-[19.4px] laptop:mr-[109px]">
          <div
            style={{
              background: "url(/assets/svgs/dashboard/MeBadge.svg)",
              backgroundRepeat: "no-repeat",
            }}
            className="flex h-[26.8px] w-[21.8px] items-center justify-center bg-cover bg-no-repeat tablet:h-[85px] tablet:w-[69px]"
          >
            <p className="h-[80%] text-[9.2px] font-normal leading-normal text-[#7A7016] tablet:text-[30px]">
              2
            </p>
          </div>

          <div>
            <h4 className="heading">My Profile</h4>
            <div className="flex items-center gap-1 tablet:gap-[13px]">
              <p className="text-[8px] tablet:text-[16px] dark:text-white">
                Light
              </p>
              <Switch
                checked={checkState}
                onChange={handleTheme}
                className={`${checkState ? "bg-[#CBCCCD]" : "bg-[#BEDEF4]"}
      relative inline-flex h-[10.78px] w-[20.53px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 tablet:h-[25px] tablet:w-12`}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={`${
                    checkState
                      ? "translate-x-[9px] bg-[#565D62] tablet:translate-x-6"
                      : "translate-x-[1px] bg-[#4A8DBD]"
                  }
        pointer-events-none inline-block h-2 w-2 transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out tablet:h-5 tablet:w-5`}
                />
              </Switch>
              <p className="text-[8px] tablet:text-[16px] dark:text-white">
                Dark
              </p>
            </div>
          </div>
        </div>
        <Tabs handleSelectedTab={handleSelectedTab} active={selectedTab} />
        {selectedTab === 1 && <Contributions />}
        {selectedTab === 2 && <VerificationBadges />}
        {selectedTab === 3 && <Ledger />}
        {selectedTab === 4 && <ChangePassword />}
      </div>
    </div>
  );
};

export default Profile;
