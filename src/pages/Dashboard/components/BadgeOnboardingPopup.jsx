import { useState } from 'react';
import PersonalBadgesPopup from '../../../components/dialogue-boxes/PersonalBadgesPopup';
import EducationBadgePopup from '../../../components/dialogue-boxes/EducationBadgePopup';
import WorkBadgePopup from '../../../components/dialogue-boxes/WorkBadgePopup';
import HomepageBadgePopup from '../../../components/dialogue-boxes/HomepageBadgePopup';
import VerificationPopups from '../pages/Profile/components/VerificationPopups';
import AddCellPhonePopup from '../../../components/dialogue-boxes/AddCellPhonePopup';
import InfoPopup from '../../../components/dialogue-boxes/InfoPopup';
import SocialConnectPopup from '../pages/Profile/pages/verification-badges/SocialConnectPopup';
import LegacyBadgePopup from '../../../components/dialogue-boxes/LegacyBadgePopup';
import Web3ConnectPopup from '../pages/Profile/pages/verification-badges/Web3ConnectPopup';

const badgeData = [
  {
    component: InfoPopup,
    title: 'Congratulations!',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/domain-badge.svg`,
    message:
      'Congratulations, you’ve earned 10 FDX! Keep adding verification badges and receive an additional 10 FDX for each one! Every badge you add increases your credibility on Foundation. Every badge added increases your value and credibility on the network.',
    buttonText: 'Continue',
    info: true,
  },
  {
    component: PersonalBadgesPopup,
    title: 'First Name',
    type: 'firstName',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/firstname.png`,
    placeholder: 'First Name Here',
  },
  {
    component: PersonalBadgesPopup,
    title: 'Last Name',
    type: 'lastName',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/lastname.png`,
    placeholder: 'Last Name Here',
  },
  {
    component: PersonalBadgesPopup,
    title: 'Date of Birth',
    type: 'dateOfBirth',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/dob.svg`,
    placeholder: 'MM/DD/YYYY',
  },
  {
    component: HomepageBadgePopup,
    title: 'Domain Badge',
    type: 'domainBadge',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/domain-badge.svg`,
    placeholder: 'Answer Here',
  },

  {
    component: InfoPopup,
    title: 'Onward and upward!',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/domain-badge.svg`,
    message: `Every badge you add strengthens your validity and improves the quality of crowd-sourced insights on Foundation. Plus, you're stacking up more FDX with each step—keep going!`,
    buttonText: 'Continue',
    info: true,
  },
  {
    component: AddCellPhonePopup,
    type: 'cell-phone',
    title: 'Phone Number',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/cellphone-1.png`,
  },

  {
    component: PersonalBadgesPopup,
    title: 'Current City',
    type: 'currentCity',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/currentcity-1.png`,
    placeholder: 'Current City here',
  },
  {
    component: PersonalBadgesPopup,
    title: 'Home Town',
    type: 'homeTown',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/hometown.svg`,
    placeholder: 'Hometown Here',
  },

  {
    component: PersonalBadgesPopup,
    title: 'Geolocation',
    type: 'geolocation',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/education-1.png`,
    placeholder: 'Geolocation',
  },
  {
    component: PersonalBadgesPopup,
    title: 'Sex',
    type: 'sex',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/relationaship-1.png`,
    placeholder: 'Choose',
  },
  {
    component: PersonalBadgesPopup,
    title: 'Relationship Status',
    type: 'relationshipStatus',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/relationship.svg`,
    placeholder: 'Choose',
  },

  {
    component: InfoPopup,
    title: 'Lets keep going!',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/domain-badge.svg`,
    message: `Adding more badges leads to more opportunities and rewards for you on Foundation. Keep the momentum going!`,
    buttonText: 'Continue',
    info: true,
  },
  {
    component: VerificationPopups,
    type: 'personal',
    title: 'Personal Email',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Personal-Email-2xa.png`,
    placeholder: 'Personal email here',
  },
  {
    component: WorkBadgePopup,
    title: 'Work',
    type: 'work',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/work-a.png`,
    placeholder: 'Work Here',
  },
  {
    component: VerificationPopups,
    type: 'work',
    title: 'Work Email',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Work-Email-2xa.png`,
    placeholder: 'Work email here',
  },

  {
    component: EducationBadgePopup,
    title: 'Education',
    type: 'education',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/education-1.png`,
    placeholder: 'Education Here',
  },
  {
    component: VerificationPopups,
    type: 'education',
    title: 'Education Email',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Education-Email-2xa.png`,
    placeholder: 'Educational email here',
  },
  {
    component: PersonalBadgesPopup,
    title: 'Security Question',
    type: 'security-question',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/securityquestion-a.png`,
    placeholder: 'Answer Here',
  },

  {
    component: InfoPopup,
    title: 'Let’s take it to the next level!',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/domain-badge.svg`,
    message: `Adding all these badges starts you off with an impressive FDX balance! Your contributions play a key role in keeping Foundation’s data authentic. Keep it up—more badges and rewards are just ahead!`,
    buttonText: 'Continue',
    info: true,
  },
  {
    component: LegacyBadgePopup,
    title: 'Password',
    type: 'password',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/wallet.svg`,
    placeholder: 'Answer Here',
  },
  {
    component: SocialConnectPopup,
    type: 'twitter',
    title: 'Twitter',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Twitter-2x.png`,
    accountName: 'twitter',
    link: '/auth/twitter',
  },
  {
    component: SocialConnectPopup,
    type: 'linkedin',
    title: 'LinkedIn',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/LinkedIn-2x.png`,
    accountName: 'linkedin',
    link: '/auth/linkedin',
  },
  {
    component: SocialConnectPopup,
    type: 'facebook',
    title: 'Facebook',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Facebook-2x.png`,
    accountName: 'facebook',
    link: '/auth/facebook',
  },
  {
    component: SocialConnectPopup,
    type: 'github',
    title: 'Github',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Github-2x.png`,
    accountName: 'github',
    link: '/auth/github',
  },

  {
    component: SocialConnectPopup,
    type: 'farcaster',
    title: 'Farcaster',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/verification-badges/farcaster.svg`,
    accountName: '',
    link: '',
  },
  {
    component: Web3ConnectPopup,
    type: 'etherium-wallet',
    title: 'Ethereum Wallet',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/verification-badges/farcaster.svg`,
    accountName: 'Farcaster',
    link: '',
  },

  {
    component: InfoPopup,
    title: 'Thats all the badges!',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/domain-badge.svg`,
    message: `Completing all your verification badges gives you a highly verified status on Foundation!`,
    message2:
      'Your commitment to completing all badges enhances your credibility and opens the door to more earning opportunities.',
    message3: 'Thank you for being an essential part of our community!',
    buttonText: 'Finish',
    info: true,
  },
  {
    component: InfoPopup,
    title: 'Continue Where You Left Off!',
    logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/domain-badge.svg`,
    message: `Add more badges to boost your profile, increase credibility, and easily earn more FDX along the way. Each badge brings you closer to maximizing your earning potential on Foundation!`,
    buttonText: 'Continue',
    info: true,
  },
];

export const BadgeOnboardingPopup = ({ isPopup, setIsPopup, edit, setEdit, fetchUser }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    console.log(currentIndex, badgeData.length - 1);

    if (currentIndex < badgeData.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsPopup(false);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleAdd = () => {
    handleNext();
  };

  const actionableBadges = badgeData.filter((badge) => !badge.info);
  const totalBadges = actionableBadges.length;
  const completedBadges = actionableBadges.slice(0, currentIndex).length;
  const progress = Math.floor((completedBadges / totalBadges) * 100);

  const CurrentBadgeComponent = badgeData[currentIndex].component;

  return (
    <CurrentBadgeComponent
      isPopup={isPopup}
      setIsPopup={setIsPopup}
      title={badgeData[currentIndex].title}
      type={badgeData[currentIndex].type}
      logo={badgeData[currentIndex].logo}
      placeholder={badgeData[currentIndex].placeholder}
      edit={edit}
      setEdit={setEdit}
      fetchUser={fetchUser}
      handleSkip={handleSkip}
      handleAdd={handleAdd}
      onboarding={true}
      selectedBadge={badgeData[currentIndex].type}
      message={badgeData[currentIndex].message}
      message2={badgeData[currentIndex].message2}
      message3={badgeData[currentIndex].message3}
      buttonText={badgeData[currentIndex].buttonText}
      accountName={badgeData[currentIndex].accountName}
      link={badgeData[currentIndex].link}
      progress={progress}
    />
  );
};
