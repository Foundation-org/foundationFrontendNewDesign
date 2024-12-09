import { useSelector } from 'react-redux';
import PersonalBadgesPopup from '../../../components/dialogue-boxes/PersonalBadgesPopup';
import HomepageBadgePopup from '../../../components/dialogue-boxes/HomepageBadgePopup';
import LinkHubPopup from '../../../components/dialogue-boxes/LinkHubPopup';
import AddCellPhonePopup from '../../../components/dialogue-boxes/AddCellPhonePopup';
import VerificationPopups from '../../Dashboard/pages/Profile/components/VerificationPopups';
import WorkBadgePopup from '../../../components/dialogue-boxes/WorkBadgePopup';
import EducationBadgePopup from '../../../components/dialogue-boxes/EducationBadgePopup';
import LegacyBadgePopup from '../../../components/dialogue-boxes/LegacyBadgePopup';
import SocialConnectPopup from '../../Dashboard/pages/Profile/pages/verification-badges/SocialConnectPopup';
import Web3ConnectPopup from '../../Dashboard/pages/Profile/pages/verification-badges/Web3ConnectPopup';
import { useState } from 'react';

export default function BadgeHubAddBadge({ isPopup, setIsPopup, edit, setEdit, type, badges }) {
  // const fetchUser = useSelector((state) => state.auth.user);

  const checkDomainBadge = () => {
    return badges?.some((badge) => !!badge?.domain) || false;
  };
  const checkSocial = (name) => badges?.some((i) => i.accountName === name);

  const checkContact = (itemType) => badges?.some((i) => i.type === itemType);

  const checkLegacyBadge = () => badges?.some((badge) => (badge?.legacy ? true : false));

  const checkWeb3Badge = (itemType) => badges?.some((badge) => badge?.web3?.hasOwnProperty(itemType) || false) || false;

  const checkPersonalBadge = (itemType) =>
    badges?.some((badge) => badge?.personal?.hasOwnProperty(itemType) || false) || false;

  const checkWorkOrEdu = (itemType) =>
    badges?.find((badge) => badge.personal && badge.personal.hasOwnProperty(itemType));

  const getBadgeByType = (type) => badges?.find((badge) => badge?.type === type) || null;

  const badgeData = [
    {
      component: PersonalBadgesPopup,
      title: 'Date of Birth',
      type: 'dateOfBirth',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/dob.svg`,
      placeholder: 'MM/DD/YYYY',
      info: false,
      check: checkPersonalBadge('dateOfBirth'),
      badgeHubType: 'dateOfBirth',
    },
    {
      component: LinkHubPopup,
      title: 'Link Hub',
      type: 'linkHub',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/linkhub.svg`,
      info: false,
      check: checkPersonalBadge('linkHub'),
      badgeHubType: 'linkHub',
    },
    {
      component: AddCellPhonePopup,
      type: 'cell-phone',
      title: 'Phone Number',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/cellphone-1.png`,
      info: false,
      check: checkContact('cell-phone'),
      badgeHubType: 'cell-phone',
    },
    {
      component: PersonalBadgesPopup,
      title: 'Current City',
      type: 'currentCity',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/currentcity-1.png`,
      placeholder: 'Current City here',
      info: false,
      check: checkPersonalBadge('currentCity'),
      badgeHubType: 'currentCity',
    },
    {
      component: PersonalBadgesPopup,
      title: 'Home Town',
      type: 'homeTown',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/hometown.svg`,
      placeholder: 'Hometown Here',
      info: false,
      check: checkPersonalBadge('homeTown'),
      badgeHubType: 'homeTown',
    },
    {
      component: PersonalBadgesPopup,
      title: 'Geolocation',
      type: 'geolocation',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/education-1.png`,
      placeholder: 'Geolocation',
      info: false,
      check: checkPersonalBadge('geolocation'),
      badgeHubType: 'geolocation',
    },
    {
      component: PersonalBadgesPopup,
      title: 'Sex',
      type: 'sex',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/relationaship-1.png`,
      placeholder: 'Choose',
      info: false,
      check: checkPersonalBadge('sex'),
      badgeHubType: 'sex',
    },
    {
      component: PersonalBadgesPopup,
      title: 'Relationship Status',
      type: 'relationshipStatus',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/relationship.svg`,
      placeholder: 'Choose',
      info: false,
      check: checkPersonalBadge('relationshipStatus'),
      badgeHubType: 'relationshipStatus',
    },
    {
      component: VerificationPopups,
      type: 'personal',
      title: 'Personal Email',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Personal-Email-2xa.png`,
      placeholder: 'Personal email here',
      info: false,
      check: checkContact('personal'),
      badgeHubType: 'personal',
    },
    {
      component: WorkBadgePopup,
      title: 'Work',
      type: 'work',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/work-a.png`,
      placeholder: 'Work Here',
      info: false,
      check: checkWorkOrEdu('work'),
      badgeHubType: 'workPersonal',
    },
    {
      component: VerificationPopups,
      type: 'work',
      title: 'Work Email',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Work-Email-2xa.png`,
      placeholder: 'Work email here',
      info: false,
      check: checkContact('work'),
      badgeHubType: 'work',
    },
    {
      component: EducationBadgePopup,
      title: 'Education',
      type: 'education',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/education-1.png`,
      placeholder: 'Education Here',
      info: false,
      check: checkWorkOrEdu('education'),
      badgeHubType: 'educationPersonal',
    },
    {
      component: VerificationPopups,
      type: 'education',
      title: 'Education Email',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Education-Email-2xa.png`,
      placeholder: 'Educational email here',
      info: false,
      check: checkContact('education'),
      badgeHubType: 'education',
    },
    {
      component: SocialConnectPopup,
      type: 'twitter',
      title: 'Twitter',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Twitter-2x.png`,
      accountName: 'twitter',
      link: '/auth/twitter',
      info: false,
      check: checkSocial('twitter'),
      badgeHubType: 'twitter',
    },
    {
      component: SocialConnectPopup,
      type: 'linkedin',
      title: 'LinkedIn',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/LinkedIn-2x.png`,
      accountName: 'linkedin',
      link: '/auth/linkedin',
      info: false,
      check: checkSocial('linkedin'),
      badgeHubType: 'linkedin',
    },
    {
      component: SocialConnectPopup,
      type: 'facebook',
      title: 'Facebook',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Facebook-2x.png`,
      accountName: 'facebook',
      link: '/auth/facebook',
      info: false,
      check: checkSocial('facebook'),
      badgeHubType: 'facebook',
    },
    {
      component: SocialConnectPopup,
      type: 'github',
      title: 'Github',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Github-2x.png`,
      accountName: 'github',
      link: '/auth/github',
      info: false,
      check: checkSocial('github'),
      badgeHubType: 'github',
    },
    {
      component: SocialConnectPopup,
      type: 'farcaster',
      title: 'Farcaster',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/verification-badges/farcaster.svg`,
      accountName: '',
      link: '',
      check: checkSocial('farcaster'),
      badgeHubType: 'farcaster',
    },
    {
      component: Web3ConnectPopup,
      type: 'etherium-wallet',
      title: 'Ethereum Wallet',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/verification-badges/farcaster.svg`,
      accountName: '',
      link: '',
      check: checkWeb3Badge('etherium-wallet'),
      badgeHubType: 'etherium-wallet',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const actionableBadges = badgeData.filter((badge) => badge.badgeHubType === type);

  const CurrentBadgeComponent = actionableBadges[currentIndex]?.component;

  return (
    <CurrentBadgeComponent
      isPopup={isPopup}
      setIsPopup={() => setIsPopup(false)}
      title={actionableBadges[currentIndex]?.title}
      type={actionableBadges[currentIndex]?.type}
      logo={actionableBadges[currentIndex]?.logo}
      placeholder={actionableBadges[currentIndex]?.placeholder}
      edit={edit}
      setEdit={setEdit}
      fetchUser={badges}
      //   handleSkip={handleSkip}
      onboarding={false}
      selectedBadge={getBadgeByType(type)}
      message={actionableBadges[currentIndex]?.message}
      message2={actionableBadges[currentIndex]?.message2}
      message3={actionableBadges[currentIndex]?.message3}
      buttonText={actionableBadges[currentIndex]?.buttonText}
      accountName={actionableBadges[currentIndex]?.accountName}
      link={actionableBadges[currentIndex]?.link}
      page={edit ? 'badgeHub' : ''}
    />
  );
}
