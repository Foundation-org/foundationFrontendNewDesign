import { Settings } from './Settings';
import NotificationSettings from './NotificationSettings';
import SummaryCard from '../../../../../../components/SummaryCard';

const UserSettings = () => {
  return (
    <div className="mx-4 flex flex-col gap-2 pb-6 tablet:mx-6 tablet:gap-[15px]">
      <SummaryCard headerIcon="/assets/summary/settings-logo.svg" headerTitle="User Settings">
        <h1 className="text-[12px] font-medium leading-[13.56px] tablet:text-[16px] tablet:leading-normal">
          Manage your communication preferences, display and feed settings, and more.
        </h1>
      </SummaryCard>

      <NotificationSettings />
      <Settings />
    </div>
  );
};

export default UserSettings;
