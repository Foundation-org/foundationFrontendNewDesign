import { Button } from '../ui/Button';
import { useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import PopUp from '../ui/PopUp';
import BadgeRemovePopup from './badgeRemovePopup';
import useAddDomainBadge from '../../services/mutations/verification-adges';
import { moderationRating } from '../../services/api/questsApi';
import { toast } from 'sonner';
import DynamicBadgeImageCropper from '../DynamicBadgeImageCropper';

const HomepageBadgePopup = ({ isPopup, setIsPopup, title, logo, edit, setIsPersonalPopup }) => {
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [domainBadge, setDomainBadge] = useState({
    title: '',
    domain: '',
    description: '',
    image: '',
  });

  const [RemoveLoading, setRemoveLoading] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  const handleClose = () => setIsPopup(false);
  const handleBadgesClose = () => setModalVisible(false);

  const { mutateAsync: addDomainBadge } = useAddDomainBadge(domainBadge, edit, setLoading, handleClose);

  const checkDomainBadge = () => {
    return persistedUserInfo?.badges?.some((badge) => !!badge?.domain) || false;
  };

  useEffect(() => {
    if (checkDomainBadge()) {
      const domainBadge = persistedUserInfo?.badges.find((badge) => badge?.domain);

      setDomainBadge({
        title: domainBadge?.domain?.title,
        domain: domainBadge?.domain?.name,
        description: domainBadge?.domain?.description,
        image: domainBadge?.domain?.s3Urls,
      });
    }
  }, [persistedUserInfo]);

  const handleRemoveBadgePopup = (item) => {
    setDeleteModalState(item);
    setModalVisible(true);
  };

  const validateDomainInput = (input) => {
    const isValidPattern = /^[a-z0-9-]*$/.test(input);
    const isWithinLimit = input.length <= 63;

    return isValidPattern && isWithinLimit;
  };

  const handleDomainChange = (e) => {
    const input = e.target.value;

    if (validateDomainInput(input)) {
      setDomainBadge({ ...domainBadge, domain: input });
    }
  };

  const handleDomainInputBlur = async () => {
    const cleanedDomain = domainBadge.domain.replace(/^-+|-+$/g, '');
    setDomainBadge({ ...domainBadge, domain: cleanedDomain });

    if (cleanedDomain.startsWith('-') || cleanedDomain.endsWith('-')) {
      return;
    }

    try {
      const moderationRatingResult = await moderationRating({
        validatedQuestion: cleanedDomain,
      });

      if (moderationRatingResult.moderationRatingCount === 0) {
        setDomainBadge({ ...domainBadge, domain: cleanedDomain });
      } else {
        toast.warning('Domain is not allowed');
        setDomainBadge({ ...domainBadge, domain: '' });
        return;
      }
      console.log('Moderation rating result:', moderationRatingResult);
    } catch (error) {
      console.error('Error checking moderation rating:', error);
    }
  };

  console.log({ domainBadge });

  return (
    <>
      {modalVisible && (
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
      )}
      <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo}>
        <div className="flex flex-col gap-[10px] px-5 py-[15px] tablet:gap-4 tablet:px-[60px] tablet:py-[25px] laptop:px-[80px]">
          <div>
            <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:mb-[10px] tablet:text-[20px] tablet:leading-[20px]">
              Domain
            </p>
            <input
              type="text"
              value={domainBadge.domain}
              onChange={handleDomainChange}
              onBlur={handleDomainInputBlur}
              className={`verification_badge_input ${edit ? (domainBadge.domain ? '' : 'caret-hidden') : ''}`}
            />
            <p>Domain Preview: {`(${domainBadge.domain}.${window.location.hostname})`}</p>
          </div>
          <div>
            <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:mb-[10px] tablet:text-[20px] tablet:leading-[20px]">
              Title
            </p>
            <input
              type="text"
              value={domainBadge.title}
              onChange={(e) => {
                setDomainBadge({ ...domainBadge, title: e.target.value });
              }}
              placeholder="Title"
              className={`verification_badge_input ${edit ? (domainBadge.title ? '' : 'caret-hidden') : ''}`}
            />
          </div>
          <div>
            <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:mb-[10px] tablet:text-[20px] tablet:leading-[20px]">
              Description
            </p>
            <TextareaAutosize
              id="input-2"
              aria-label="multiple choice question"
              placeholder="Enter description here"
              value={domainBadge.description}
              onChange={(e) => {
                if (e.target.value.length <= 300) {
                  setDomainBadge({ ...domainBadge, description: e.target.value });
                }
              }}
              tabIndex={2}
              minRows={4}
              // onBlur={(e) => e.target.value.trim() !== '' && questionVerification(e.target.value)}
              // onKeyDown={(e) => e.key === 'Tab' || (e.key === 'Enter' && handleTab(2, 'Enter'))}
              className={`verification_badge_input resize-none ${edit ? (domainBadge.description ? '' : 'caret-hidden') : ''}`}
            />
            <p>Characters Remaining: {300 - domainBadge.description.length}</p>
          </div>
          <div>
            <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:mb-[10px] tablet:text-[20px] tablet:leading-[20px]">
              Image
            </p>
            <div className="flex w-full items-center justify-center">
              <label
                htmlFor="dropzone-file"
                className={`verification_badge_input resize-none py-5 ${edit ? (domainBadge.image ? '' : 'caret-hidden') : ''}`}
              >
                <div className="flex flex-col items-center justify-center">
                  <p>Upload Your Image</p>
                  <p className="text-[16px] font-normal">Please upload your image or drag and drop it here.</p>
                  <p className="text-[16px] font-normal">Ensure the image has a 16:9 aspect ratio.</p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    setDomainBadge({ ...domainBadge, image: e.target.files[0] });
                  }}
                />
              </label>
            </div>
          </div>
          <DynamicBadgeImageCropper imgSrc={domainBadge.image} setDomainBadge={setDomainBadge} />
          {/* {domainBadge.image && (
            <div className="flex items-center">
              <img
                src={domainBadge.image?.length === 2 ? domainBadge.image[0] : URL.createObjectURL(domainBadge.image)}
                alt="badge"
                className="aspect-video rounded-md object-contain"
              />
            </div>
          )} */}
          <div className="flex justify-end gap-[15px] tablet:gap-[35px]">
            {edit && (
              <Button
                variant="badge-remove"
                onClick={() => {
                  handleRemoveBadgePopup({
                    title: 'Domain Badge',
                    type: 'domainBadge',
                    badgeType: 'homepage',
                    image: logo,
                  });
                }}
              >
                {RemoveLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Remove'}
              </Button>
            )}
            <div className="flex gap-2">
              <Button variant={'submit'} onClick={() => addDomainBadge()}>
                {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : edit ? 'Update' : 'Add'}
              </Button>
            </div>
          </div>
        </div>
      </PopUp>
    </>
  );
};

export default HomepageBadgePopup;
