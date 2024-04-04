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
  const [field3Data, setField3Data] = useState();
  const [field4Data, setField4Data] = useState();
  const [prevInfo, setPrevInfo] = useState({});
  const [existingData, setExistingData] = useState();
  const [query, setQuery] = useState('');
  const [deleteItem, setDeleteItem] = useState('');

  const searchUniversities = async () => {
    const universities = await api.post(`search/searchUniversities/?name=${query}`);
    setUniversities(universities.data);
  };
  useEffect(() => {
    searchUniversities();
  }, [query]);

  useEffect(() => {
    const param = fetchUser?.badges?.find((badge) => badge.personal && badge.personal.hasOwnProperty(type));
    setExistingData(param?.personal[type]);
  }, [fetchUser.badges]);

  const handleClose = () => setIsPopup(false);

  const handlefield3Change = (event) => {
    const value = event.target.value;
    setField3Data(value);
  };
  const handlefield4Change = (event) => {
    const value = event.target.value;
    setField4Data(value);
  };

  const handleAddPersonalBadge = async (data) => {
    try {
      if (
        field1Data.name === undefined ||
        field2Data.name === undefined ||
        field3Data === undefined ||
        field4Data === undefined
      ) {
        toast.error('You cannot leave the field blank');
        return;
      }
      if (field4Data < field3Data) {
        toast.warning('Please ensure the ending date is not earlier than the starting date.');
        return;
      }
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
  const handleDelete = async (id) => {
    const companies = await api.post(`/addBadge/personal/deleteWorkOrEducation`, {
      id: id,
      uuid: localStorage.getItem('uuid'),
      type: type,
    });
    if (companies.status === 200) {
      handleUserInfo();
    }
  };

  const handleUpdateBadge = async (newData) => {
    try {
      if (field4Data < field3Data) {
        toast.warning('Please ensure the ending date is not earlier than the starting date.');
        return;
      }
      if (
        prevInfo.school === field1Data.name &&
        prevInfo.degreeProgram === field2Data.name &&
        prevInfo.startingYear === field3Data &&
        prevInfo.graduationYear === field4Data
      ) {
        toast.error('Information already saved');
        return;
      }

      const updateBadge = await api.post(`/addBadge/personal/updateWorkOrEducation`, {
        newData,
        type,
        uuid: localStorage.getItem('uuid'),
        id: prevInfo.id,
      });
      if (updateBadge.status === 200) {
        handleUserInfo();
        toast.success('Info Updated Successfully');

        handleClose();
      }
    } catch (error) {
      toast.error(error.response.data.message.split(':')[1]);
      handleClose();
    }
  };

  const handleEdit = async (id) => {
    const info = await api.post(`/addBadge/personal/getWorkOrEducation`, {
      id: id,
      uuid: localStorage.getItem('uuid'),
      type: type,
    });
    setPrevInfo(info?.data?.obj);
    if (info.status === 200) {
      console.log(info);
      const data = info?.data.obj;

      setField1Data({ id: data.id, name: data.school, country: data.country });
      setField2Data({ name: data.degreeProgram });
      setField3Data(data.startingYear);
      if (data.graduationYear === 'Present') {
        setIsPresent(true);
        setField4Data(data.graduationYear);
      } else {
        setField4Data(data.graduationYear);
      }
    }
  };

  const renderWorkField = (field1, field2, field3, field4) => {
    const [addAnotherForm, setAddAnotherForm] = useState(false);
    const [edit, setEdit] = useState(false);

    return (
      <div className="pb-[15px] pt-2 tablet:py-[25px]">
        {/* To View Already Added Info */}
        {existingData && !addAnotherForm ? (
          <div className="mx-3 flex flex-col gap-[2px] tablet:mx-[40px] tablet:gap-[5px]">
            {existingData.map((item, index) =>
              deleteItem === item.id ? (
                <div className="flex w-full flex-col justify-between gap-[10px]  rounded-[8.62px] border border-[#DEE6F7] bg-[#FBFBFB] px-[9px] py-3 text-[9.28px] font-medium leading-[11.23px] text-[#B6B4B4] focus:outline-none tablet:rounded-[21.06px] tablet:border-[3px] tablet:px-7 tablet:py-[25px] tablet:text-[18px] tablet:leading-[21px]">
                  <p>Are you sure you want to remove this item?</p>
                  <div className="flex justify-end gap-[10px]">
                    <Button
                      variant="addOption"
                      onClick={() => {
                        setDeleteItem('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => {
                        handleDelete(deleteItem);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ) : (
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
                        onClick={() => {
                          setAddAnotherForm(true), setEdit(true), handleEdit(item.id);
                        }}
                      />
                      <img
                        src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/trash2.svg`}
                        alt="Edit Icon"
                        className="h-[12px] w-[12px] tablet:h-[23px] tablet:w-[17.64px]"
                        onClick={() => setDeleteItem(item.id)}
                      />
                    </div>
                    <h4 className="text-[8.28px] font-medium leading-[10.93px] text-[#A7A7A7] tablet:text-[18px] tablet:leading-[26.63px]">
                      {item.startingYear + '-' + item.graduationYear}
                    </h4>
                  </div>
                </div>
              ),
            )}

            <div className="mt-4">
              <Button variant="addOption" onClick={() => setAddAnotherForm(true)}>
                <span className="text-[16px] tablet:text-[32px]">+</span> Add Another
              </Button>
            </div>
          </div>
        ) : (
          <div className="px-5 tablet:px-[60px] laptop:px-[72px]">
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

            <div className="mb-4 mt-[15px] flex gap-[17.5px] tablet:mb-5 tablet:mt-[25px] tablet:gap-[37px]">
              <div className="w-full">
                <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:mb-[14px] tablet:text-[20px] tablet:leading-[24.2px]">
                  {field3.label}
                </p>
                <input
                  type="date"
                  value={field3Data}
                  onChange={handlefield3Change}
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
              </div>
            </div>

            <div className="flex justify-between">
              {existingData && existingData.lenght !== 0 ? (
                <Button
                  variant="addOption"
                  onClick={() => {
                    setField1Data([]);
                    setField2Data([]);
                    setField3Data();
                    setField4Data();
                    setAddAnotherForm(false);
                  }}
                >
                  Cancel
                </Button>
              ) : (
                <div></div>
              )}
              <Button
                variant="submit"
                onClick={() => {
                  const allFieldObject = {
                    ['id']: field1Data.id,
                    [field1.type]: field1Data.name,
                    [field2.type]: field2Data.name,
                    ['country']: field1Data.country,
                    [field3.type]: field3Data,
                    [field4.type]: field4Data,
                  };
                  if (edit) {
                    handleUpdateBadge(allFieldObject);
                  } else {
                    handleAddPersonalBadge(allFieldObject);
                  }
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
