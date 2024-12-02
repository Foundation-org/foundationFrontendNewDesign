import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import PopUp from '../ui/PopUp';
import BadgeRemovePopup from './badgeRemovePopup';
import Checkbox from '../ui/Checkbox';
import { FaSpinner } from 'react-icons/fa';
import { Button } from '../ui/Button';
import { useAddBadgeHub } from '../../services/mutations/verification-adges';

const BadgeHubPopup = ({ isPopup, setIsPopup, title, logo }) => {
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [hollow, setHollow] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const handleClose = () => setIsPopup(false);

  const { mutateAsync: handleAddBadgeHub, isPending } = useAddBadgeHub();

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]));
  };

  const handleItemClick = (id) => {
    handleCheckboxChange(id);
  };

  useEffect(() => {
    if (persistedUserInfo?.badges) {
      const addedBadgeIds = persistedUserInfo.badges.filter((badge) => badge.isAdded).map((badge) => badge._id);

      setSelectedIds(addedBadgeIds);
    }
  }, [persistedUserInfo?.badges]);

  const selectAll = () => {
    const allIds = persistedUserInfo?.badges.map((badge) => badge._id);
    setSelectedIds(allIds);
  };

  const allSelected = persistedUserInfo?.badges.map((badge) => badge._id);

  return (
    <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo} customClasses={'overflow-y-auto'}>
      <div className="flex flex-col gap-[10px] px-5 py-[15px] tablet:gap-4 tablet:px-[60px] tablet:py-[25px] laptop:px-[80px]">
        <h1 className="summary-text">Select the badges you want to display on your profile.</h1>
        <ul className="flex flex-col gap-[5px] tablet:gap-4">
          {persistedUserInfo?.badges
            ?.filter(
              (badge) =>
                !badge.pseudo &&
                !badge.personal?.firstName &&
                !badge.personal?.lastName &&
                !badge.personal?.['security-question'] &&
                !badge.domain
            )
            ?.map((badge, index) => {
              const badgeName =
                (badge.type === 'personal' && 'Personal') ||
                (badge.type === 'work' && 'Work') ||
                (badge.type === 'cell-phone' && 'Cell Phone') ||
                badge.details?.provider ||
                (badge.personal?.dateOfBirth && 'Date of Birth') ||
                (badge.personal?.currentCity && 'Current City') ||
                (badge.personal?.homeTown && 'Home Town') ||
                (badge.personal?.relationshipStatus && 'Relationship') ||
                (badge.personal?.education && 'Education') ||
                (badge.personal?.sex && 'Sex') ||
                (badge.personal?.geolocation && 'Geolocation') ||
                (badge.personal?.linkHub && 'Link Hub') ||
                (badge.web3 && 'Web3') ||
                'Unknown';

              return (
                <li
                  key={badge._id || index}
                  className="mx-auto flex w-full max-w-[70%] cursor-pointer items-center justify-center gap-[10px] rounded-md border border-gray-100 px-4 py-1 tablet:gap-6 tablet:rounded-lg tablet:border-2 tablet:py-2"
                  onClick={() => handleItemClick(badge._id)}
                >
                  <Checkbox
                    id={badge._id}
                    checked={selectedIds.includes(badge._id)}
                    onChange={() => handleCheckboxChange(badge._id)}
                  />
                  <div className="dark-shadow-input flex h-[21.5px] w-[24vw] items-center justify-center rounded-[1.31vw] border border-white-500 dark:border-gray-100 dark:bg-accent-100 tablet:h-[50px] tablet:w-[200px] tablet:rounded-[8px] tablet:border-[3px] laptop:rounded-[15px]">
                    <h1 className="text-[2.11vw] font-medium capitalize leading-normal text-[#000] dark:text-gray-400 tablet:text-[20px]">
                      {badgeName}
                    </h1>
                  </div>
                  <h5 className="summary-text">Added</h5>
                </li>
              );
            })}
        </ul>
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
              handleAddBadgeHub(selectedIds);
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
