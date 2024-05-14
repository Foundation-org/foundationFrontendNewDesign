// export const TopbarItems = [
//   {
//     id: 1,
//     title: 'Home',
//     path: '/dashboard',
//     activePaths: ['/dashboard'],
//     icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/home-white.svg`,
//   },
//   {
//     id: 2,
//     title: 'Create',
//     path: '/dashboard/quest',
//     activePaths: ['/dashboard/quest'],
//     icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/create.svg`,
//   },
//   {
//     id: 3,
//     title: 'Profile',
//     path: '/dashboard/profile',
//     activePaths: [
//       '/dashboard/profile',
//       '/dashboard/profile/verification-badges',
//       '/dashboard/profile/ledger',
//       '/dashboard/profile/hidden-posts',
//       '/dashboard/profile/shared-links',
//       '/dashboard/profile/user-settings',
//     ],
//     icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/profile-logo.svg`,
//   },
//   {
//     id: 4,
//     title: 'Treasury',
//     path: '/dashboard/treasury',
//     activePaths: ['/dashboard/treasury', '/dashboard/treasury/ledger'],
//     icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/treasury/treasury-logo.svg`,
//   },
//   // {
//   //   id: 5,
//   //   title: 'Bookmarks',
//   //   path: '/dashboard/bookmark',
//   //   activePaths: ['/dashboard/bookmark'],
//   //   icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/bookmark/darkbookmark2.png`,
//   // },
// ];

export const TopbarItems = [
  {
    id: 1,
    title: 'Profile',
    path: '/dashboard/profile',
    activePaths: [
      '/dashboard/profile',
      '/dashboard/profile/verification-badges',
      '/dashboard/profile/ledger',
      '/dashboard/profile/hidden-posts',
      '/dashboard/profile/shared-links',
      '/dashboard/profile/user-settings',
    ],
    icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/topbar/profile.svg`,
  },
  // {
  //   id: 2,
  //   title: 'Chat',
  //   path: '/dashboard/quest',
  //   activePaths: ['/dashboard/quest'],
  //   icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/topbar/chat.svg`,
  // },
  {
    id: 2,
    title: 'Faqs',
    path: '/dashboard/help/about',
    activePaths: ['/dashboard/help/about', '/dashboard/help/faq'],
    icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/navbar/faqlogo.png`,
  },
];
