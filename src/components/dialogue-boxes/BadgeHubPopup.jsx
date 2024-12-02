import { useSelector } from 'react-redux';
import { useState } from 'react';
import PopUp from '../ui/PopUp';
import BadgeRemovePopup from './badgeRemovePopup';
import Checkbox from '../ui/Checkbox';
import { FaSpinner } from 'react-icons/fa';
import { Button } from '../ui/Button';

const BadgeHubPopup = ({
  isPopup,
  setIsPopup,
  title,
  logo,
  edit,
  setIsPersonalPopup,
  handleSkip,
  onboarding,
  progress,
}) => {
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [selectedIds, setSelectedIds] = useState([]);

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]));
  };

  const handleItemClick = (id) => {
    handleCheckboxChange(id);
  };

  const [RemoveLoading, setRemoveLoading] = useState(false);
  const [hollow, setHollow] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [deleteModalState, setDeleteModalState] = useState();
  // const [modalVisible, setModalVisible] = useState(false);
  // const handleBadgesClose = () => setModalVisible(false);

  const handleClose = () => setIsPopup(false);

  console.log(persistedUserInfo?.badges);

  return (
    <>
      {/* {modalVisible && (
        <BadgeRemovePopup
          handleClose={handleBadgesClose}
          modalVisible={modalVisible}
          title={deleteModalState?.title}
          image={deleteModalState?.image}
          type={deleteModalState?.type}
          badgeType={deleteModalState?.badgeType}
          setIsPersonalPopup={setIsPersonalPopup}
          setIsLoading={setRemoveLoading}
          loading={RemoveLoading}
        />
      )} */}
      <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo} customClasses={'overflow-y-auto'}>
        <div className="flex flex-col gap-[10px] px-5 py-[15px] tablet:gap-4 tablet:px-[60px] tablet:py-[25px] laptop:px-[80px]">
          <h1 className="summary-text">Select the badges you want to display on your profile.</h1>
          <ul className="flex flex-col gap-[5px] tablet:gap-4">
            {persistedUserInfo?.badges
              ?.filter((badge) => !badge.pseudo)
              ?.map((badge, index) => {
                const badgeName =
                  badge.accountName ||
                  badge.details?.displayName ||
                  (badge.personal?.lastName && 'Last Name') ||
                  (badge.personal?.dateOfBirth && 'Date of Birth') ||
                  (badge.personal?.currentCity && 'Current City') ||
                  (badge.personal?.homeTown && 'Home Town') ||
                  (badge.personal?.relationshipStatus && 'Relationship') ||
                  (badge.personal?.work && 'Work') ||
                  (badge.personal?.education && 'Education') ||
                  (badge.personal?.sex && 'Sex') ||
                  (badge.personal?.linkHub && 'Link Hub') ||
                  (badge.web3 && 'Web3') ||
                  (badge.domain && 'Domain') ||
                  badge.details?.type ||
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
            {edit && (
              <Button
                variant="badge-remove"
                onClick={() => {
                  handleRemoveBadgePopup({
                    title: title,
                    type: type,
                    badgeType: 'personal',
                    image: logo,
                  });
                }}
              >
                {RemoveLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Remove Badge'}
              </Button>
            )}
            {hollow ? (
              <Button variant="submit-hollow" disabled={true}>
                {loading === true ? (
                  <FaSpinner className="animate-spin text-[#EAEAEA]" />
                ) : edit ? (
                  'Update Badge'
                ) : (
                  'Add Badge'
                )}
              </Button>
            ) : (
              <Button variant="submit" onClick={() => (edit ? handleUpdateBadge() : handleAddPersonalBadge())}>
                {loading === true ? (
                  <FaSpinner className="animate-spin text-[#EAEAEA]" />
                ) : edit ? (
                  'Update Badge'
                ) : (
                  'Add Badge'
                )}
              </Button>
            )}
          </div>
        </div>
      </PopUp>
    </>
  );
};

export default BadgeHubPopup;
