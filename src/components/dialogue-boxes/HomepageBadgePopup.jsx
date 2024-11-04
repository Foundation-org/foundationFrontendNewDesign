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
import ProgressBar from '../ProgressBar';

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
    image: '',
  });
  const [prevState, setPrevState] = useState({
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

      setDomainBadge({
        title: domainBadge?.domain?.title,
        domain: domainBadge?.domain?.name,
        description: domainBadge?.domain?.description,
        image: domainBadge?.domain?.s3Urls,
      });
      setPrevState({
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

  const checkHollow = () => {
    if (
      domainBadge.title === '' ||
      domainBadge.domain === '' ||
      domainBadge.description === '' ||
      domainBadge.image === '' ||
      JSON.stringify(prevState) === JSON.stringify(domainBadge)
    ) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    checkHollow();
  }, [domainBadge.title, domainBadge.domain, domainBadge.description, domainBadge.image]);

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
            Your Home Page is the hub for connecting with your audience. Share posts, lists and news easily
            with your audience.
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
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[9.28px] text-gray-500 tablet:text-[20px]">
                .on.foundation
              </span>
            </div>
            <p className="text-[9.28px] tablet:text-[20px]">Characters Remaining: {63 - domainBadge.domain.length}</p>
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
            <p className="text-[9.28px] tablet:text-[20px]">
              Characters Remaining: {300 - domainBadge.description.length}
            </p>
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
                  <p className="text-[10px] font-normal tablet:text-[16px]">
                    Please upload your image or drag and drop it here.
                  </p>
                  <p className="text-[10px] font-normal tablet:text-[16px]">
                    Ensure the image has a 16:9 aspect ratio.
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      const reader = new FileReader();

                      reader.onload = (event) => {
                        const result = event.target?.result;
                        if (!result) {
                          return;
                        }

                        const img = new Image();
                        img.onload = () => {
                          const width = img.width;
                          const height = img.height;
                          if (width / height >= 1.7 && width / height <= 2) {
                            setDomainBadge({ ...domainBadge, image: e.target.files[0] });
                          } else {
                            toast.error('Please upload an image with a 16:9 aspect ratio.');
                          }
                        };

                        img.src = result; // Set image source to the data URL
                      };

                      reader.readAsDataURL(file);
                    }
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
              {checkHollow() ? (
                <Button variant={'submit-hollow'} disabled={true}>
                  {edit ? 'Update' : 'Add'}
                </Button>
              ) : (
                <Button
                  variant={'submit'}
                  onClick={() => {
                    if (Array.isArray(domainBadge.image)) {
                      addDomainBadge();
                    } else if (!Array.isArray(domainBadge.image) && domainBadge.croppedImage) {
                      addDomainBadge();
                    } else {
                      toast.warning('Please crop the image for your profile.');
                    }
                  }}
                >
                  {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : edit ? 'Update' : 'Add'}
                </Button>
              )}
            </div>
          </div>
        </div>
        {onboarding && <ProgressBar progress={progress} handleSkip={handleSkip} />}
      </PopUp>
    </>
  );
};

export default HomepageBadgePopup;
