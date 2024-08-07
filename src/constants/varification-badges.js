import { IoAccessibility } from 'react-icons/io5';

export const contacts = [
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Personal-Email-2xa.png`,
    title: 'Personal Email',
    ButtonColor: 'submit',
    ButtonText: 'Add',
    NoOfButton: 1,
    accountName: 'Gmail',
    type: 'personal',
  },
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Work-Email-2xa.png`,
    title: 'Work Email',
    ButtonColor: 'submit',
    ButtonText: 'Add',
    NoOfButton: 1,
    accountName: 'Gmail',
    type: 'work',
  },
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Education-Email-2xa.png`,
    title: 'Education Email',
    ButtonColor: 'submit',
    ButtonText: 'Add',
    NoOfButton: 1,
    accountName: 'Gmail',
    type: 'education',
  },
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/cellphone-1.png`,
    title: 'Cell Phone',
    ButtonColor: 'submit',
    ButtonText: 'Add',
    NoOfButton: 1,
    disabled: false,
    type: 'cell-phone',
  },
];

export const socials = [
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Twitter-2x.png`,
    title: 'Twitter',
    ButtonColor: 'blue',
    ButtonText: 'Add',
    NoOfButton: 1,
    link: '/auth/twitter',
    accountName: 'twitter',
    type: 'twitter',
    disabled: true,
    email: true,
  },
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/LinkedIn-2x.png`,
    title: 'LinkedIn',
    ButtonColor: 'gray',
    ButtonText: 'Add',
    NoOfButton: 1,
    link: '/auth/linkedin',
    accountName: 'linkedin',
    type: 'linkedin',
    disabled: true,
    email: true,
  },
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Facebook-2x.png`,
    title: 'Facebook',
    ButtonColor: 'blue',
    ButtonText: 'Add',
    NoOfButton: 1,
    link: '/auth/facebook',
    accountName: 'facebook',
    type: 'facebook',
    email: 'test@foundation-IoAccessibility.com',
  },
  // {
  //   image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Instagram-2x.png`,
  //   title: 'Instagram',
  //   ButtonColor: 'gray',
  //   ButtonText: 'Add',
  //   NoOfButton: 1,
  //   link: '/auth/instagram',
  //   accountName: 'instagram',
  //   type: 'instagram',
  //   disabled: false,
  // },
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Github-2x.png`,
    title: 'Github',
    ButtonColor: 'blue',
    ButtonText: 'Add',
    NoOfButton: 1,
    link: '/auth/github',
    accountName: 'github',
    type: 'github',
    disabled: false,
    email: true,
  },
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/verification-badges/farcaster.svg`,
    title: 'Farcaster',
    ButtonColor: 'submit',
    ButtonText: 'Add',
    disabled: false,
    NoOfButton: 1,
    type: 'farcaster',
    accountName: 'Farcaster',
    badgeType: 'farcaster',
    email: true,
  },
];

export const web3 = [
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Ethereum-Wallet-2x.png`,
    title: 'Ethereum Wallet',
    ButtonColor: 'submit',
    ButtonText: 'Add',
    NoOfButton: 1,
    type: 'etherium-wallet',
    disabled: false,
    accountName: '',
    badgeType: '',
  },
  // {
  //   image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/verification-badges/passkey-desktop.svg`,
  //   title: 'Passkey Desktop',
  //   ButtonColor: 'submit',
  //   ButtonText: 'Add',
  //   disabled: false,
  //   NoOfButton: 1,
  //   type: 'desktop',
  //   accountName: 'Passkey',
  //   badgeType: 'passkey',
  // },
  // {
  //   image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/verification-badges/passkey.svg`,
  //   title: 'Passkey Mobile',
  //   ButtonColor: 'submit',
  //   ButtonText: 'Add',
  //   disabled: false,
  //   NoOfButton: 1,
  //   type: 'mobile',
  //   accountName: 'Passkey',
  //   badgeType: 'passkey',
  // },
  // {
  //   image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/verification-badges/farcaster.svg`,
  //   title: 'Farcaster',
  //   ButtonColor: 'submit',
  //   ButtonText: 'Add',
  //   disabled: false,
  //   NoOfButton: 1,
  //   type: 'farcaster',
  //   accountName: 'Farcaster',
  //   badgeType: 'farcaster',
  // },
];

export const legacy = [
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/wallet.svg`,
    title: 'Data Encryption',
    ButtonColor: 'blue',
    ButtonText: 'Add',
    NoOfButton: 1,
    type: 'password',
    disabled: false,
    accountName: '',
    badgeType: '',
  },
];

export const personal = [
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/firstname.png`,
    title: 'First Name',
    ButtonColor: 'submit',
    NoOfButton: 1,
    ButtonText: 'Add',
    type: 'firstName',
    disabled: false,
  },
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/lastname.svg`,
    title: 'Last Name',
    ButtonColor: 'submit',
    NoOfButton: 1,
    ButtonText: 'Add',
    type: 'lastName',
    disabled: false,
  },
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/dob.svg`,
    title: 'Date of Birth',
    ButtonColor: 'submit',
    NoOfButton: 1,
    ButtonText: 'Add',
    type: 'dateOfBirth',
    disabled: false,
  },
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/currentcity-1.png`,
    title: 'Current City',
    ButtonColor: 'submit',
    ButtonText: 'Add',
    NoOfButton: 1,
    type: 'currentCity',
    disabled: false,
  },
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/hometown.svg`,
    title: 'Home Town',
    ButtonColor: 'submit',
    ButtonText: 'Add',
    NoOfButton: 1,
    type: 'homeTown',
    disabled: false,
  },
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/relationaship-1.png`,
    title: 'Relationship',
    ButtonColor: 'submit',
    ButtonText: 'Add',
    NoOfButton: 1,
    type: 'relationshipStatus',
    disabled: false,
  },
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/work-a.png`,
    title: 'Work',
    ButtonColor: 'submit',
    ButtonText: 'Add',
    NoOfButton: 1,
    disabled: false,
    type: 'work',
  },
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/education-1.png`,
    title: 'Education',
    ButtonColor: 'submit',
    ButtonText: 'Add',
    NoOfButton: 1,
    type: 'education',
    disabled: false,
  },
  // {
  //   image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Identity-2x-1.png`,
  //   title: 'ID / Passport',
  //   ButtonColor: 'gray',
  //   ButtonText: 'Add',
  //   NoOfButton: 1,
  //   disabled: true,
  //   type: 'id-passport',
  //   disabled: true,
  // },
  // {
  //   image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Geolocation-2x-1.png`,
  //   title: 'Geolocation',
  //   ButtonColor: 'blue',
  //   ButtonText: 'Add',
  //   NoOfButton: 1,
  //   type: 'geolocation',
  //   disabled: false,
  // },
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/securityquestion-a.png`,
    title: 'Security Question',
    ButtonColor: 'submit',
    ButtonText: 'Add',
    NoOfButton: 1,
    type: 'security-question',
    disabled: false,
  },
];

export const subscription = [
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/creditScore.svg`,
    title: 'Credit Score',
    ButtonColor: 'submit',
    NoOfButton: 1,
    ButtonText: 'Add',
    type: 'firstName',
    disabled: false,
  },
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/employement.svg`,
    title: 'Employment',
    ButtonColor: 'submit',
    NoOfButton: 1,
    ButtonText: 'Add',
    type: 'lastName',
    disabled: false,
  },
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/collageDegree.svg`,
    title: 'College Degree',
    ButtonColor: 'submit',
    NoOfButton: 1,
    ButtonText: 'Add',
    type: 'dateOfBirth',
    disabled: false,
  },
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/income.svg`,
    title: 'Income',
    ButtonColor: 'submit',
    NoOfButton: 1,
    ButtonText: 'Add',
    type: 'dateOfBirth',
    disabled: false,
  },
  // {
  //   image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/checkpassed.svg`,
  //   title: 'Check Passed',
  //   ButtonColor: 'submit',
  //   NoOfButton: 1,
  //   ButtonText: 'Add',
  //   type: 'dateOfBirth',
  //   disabled: false,
  // },
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/identity.svg`,
    title: 'Identity',
    ButtonColor: 'submit',
    NoOfButton: 1,
    ButtonText: 'Add',
    type: 'dateOfBirth',
    disabled: false,
  },
];

export const badgesTotalLength = contacts.length + socials.length + web3.length + legacy.length + personal.length;
