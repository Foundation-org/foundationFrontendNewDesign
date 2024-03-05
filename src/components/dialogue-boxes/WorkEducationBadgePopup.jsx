import { toast } from 'sonner';
import { useState } from 'react';
import { Button } from '../ui/Button';
import { useQuery } from '@tanstack/react-query';
import { validation } from '../../services/api/badgesApi';

import PopUp from '../ui/PopUp';
import api from '../../services/api/Axios';
import CustomCombobox from '../ui/Combobox';

const workForm = [
  {
    label: 'Compaany Name',
    items: [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ],
    placeholder: 'Company Here',
  },
  {
    label: 'Tittle',
    items: [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ],
    placeholder: 'Job Title Here',
  },
];

const workFormTwo = [
  {
    label: 'Employement Type',
    placeholder: 'Job Title Here',
  },
  {
    label: 'Mode of Job',
    placeholder: 'Job Title Here',
  },
];

const EducationForm = [
  {
    label: 'School',
    items: [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ],
    placeholder: 'school here',
  },
  {
    label: 'Degree',
    items: [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ],
    placeholder: 'Degree here',
  },
  {
    label: 'Field of study',
    items: [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ],
    placeholder: 'field of study here',
  },
];

const EducationFormTwo = [
  {
    label: 'Start Date',
    placeholder: 'Date here',
  },
  {
    label: 'End Date',
    placeholder: 'Date here',
  },
];

const WorkEducationBadgePopup = ({ isPopup, setIsPopup, type, title, logo, placeholder }) => {
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
    if (type === 'dataOfBirth') {
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
      if (addBadge.status === 201) {
        toast.success('Email Send Successfully!');
        handleClose();
      }
    } catch (error) {
      toast.error(error.response.data.message.split(':')[1]);
      handleClose();
    }
  };

  const renderWorkField = (workForm, workFormTwo) => {
    // const isError = apiResp?.data?.message === 'No';

    console.log('first', workForm);

    return (
      <div className="pb-[15px] pt-2 tablet:py-[25px]">
        {/* To View Already Added Info */}
        <div className="mx-3 tablet:mx-[40px]">
          <div className="flex w-full justify-between rounded-[8.62px] border border-[#DEE6F7] bg-[#FBFBFB] px-[9px] py-3 text-[9.28px] font-medium leading-[11.23px] text-[#B6B4B4] focus:outline-none tablet:rounded-[21.06px] tablet:border-[3px] tablet:px-7 tablet:py-[25px] tablet:text-[18px] tablet:leading-[21px]">
            <div>
              <h4 className="max-w-[324px] text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:text-[22px] tablet:leading-[26.63px]">
                Senior User Interface Designer
              </h4>
              <div className="mt-[2px] max-w-[270px] tablet:mt-2">
                <h5 className="text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:text-[20px] tablet:leading-[26.63px]">
                  Cache Cloud INC · Part-time
                </h5>
                <h6 className="text-[8.28px] font-medium leading-[10.93px] text-[#B6B4B4] tablet:text-[18px] tablet:leading-[26.63px]">
                  Islamabad, Pakistan · Remote
                </h6>
              </div>
            </div>
            <div className="flex flex-col justify-between">
              <div className="flex justify-end gap-[10px] tablet:gap-[30px]">
                <img
                  src="/assets/svgs/editIcon.svg"
                  alt="Edit Icon"
                  className="h-[12px] w-[12px] tablet:h-[23px] tablet:w-[23px]"
                />
                <img
                  src="/assets/svgs/dashboard/trash2.svg"
                  alt="Edit Icon"
                  className="h-[12px] w-[12px] tablet:h-[23px] tablet:w-[17.64px]"
                />
              </div>
              <h4 className="text-[8.28px] font-medium leading-[10.93px] text-[#A7A7A7] tablet:text-[18px] tablet:leading-[26.63px]">
                Nov 2023 - Present · 3 mos
              </h4>
            </div>
          </div>
        </div>
        {/* Form */}
        <div className="px-5 tablet:px-[60px] laptop:px-[80px]">
          {workForm.map((item, index) => (
            <div key={index + 1} className="mb-[5px] mt-[15px] tablet:mb-[15px] tablet:mt-[25px]">
              <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:mb-[14px] tablet:text-[20px] tablet:leading-[24.2px]">
                {item.label}
              </p>
              <CustomCombobox items={item.items} placeholder={item.placeholder} />
            </div>
          ))}

          <div className="mb-4 flex gap-[17.5px] tablet:mb-5 tablet:gap-[37px]">
            {workFormTwo.map((item, index) => (
              <div key={index + 1} className="w-full">
                <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:mb-[14px] tablet:text-[20px] tablet:leading-[24.2px]">
                  {item.label}
                </p>
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  placeholder={item.placeholder}
                  className={`w-full rounded-[8.62px] border border-[#DEE6F7] bg-[#FBFBFB] px-[12px] py-2 text-[9.28px] font-medium leading-[11.23px] text-[#B6B4B4] focus:outline-none tablet:rounded-[10px] tablet:border-[3px] tablet:px-[28px] tablet:py-3 tablet:text-[18px] tablet:leading-[21px]`}
                />
              </div>
            ))}
          </div>
          {/* {isError && <p className="text-red ml-1 text-[6.8px] tablet:text-[14px]">{`Invalid ${title}!`}</p>}{' '} */}
          <div className="flex justify-between">
            <Button variant="addOption">
              <span className="text-[16px] tablet:text-[32px]">+</span> Add Another
            </Button>
            <Button variant="submit" onClick={() => handleAddPersonalBadge()}>
              Add
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo}>
      {title === 'Work' && renderWorkField(workForm, workFormTwo)}
      {title === 'Education' && renderWorkField(EducationForm, EducationFormTwo)}
    </PopUp>
  );
};

export default WorkEducationBadgePopup;
