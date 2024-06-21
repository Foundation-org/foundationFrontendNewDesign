export const contacts = [
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Personal-Email-2xa.png`,
    title: 'Personal Email',
    ButtonColor: 'blue',
    ButtonText: 'Add Badge',
    NoOfButton: 1,
    accountName: 'Gmail',
    type: 'personal',
  },
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Work-Email-2xa.png`,
    title: 'Work Email',
    ButtonColor: 'blue',
    ButtonText: 'Add Badge',
    NoOfButton: 1,
    accountName: 'Gmail',
    type: 'work',
  },
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Education-Email-2xa.png`,
    title: 'Education Email',
    ButtonColor: 'blue',
    ButtonText: 'Add Badge',
    NoOfButton: 1,
    accountName: 'Gmail',
    type: 'education',
  },
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/cellphone-1.png`,
    title: 'Cell Phone',
    ButtonColor: 'blue',
    ButtonText: 'Add Badge',
    NoOfButton: 1,
    disabled: false,
    type: 'cell-phone',
  },
];

export const socials = [
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/LinkedIn-2x.png`,
    title: 'LinkedIn',
    ButtonColor: 'gray',
    ButtonText: 'Add Badge',
    NoOfButton: 1,
    // link: '/auth/linkedin',
    accountName: 'linkedin',
    disabled: true,
  },
  // {
  //   image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Facebook-2x.png`,
  //   title: 'Facebook',
  //   ButtonColor: 'blue',
  //   ButtonText: 'Add Badge',
  //   NoOfButton: 1,
  //   link: '/auth/facebook',
  //   accountName: 'facebook',
  // },
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Twitter-2x.png`,
    title: 'Twitter',
    ButtonColor: 'blue',
    ButtonText: 'Add Badge',
    NoOfButton: 1,
    link: '/auth/twitter',
    accountName: 'twitter',
    disabled: true,
  },
  // {
  //   image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Instagram-2x.png`,
  //   title: 'Instagram',
  //   ButtonColor: 'gray',
  //   ButtonText: 'Add Badge',
  //   NoOfButton: 1,
  //   // link: '/auth/instagram',
  //   accountName: 'instagram',
  //   disabled: false,
  // },

  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Github-2x.png`,
    title: 'Github',
    ButtonColor: 'blue',
    ButtonText: 'Add Badge',
    NoOfButton: 1,
    link: '/auth/github',
    accountName: 'github',
    disabled: false,
  },
];

export const web3 = [
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Ethereum-Wallet-2x.png`,
    title: 'Ethereum Wallet',
    ButtonColor: 'blue',
    ButtonText: 'Add Badge',
    NoOfButton: 1,
    type: 'etherium-wallet',
    disabled: false,
    accountName: '',
    badgeType: '',
  },
  // {
  //   image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/verification-badges/passkey-desktop.svg`,
  //   title: 'Passkey Desktop',
  //   ButtonColor: 'blue',
  //   ButtonText: 'Add Badge',
  //   disabled: false,
  //   NoOfButton: 1,
  //   type: 'desktop',
  //   accountName: 'Passkey',
  //   badgeType: 'passkey',
  // },
  // {
  //   image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/verification-badges/passkey.svg`,
  //   title: 'Passkey Mobile',
  //   ButtonColor: 'blue',
  //   ButtonText: 'Add Badge',
  //   disabled: false,
  //   NoOfButton: 1,
  //   type: 'mobile',
  //   accountName: 'Passkey',
  //   badgeType: 'passkey',
  // },
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/verification-badges/farcaster.svg`,
    title: 'Farcaster',
    ButtonColor: 'blue',
    ButtonText: 'Add Badge',
    disabled: false,
    NoOfButton: 1,
    type: 'farcaster',
    accountName: 'Farcaster',
    badgeType: 'farcaster',
  },
];

export const legacy = [
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/wallet.svg`,
    title: 'Data Encryption',
    ButtonColor: 'blue',
    ButtonText: 'Add Badge',
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
    ButtonColor: 'blue',
    NoOfButton: 1,
    ButtonText: 'Add Badge',
    type: 'firstName',
    disabled: false,
  },
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/lastname.svg`,
    title: 'Last Name',
    ButtonColor: 'blue',
    NoOfButton: 1,
    ButtonText: 'Add Badge',
    type: 'lastName',
    disabled: false,
  },
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/dob.svg`,
    title: 'Date of Birth',
    ButtonColor: 'blue',
    NoOfButton: 1,
    ButtonText: 'Add Badge',
    type: 'dateOfBirth',
    disabled: false,
  },
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/currentcity-1.png`,
    title: 'Current City',
    ButtonColor: 'blue',
    ButtonText: 'Add Badge',
    NoOfButton: 1,
    type: 'currentCity',
    disabled: false,
  },
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/hometown.svg`,
    title: 'Home Town',
    ButtonColor: 'blue',
    ButtonText: 'Add Badge',
    NoOfButton: 1,
    type: 'homeTown',
    disabled: false,
  },
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/relationaship-1.png`,
    title: 'Relationship',
    ButtonColor: 'blue',
    ButtonText: 'Add Badge',
    NoOfButton: 1,
    type: 'relationshipStatus',
    disabled: false,
  },
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/work-a.png`,
    title: 'Work',
    ButtonColor: 'blue',
    ButtonText: 'Add Badge',
    NoOfButton: 1,
    disabled: false,
    type: 'work',
  },
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/education-1.png`,
    title: 'Education',
    ButtonColor: 'blue',
    ButtonText: 'Add Badge',
    NoOfButton: 1,
    type: 'education',
    disabled: false,
  },
  // {
  //   image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Identity-2x-1.png`,
  //   title: 'ID / Passport',
  //   ButtonColor: 'gray',
  //   ButtonText: 'Add Badge',
  //   NoOfButton: 1,
  //   disabled: true,
  //   type: 'id-passport',
  //   disabled: true,
  // },
  // {
  //   image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Geolocation-2x-1.png`,
  //   title: 'Geolocation',
  //   ButtonColor: 'blue',
  //   ButtonText: 'Add Badge',
  //   NoOfButton: 1,
  //   type: 'geolocation',
  //   disabled: false,
  // },
  {
    image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/securityquestion-a.png`,
    title: 'Security Question',
    ButtonColor: 'blue',
    ButtonText: 'Add Badge',
    NoOfButton: 1,
    type: 'security-question',
    disabled: false,
  },
];

export const badgesTotalLength = contacts.length + socials.length + web3.length + legacy.length + personal.length;
console.log('first', badgesTotalLength);
