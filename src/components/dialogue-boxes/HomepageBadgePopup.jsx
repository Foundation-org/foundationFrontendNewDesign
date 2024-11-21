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
import ProgressBar from '../ProgressBar';
import ImageCropper from '../ImageCropper';

const HomepageBadgePopup = ({
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
  const [loading, setLoading] = useState(false);
  const [domainBadge, setDomainBadge] = useState({
    title: '',
    domain: '',
    description: '',
    image: [],
  });
  const [prevState, setPrevState] = useState({
    title: '',
    domain: '',
    description: '',
    image: [],
  });
  const [RemoveLoading, setRemoveLoading] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  const handleClose = () => setIsPopup(false);
  const handleBadgesClose = () => setModalVisible(false);

  const { mutateAsync: addDomainBadge } = useAddDomainBadge(
    domainBadge,
    edit,
    setLoading,
    handleClose,
    onboarding,
    handleSkip
  );

  const checkDomainBadge = () => {
    return persistedUserInfo?.badges?.some((badge) => !!badge?.domain) || false;
  };

  useEffect(() => {
    if (checkDomainBadge()) {
      const domainBadge = persistedUserInfo?.badges.find((badge) => badge?.domain);

      const image = [
        domainBadge?.domain?.s3Urls[0], // 1:1 image
        domainBadge?.domain?.s3Urls[1], // 16:9 image
        domainBadge?.domain?.s3Urls[1], // 16:9 image again
      ];

      setDomainBadge({
        title: domainBadge?.domain?.title,
        domain: domainBadge?.domain?.name,
        description: domainBadge?.domain?.description,
        image: image,
      });
      setPrevState({
        title: domainBadge?.domain?.title,
        domain: domainBadge?.domain?.name,
        description: domainBadge?.domain?.description,
        image: image,
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
    if (domainBadge.domain === '') {
      return;
    }
    const cleanedDomain = domainBadge.domain.replace(/^-+|-+$/g, '');
    setDomainBadge({ ...domainBadge, domain: cleanedDomain });

    if (cleanedDomain.startsWith('-') || cleanedDomain.endsWith('-')) {
      return;
    }

    try {
      const moderationRatingResult = await moderationRating({
        validatedQuestion: cleanedDomain,
      });

      if (moderationRatingResult.moderationRatingCount !== 0) {
        toast.warning('Domain is not allowed');
        setDomainBadge((prevBadge) => ({
          ...prevBadge,
          domain: '',
        }));
        return;
      }
    } catch (error) {
      console.error('Error checking moderation rating:', error);
    }
  };

  const checkHollow = () => {
    // console.log('A', JSON.stringify(prevState));
    // console.log('B', JSON.stringify(domainBadge));
    if (edit) {
      if (JSON.stringify(prevState) === JSON.stringify(domainBadge)) {
        return true;
      } else {
        return false;
      }
    } else {
      if (
        domainBadge.title === '' ||
        domainBadge.domain === '' ||
        domainBadge.description === '' ||
        (domainBadge.image[0] && typeof domainBadge.image[0] === 'string' && domainBadge.image[0].startsWith('blob:'))
      ) {
        return true;
      } else {
        return false;
      }
    }
  };

  useEffect(() => {
    checkHollow();
  }, [domainBadge.title, domainBadge.domain, domainBadge.description, domainBadge.image]);

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1000000) {
        toast.warning('File size is too large. Please upload a file less than 1MB.');
        return;
      }
      const image = URL.createObjectURL(file);
      setDomainBadge({ ...domainBadge, image: [image, image, image] });
    }
  };

  const handleCropComplete = async (blob) => {
    if (blob) {
      setDomainBadge((prev) => {
        const updatedImages = [...prev.image];
        updatedImages[0] = blob; // Set the blob at index 1
        return { ...prev, image: updatedImages };
      });
    } else {
      console.error('Crop failed or returned null Blob');
    }
  };

  const handleCropComplete2 = async (blob) => {
    if (blob) {
      setDomainBadge((prev) => {
        const updatedImages = [...prev.image];
        updatedImages[1] = blob; // Set the blob at index 2
        return { ...prev, image: updatedImages };
      });
    } else {
      console.error('Crop failed or returned null Blob');
    }
  };

  console.log(domainBadge.image);

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
          <h1 className="summary-text">
            Your Home Page is the hub for connecting with your audience. Share posts, lists and news easily with your
            audience.
          </h1>
          <div>
            <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:mb-[10px] tablet:text-[20px] tablet:leading-[20px]">
              Domain
            </p>
            <div className="relative inline-block w-full">
              <input
                type="text"
                value={domainBadge.domain}
                onChange={handleDomainChange}
                onBlur={handleDomainInputBlur}
                className={`verification_badge_input ${edit ? (domainBadge.domain ? '' : 'caret-hidden') : ''}`}
                placeholder="Enter domain"
              />
              {/* Display the suffix next to the input */}
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[9.28px] text-gray-500 dark:text-[#f1f1f1] tablet:text-[20px]">
                .on.foundation
              </span>
            </div>
            <p className="text-[9.28px] tablet:text-[20px]">Characters Remaining: {63 - domainBadge.domain.length}</p>
          </div>
          <div>
            <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:mb-[10px] tablet:text-[20px] tablet:leading-[20px]">
              Name / Organization
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
            <p className="text-[9.28px] tablet:text-[20px]">
              Characters Remaining: {300 - domainBadge.description.length}
            </p>
            <p className="text-[9.28px] tablet:text-[20px]">For best SEO results, use 100+ characters</p>
          </div>
          <div>
            <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:mb-[10px] tablet:text-[20px] tablet:leading-[20px]">
              Image
            </p>
            <div className="flex w-full items-center justify-center">
              <label
                htmlFor="dropzone-file"
                className={`verification_badge_input relative resize-none py-5 ${edit ? (domainBadge.image ? '' : 'caret-hidden') : ''} `}
              >
                <div className="flex flex-col items-center justify-center">
                  <p>Upload Your Image</p>
                  <p className="max-w-lg text-center text-[10px] font-normal tablet:text-[16px]">
                    Foundation wants your SEO to look its best. For best results upload an image that is 1280x720
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="absolute left-0 top-0 hidden w-full"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </div>
          {/* Image Cropper */}
          {domainBadge.image?.length > 0 && (
            <div className="space-y-6">
              <div className="space-y-1 tablet:space-y-3">
                <p className="text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:text-[20px] tablet:leading-[20px]">
                  Seo Image:
                </p>
                <ImageCropper type="16:9" onCropComplete={handleCropComplete} image={domainBadge.image[2]} />
              </div>
              <div className="space-y-1 tablet:space-y-3">
                <p className="text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:text-[20px] tablet:leading-[20px]">
                  Profile Image:
                </p>
                <ImageCropper type="rounded" onCropComplete={handleCropComplete2} image={domainBadge.image[2]} />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-[15px] tablet:gap-[35px]">
            {edit && (
              <Button
                variant="badge-remove"
                onClick={() => {
                  handleRemoveBadgePopup({
                    title: 'Domain',
                    type: 'domainBadge',
                    badgeType: 'homepage',
                    image: logo,
                  });
                }}
              >
                {RemoveLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Remove Badge'}
              </Button>
            )}
            <Button
              variant={checkHollow() ? 'submit-hollow' : 'submit'}
              onClick={() => {
                addDomainBadge();
              }}
              disabled={checkHollow()}
            >
              {loading === true ? (
                <FaSpinner className="animate-spin text-[#EAEAEA]" />
              ) : edit ? (
                'Update Badge'
              ) : (
                'Add Badge'
              )}
            </Button>
          </div>
        </div>
        {onboarding && <ProgressBar handleSkip={handleSkip} />}
      </PopUp>
    </>
  );
};

export default HomepageBadgePopup;
