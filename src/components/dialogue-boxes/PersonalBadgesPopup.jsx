import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { useQuery } from '@tanstack/react-query';
import { validation } from '../../services/api/badgesApi';
import PopUp from '../ui/PopUp';
import api from '../../services/api/Axios';
import CustomCombobox from '../ui/Combobox';
import { FaSpinner } from 'react-icons/fa';
import { useErrorBoundary } from 'react-error-boundary';
import Listbox from '../ui/ListBox';

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

const PersonalBadgesPopup = ({ isPopup, setIsPopup, type, title, logo, placeholder, handleUserInfo }) => {
  const { showBoundary } = useErrorBoundary();
  const [selected, setSelected] = useState();
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);

  const handleClose = () => setIsPopup(false);

  const handleNameChange = (e) => setName(e.target.value);

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setDate(selectedDate);
  };

  const handleSecurityQuestionChange = (event) => {};
  const [query, setQuery] = useState('');

  const { data: apiResp } = useQuery({
    queryKey: ['validate-name', (title === 'First Name' || title === 'Last Name') && name],
    queryFn: () => validation(title === 'First Name' ? 5 : title === 'Last Name' && 6, name),
  });

  const searchCities = async () => {
    const cities = await api.post(`search/searchCities/?name=${query}`);
    console.log(cities.data);

    setCities(cities.data);
  };

  useEffect(() => {
    if ((type.trim() === 'currentCity' || type.trim() === 'homeTown') && query !== '') {
      searchCities();
    }
  }, [query]);

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
      const addBadge = await api.post(`/addBadge/personal/add`, {
        personal: {
          [type]: value,
        },
        uuid: localStorage.getItem('uuid'),
      });
      if (addBadge.status === 200) {
        toast.success('Badge Added Successfully!');
        handleUserInfo();
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

  const renderInputField = (title, name, handleNameChange, placeholder, apiResp, data, placeholder2) => {
    const isError = apiResp?.data?.message === 'No';
    return (
      <div className="px-5 py-[15px] tablet:px-[60px] tablet:py-[25px] laptop:px-[80px]">
        {data && data.length >= 1 ? (
          <>
            <div className="flex flex-col gap-[10px] tablet:gap-[15px]">
              <Listbox items={data} selected={selected} setSelected={setSelected} placeholder={placeholder} />
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder={placeholder2}
                className="w-full rounded-[8.62px] border border-[#DEE6F7] bg-[#FBFBFB] px-[16px] py-2 text-[9.28px] font-medium leading-[11.23px] text-[#B6B4B4] focus:outline-none tablet:rounded-[10px] tablet:border-[3px] tablet:px-7 tablet:py-3 tablet:text-[18px] tablet:leading-[21px]"
              />
              {isError && (
                <p className="absolute ml-1 text-[6.8px] font-semibold text-[#FF4057] tablet:text-[14px]">{`Invalid ${title}!`}</p>
              )}
            </div>
            <div className="mt-[10px] flex justify-end tablet:mt-5">
              <Button variant="submit" disabled={isError} onClick={() => handleAddPersonalBadge()}>
                {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Add'}
              </Button>
            </div>
          </>
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
            placeholder={placeholder}
            query={query}
            setQuery={setQuery}
          />
          {isError && (
            <p className="absolute top-16 ml-1 text-[6.8px] font-semibold text-[#FF4057] tablet:text-[14px]">{`Invalid ${title}!`}</p>
          )}
        </div>
        <div className="mt-[10px] flex justify-end tablet:mt-5">
          <Button variant="submit" disabled={isError} onClick={() => handleAddPersonalBadge()}>
            {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Add'}
          </Button>
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
          <Listbox items={relationshipData} selected={selected} setSelected={setSelected} placeholder={placeholder} />
          {/* <CustomCombobox
            items={relationshipData}
            selected={selected}
            setSelected={setSelected}
            query={query}
            setQuery={setQuery}
            isArrow={true}
            placeholder={placeholder}
          /> */}
          {/* <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder={placeholder2}
            className="w-full rounded-[8.62px] border border-[#DEE6F7] bg-[#FBFBFB] px-[16px] py-2 text-[9.28px] font-medium leading-[11.23px] text-[#B6B4B4] focus:outline-none tablet:rounded-[10px] tablet:border-[3px] tablet:px-7 tablet:py-3 tablet:text-[18px] tablet:leading-[21px]"
          /> */}
          {isError && (
            <p className="absolute top-16 ml-1 text-[6.8px] font-semibold text-[#FF4057] tablet:text-[14px]">{`Invalid ${title}!`}</p>
          )}
        </div>
        <div className="mt-[10px] flex justify-end tablet:mt-5">
          <Button variant="submit" disabled={isError} onClick={() => handleAddPersonalBadge()}>
            {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Add'}
          </Button>
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
    <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo}>
      {title === 'First Name' && renderInputField('First Name', name, handleNameChange, placeholder, apiResp)}
      {title === 'Last Name' && renderInputField('Last Name', name, handleNameChange, placeholder, apiResp)}
      {title === 'Date of Birth' && (
        <div className="px-5 py-[15px] tablet:px-[60px] tablet:py-[25px] laptop:px-[80px]">
          <input
            type="date"
            id="dateInput"
            value={date}
            onChange={handleDateChange}
            className="revert-calender-color w-full rounded-[8.62px] border border-[#DEE6F7] bg-[#FBFBFB] px-[16px] py-2 text-[9.28px] font-medium leading-[11.23px] text-[#B6B4B4] focus:outline-none tablet:rounded-[15px] tablet:border-[3px] tablet:py-[18px] tablet:text-[18px] tablet:leading-[21px]"
          />
          <div className="mt-[10px] flex justify-end tablet:mt-5">
            <Button variant="submit" onClick={() => handleAddPersonalBadge()}>
              {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Add'}
            </Button>
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
          'Select a security question',
          apiResp,
          data,
          'Write your answer here',
        )}
    </PopUp>
  );
};

export default PersonalBadgesPopup;
