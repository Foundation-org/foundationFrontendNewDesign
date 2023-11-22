import { useState } from 'react';
import { Switch } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { changeTheme } from '../../../../features/utils/utilsSlice';
import Topbar from '../../components/Topbar';
import Tabs from './components/Tabs';
import Contributions from './pages/Contributions';
import VerificationBadges from './pages/VerificationBadges';
import Ledger from './pages/Ledger';
import ChangePassword from './pages/ChangePassword';

const Profile = () => {
  const dispatch = useDispatch();
  const [checkState, setCheckState] = useState(false);
  const persistedTheme = useSelector((state) => state.utils.theme);
  const [selectedTab, setSelectedTab] = useState(1);

  useEffect(() => {
    if (persistedTheme === 'light') {
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
      <div className="bg-white h-[calc(100vh-96px)] overflow-y-auto">
        <div className="flex gap-[19.4px] justify-end mr-[109px] mt-12">
          <div className="w-fit h-fit relative">
            <img src="/assets/svgs/dashboard/badge.svg" alt="badge" />
            <p className="absolute transform-center pb-5 z-50 font-bold text-white text-[35px] leading-normal">
              2
            </p>
          </div>
          <div>
            <h4 className="heading">My Profile</h4>
            <div className="flex gap-[13px]">
              <p>Light</p>
              <Switch
                checked={checkState}
                onChange={handleTheme}
                className={`${checkState ? 'bg-[#BEDEF4]' : 'bg-[#BEDEF4]'}
      relative inline-flex items-center h-[25px] w-[48px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={`${
                    checkState
                      ? 'translate-x-6 bg-[#4A8DBD]'
                      : 'translate-x-[1px] bg-[#4A8DBD]'
                  }
        pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full  shadow-lg ring-0 transition duration-200 ease-in-out`}
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
