export const createQuestItems = [
  { id: 0, title: 'Yes/No', path: '/dashboard/quest' },
  { id: 1, title: 'Agree/Disagree', path: '/dashboard/quest/agree-disagree' },
  { id: 2, title: 'Like/Dislike', path: '/dashboard/quest/like-dislike' },
  { id: 3, title: 'Multiple Choice', path: '/dashboard/quest/multiple-choice' },
  { id: 4, title: 'Open Choice', path: '/dashboard/quest/open-choice' },
  { id: 5, title: 'Ranked Choice', path: '/dashboard/quest/ranked-choice' },
];

export const profileItems = [
  { id: 8, title: 'Summary', path: '/dashboard/profile', to: '' },
  { id: 1, title: 'Verification Badges', path: '/dashboard/profile/verification-badges', to: '' },
  { id: 0, title: 'Post activity', path: '/dashboard/profile/post-activity', to: 'post-activity' },
  { id: 3, title: 'Hidden Posts', path: '/dashboard/profile/hidden-posts', to: 'hidden-posts' },
  { id: 6, title: 'Posts Feedback', path: '/dashboard/profile/feedback', to: 'feedback' },
  { id: 4, title: 'Shared Posts', path: '/dashboard/profile/shared-links', to: 'shared-links' },
  { id: 7, title: 'My Lists', path: '/dashboard/profile/lists', to: 'lists' },
  { id: 5, title: 'User Settings', path: '/dashboard/profile/user-settings', to: 'user-settings' },
  { id: 2, title: 'My Activity', path: '/dashboard/profile/ledger', to: 'ledger' },
];

export const treasuryItems = [
  {
    id: 0,
    title: 'Summary',
    path: '/dashboard/treasury',
  },
  {
    id: 1,
    title: 'Rewards & Fees',
    path: '/dashboard/treasury/reward-schedule',
  },
  {
    id: 2,
    title: 'Buy FDX',
    path: '/dashboard/treasury/buy-fdx',
  },
  {
    id: 3,
    title: 'Redemption center',
    path: '/dashboard/treasury/redemption-center',
  },
  { id: 4, title: 'Treasury Activity', path: '/dashboard/treasury/ledger' },
];
