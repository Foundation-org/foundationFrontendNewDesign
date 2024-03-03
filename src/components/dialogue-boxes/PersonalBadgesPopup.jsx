import { toast } from 'sonner';
import { useState } from 'react';
import { Button } from '../ui/Button';

import PopUp from '../ui/PopUp';
import { validation } from '../../services/api/badgesApi';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api/Axios';

const PersonalBadgesPopup = ({ isPopup, setIsPopup,type, title, logo, placeholder }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');

  const handleClose = () => {
    setIsPopup(false);
  };

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
    if(type ==="dataOfBirth"){
          value=date;
    }
    else{
      value=name;
    }
    try {
        const addBadge = await api.post(`/addBadge/personal/add`, {
          personal:{
            [type] : value,
          },
          uuid: localStorage.getItem('uuid'),

        });
      if (addBadge.status === 200) {
        toast.success('Badge Added Successfully!');
        handleClose()
      }
      if (addBadge.status === 201) {
        toast.success('Email Send Successfully!');
        handleClose()
      }
    } catch (error) {
      toast.error(error.response.data.message.split(':')[1]);
      handleClose()
    }
  };

  return (
    <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo}>
      <div className="pt-2 pb-[15px] tablet:py-[25px] px-5 tablet:px-[60px] laptop:px-[80px]">
        {title === 'First Name' && (
          <div>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder={placeholder}
              className={`w-full text-[9.28px] tablet:text-[18px] leading-[11.23px] tablet:leading-[21px] font-medium text-[#B6B4B4] border tablet:border-[3px] border-[#DEE6F7] bg-[#FBFBFB] rounded-[8.62px] tablet:rounded-[15px] py-2 tablet:py-[18px] px-[16px] focus:outline-none ${apiResp?.data?.message !== 'No' && 'mb-[10px] tablet:mb-5'}  `}
            />
            {apiResp?.data?.message === 'No' && (
              <p className="text-red text-[6.8px] tablet:text-[14px]  ml-1">Invalid First Name!</p>
            )}
          </div>
        )}
        {title === 'Last Name' && (
          <div>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder={placeholder}
              className={`w-full text-[9.28px] tablet:text-[18px] leading-[11.23px] tablet:leading-[21px] font-medium text-[#B6B4B4] border tablet:border-[3px] border-[#DEE6F7] bg-[#FBFBFB] rounded-[8.62px] tablet:rounded-[15px] py-2 tablet:py-[18px] px-[16px] focus:outline-none ${apiResp?.data?.message !== 'No' && 'mb-[10px] tablet:mb-5'}  `}
              />
              {apiResp?.data?.message === 'No' && (
                <p className="text-red text-[6.8px] tablet:text-[14px]  ml-1">Invalid Last Name!</p>
              )}
            </div>
        )}
        {title === 'Date of Birth' && (
          <div>
            <input
              type="text"
              id="dateInput"
              value={date}
              maxLength="10"
              onChange={handleDateChange}
              placeholder="MM/DD/YYYY"
              className={`w-full text-[9.28px] tablet:text-[18px] leading-[11.23px] tablet:leading-[21px] font-medium text-[#B6B4B4] border tablet:border-[3px] border-[#DEE6F7] bg-[#FBFBFB] rounded-[8.62px] tablet:rounded-[15px] py-2 tablet:py-[18px] px-[16px] focus:outline-none ${apiResp?.data?.message !== 'No' && 'mb-[10px] tablet:mb-5'}  `}
              />
              {apiResp?.data?.message === 'No' && (
                <p className="text-red text-[6.8px] tablet:text-[14px]  ml-1">Invalid Date of Birth!</p>
              )}
            </div>
        )}
        <div className="flex justify-end" onClick={() => handleAddPersonalBadge()}>
          <Button variant="submit">Add</Button>
        </div>
      </div>
    </PopUp>
  );
};

export default PersonalBadgesPopup;
