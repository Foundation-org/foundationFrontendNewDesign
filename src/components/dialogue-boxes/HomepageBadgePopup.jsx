import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { validation } from '../../services/api/badgesApi';
import PopUp from '../ui/PopUp';
import api from '../../services/api/Axios';
import CustomCombobox from '../ui/Combobox';
import { FaSpinner } from 'react-icons/fa';
import Listbox from '../ui/ListBox';
import { useDebounce } from '../../utils/useDebounce';
import BadgeRemovePopup from './badgeRemovePopup';
import showToast from '../ui/Toast';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';

const data = [
  { id: 1, name: 'In what city were you born?' },
  { id: 2, name: 'What is the name of your first pet?' },
  { id: 2, name: 'What is the last name of your favorite teacher?' },
];

const relationshipData = [
  { id: 1, name: 'Single' },
  { id: 2, name: 'In a relationship' },
  { id: 3, name: 'Engaged' },
  { id: 4, name: 'Married' },
  { id: 5, name: "It's complicated" },
  { id: 6, name: 'In an open relationship' },
  { id: 7, name: 'Widowed' },
  { id: 8, name: 'Separated' },
  { id: 9, name: 'Divorced' },
];

const sexOtpions = [
  { id: 1, name: 'Male' },
  { id: 2, name: 'Female' },
  { id: 3, name: 'X' },
];

const HomepageBadgePopup = ({
  isPopup,
  setIsPopup,
  type,
  title,
  logo,
  placeholder,
  edit,
  fetchUser,
  setIsPersonalPopup,
}) => {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState();
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [RemoveLoading, setRemoveLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const debounceName = useDebounce(name, 1000);
  const [check, setCheck] = useState(edit ? false : true);
  const [deleteModalState, setDeleteModalState] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [prevInfo, setPrevInfo] = useState();
  const handleClose = () => setIsPopup(false);
  const [hollow, setHollow] = useState(edit ? false : true);
  const [fetchingEdit, setFetchingEdit] = useState(false);

  const handleNameChange = (e) => setName(e.target.value);

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setDate(selectedDate);
  };

  const handleSecurityQuestionChange = (event) => {};
  const [query, setQuery] = useState('');
  const [questions, setQuestion] = useState();

  useEffect(() => {
    const jb = data;
    const queryExists = jb.some((item) => item.name.toLowerCase() === query.toLowerCase());
    const newArr = queryExists
      ? [...jb]
      : [
          { id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`, name: query, button: true },
          ...jb.map((jb) => ({
            ...jb,
            id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          })),
        ];
    setQuestion(newArr);
  }, [query]);

  const FetchData = async () => {
    const payload = {
      uuid: localStorage.getItem('uuid'),
      type: type,
    };
    if (localStorage.getItem('legacyHash')) {
      payload.infoc = localStorage.getItem('legacyHash');
    }
    const info = await api.post(`/addBadge/personal/getPersonalBadge`, payload);
    setPrevInfo(info?.data?.obj);
    if (type === 'firstName' || type === 'lastName' || type === 'geolocation') {
      setName(info?.data?.obj);
    }
    if (type === 'dateOfBirth') {
      setDate(info?.data?.obj);
    }
    if (type === 'currentCity' || type === 'homeTown' || type === 'relationshipStatus' || type === 'sex') {
      setSelected({ name: info?.data?.obj });
    }
    if (type === 'security-question') {
      setSelected({ name: Object.keys(info?.data?.obj)[0] });
      setName(info?.data?.obj[Object.keys(info?.data?.obj)[0]]);
    }
    setFetchingEdit(false);
  };

  useEffect(() => {
    if (edit) {
      setFetchingEdit(true);
      FetchData();
    }
  }, []);

  useEffect(() => {
    if (edit) {
      if (type === 'dateOfBirth') {
        if (date && date !== prevInfo) {
          setHollow(false);
        } else {
          setHollow(true);
        }
      } else if (type === 'geolocation') {
        if (name && name !== prevInfo) {
          setHollow(false);
        } else {
          setHollow(true);
        }
      } else if (type === 'firstName' || type === 'lastName') {
        if (name && name !== prevInfo && !check) {
          setHollow(false);
        } else {
          setHollow(true);
        }
      } else if (type === 'security-question') {
        if (name && selected?.name) {
          if (prevInfo) {
            if (name === prevInfo[Object.keys(prevInfo)[0]] && selected?.name === Object.keys(prevInfo)[0]) {
              setHollow(true);
            } else {
              setHollow(false);
            }
          } else {
            setHollow(true);
          }
        } else {
          setHollow(true);
        }
      } else if (type === 'currentCity' || type === 'homeTown' || type === 'relationshipStatus' || type === 'sex') {
        if (selected?.name && selected?.name !== prevInfo) {
          setHollow(false);
        } else {
          setHollow(true);
        }
      }
    } else {
      if (type === 'dateOfBirth') {
        if (date) {
          setHollow(false);
        } else {
          setHollow(true);
        }
      } else if (type === 'geolocation') {
        if (name) {
          setHollow(false);
        } else {
          setHollow(true);
        }
      } else if (type === 'firstName' || type === 'lastName') {
        if (name && !check) {
          setHollow(false);
        } else {
          setHollow(true);
        }
      } else if (type === 'security-question') {
        if (name && selected?.name) {
          setHollow(false);
        } else {
          setHollow(true);
        }
      } else if (type === 'currentCity' || type === 'homeTown' || type === 'relationshipStatus' || type === 'sex') {
        if (selected?.name) {
          setHollow(false);
        } else {
          setHollow(true);
        }
      }
    }
  }, [date, selected, name, check, prevInfo]);

  const { data: apiResp } = useQuery({
    queryKey: ['validate-name', (title === 'First Name' || title === 'Last Name') && debounceName],
    queryFn: () =>
      validation(title === 'First Name' ? 5 : title === 'Last Name' && 6, name.charAt(0).toUpperCase() + name.slice(1)),
  });

  const gotLocation = (position) => {
    setName(position.coords.latitude + ',' + position.coords.longitude);
  };

  const failedToGet = (err) => {
    showToast('error', 'failedGettingLocation');
    console.log(err);
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(gotLocation, failedToGet);
    } else {
      showToast('error', 'locationNotSupported');
    }
  };

  useEffect(() => {
    if (edit) {
      if (prevInfo !== undefined && name !== undefined && prevInfo !== name)
        if (apiResp?.data?.message?.trim() === 'Yes' || apiResp?.data?.message?.trim() === 'Yes.') {
          setCheck(false);
        } else {
          setCheck(true);
        }
    } else {
      if (apiResp?.data?.message?.trim() === 'Yes' || apiResp?.data?.message?.trim() === 'Yes.') {
        setCheck(false);
      } else {
        setCheck(true);
      }
    }
  }, [apiResp]);

  const searchCities = async () => {
    try {
      const cities = await api.post(`search/searchCities/?name=${query}`);
      console.log(cities.data);
      setCities(cities.data);
    } catch (err) {
      setCities([]);
    }
  };

  useEffect(() => {
    if ((type.trim() === 'currentCity' || type.trim() === 'homeTown') && query !== '') {
      searchCities();
    }
  }, [query]);

  const handleUpdateBadge = async () => {
    if (type === 'firstName' || type === 'lastName' || type === 'geolocation') {
      if (name === prevInfo) {
        showToast('warning', 'infoAlreadySaved');
        return;
      }
    }
    if (type === 'dateOfBirth') {
      if (date === prevInfo) {
        showToast('warning', 'infoAlreadySaved');
        return;
      }
    }
    if (type === 'currentCity' || type === 'homeTown' || type === 'relationshipStatus' || type === 'sex') {
      if (selected.name === prevInfo) {
        showToast('warning', 'infoAlreadySaved');
        return;
      }
    }
    if (type === 'security-question') {
      if (name === prevInfo[Object.keys(prevInfo)[0]] && selected.name === Object.keys(prevInfo)[0]) {
        showToast('warning', 'infoAlreadySaved');
        return;
      }
    }
    setLoading(true);
    let value;
    if (type.trim() === 'dateOfBirth') {
      value = date;
    } else if (type.trim() === 'security-question') {
      value = {
        [selected?.name]: name,
      };
      if (!selected) {
        showToast('warning', 'selectSecQuestion');
        setLoading(false);
        return;
      }
      if (!name) {
        showToast('warning', 'emptyAnswer');
        setLoading(false);
        return;
      }
    } else if (
      type.trim() === 'currentCity' ||
      type.trim() === 'homeTown' ||
      type.trim() === 'relationshipStatus' ||
      type === 'sex'
    ) {
      value = selected?.name;
    } else {
      value = name;
    }
    if (value === '' || value === undefined) {
      showToast('warning', 'blankField');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        newData: value,
        type: type,
        uuid: localStorage.getItem('uuid'),
      };
      if (localStorage.getItem('legacyHash')) {
        payload.infoc = localStorage.getItem('legacyHash');
      }
      const addBadge = await api.post(`/addBadge/personal/updatePersonalBadge`, payload);
      if (addBadge.status === 200) {
        showToast('success', 'badgeUpdated');
        queryClient.invalidateQueries(['userInfo']);
        handleClose();
      }
    } catch (error) {
      console.log(error);
      handleClose();
    } finally {
      setLoading(false);
    }
  };

  const handleAddPersonalBadge = async () => {
    setLoading(true);
    let value;
    if (type.trim() === 'dateOfBirth') {
      value = date;
    } else if (type.trim() === 'security-question') {
      value = {
        [selected?.name]: name,
      };
      if (!selected) {
        showToast('warning', 'selectSecQuestion');
        setLoading(false);
        return;
      }
      if (!name) {
        showToast('warning', 'emptyAnswer');
        setLoading(false);
        return;
      }
    } else if (
      type.trim() === 'currentCity' ||
      type.trim() === 'homeTown' ||
      type.trim() === 'relationshipStatus' ||
      type === 'sex'
    ) {
      value = selected?.name;
    } else {
      value = name;
    }
    if (value === '' || value === undefined) {
      showToast('warning', 'blankField');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        personal: {
          [type]: value,
        },
        uuid: localStorage.getItem('uuid'),
      };

      if (localStorage.getItem('legacyHash')) {
        payload.infoc = localStorage.getItem('legacyHash');
      }

      const addBadge = await api.post(`/addBadge/personal/add`, payload);
      if (addBadge.status === 200) {
        showToast('success', 'badgeAdded');
        queryClient.invalidateQueries(['userInfo']);
        handleClose();
      }
    } catch (error) {
      console.log(error);
      handleClose();
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBadgePopup = (item) => {
    setDeleteModalState(item);
    setModalVisible(true);
  };

  const handleBadgesClose = () => setModalVisible(false);

  const renderInputField = (title, name, handleNameChange, placeholder, apiResp, data, placeholder2) => {
    const isError = apiResp?.data?.message === 'No';

    return (
      <div className="px-5 py-[15px] tablet:px-[60px] tablet:py-[25px] laptop:px-[80px]">
        <div className="relative">
          <input
            type="text"
            value={edit ? (!fetchingEdit ? name : 'Loading...') : name}
            onChange={(e) => {
              setCheck(true);
              setName(e.target.value);
            }}
            placeholder="Title"
            disabled={fetchingEdit}
            className={`verification_badge_input ${edit ? (name ? '' : 'caret-hidden') : ''}`}
          />
          <input
            type="text"
            value={edit ? (!fetchingEdit ? name : 'Loading...') : name}
            onChange={(e) => {
              setCheck(true);
              setName(e.target.value);
            }}
            placeholder="Domain"
            disabled={fetchingEdit}
            className={`verification_badge_input ${edit ? (name ? '' : 'caret-hidden') : ''}`}
          />
          <TextareaAutosize
            id="input-2"
            aria-label="multiple choice question"
            placeholder="Description"
            // onChange={handleQuestionChange}
            // onBlur={(e) => e.target.value.trim() !== '' && questionVerification(e.target.value)}
            // value={createQuestSlice.question}
            tabIndex={2}
            // onKeyDown={(e) => e.key === 'Tab' || (e.key === 'Enter' && handleTab(2, 'Enter'))}
            className="w-full resize-none rounded-l-[5.128px] border-y border-l border-white-500 bg-white px-[9.24px] py-[7px] text-[10px] font-medium leading-3 tracking-wide text-[#7C7C7C] focus-visible:outline-none dark:border-gray-100 dark:bg-accent-100 dark:text-white-400 tablet:rounded-l-[10.3px] tablet:border-y-[3px] tablet:border-l-[3px] tablet:px-[18px] tablet:py-[11.6px] tablet:text-[1.296rem] tablet:leading-[23px] laptop:rounded-l-[0.625rem] laptop:py-[13px] laptop:text-[1.25rem]"
          />
          <div>
            <label
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white tablet:text-lg"
              htmlFor="file_input"
            >
              Upload Article Image (16:9 aspect ratio)
            </label>
            <input
              className="dark:placeholder-#9ca3af[#9ca3af block w-full cursor-pointer rounded-lg border border-[#d1d5db] bg-[#f9fafb] text-sm text-[#111827] focus:outline-none dark:border-[#4b5563] dark:bg-[#374151] dark:text-[#9ca3af] tablet:text-lg"
              id="file_input"
              type="file"
              accept=".jpg, .jpeg, .png, .webp"
              // onChange={handleFileChange}
            />
            <p className="mb-2 block text-sm font-medium text-gray-900 dark:text-white tablet:text-lg">
              PNG, JPG, JPEG or Webp.
            </p>
          </div>
          {isError && (
            <p className="absolute ml-1 text-[6.8px] font-semibold text-red-400 tablet:text-[14px]">{`Invalid ${title}!`}</p>
          )}
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
                {RemoveLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Remove'}
              </Button>
            )}
            {hollow ? (
              <div className="flex gap-2">
                <Button variant="hollow-submit" disabled={true}>
                  {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : edit ? 'Update' : 'Add'}
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button variant="submit" onClick={() => (edit ? handleUpdateBadge() : handleAddPersonalBadge())}>
                  {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : edit ? 'Update' : 'Add'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

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
        {title === 'Domain Badge' && renderInputField('Domain Badge', name, handleNameChange, placeholder, apiResp)}
      </PopUp>
    </>
  );
};

export default HomepageBadgePopup;
