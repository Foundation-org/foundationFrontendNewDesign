import { Button } from '../ui/Button';
import { useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import PopUp from '../ui/PopUp';
import showToast from '../ui/Toast';
import api from '../../services/api/Axios';
import BadgeRemovePopup from './badgeRemovePopup';

const HomepageBadgePopup = ({ isPopup, setIsPopup, type, title, logo, edit, fetchUser, setIsPersonalPopup }) => {
  const queryClient = useQueryClient();
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

  const { mutateAsync: addDomainBadge } = useMutation({
    mutationFn: () => {
      const formData = new FormData();
      formData.append('name', domainBadge.domain);
      formData.append('title', domainBadge.title);
      formData.append('description', domainBadge.description);
      formData.append('uuid', persistedUserInfo.uuid);

      if (edit) {
        formData.append('update', true);
      }

      if (domainBadge.image.length !== 2) {
        formData.append('file', domainBadge.image);
      }

      return api.post(`/addDomainBadge`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: (data) => {
      if (data.status === 200) {
        showToast('success', 'badgeAdded');
        setLoading(false);
        queryClient.invalidateQueries(['userInfo']);
        handleClose();
      }
    },
    onError: (error) => {
      console.log(error);
      setLoading(false);
      handleClose();
    },
  });

  const handleRemoveBadgePopup = (item) => {
    setDeleteModalState(item);
    setModalVisible(true);
  };

  const handleBadgesClose = () => setModalVisible(false);

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
          fetchUser={fetchUser}
          setIsPersonalPopup={setIsPersonalPopup}
          setIsLoading={setRemoveLoading}
          loading={RemoveLoading}
        />
      )}
      <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo}>
        <div className="flex flex-col gap-[10px] px-5 py-[15px] tablet:gap-4 tablet:px-[60px] tablet:py-[25px] laptop:px-[80px]">
          <input
            type="text"
            value={domainBadge.title}
            onChange={(e) => {
              setDomainBadge({ ...domainBadge, title: e.target.value });
            }}
            placeholder="Title"
            className={`verification_badge_input ${edit ? (domainBadge.title ? '' : 'caret-hidden') : ''}`}
          />
          <div>
            <input
              type="text"
              value={domainBadge.domain}
              onChange={(e) => {
                setDomainBadge({ ...domainBadge, domain: e.target.value });
              }}
              placeholder="Domain"
              className={`verification_badge_input ${edit ? (domainBadge.domain ? '' : 'caret-hidden') : ''}`}
            />
            <p>Domain Preview: {`(${domainBadge.domain}.${window.location.hostname})`}</p>
          </div>
          <TextareaAutosize
            id="input-2"
            aria-label="multiple choice question"
            placeholder="Description"
            value={domainBadge.description}
            onChange={(e) => {
              setDomainBadge({ ...domainBadge, description: e.target.value });
            }}
            tabIndex={2}
            // onBlur={(e) => e.target.value.trim() !== '' && questionVerification(e.target.value)}
            // onKeyDown={(e) => e.key === 'Tab' || (e.key === 'Enter' && handleTab(2, 'Enter'))}
            className={`verification_badge_input resize-none ${edit ? (domainBadge.description ? '' : 'caret-hidden') : ''}`}
          />
          <div class="flex w-full items-center justify-center">
            <label
              for="dropzone-file"
              className={`verification_badge_input resize-none ${edit ? (domainBadge.image ? '' : 'caret-hidden') : ''}`}
            >
              <div class="flex flex-col items-center justify-center">
                <p>Click to upload</p>
                <p>Image should be of (16:9 aspect ratio)</p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                class="hidden"
                onChange={(e) => {
                  setDomainBadge({ ...domainBadge, image: e.target.files[0] });
                }}
              />
            </label>
          </div>
          {domainBadge.image && (
            <div className="flex items-center">
              <img
                src={domainBadge.image?.length === 2 ? domainBadge.image[0] : URL.createObjectURL(domainBadge.image)}
                alt="badge"
                className="aspect-video rounded-md object-contain"
              />
            </div>
          )}
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
