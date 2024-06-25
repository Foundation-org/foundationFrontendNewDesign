export const createQuestItems = [
  { id: 0, title: 'Yes/No', path: '/quest' },
  { id: 1, title: 'Agree/Disagree', path: '/quest/agree-disagree' },
  { id: 2, title: 'Like/Dislike', path: '/quest/like-dislike' },
  { id: 3, title: 'Multiple Choice', path: '/quest/multiple-choice' },
  { id: 4, title: 'Open Choice', path: '/quest/open-choice' },
  { id: 5, title: 'Ranked Choice', path: '/quest/ranked-choice' },
];

export const profileItems = [
  { id: 8, title: 'Summary', path: '/profile', to: '' },
  { id: 1, title: 'Verification Badges', path: '/profile/verification-badges', to: '' },
  { id: 0, title: 'Post Activity', path: '/profile/post-activity', to: 'post-activity' },
  { id: 3, title: 'Hidden Posts', path: '/profile/hidden-posts', to: 'hidden-posts' },
  { id: 6, title: 'Posts Feedback', path: '/profile/feedback', to: 'feedback' },
  { id: 4, title: 'Shared Posts', path: '/profile/shared-links', to: 'shared-links' },
  { id: 7, title: 'My Lists', path: '/profile/lists', to: 'lists' },
  { id: 5, title: 'User Settings', path: '/profile/user-settings', to: 'user-settings' },
  { id: 2, title: 'My Activity', path: '/profile/ledger', to: 'ledger' },
];

export const treasuryItems = [
  { id: 0, title: 'Summary', path: '/treasury' },
  { id: 1, title: 'Rewards & Fees', path: '/treasury/reward-schedule' },
  { id: 2, title: 'Buy FDX', path: '/treasury/buy-fdx' },
  // { id: 3, title: 'Redemption center', path: '/treasury/redemption-center' },
  { id: 4, title: 'Treasury Activity', path: '/treasury/ledger' },
];

export const helpItems = [
  { id: 1, title: 'About', path: '/help/about' },
  { id: 2, title: "FAQ's", path: '/help/faq' },
  { id: 3, title: 'Terms of Service', path: '/help/terms-of-service' },
  { id: 4, title: 'Privacy Policy', path: '/help/privacy-policy' },
  { id: 5, title: 'Contact Us', path: '/help/contact-us' },
];
