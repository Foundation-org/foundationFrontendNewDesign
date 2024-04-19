import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { useQuery } from '@tanstack/react-query';
import { validation } from '../../services/api/badgesApi';

import PopUp from '../ui/PopUp';
import api from '../../services/api/Axios';
import CustomCombobox from '../ui/Combobox';
import { FaSpinner } from 'react-icons/fa';

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
  type: 'degreeProgram',
  placeholder: 'Degree here',
};

const fieldOfStudy = {
  label: 'Field of Study',
  type: 'fieldOfStudy',
  placeholder: 'Field of Study here',
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
  const [field5Data, setField5Data] = useState([]);
  const [prevInfo, setPrevInfo] = useState({});
  const [isPresent, setIsPresent] = useState(false);
  const [existingData, setExistingData] = useState();
  const [query, setQuery] = useState('');
  const [deleteItem, setDeleteItem] = useState('');
  const [loading, setLoading] = useState(false);
  const [delloading, setDelLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isError2, setIsError2] = useState(false);
  const [hollow, setHollow] = useState(false);

  const searchUniversities = async () => {
    const universities = await api.post(`search/searchUniversities/?name=${query}`);
    setUniversities(universities.data);
  };
  const handlePresentToggle = () => {
    setIsPresent(!isPresent);
    if (!isPresent) {
      setField4Data('Present');
    } else {
      setField4Data('');
    }
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
        field2Data === undefined ||
        field2Data === '' ||
        field3Data === undefined ||
        field4Data === undefined ||
        field4Data === '' ||
        field5Data === undefined ||
        field5Data === ''
      ) {
        toast.error('You cannot leave the field blank');
        setLoading(false);
        return;
      }
      if (field4Data < field3Data) {
        toast.warning('Please ensure the graduation date is not earlier than the start date.');
        setLoading(false);
        return;
      }
      if (field4Data === field3Data) {
        toast.warning('Please ensure the graduation date is not the same as the start date.');
        setLoading(false);
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
        setLoading(false);
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
  console.log(field1Data.name, field2Data, field3Data, field4Data, field5Data);

  const handleUpdateBadge = async (newData) => {
    try {
      if (
        field1Data.name === undefined ||
        field2Data === undefined ||
        field2Data === '' ||
        field3Data === undefined ||
        field4Data === undefined ||
        field4Data === '' ||
        field5Data === undefined ||
        field5Data === ''
      ) {
        toast.error('You cannot leave the field blank');
        setLoading(false);
        return;
      }
      if (field4Data < field3Data) {
        toast.warning('Please ensure the graduation date is not earlier than the start date.');
        setLoading(false);
        return;
      }
      if (field4Data === field3Data) {
        toast.warning('Please ensure the graduation date is not the same as the start date.');
        setLoading(false);
        return;
      }
      if (
        prevInfo.school === field1Data.name &&
        prevInfo.degreeProgram === field2Data &&
        prevInfo.fieldOfStudy === field5Data &&
        prevInfo.startingYear === field3Data &&
        prevInfo.graduationYear === field4Data
      ) {
        toast.error('Information already saved');
        setLoading(false);
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
        setLoading(false);
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
      setField2Data(data.degreeProgram);
      setField5Data(data.fieldOfStudy);
      setField3Data(data.startingYear);
      if (data.graduationYear === 'Present') {
        setIsPresent(true);
        setField4Data(data.graduationYear);
      } else {
        setField4Data(data.graduationYear);
      }
    }
  };

  const handleTab = (index, key) => {
    if (index === 3) {
      document.getElementById(`input-${index}`).blur();
    } else {
      if (key === 'Enter') {
        document.getElementById(`input-${index + 1}`).focus();
      } else {
        if (index > 1) {
          document.getElementById(`input-${index + 1}`).focus();
        } else {
          document.getElementById(`input-${index}`).focus();
        }
      }
    }
  };
  const verifyDegree = async () => {
    setHollow(true);
    const response = await api.get(`/ai-validation/7?userMessage=${field2Data}`);
    if (response.data.message === 'Rejected') {
      setIsError(true);
      setHollow(true);
    } else {
      setIsError(false);
      setHollow(false);
    }
  };
  const verifyFieldOfStudy = async () => {
    setHollow(true);
    const response = await api.get(`/ai-validation/8?userMessage=${field5Data}`);
    if (response.data.message === 'Rejected') {
      setIsError2(true);
      setHollow(true);
    } else {
      setIsError2(false);
      setHollow(false);
    }
  };
  const checkHollow = () => {
    if (
      field1Data.name === undefined ||
      field2Data === undefined ||
      field2Data === '' ||
      field3Data === undefined ||
      field4Data === undefined ||
      field4Data === '' ||
      field5Data === undefined ||
      field5Data === ''
    ) {
      return true;
    } else {
      return false;
    }
  };
  useEffect(() => {
    checkHollow();
  }, [field1Data, field2Data, field3Data, field4Data, field5Data]);

  const renderWorkField = (field1, field2, field3, field4, field5) => {
    const [addAnotherForm, setAddAnotherForm] = useState(false);
    const [edit, setEdit] = useState(false);

    return (
      <div className="pb-[15px] pt-2 tablet:py-[25px]">
        {/* To View Already Added Info */}
        {existingData && !addAnotherForm ? (
          <div className="mx-3 flex flex-col gap-[2px] tablet:mx-[40px] tablet:gap-[5px]">
            {existingData.map((item, index) => (
              <div
                key={index}
                className="flex w-full justify-between rounded-[8.62px] border border-[#DEE6F7] bg-[#FBFBFB] pl-[9px] text-[9.28px] font-medium leading-[11.23px] text-[#B6B4B4] focus:outline-none tablet:rounded-[21.06px] tablet:border-[3px] tablet:pl-7 tablet:text-[18px] tablet:leading-[21px]"
              >
                <div className="py-3 tablet:py-[25px]">
                  <h4 className="max-w-[324px] text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:text-[22px] tablet:leading-[26.63px]">
                    {item.school}
                  </h4>
                  <div className="mt-[2px] max-w-[270px] tablet:mt-2">
                    <h5 className="text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:text-[20px] tablet:leading-[26.63px]">
                      {item.degreeProgram + ' ' + 'of' + ' ' + item.fieldOfStudy}
                    </h5>
                    <h6 className="text-[8.28px] font-medium leading-[10.93px] text-[#B6B4B4] tablet:text-[18px] tablet:leading-[26.63px]">
                      {item.country}
                    </h6>
                  </div>
                </div>
                {deleteItem === item.id ? (
                  <div className="max-w-[160px] rounded-[10.06px] border-l border-[#DEE6F7] px-[9px] py-2 tablet:max-w-[342px] tablet:rounded-[21.06px] tablet:border-l-[3px] tablet:px-5 tablet:py-[15px]">
                    <h1 className="mb-[7px] text-[8px] font-medium leading-[8px] text-[#A7A7A7] tablet:mb-[10px] tablet:text-[18px] tablet:font-semibold tablet:leading-[26.73px]">
                      Are you sure you want to delete your experience?
                    </h1>
                    <div className="flex justify-end gap-2 tablet:gap-[25px]">
                      <Button
                        className={'min-w-[2.875rem] tablet:min-w-[80px]'}
                        variant="submit"
                        onClick={() => {
                          setDelLoading(true);
                          handleDelete(deleteItem);
                        }}
                      >
                        {delloading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Yes'}
                      </Button>
                      <Button
                        className={'w-[2.875rem] tablet:min-w-[80px] laptop:w-[80px]'}
                        variant="cancel"
                        onClick={() => {
                          setDeleteItem('');
                        }}
                      >
                        No
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col justify-between py-3 pr-[9px] tablet:py-[25px] tablet:pr-7">
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
                )}
              </div>
            ))}

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
                id={1}
                handleTab={handleTab}
              />
            </div>
            <div className="mb-4 mt-[15px] flex gap-[17.5px] tablet:mb-5 tablet:mt-[25px] tablet:gap-[37px]">
              <div className="w-full">
                <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:mb-[14px] tablet:text-[20px] tablet:leading-[24.2px]">
                  {field2.label}
                </p>
                <input
                  id="input-2"
                  type="text"
                  value={field2Data}
                  onBlur={() => {
                    if (field2Data) {
                      verifyDegree();
                    }
                  }}
                  onChange={(e) => {
                    setHollow(true);
                    setIsError(false);
                    setField2Data(e.target.value);
                  }}
                  onKeyDown={(e) => (e.key === 'Tab' && handleTab(2)) || (e.key === 'Enter' && handleTab(2, 'Enter'))}
                  placeholder={field2.placeholder}
                  className="w-full rounded-[8.62px] border border-[#DEE6F7] bg-[#FBFBFB] px-[16px] py-2 text-[9.28px] font-medium leading-[11.23px] text-[#B6B4B4] focus:outline-none tablet:rounded-[10px] tablet:border-[3px] tablet:px-7 tablet:py-3 tablet:text-[18px] tablet:leading-[21px]"
                />
                {isError && (
                  <p className="top-25 absolute ml-1 text-[6.8px] font-semibold text-[#FF4057] tablet:text-[14px]">{`Invalid ${field2.label}!`}</p>
                )}
              </div>
              <div className="w-full">
                <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:mb-[14px] tablet:text-[20px] tablet:leading-[24.2px]">
                  {field5.label}
                </p>
                <input
                  id="input-3"
                  type="text"
                  onBlur={() => {
                    if (field5Data) {
                      verifyFieldOfStudy();
                    }
                  }}
                  value={field5Data}
                  onChange={(e) => {
                    setHollow(true);
                    setIsError2(false);
                    setField5Data(e.target.value);
                  }}
                  onKeyDown={(e) => (e.key === 'Tab' && handleTab(3)) || (e.key === 'Enter' && handleTab(3, 'Enter'))}
                  placeholder={field5.placeholder}
                  className="w-full rounded-[8.62px] border border-[#DEE6F7] bg-[#FBFBFB] px-[16px] py-2 text-[9.28px] font-medium leading-[11.23px] text-[#B6B4B4] focus:outline-none tablet:rounded-[10px] tablet:border-[3px] tablet:px-7 tablet:py-3 tablet:text-[18px] tablet:leading-[21px]"
                />
                {isError2 && (
                  <p className="top-25 absolute ml-1 text-[6.8px] font-semibold text-[#FF4057] tablet:text-[14px]">{`Invalid ${field5.label}!`}</p>
                )}
              </div>
            </div>
            <label
              id="custom-square-checkbox"
              className="flex items-center gap-2 text-[10px] font-medium text-[#7C7C7C] tablet:gap-[15px] tablet:text-[20px]"
            >
              <input
                type="checkbox"
                checked={isPresent}
                onChange={handlePresentToggle}
                className="checkbox size-[14px] tablet:size-[25px]"
              />
              Not Completed
            </label>

            <div className="mb-4 mt-[15px] flex gap-[17.5px] tablet:mb-5 tablet:mt-[25px] tablet:gap-[37px]">
              <div className="w-full">
                <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:mb-[14px] tablet:text-[20px] tablet:leading-[24.2px]">
                  {field3.label}
                </p>
                <input
                  id="input-4"
                  onKeyDown={(e) => (e.key === 'Tab' && handleTab(4)) || (e.key === 'Enter' && handleTab(4, 'Enter'))}
                  type="date"
                  value={field3Data}
                  onChange={handlefield3Change}
                  className={`w-full rounded-[8.62px] border border-[#DEE6F7] bg-[#FBFBFB] px-[12px] py-2 text-[9.28px] font-medium leading-[11.23px] text-[#B6B4B4] focus:outline-none tablet:rounded-[10px] tablet:border-[3px] tablet:px-[28px] tablet:py-3 tablet:text-[18px] tablet:leading-[21px]`}
                />
              </div>
              {isPresent ? (
                <div className="w-full"></div>
              ) : (
                <div className="w-full">
                  <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:mb-[14px] tablet:text-[20px] tablet:leading-[24.2px]">
                    {field4.label}
                  </p>
                  <input
                    id="input-5"
                    onKeyDown={(e) => (e.key === 'Tab' && handleTab(4)) || (e.key === 'Enter' && handleTab(4, 'Enter'))}
                    type="date"
                    value={field4Data}
                    onChange={handlefield4Change}
                    placeholder={field4.placeholder}
                    className={`w-full rounded-[8.62px] border border-[#DEE6F7] bg-[#FBFBFB] px-[12px] py-2 text-[9.28px] font-medium leading-[11.23px] text-[#B6B4B4] focus:outline-none tablet:rounded-[10px] tablet:border-[3px] tablet:px-[28px] tablet:py-3 tablet:text-[18px] tablet:leading-[21px]`}
                  />
                </div>
              )}
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
              {hollow || checkHollow() ? (
                <Button variant="hollow-submit" id="submitButton" disabled={true}>
                  Add
                </Button>
              ) : (
                <Button
                  disabled={loading}
                  variant="submit"
                  onClick={() => {
                    const allFieldObject = {
                      ['id']: field1Data.id,
                      [field1.type]: field1Data.name,
                      [field2.type]: field2Data,
                      [field5.type]: field5Data,
                      ['country']: field1Data.country,
                      [field3.type]: field3Data,
                      [field4.type]: field4Data,
                    };
                    if (edit) {
                      setLoading(true);
                      handleUpdateBadge(allFieldObject);
                    } else {
                      setLoading(true);
                      handleAddPersonalBadge(allFieldObject);
                    }
                  }}
                >
                  {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Add'}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo}>
      {title === 'Education' && renderWorkField(School, degreePrograms, StartingYear, graduationYear, fieldOfStudy)}
    </PopUp>
  );
};

export default EducationBadgePopup;
