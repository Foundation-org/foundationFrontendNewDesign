import { Switch } from '@headlessui/react';
import { updateUserSettings } from '../../../../../../services/api/userAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import CloseEmailNotificationPopup from '../../../../../../components/dialogue-boxes/CloseEmailNotificationPopup';
import showToast from '../../../../../../components/ui/Toast';

export default function NotificationSettings() {
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [modalVisible, setModalVisible] = useState(false);
  const [systemNotifications, setSystemNotifications] = useState(
    persistedUserInfo.notificationSettings.systemNotifications || false,
  );
  const [emailNotifications, setEmailNotifications] = useState(
    persistedUserInfo.notificationSettings.emailNotifications || false,
  );

  const { mutateAsync: handleUserSettings } = useMutation({
    mutationFn: updateUserSettings,
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
    },
    onError: (error) => {
      console.log(error);
      showToast('error', 'error', {}, error.response.data.message.split(':')[1]);
    },
  });

  const handleCloseModal = () => setModalVisible(false);

  return (
    <div className="space-y-2 tablet:space-y-[15px]">
      {modalVisible && (
        <CloseEmailNotificationPopup
          handleClose={handleCloseModal}
          modalVisible={modalVisible}
          title={'Email Notification'}
          image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/email-icon.svg`}
          emailNotifications={emailNotifications}
          setEmailNotifications={setEmailNotifications}
        />
      )}
      <div className="mx-auto w-full">
        <div className="flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px]">
          <div className="flex items-center gap-2">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/notification-icon.svg`}
              alt={'notification-icon'}
              className="h-[18.5px] w-[14.6px] tablet:h-[29px] tablet:w-6"
            />
            <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">
              Notification Settings
            </h1>
          </div>
        </div>
        <div className="rounded-b-[10px] border-[#D9D9D9] bg-[#FDFDFD] px-5 py-[10px] tablet:border-[1.85px] tablet:py-[18.73px]">
          <div className="flex flex-col gap-3 rounded-[6.749px] tablet:gap-6 tablet:rounded-[15px]">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[10px] font-semibold text-[#707175] tablet:text-[20px]">Email Notifications</h1>{' '}
                <p className="text-[8px] font-medium text-[#ACACAC] tablet:text-[16px]">
                  Get notified of new features, updates and more!
                </p>
              </div>
              <Switch
                checked={emailNotifications}
                onChange={(e) => {
                  setModalVisible(true);
                }}
                className={`${emailNotifications ? 'bg-[#BEDEF4]' : 'bg-[#D9D9D9]'} switch_basic_design`}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={`switch_base ${
                    emailNotifications
                      ? 'translate-x-[9px] bg-[#4A8DBD] tablet:translate-x-6'
                      : 'translate-x-[1px] bg-[#707175]'
                  }`}
                />
              </Switch>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[10px] font-semibold text-[#707175] tablet:text-[20px]">System Notifications</h1>
                <p className="text-[8px] font-medium text-[#ACACAC] tablet:text-[16px]">
                  Helpful messages in your feed to guide you along
                </p>
              </div>
              <Switch
                checked={systemNotifications}
                onChange={(e) => {
                  setSystemNotifications(e);
                  handleUserSettings({ uuid: persistedUserInfo.uuid, systemNotifications: e });
                }}
                className={`${systemNotifications ? 'bg-[#BEDEF4]' : 'bg-[#D9D9D9]'} switch_basic_design`}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={`switch_base ${
                    systemNotifications
                      ? 'translate-x-[9px] bg-[#4A8DBD] tablet:translate-x-6'
                      : 'translate-x-[1px] bg-[#707175]'
                  }`}
                />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
