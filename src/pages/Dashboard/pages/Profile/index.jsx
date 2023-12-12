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
  const [checkState, setCheckState] = useState(false);
  const persistedTheme = useSelector((state) => state.utils.theme);
  const [selectedTab, setSelectedTab] = useState(1);

  useEffect(() => {
    if (persistedTheme === "light") {
      setCheckState(false);
    } else {
      setCheckState(true);
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
      <div className="h-[calc(100vh-96px)] overflow-y-auto bg-white">
        <div className="mr-5 mt-5 flex justify-end gap-[5.16px] tablet:mr-[109px] tablet:mt-12 tablet:gap-[19.4px]">
          <div className="relative h-[26.8px] w-[21.8px] tablet:h-fit tablet:w-fit">
            <img src="/assets/svgs/dashboard/badge.svg" alt="badge" />
            <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-[9.2px] font-bold leading-normal text-white tablet:text-[35px]">
              2
            </p>
          </div>
          <div>
            <h4 className="heading">My Profile</h4>
            <div className="flex gap-[13px]">
              <p className="text-[8px] tablet:text-[16px]">Light</p>
              <Switch
                checked={checkState}
                onChange={handleTheme}
                className={`${checkState ? "bg-[#BEDEF4]" : "bg-[#BEDEF4]"}
      relative inline-flex h-[25px] w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={`${
                    checkState
                      ? "translate-x-6 bg-[#4A8DBD]"
                      : "translate-x-[1px] bg-[#4A8DBD]"
                  }
        pointer-events-none inline-block h-5 w-5 transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out`}
                />
              </Switch>
              <p>Dark</p>
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
