import { Link } from 'react-router-dom';
import { Menu } from '@headlessui/react';
import { useSelector } from 'react-redux';

const navMenuList = [
  {
    title: 'News',
    path: '/news',
    icon: `/assets/mobilenav/news.svg`,
    allowedRole: 'public',
  },
  { title: 'Treasury', path: '/treasury', icon: `/assets/mobilenav/treasury.svg`, allowedRole: 'public' },
  {
    title: 'Verification Badges',
    path: '/profile/verification-badges',
    icon: `/assets/mobilenav/verificationbadges.svg`,
  },
  { title: 'Feedback Given', path: '/profile/feedback-given', icon: `/assets/mobilenav/feedback-given.svg` },
  { title: 'Feedback received', path: '/profile/feedback', icon: `/assets/mobilenav/feedback-received.svg` },
  {
    title: 'Shared Posts',
    path: '/profile/shared-links',
    icon: `/assets/svgs/sharelink.svg`,
  },
  { title: 'My Lists', path: '/profile/lists', icon: `/assets/mobilenav/my-list-logo1.svg` },
  { title: 'Shared Articles', path: '/profile/shared-articles', icon: `/assets/mobilenav/sharedarticles.svg` },
  { title: 'Post Activity', path: '/profile/post-activity', icon: `/assets/mobilenav/post-activity-logo2.svg` },
  { title: 'User Setting', path: '/profile/user-settings', icon: `/assets/mobilenav/user setting.svg` },
  { title: 'Help', path: '/help/about', icon: `/assets/mobilenav/help.svg`, allowedRole: 'public' },
  {
    title: 'Seldon',
    path: 'seldon-ai',
    icon: `/assets/mobilenav/seldon.svg`,
  },
];

export default function NavMobileMenu() {
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const isUser = persistedUserInfo?.role === 'user';
  const isPseudoBadge = persistedUserInfo?.badges?.some((badge) => (badge?.pseudo ? true : false));

  return (
    <Menu as="div" className="relative inline-block h-5 text-left tablet:h-8">
      <Menu.Button className="size-5 h-5 min-w-5 tablet:size-8 tablet:min-w-8">
        <img
          src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/hamburger.svg`}
          alt="arrow-right"
          className="size-full"
        />
      </Menu.Button>
      <Menu.Items
        transition="true"
        className="absolute -right-[15px] z-[1000] mt-2 w-48 origin-top-right rounded-bl-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in dark:bg-gray-200 dark:ring-gray-100 tablet:mt-4"
      >
        {navMenuList
          .filter((item) => isUser || item.allowedRole === 'public')
          .filter((item) => {
            if (item.title === 'Seldon') return isPseudoBadge;
            return true;
          })
          .map((item, index) => (
            <Menu.Item
              className={`border-b border-b-[#D9D9D9] px-5 py-2 hover:bg-[#F2F3F5] dark:border-b-gray-100 ${navMenuList.length === index + 1 ? 'border-b-0' : ''}`}
              key={index + 1}
            >
              <Link
                to={item.path}
                className="flex items-center gap-2 text-[12px] font-semibold leading-normal text-[#7C7C7C] dark:text-white-400"
              >
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}${item.icon}`}
                  alt={item.title}
                  className="size-[17px]"
                />
                {item.title}
              </Link>
            </Menu.Item>
          ))}
      </Menu.Items>
    </Menu>
  );
}
