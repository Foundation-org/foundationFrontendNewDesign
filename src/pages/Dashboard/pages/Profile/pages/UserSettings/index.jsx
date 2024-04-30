import React from 'react';
import { Settings } from './Settings';
import NotificationSettings from './NotificationSettings';

const UserSettings = () => {
  return (
    <div className="mx-4 space-y-2 tablet:mx-6 tablet:space-y-[15px]">
      <NotificationSettings />
      <Settings />
    </div>
  );
};

export default UserSettings;
