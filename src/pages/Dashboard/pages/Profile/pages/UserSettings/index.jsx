import { Settings } from './Settings';
import NotificationSettings from './NotificationSettings';
import SummaryCard from '../../../../../../components/SummaryCard';

const UserSettings = () => {
  return (
    <div className="mx-4 flex flex-col gap-2 pb-6 tablet:mx-6 tablet:gap-[15px]">
      <SummaryCard headerIcon="/assets/summary/settings-logo.svg" headerTitle="User Settings">
        <h1 className="text-[12px] font-medium leading-[13.56px] tablet:text-[16px] tablet:leading-normal">
          Customize your data organization with various sorting options and switch between dark/light themes for optimal
          viewing. Manage and personalize notifications to stay updated without distractions.
        </h1>
      </SummaryCard>

      <NotificationSettings />
      <Settings />
    </div>
  );
};

export default UserSettings;
