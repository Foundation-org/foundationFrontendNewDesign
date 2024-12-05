import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import PopUp from '../ui/PopUp';
import Checkbox from '../ui/Checkbox';
import { FaSpinner } from 'react-icons/fa';
import { Button } from '../ui/Button';
import { useAddBadgeHub } from '../../services/mutations/verification-adges';
import { contactBadges, personalBadges, socialBadges } from '../../constants/badge-hub';
import { Link } from 'react-router-dom';
import * as badgeService from '../../utils/helper-function/badge-service';

const BadgeHubPopup = ({ isPopup, setIsPopup, title, logo }) => {
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [hollow, setHollow] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const handleClose = () => setIsPopup(false);

  const { mutateAsync: handleAddBadgeHub, isPending } = useAddBadgeHub();

  const handleCheckboxChange = (id, type) => {
    setSelectedIds((prev) => {
      const itemExists = prev.some((selectedItem) => selectedItem.id === id && selectedItem.type === type);

      if (itemExists) {
        return prev.filter((selectedItem) => selectedItem.id !== id || selectedItem.type !== type);
      } else {
        return [...prev, { id, type }];
      }
    });
  };

  useEffect(() => {
    if (persistedUserInfo?.badges) {
      const addedBadges = persistedUserInfo.badges
        .filter((badge) => badge.isAdded)
        .map((badge) => ({ id: badge._id, type: badge.type }));

      setSelectedIds(addedBadges);
    }
  }, [persistedUserInfo?.badges]);

  const getBadgeIds = (badgeList, badgeTypes) => {
    return badgeList
      .filter((badge) => badgeTypes.some((badgeType) => badgeType.type === badge.type))
      .map((badge) => ({ id: badge._id, type: badge.type }));
  };

  const selectAll = () => {
    const allSocialBadges = getBadgeIds(persistedUserInfo?.badges, socialBadges);
    const allContactIds = getBadgeIds(persistedUserInfo?.badges, contactBadges);
    const allPersonalIds = getBadgeIds(persistedUserInfo?.badges, personalBadges);

    const arr = [...allSocialBadges, ...allContactIds, ...allPersonalIds];

    setSelectedIds(arr);
  };

  const getSelectedBadgeTypes = (badgeTypes) => {
    return badgeTypes
      .filter((infoBadge) => persistedUserInfo?.badges?.some((badge) => badge.type === infoBadge.type))
      .map((badge) => badge.type);
  };

  const allSelected = [
    ...getSelectedBadgeTypes(personalBadges),
    ...getSelectedBadgeTypes(socialBadges),
    ...getSelectedBadgeTypes(contactBadges),
  ];

  const handleBadgeId = (type) => {
    const badge = badgeService.getBadgeIdByType(persistedUserInfo, type);
    handleCheckboxChange(badge, type);
  };

  const isAddedInBadgeHub = (itemType) => selectedIds?.some((badge) => badge?.type === itemType) || false;

  return (
    <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo} customClasses={'overflow-y-auto'}>
      <div className="flex flex-col gap-[10px] px-5 py-[15px] tablet:gap-4 tablet:px-[60px] tablet:py-[25px] laptop:px-[80px]">
        <h1 className="summary-text">Select the badges you want to display on your profile.</h1>
        <div>
          <h1 className="summary-text">Social Badges</h1>
          <ul className="flex flex-col gap-[5px] tablet:gap-4">
            {socialBadges.map((badge, index) => (
              <li
                key={index}
                className="mx-auto flex w-full max-w-[70%] cursor-pointer items-center justify-between gap-[10px] tablet:gap-6"
                onClick={() => handleBadgeId(badge.type)}
              >
                {badgeService.checkBadgeExists(persistedUserInfo, badge.type) ? (
                  <Checkbox
                    id={index}
                    checked={isAddedInBadgeHub(badge.type)}
                    onChange={() => handleBadgeId(badge.type)}
                  />
                ) : (
                  <div className="size-[25px]"></div>
                )}
                <img src={badge.image} alt={badge.title} className="h-[6.389vw] w-[6.389vw] tablet:size-[50px]" />
                <div className="flex h-[21.5px] w-[24vw] items-center justify-center rounded-[1.31vw] border border-white-500 dark:border-gray-100 dark:bg-accent-100 tablet:h-[50px] tablet:w-[200px] tablet:rounded-[8px] tablet:border-[3px] laptop:rounded-[15px]">
                  <h1 className="text-[2.11vw] font-medium capitalize leading-normal text-gray dark:text-gray-400 tablet:text-[20px]">
                    {badge.title}
                  </h1>
                </div>
                <h5 className="summary-text tablet:min-w-[122px]">
                  {badgeService.checkBadgeExists(persistedUserInfo, badge.type) ? (
                    'Added'
                  ) : (
                    <Link to={'/profile/verification-badges'} className="whitespace-nowrap text-blue-100 underline">
                      Add This Badge
                    </Link>
                  )}
                </h5>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h1 className="summary-text">Contact Badges</h1>
          <ul className="flex flex-col gap-[5px] tablet:gap-4">
            {contactBadges.map((badge, index) => (
              <li
                key={index}
                className="mx-auto flex w-full max-w-[70%] cursor-pointer items-center justify-between gap-[10px] tablet:gap-6"
                onClick={() => handleBadgeId(badge.type)}
              >
                {badgeService.checkBadgeExists(persistedUserInfo, badge.type) ? (
                  <Checkbox
                    id={index}
                    checked={isAddedInBadgeHub(badge.type)}
                    onChange={() => handleBadgeId(badge.type)}
                  />
                ) : (
                  <div className="size-[25px]"></div>
                )}
                <img src={badge.image} alt={badge.title} className="h-[6.389vw] w-[6.389vw] tablet:size-[50px]" />
                <div className="flex h-[21.5px] w-[24vw] items-center justify-center rounded-[1.31vw] border border-white-500 dark:border-gray-100 dark:bg-accent-100 tablet:h-[50px] tablet:w-[200px] tablet:rounded-[8px] tablet:border-[3px] laptop:rounded-[15px]">
                  <h1 className="text-[2.11vw] font-medium capitalize leading-normal text-gray dark:text-gray-400 tablet:text-[20px]">
                    {badge.title}
                  </h1>
                </div>
                <h5 className="summary-text tablet:min-w-[122px]">
                  {badgeService.checkBadgeExists(persistedUserInfo, badge.type) ? (
                    'Added'
                  ) : (
                    <Link to={'/profile/verification-badges'} className="whitespace-nowrap text-blue-100 underline">
                      Add This Badge
                    </Link>
                  )}
                </h5>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h1 className="summary-text">Personal Badges</h1>
          <ul className="flex flex-col gap-[5px] tablet:gap-4">
            {personalBadges.map((badge, index) => (
              <li
                key={index}
                className="mx-auto flex w-full max-w-[70%] cursor-pointer items-center justify-between gap-[10px] tablet:gap-6"
                onClick={() => handleBadgeId(badge.type)}
              >
                {badgeService.checkBadgeExists(persistedUserInfo, badge.type) ? (
                  <Checkbox
                    id={index}
                    checked={isAddedInBadgeHub(badge.type)}
                    onChange={() => handleBadgeId(badge.type)}
                  />
                ) : (
                  <div className="size-[25px]"></div>
                )}
                <img src={badge.image} alt={badge.title} className="h-[6.389vw] w-[6.389vw] tablet:size-[50px]" />
                <div className="flex h-[21.5px] w-[24vw] items-center justify-center rounded-[1.31vw] border border-white-500 dark:border-gray-100 dark:bg-accent-100 tablet:h-[50px] tablet:w-[200px] tablet:rounded-[8px] tablet:border-[3px] laptop:rounded-[15px]">
                  <h1 className="text-[2.11vw] font-medium capitalize leading-normal text-gray dark:text-gray-400 tablet:text-[20px]">
                    {badge.title}
                  </h1>
                </div>
                <h5 className="summary-text tablet:min-w-[122px]">
                  {badgeService.checkBadgeExists(persistedUserInfo, badge.type) ? (
                    'Added'
                  ) : (
                    <Link to={'/profile/verification-badges'} className="whitespace-nowrap text-blue-100 underline">
                      Add This Badge
                    </Link>
                  )}
                </h5>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-5 tablet:gap-[35px]">
          <Button
            variant="submit"
            onClick={() => {
              if (selectedIds.length > 1 && allSelected.length === selectedIds.length) {
                setSelectedIds([]);
              } else {
                selectAll();
              }
            }}
          >
            {selectedIds.length > 1 && allSelected.length === selectedIds.length ? 'Clear All' : 'Select All'}
          </Button>
          <Button
            variant={hollow ? 'submit-hollow' : 'submit'}
            disabled={hollow}
            onClick={() => {
              const ids = selectedIds.map((badge) => badge.id);
              handleAddBadgeHub(ids);
            }}
          >
            {isPending ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Save'}
          </Button>
        </div>
      </div>
    </PopUp>
  );
};

export default BadgeHubPopup;
