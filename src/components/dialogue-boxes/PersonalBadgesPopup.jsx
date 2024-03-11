import { toast } from 'sonner';
import { useState } from 'react';
import { Button } from '../ui/Button';
import { useQuery } from '@tanstack/react-query';
import { validation } from '../../services/api/badgesApi';
import PopUp from '../ui/PopUp';
import api from '../../services/api/Axios';
import CustomCombobox from '../ui/Combobox';
import { FaSpinner } from 'react-icons/fa';

const data = [
  { id: 1, name: 'In what city were you born?' },
  { id: 2, name: 'What is the name of your first pet?' },
  { id: 2, name: 'What is the last name of your favorite teacher?' },
];

const PersonalBadgesPopup = ({ isPopup, setIsPopup, type, title, logo, placeholder, handleUserInfo }) => {
  const [selected, setSelected] = useState();
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClose = () => setIsPopup(false);

  const handleNameChange = (e) => setName(e.target.value);

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setDate(selectedDate);
  };
  const handleSecurityQuestionChange = (event) => {};

  const { data: apiResp } = useQuery({
    queryKey: ['validate-name', (title === 'First Name' || title === 'Last Name') && name],
    queryFn: () => validation(title === 'First Name' ? 5 : title === 'Last Name' && 6, name),
  });

  const handleAddPersonalBadge = async () => {
    setLoading(true);
    let value;
    if (type.trim() === 'dateOfBirth') {
      value = date;
    } else if (type.trim() === 'security-question') {
      value = {
        [selected.name]: name,
      };
    } else {
      value = name;
    }

    if (value === '') {
      toast.warning('Field cannot be empty!');
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
      console.log(error);
      handleClose();
    } finally {
      setLoading(false);
    }
  };

  const renderInputField = (title, name, handleNameChange, placeholder, apiResp, data) => {
    const isError = apiResp?.data?.message === 'No';
    console.log('isError', isError);
    return (
      <div className="px-5 py-[15px] tablet:px-[60px] tablet:py-[25px] laptop:px-[80px]">
        {data && data.length >= 1 ? (
          <>
            <div className="flex flex-col gap-[10px] tablet:gap-[15px]">
              <CustomCombobox items={data} selected={selected} setSelected={setSelected} />
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder={placeholder}
                className="w-full rounded-[8.62px] border border-[#DEE6F7] bg-[#FBFBFB] px-[16px] py-2 text-[9.28px] font-medium leading-[11.23px] text-[#B6B4B4] focus:outline-none tablet:rounded-[10px] tablet:border-[3px] tablet:px-7 tablet:py-3 tablet:text-[18px] tablet:leading-[21px]"
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
      {title === 'Current City' && renderInputField('Current City', name, handleNameChange, placeholder, apiResp)}
      {title === 'Home Town' && renderInputField('Home Town', name, handleNameChange, placeholder, apiResp)}
      {title === 'Relationship Status' &&
        renderInputField('Relationship Status', name, handleNameChange, placeholder, apiResp)}
      {title === 'ID / Passport' && renderInputField('ID / Passport', name, handleNameChange, placeholder, apiResp)}
      {title === 'Geolocation' && renderInputField('Geolocation', name, handleNameChange, placeholder, apiResp)}
      {title === 'Security Question' &&
        renderInputField(
          'Security Question',
          name,
          handleSecurityQuestionChange,
          'Enter your answer here',
          apiResp,
          data,
        )}
    </PopUp>
  );
};

export default PersonalBadgesPopup;
