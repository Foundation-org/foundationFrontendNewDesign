import { toast } from 'sonner';
import { useEffect, useState } from 'react';
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

const School = {
  label: 'School',
  type: 'school',
  placeholder: 'School here',
};
const degreePrograms = {
  label: 'Degree Program',
  items: [
    { id: 1, name: 'Bachelor of Science in Computer Science' },
    { id: 2, name: 'Bachelor of Science in Electrical Engineering' },
    { id: 3, name: 'Bachelor of Arts in Psychology' },
    { id: 4, name: 'Bachelor of Arts in English Literature' },
    { id: 5, name: 'Bachelor of Business Administration (BBA)' },
    { id: 6, name: 'Bachelor of Science in Nursing (BSN)' },
    { id: 7, name: 'Master of Business Administration (MBA)' },
    { id: 8, name: 'Master of Science in Mechanical Engineering' },
    { id: 9, name: 'Master of Science in Data Science' },
    { id: 10, name: 'Master of Public Health (MPH)' },
    { id: 11, name: 'Doctor of Medicine (MD)' },
    { id: 12, name: 'Doctor of Philosophy (Ph.D.) in Economics' },
    { id: 13, name: 'Doctor of Philosophy (Ph.D.) in Computer Science' },
    { id: 14, name: 'Doctor of Philosophy (Ph.D.) in Psychology' },
    // Add more as needed...
  ],
  type: 'degreeProgram',
  placeholder: 'Select your degree program',
};
const StartingYear = {
  label: 'Start Date',
  placeholder: 'Year here',
  type: 'startingYear',
};

const graduationYear = {
  label: 'Graduation Date',
  placeholder: 'Year here / Present',
  type: 'graduationYear',
};

const EducationBadgePopup = ({ isPopup, setIsPopup, type, title, logo, placeholder, handleUserInfo, fetchUser }) => {
  const [universities, setUniversities] = useState([]);
  const [field1Data, setField1Data] = useState([]);
  const [field2Data, setField2Data] = useState([]);
  const [field3Data, setField3Data] = useState([]);
  const [field4Data, setField4Data] = useState([]);

  const [existingData, setExistingData] = useState();
  const [query, setQuery] = useState('');
  const [isPresent, setIsPresent] = useState(false);

  const searchUniversities = async () => {
    const universities = await api.post(`search/searchUniversities/?name=${query}`);
    setUniversities(universities.data);
  };

  useEffect(() => {
    const param = fetchUser?.badges?.find((badge) => badge.personal && badge.personal.hasOwnProperty(type));
    setExistingData(param?.personal[type]);
  }, [fetchUser.badges]);
  console.log(existingData);
  useEffect(() => {
    searchUniversities();
  }, [query]);

  const handleClose = () => setIsPopup(false);

  const handlefield3Change = (event) => {
    const value = event.target.value;
    setField3Data(value);
  };
  const handlefield4Change = (event) => {
    const value = event.target.value;
    setField4Data(value);
  };

  const handlePresentToggle = () => {
    setIsPresent(!isPresent);
    if (!isPresent) {
      setField4Data('Present');
    } else {
      setField4Data('');
    }
  };

  const handleAddPersonalBadge = async (data) => {
    try {
      const addBadge = await api.post(`/addBadge/personal/addWorkOrEducation`, {
        data,
        type,
        uuid: localStorage.getItem('uuid'),
      });
      if (addBadge.status === 200) {
        handleUserInfo();
        toast.success('Badge Added Successfully!');

        handleClose();
      }
      if (addBadge.status === 201) {
        toast.success('Please check your Email to verify');
        handleClose();
      }
    } catch (error) {
      toast.error(error.response.data.message.split(':')[1]);
      handleClose();
    }
  };

  const renderWorkField = (field1, field2, field3, field4) => {
    const [addAnotherForm, setAddAnotherForm] = useState(false);

    return (
      <div className="pb-[15px] pt-2 tablet:py-[25px]">
        {/* To View Already Added Info */}
        {existingData && !addAnotherForm ? (
          <div className="mx-3 tablet:mx-[40px]">
            {existingData.map((item, index) => (
              <div
                key={index}
                className="flex w-full justify-between rounded-[8.62px] border border-[#DEE6F7] bg-[#FBFBFB] px-[9px] py-3 text-[9.28px] font-medium leading-[11.23px] text-[#B6B4B4] focus:outline-none tablet:rounded-[21.06px] tablet:border-[3px] tablet:px-7 tablet:py-[25px] tablet:text-[18px] tablet:leading-[21px]"
              >
                <div>
                  <h4 className="max-w-[324px] text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:text-[22px] tablet:leading-[26.63px]">
                    {item.school}
                  </h4>
                  <div className="mt-[2px] max-w-[270px] tablet:mt-2">
                    <h5 className="text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:text-[20px] tablet:leading-[26.63px]">
                      {item.degreeProgram}
                    </h5>
                    <h6 className="text-[8.28px] font-medium leading-[10.93px] text-[#B6B4B4] tablet:text-[18px] tablet:leading-[26.63px]">
                      {item.country}
                    </h6>
                  </div>
                </div>
                <div className="flex flex-col justify-between">
                  <div className="flex justify-end gap-[10px] tablet:gap-[30px]">
                    <img
                      src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/editIcon.svg`}
                      alt="Edit Icon"
                      className="h-[12px] w-[12px] tablet:h-[23px] tablet:w-[23px]"
                    />
                    <img
                      src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/trash2.svg`}
                      alt="Edit Icon"
                      className="h-[12px] w-[12px] tablet:h-[23px] tablet:w-[17.64px]"
                    />
                  </div>
                  <h4 className="text-[8.28px] font-medium leading-[10.93px] text-[#A7A7A7] tablet:text-[18px] tablet:leading-[26.63px]">
                    {item.startingYear + '-' + item.graduationYear}
                  </h4>
                </div>
              </div>
            ))}
            <div className="mt-4">
              <Button variant="addOption" onClick={() => setAddAnotherForm(true)}>
                <span className="text-[16px] tablet:text-[32px]">+</span> Add Another
              </Button>
            </div>
          </div>
        ) : (
          <div className="px-5 tablet:px-[60px] laptop:px-[80px]">
            <div className="mb-[5px] tablet:mb-[15px]">
              <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:mb-[14px] tablet:text-[20px] tablet:leading-[24.2px]">
                {field1.label}
              </p>
              <CustomCombobox
                items={universities}
                placeholder={field1.placeholder}
                selected={field1Data}
                setSelected={setField1Data}
                query={query}
                setQuery={setQuery}
              />
            </div>
            <div className="mb-[5px] mt-[15px] tablet:mb-[15px] tablet:mt-[25px]">
              <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:mb-[14px] tablet:text-[20px] tablet:leading-[24.2px]">
                {field2.label}
              </p>
              <CustomCombobox
                items={field2.items}
                placeholder={field2.placeholder}
                selected={field2Data}
                setSelected={setField2Data}
                query={query}
                setQuery={setQuery}
              />
            </div>

            <div className="mb-4 flex gap-[17.5px] tablet:mb-5 tablet:gap-[37px]">
              <div className="w-full">
                <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:mb-[14px] tablet:text-[20px] tablet:leading-[24.2px]">
                  {field3.label}
                </p>
                <input
                  type="date"
                  value={field3Data}
                  onChange={handlefield3Change}
                  disabled={isPresent} // Disable date input when "Present" is selected
                  className={`w-full rounded-[8.62px] border border-[#DEE6F7] bg-[#FBFBFB] px-[12px] py-2 text-[9.28px] font-medium leading-[11.23px] text-[#B6B4B4] focus:outline-none tablet:rounded-[10px] tablet:border-[3px] tablet:px-[28px] tablet:py-3 tablet:text-[18px] tablet:leading-[21px]`}
                />
              </div>
              <div className="w-full">
                <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:mb-[14px] tablet:text-[20px] tablet:leading-[24.2px]">
                  {field4.label}
                </p>
                <input
                  type="date"
                  value={field4Data}
                  onChange={handlefield4Change}
                  placeholder={field4.placeholder}
                  className={`w-full rounded-[8.62px] border border-[#DEE6F7] bg-[#FBFBFB] px-[12px] py-2 text-[9.28px] font-medium leading-[11.23px] text-[#B6B4B4] focus:outline-none tablet:rounded-[10px] tablet:border-[3px] tablet:px-[28px] tablet:py-3 tablet:text-[18px] tablet:leading-[21px]`}
                />
                <label className="ml-2">
                  <input type="checkbox" checked={isPresent} onChange={handlePresentToggle} className="mr-1" />
                  Present
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              {/* <Button variant="addOption">
                <span className="text-[16px] tablet:text-[32px]">+</span> Add Another
              </Button> */}
              <Button
                variant="submit"
                onClick={() => {
                  const allFieldObject = {
                    [field1.type]: field1Data.name,
                    [field2.type]: field2Data.name,
                    ['country']: field1Data.country,
                    [field3.type]: field3Data,
                    [field4.type]: field4Data,
                  };
                  handleAddPersonalBadge(allFieldObject);
                }}
              >
                Add
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo}>
      {title === 'Education' && renderWorkField(School, degreePrograms, StartingYear, graduationYear)}
    </PopUp>
  );
};

export default EducationBadgePopup;
