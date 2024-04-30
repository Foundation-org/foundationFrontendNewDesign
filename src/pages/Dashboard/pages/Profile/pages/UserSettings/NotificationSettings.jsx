import { Switch } from '@headlessui/react';
import { toast } from 'sonner';

export default function NotificationSettings() {
  return (
    <div className="space-y-2 tablet:space-y-[15px]">
      <h1 className="text-[12px] font-semibold text-black tablet:text-[22px] tablet:font-medium">
        Notification Settings
      </h1>
      {/* Change Theme */}
      <div className="flex flex-col gap-3 rounded-[6.749px] border-[1.85px] border-[#DEE6F7] bg-[#FDFDFD] px-4 py-3 tablet:gap-6 tablet:rounded-[15px] tablet:px-[30px] tablet:py-5">
        <div className="flex items-center justify-between">
          <h1 className="text-[10px] font-semibold text-[#707175] tablet:text-[20px]">Email notifications</h1>
          <Switch
            checked={false}
            onChange={() => toast.info('Feature coming soon.')}
            className={`${false ? 'bg-[#BEDEF4]' : 'bg-[#BEDEF4]'} switch_basic_design`}
          >
            <span className="sr-only">Use setting</span>
            <span
              aria-hidden="true"
              className={`${
                false ? 'translate-x-[9px] bg-[#4A8DBD] tablet:translate-x-6' : 'translate-x-[1px] bg-[#4A8DBD]'
              }
      pointer-events-none inline-block h-2 w-2 transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out tablet:h-5 tablet:w-5`}
            />
          </Switch>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-[10px] font-semibold text-[#707175] tablet:text-[20px]">system notifications</h1>
          <Switch
            checked={false}
            onChange={() => toast.info('Feature coming soon.')}
            className={`${false ? 'bg-[#BEDEF4]' : 'bg-[#BEDEF4]'} switch_basic_design`}
          >
            <span className="sr-only">Use setting</span>
            <span
              aria-hidden="true"
              className={`${
                false ? 'translate-x-[9px] bg-[#4A8DBD] tablet:translate-x-6' : 'translate-x-[1px] bg-[#4A8DBD]'
              }
      pointer-events-none inline-block h-2 w-2 transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out tablet:h-5 tablet:w-5`}
            />
          </Switch>
        </div>
      </div>
    </div>
  );
}
