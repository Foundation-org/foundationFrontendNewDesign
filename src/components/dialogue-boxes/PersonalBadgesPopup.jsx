import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { validation } from '../../services/api/badgesApi';
import PopUp from '../ui/PopUp';
import api from '../../services/api/Axios';
import CustomCombobox from '../ui/Combobox';
import { FaSpinner } from 'react-icons/fa';
import { useErrorBoundary } from 'react-error-boundary';
import Listbox from '../ui/ListBox';
import { useDebounce } from '../../utils/useDebounce';
import BadgeRemovePopup from './badgeRemovePopup';

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
}) => {
  const queryClient = useQueryClient();
  const { showBoundary } = useErrorBoundary();
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
    if (type === 'currentCity' || type === 'homeTown' || type === 'relationshipStatus') {
      setSelected({ name: info?.data?.obj });
    }
    if (type === 'security-question') {
      setSelected({ name: Object.keys(info?.data?.obj)[0] });
      setName(info?.data?.obj[Object.keys(info?.data?.obj)[0]]);
    }
  };

  useEffect(() => {
    if (edit) {
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
      } else if (type === 'currentCity' || type === 'homeTown' || type === 'relationshipStatus') {
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
      } else if (type === 'currentCity' || type === 'homeTown' || type === 'relationshipStatus') {
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
    toast.error(
      'It seems like location services are off or denied. To proceed, please enable location in your device settings and try again.',
    );
    console.log(err);
  };
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(gotLocation, failedToGet);
    } else {
      toast.error("Your browser doesn't support geolocation.");
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
        toast.warning('Information already saved');
        return;
      }
    }
    if (type === 'dateOfBirth') {
      if (date === prevInfo) {
        toast.warning('Information already saved');
        return;
      }
    }
    if (type === 'currentCity' || type === 'homeTown' || type === 'relationshipStatus') {
      if (selected.name === prevInfo) {
        toast.warning('Information already saved');
        return;
      }
    }
    if (type === 'security-question') {
      if (name === prevInfo[Object.keys(prevInfo)[0]] && selected.name === Object.keys(prevInfo)[0]) {
        toast.warning('Information already saved');
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
        toast.warning('Please select a question first!');
        setLoading(false);
        return;
      }
      if (!name) {
        toast.warning('Answer field cannot be empty.');
        setLoading(false);
        return;
      }
    } else if (type.trim() === 'currentCity' || type.trim() === 'homeTown' || type.trim() === 'relationshipStatus') {
      value = selected?.name;
    } else {
      value = name;
    }
    if (value === '' || value === undefined) {
      toast.warning('Field cannot be empty!');
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
        toast.success('Badge Updated Successfully!');
        queryClient.invalidateQueries(['userInfo']);
        handleClose();
      }
    } catch (error) {
      showBoundary(error);
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
        toast.warning('Please select a question first!');
        setLoading(false);
        return;
      }
      if (!name) {
        toast.warning('Answer field cannot be empty.');
        setLoading(false);
        return;
      }
    } else if (type.trim() === 'currentCity' || type.trim() === 'homeTown' || type.trim() === 'relationshipStatus') {
      value = selected?.name;
    } else {
      value = name;
    }
    if (value === '' || value === undefined) {
      toast.warning('Field cannot be empty!');
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
        toast.success('Badge Added Successfully!');
        queryClient.invalidateQueries(['userInfo']);
        handleClose();
      }
    } catch (error) {
      showBoundary(error);
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
        {data && data.length >= 1 ? (
          <>
            <div className="flex flex-col gap-[10px] tablet:gap-[15px]">
              <div className="my-[5px] w-full ">
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
                  value={edit ? (name ? name : 'Loading...') : name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  placeholder={placeholder2}
                  disabled={edit ? (name ? false : true) : false}
                  className={`w-full rounded-[8.62px] border border-[#DEE6F7] bg-[#FBFBFB] px-[16px] py-2 text-[9.28px] font-medium leading-[11.23px] text-[#B6B4B4] focus:outline-none tablet:rounded-[10px] tablet:border-[3px] tablet:px-7 tablet:py-3 tablet:text-[18px] tablet:leading-[21px] ${
                    edit ? (name ? '' : 'caret-hidden') : ''
                  }`}
                />
                {isError && (
                  <p className="absolute top-16 ml-1 text-[6.8px] font-semibold text-[#FF4057] tablet:text-[14px]">{`Invalid ${title}!`}</p>
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
                  {RemoveLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Remove'}
                </Button>
              )}
              {hollow ? (
                <Button variant="hollow-submit" disabled={true}>
                  {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : edit ? 'Update' : 'Add'}
                </Button>
              ) : (
                <Button variant="submit" onClick={() => (edit ? handleUpdateBadge() : handleAddPersonalBadge())}>
                  {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : edit ? 'Update' : 'Add'}
                </Button>
              )}
            </div>
          </>
        ) : title === 'Geolocation' ? (
          <div className="relative">
            <input
              type="text"
              value={edit ? (name ? name : 'Loading...') : name}
              disabled
              placeholder={placeholder2}
              className="w-full rounded-[8.62px] border border-[#DEE6F7] bg-[#FBFBFB] px-[16px] py-2 text-[9.28px] font-medium leading-[11.23px] text-[#B6B4B4] focus:outline-none tablet:rounded-[10px] tablet:border-[3px] tablet:px-7 tablet:py-3 tablet:text-[18px] tablet:leading-[21px]"
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
                    {RemoveLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Remove'}
                  </Button>
                )}
                {hollow ? (
                  <Button variant="hollow-submit" disabled={true}>
                    {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : edit ? 'Update' : 'Add'}
                  </Button>
                ) : (
                  <Button variant="submit" onClick={() => (edit ? handleUpdateBadge() : handleAddPersonalBadge())}>
                    {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : edit ? 'Update' : 'Add'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="relative">
            <input
              type="text"
              value={edit ? (name ? name : 'Loading...') : name}
              onChange={(e) => {
                setCheck(true);
                setName(e.target.value);
              }}
              placeholder={placeholder}
              disabled={edit ? (name ? false : true) : false}
              className={`w-full rounded-[8.62px] border border-[#DEE6F7] bg-[#FBFBFB] px-[16px] py-2 text-[9.28px] font-medium leading-[11.23px] text-[#B6B4B4] focus:outline-none tablet:rounded-[10px] tablet:border-[3px] tablet:px-7 tablet:py-3 tablet:text-[18px] tablet:leading-[21px] ${
                edit ? (name ? '' : 'caret-hidden') : ''
              }`}
            />
            {isError && (
              <p className="absolute ml-1 text-[6.8px] font-semibold text-[#FF4057] tablet:text-[14px]">{`Invalid ${title}!`}</p>
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
        )}
      </div>
    );
  };

  const renderCurrentCity = (title, name, handleNameChange, placeholder, apiResp, data) => {
    const isError = apiResp?.data?.message === 'No';
    return (
      <div className="px-5 py-[15px] tablet:px-[60px] tablet:py-[25px] laptop:px-[80px]">
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
            <p className="absolute top-16 ml-1 text-[6.8px] font-semibold text-[#FF4057] tablet:text-[14px]">{`Invalid ${title}!`}</p>
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
              {RemoveLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Remove'}
            </Button>
          )}
          {hollow ? (
            <Button variant="hollow-submit" disabled={true}>
              {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : edit ? 'Update' : 'Add'}
            </Button>
          ) : (
            <Button variant="submit" onClick={() => (edit ? handleUpdateBadge() : handleAddPersonalBadge())}>
              {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : edit ? 'Update' : 'Add'}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderRelationship = (title, name, handleNameChange, placeholder, apiResp, data) => {
    const isError = apiResp?.data?.message === 'No';
    return (
      <div className="px-5 py-[15px] tablet:px-[60px] tablet:py-[25px] laptop:px-[80px]">
        {/* {data && data.length >= 1 ? (
          <> */}
        <div className="flex flex-col gap-[10px] tablet:gap-[15px]">
          <Listbox
            items={relationshipData}
            selected={selected}
            setSelected={setSelected}
            placeholder={edit ? (selected?.name ? placeholder : 'Loading...') : placeholder}
            disabled={edit ? (selected?.name ? false : true) : false}
          />
          {isError && (
            <p className="absolute top-16 ml-1 text-[6.8px] font-semibold text-[#FF4057] tablet:text-[14px]">{`Invalid ${title}!`}</p>
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
              {RemoveLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Remove'}
            </Button>
          )}
          {hollow ? (
            <Button variant="hollow-submit" disabled={true}>
              {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : edit ? 'Update' : 'Add'}
            </Button>
          ) : (
            <Button variant="submit" onClick={() => (edit ? handleUpdateBadge() : handleAddPersonalBadge())}>
              {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : edit ? 'Update' : 'Add'}
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
              className="w-full rounded-[8.62px] border border-[#DEE6F7] bg-[#FBFBFB] px-[16px] py-2 text-[9.28px] font-medium leading-[11.23px] text-[#B6B4B4] focus:outline-none tablet:rounded-[15px] tablet:border-[3px] tablet:py-[18px] tablet:text-[18px] tablet:leading-[21px]"
            />
            {isError && (
              <p className="absolute top-16 ml-1 text-[6.8px] font-semibold text-[#FF4057] tablet:text-[14px]">{`Invalid ${title}!`}</p>
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
        {title === 'First Name' && renderInputField('First Name', name, handleNameChange, placeholder, apiResp)}
        {title === 'Last Name' && renderInputField('Last Name', name, handleNameChange, placeholder, apiResp)}
        {title === 'Date of Birth' && (
          <div className="px-5 py-[15px] tablet:px-[60px] tablet:py-[25px] laptop:px-[80px]">
            {!date && edit ? (
              <input
                type="text"
                value="Loading..."
                disabled={true}
                className={`caret-hidden w-full rounded-[8.62px] border border-[#DEE6F7] bg-[#FBFBFB] px-[16px] py-2 text-[9.28px] font-medium leading-[11.23px] text-[#B6B4B4] focus:outline-none tablet:rounded-[15px] tablet:border-[3px] tablet:py-[18px] tablet:text-[18px] tablet:leading-[21px]`}
              />
            ) : (
              <input
                type="date"
                id="dateInput"
                value={date} // Assuming date is a valid string in YYYY-MM-DD format
                onChange={handleDateChange}
                className="w-full rounded-[8.62px] border border-[#DEE6F7] bg-[#FBFBFB] px-[16px] py-2 text-[9.28px] font-medium leading-[11.23px] text-[#B6B4B4] focus:outline-none tablet:rounded-[15px] tablet:border-[3px] tablet:py-[18px] tablet:text-[18px] tablet:leading-[21px]"
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
                  {RemoveLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Remove'}
                </Button>
              )}
              {hollow ? (
                <Button variant="hollow-submit" disabled={true}>
                  {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : edit ? 'Update' : 'Add'}
                </Button>
              ) : (
                <Button variant="submit" onClick={() => (edit ? handleUpdateBadge() : handleAddPersonalBadge())}>
                  {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : edit ? 'Update' : 'Add'}
                </Button>
              )}
            </div>
          </div>
        )}
        {title === 'Current City' && renderCurrentCity('Current City', name, handleNameChange, placeholder, apiResp)}
        {title === 'Home Town' && renderCurrentCity('Home Town', name, handleNameChange, placeholder, apiResp)}
        {title === 'Relationship Status' &&
          renderRelationship('Relationship Status', name, handleNameChange, placeholder, apiResp)}
        {title === 'ID / Passport' && renderInputField('ID / Passport', name, handleNameChange, placeholder, apiResp)}
        {title === 'Geolocation' && renderInputField('Geolocation', name, handleNameChange, placeholder, apiResp)}
        {title === 'Security Question' &&
          renderInputField(
            'Security Question',
            name,
            handleSecurityQuestionChange,
            'Security question here',
            apiResp,
            data,
            'Write your answer here',
          )}
      </PopUp>
    </>
  );
};

export default PersonalBadgesPopup;
