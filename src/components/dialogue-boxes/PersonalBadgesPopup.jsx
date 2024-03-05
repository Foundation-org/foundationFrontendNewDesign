import { toast } from 'sonner';
import { useState } from 'react';
import { Button } from '../ui/Button';
import { useQuery } from '@tanstack/react-query';
import { validation } from '../../services/api/badgesApi';

import PopUp from '../ui/PopUp';
import api from '../../services/api/Axios';

const PersonalBadgesPopup = ({ isPopup, setIsPopup, type, title, logo, placeholder }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');

  const handleClose = () => setIsPopup(false);

  const handleNameChange = (e) => setName(e.target.value);

  const handleDateChange = (event) => {
    let inputValue = event.target.value.replace(/\D/g, '');
    let formattedValue = '';

    if (inputValue.length > 2) {
      formattedValue += inputValue.substring(0, 2) + '/';
      if (inputValue.length > 4) {
        formattedValue += inputValue.substring(2, 4) + '/';
        formattedValue += inputValue.substring(4, 8);
      } else {
        formattedValue += inputValue.substring(2);
      }
    } else {
      formattedValue = inputValue;
    }

    setDate(formattedValue.substring(0, 10));
  };

  const { data: apiResp } = useQuery({
    queryKey: ['validate-name', { name }],
    queryFn: () => validation(title === 'First Name' ? 5 : 6, name),
  });

  const handleAddPersonalBadge = async () => {
    let value;
    if (type.trim() === "dateOfBirth") {
      value = date;
    } else {
      value = name;
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
        handleClose();
      }
    } catch (error) {
      toast.error(error.response.data.message.split(':')[1]);
      handleClose();
    }
  };

  const renderInputField = (title, name, handleNameChange, placeholder, apiResp) => {
    const isError = apiResp?.data?.message === 'No';

    return (
      <div className="px-5 pb-[15px] pt-2 tablet:px-[60px] tablet:py-[25px] laptop:px-[80px]">
        <div>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder={placeholder}
            className={`w-full rounded-[8.62px] border border-[#DEE6F7] bg-[#FBFBFB] px-[16px] py-2 text-[9.28px] font-medium leading-[11.23px] text-[#B6B4B4] focus:outline-none tablet:rounded-[15px] tablet:border-[3px] tablet:py-[18px] tablet:text-[18px] tablet:leading-[21px] ${isError && 'mb-[10px] tablet:mb-5'}`}
          />
          {isError && <p className="text-red ml-1 text-[6.8px] tablet:text-[14px]">{`Invalid ${title}!`}</p>}
          <div className="flex justify-end" onClick={() => handleAddPersonalBadge()}>
            <Button variant="submit">Add</Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo}>
      {title === 'First Name' && renderInputField('First Name', name, handleNameChange, placeholder, apiResp)}
      {title === 'Last Name' && renderInputField('Last Name', name, handleNameChange, placeholder, apiResp)}
      {title === 'Date of Birth' && (
        <div>
          <input
            type="text"
            id="dateInput"
            value={date}
            maxLength="10"
            onChange={handleDateChange}
            placeholder="MM/DD/YYYY"
            className={`w-full rounded-[8.62px] border border-[#DEE6F7] bg-[#FBFBFB] px-[16px] py-2 text-[9.28px] font-medium leading-[11.23px] text-[#B6B4B4] focus:outline-none tablet:rounded-[15px] tablet:border-[3px] tablet:py-[18px] tablet:text-[18px] tablet:leading-[21px] ${apiResp?.data?.message !== 'No' && 'mb-[10px] tablet:mb-5'}  `}
          />
          <div className="flex justify-end" onClick={() => handleAddPersonalBadge()}>
            <Button variant="submit">Add</Button>
          </div>
        </div>
      )}
      {title === 'Current City' && renderInputField('Current City', name, handleNameChange, placeholder, apiResp)}
      {title === 'Home Town' && renderInputField('Home Town', name, handleNameChange, placeholder, apiResp)}
      {title === 'Relationship Status' &&
        renderInputField('Relationship Status', name, handleNameChange, placeholder, apiResp)}
      {title === 'ID / Passport' && renderInputField('ID / Passport', name, handleNameChange, placeholder, apiResp)}
    </PopUp>
  );
};

export default PersonalBadgesPopup;
