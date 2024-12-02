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
import ProgressBar from '../ProgressBar';

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

const PersonalBadgesPopup = ({
  isPopup,
  setIsPopup,
  type,
  title,
  logo,
  placeholder,
  edit,
  fetchUser,
  setIsPersonalPopup,
  handleSkip,
  onboarding,
  progress,
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

  const handleSecurityQuestionChange = (event) => { };
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
        setName('');
        if (onboarding) {
          handleSkip(type);
          return;
        }
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

  const renderInputField = (title, name, placeholder, apiResp, data, placeholder2, summaryText) => {
    const isError = apiResp?.data?.message === 'No';

    return (
      <div className="px-5 py-[15px] tablet:px-[60px] tablet:py-[25px] laptop:px-[80px]">
        <h1 className="summary-text mb-[10px] tablet:mb-5">{summaryText}</h1>
        {data && data.length >= 1 ? (
          <>
            <div className="flex flex-col gap-[10px] tablet:gap-[15px]">
              <div className="my-[5px] w-full">
                <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:mb-[14px] tablet:text-[20px] tablet:leading-[24.2px]">
                  Security question
                </p>
                <div className="z-20 flex flex-col gap-[10px] tablet:gap-[15px]">
                  <CustomCombobox
                    items={questions}
                    selected={selected}
                    setSelected={setSelected}
                    query={query}
                    setQuery={setQuery}
                    placeholder={edit ? (selected?.name ? placeholder : 'Loading...') : placeholder}
                    disabled={edit ? (selected?.name ? false : true) : false}
                  />
                </div>
              </div>
              <div className="w-full">
                <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:mb-[14px] tablet:text-[20px] tablet:leading-[24.2px]">
                  Answer
                </p>
                <input
                  type="text"
                  value={edit ? (!fetchingEdit ? name : 'Loading...') : name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  placeholder={placeholder2}
                  disabled={fetchingEdit}
                  className={`verification_badge_input ${edit ? (name ? '' : 'caret-hidden') : ''}`}
                />
                {isError && (
                  <p className="absolute top-16 ml-1 text-[6.8px] font-semibold text-red-400 tablet:text-[14px]">{`Invalid ${title}!`}</p>
                )}
              </div>
            </div>
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
          </>
        ) : title === 'Geolocation' ? (
          <div className="relative">
            <input
              type="text"
              value={edit ? (!fetchingEdit ? name : 'Loading...') : name}
              disabled
              placeholder={placeholder2}
              className="verification_badge_input"
            />
            <div className="mt-[10px] flex justify-between gap-2 tablet:mt-5">
              <Button variant="submit" onClick={() => getLocation()} disabled={edit ? (name ? false : true) : false}>
                Get Current location
              </Button>
              <div className="flex justify-between gap-[13px] tablet:gap-[35px]">
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
          </div>
        ) : (
          <div className="relative">
            <input
              type="text"
              value={edit ? (!fetchingEdit ? name : 'Loading...') : name}
              onChange={(e) => {
                setCheck(true);
                setName(e.target.value);
              }}
              placeholder={placeholder}
              disabled={fetchingEdit}
              className={`verification_badge_input ${edit ? (name ? '' : 'caret-hidden') : ''}`}
            />
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
                  {RemoveLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Remove Badge'}
                </Button>
              )}
              {hollow ? (
                <div className="flex gap-2">
                  <Button variant="submit-hollow" disabled={true}>
                    {loading === true ? (
                      <FaSpinner className="animate-spin text-[#EAEAEA]" />
                    ) : edit ? (
                      'Update Badge'
                    ) : (
                      'Add Badge'
                    )}
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button variant="submit" onClick={() => (edit ? handleUpdateBadge() : handleAddPersonalBadge())}>
                    {loading === true ? (
                      <FaSpinner className="animate-spin text-[#EAEAEA]" />
                    ) : edit ? (
                      'Update Badge'
                    ) : (
                      'Add Badge'
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCurrentCity = (title, name, placeholder, apiResp, summaryText) => {
    const isError = apiResp?.data?.message === 'No';
    return (
      <div className="px-5 py-[15px] tablet:px-[60px] tablet:py-[25px] laptop:px-[80px]">
        <h1 className="summary-text mb-[10px] tablet:mb-5">{summaryText}</h1>
        <div className="flex flex-col gap-[10px] tablet:gap-[15px]">
          <CustomCombobox
            items={cities}
            selected={selected}
            setSelected={setSelected}
            placeholder={edit ? (selected?.name ? placeholder : 'Loading...') : placeholder}
            query={query}
            setQuery={setQuery}
            type={'city'}
            disabled={edit ? (selected?.name ? false : true) : false}
          />
          {isError && (
            <p className="absolute top-16 ml-1 text-[6.8px] font-semibold text-red-400 tablet:text-[14px]">{`Invalid ${title}!`}</p>
          )}
        </div>
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
    );
  };

  const renderRelationship = (title, data, placeholder, apiResp, summaryText) => {
    const isError = apiResp?.data?.message === 'No';
    return (
      <div className="px-5 py-[15px] tablet:px-[60px] tablet:py-[25px] laptop:px-[80px]">
        <h1 className="summary-text mb-[10px] tablet:mb-5">{summaryText}</h1>
        <div className="flex flex-col gap-[10px] tablet:gap-[15px]">
          <Listbox
            items={data}
            selected={selected}
            setSelected={setSelected}
            placeholder={edit ? (selected?.name ? placeholder : 'Loading...') : placeholder}
            disabled={edit ? (selected?.name ? false : true) : false}
          />
          {isError && (
            <p className="absolute top-16 ml-1 text-[6.8px] font-semibold text-red-400 tablet:text-[14px]">{`Invalid ${title}!`}</p>
          )}
        </div>
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
        {/* </>
        ) : (
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder={placeholder}
              className="verification_badge_input"
            />
            {isError && (
              <p className="absolute top-16 ml-1 text-[6.8px] font-semibold text-red-400 tablet:text-[14px]">{`Invalid ${title}!`}</p>
            )}
            <div className="mt-[10px] flex justify-end tablet:mt-5">
              <Button variant="submit" disabled={isError} onClick={() => handleAddPersonalBadge()}>
                {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Add'}
              </Button>
            </div>
          </div>
        )} */}
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
        {title === 'First Name' &&
          renderInputField(
            'First Name',
            name,
            placeholder,
            apiResp,
            null,
            null,
            'Your first name is a simple way to begin enhancing your value.'
          )}
        {title === 'Last Name' &&
          renderInputField(
            'Last Name',
            name,
            placeholder,
            apiResp,
            null,
            null,
            'Your last name further strengthens your authenticity.'
          )}
        {title === 'Date of Birth' && (
          <div className="px-5 py-[15px] tablet:px-[60px] tablet:py-[25px] laptop:px-[80px]">
            <h1 className="summary-text mb-[10px] tablet:mb-5">
              Your date of birth strengthens your identity verification, boosting your trustworthiness and creating
              opportunities for age-related rewards.
            </h1>
            {fetchingEdit ? (
              <input
                type="text"
                value="Loading..."
                disabled={true}
                className={`caret-hidden verification_badge_input`}
              />
            ) : (
              <input
                type="date"
                id="dateInput"
                value={date} // Assuming date is a valid string in YYYY-MM-DD format
                onChange={handleDateChange}
                className="verification_badge_input"
              />
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
        )}
        {title === 'Current City' &&
          renderCurrentCity(
            'Current City',
            name,
            placeholder,
            apiResp,
            'Your current location qualifies you for location-specific rewards.'
          )}
        {title === 'Home Town' &&
          renderCurrentCity('Home Town', name, placeholder, apiResp, 'Enhance your chances for personalized rewards.')}
        {title === 'Relationship Status' &&
          renderRelationship(
            'Relationship Status',
            relationshipData,
            placeholder,
            apiResp,
            'Enhance your credibility, value and opportunities to earn rewards.'
          )}
        {title === 'Sex' &&
          renderRelationship(
            'Sex',
            sexOtpions,
            placeholder,
            apiResp,
            'Increase your credibility, value and earning potential.'
          )}
        {title === 'ID / Passport' && renderInputField('ID / Passport', name, handleNameChange, placeholder, apiResp)}
        {title === 'Geolocation' &&
          renderInputField(
            'Geolocation',
            name,
            placeholder,
            apiResp,
            null,
            null,
            'Keeping your location up to date ensures you receive rewards tailored to your travel tendencies and interests, enhancing your overall experience on the platform.'
          )}
        {title === 'Security Question' &&
          renderInputField(
            'Security Question',
            name,
            'Security question here',
            apiResp,
            data,
            'Write your answer here',
            'Your security question helps in recovering your account if you get locked out.'
          )}
        {onboarding && <ProgressBar handleSkip={handleSkip} />}
      </PopUp>
    </>
  );
};

export default PersonalBadgesPopup;
