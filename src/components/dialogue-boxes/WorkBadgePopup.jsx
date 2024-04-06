import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import PopUp from '../ui/PopUp';
import api from '../../services/api/Axios';
import CustomCombobox from '../ui/Combobox';
import ListBox from '../ui/ListBox';
import { FaSpinner } from 'react-icons/fa';

const CompanyName = {
  label: 'Company Name',
  type: 'companyName',
  placeholder: 'Company here',
};
const jobTitles = {
  label: 'Title',
  items: [
    { id: 1, name: 'Software Engineer' },
    { id: 2, name: 'Data Analyst' },
    { id: 3, name: 'Human Resources Manager' },
    { id: 4, name: 'Marketing Coordinator' },
    { id: 5, name: 'Financial Analyst' },
    { id: 6, name: 'Sales Representative' },
    { id: 7, name: 'Customer Service Representative' },
    { id: 8, name: 'Operations Manager' },
    { id: 9, name: 'Product Manager' },
    { id: 10, name: 'Graphic Designer' },
    { id: 11, name: 'Network Administrator' },
    { id: 12, name: 'Quality Assurance Analyst' },
    { id: 13, name: 'Business Development Manager' },
    { id: 14, name: 'Project Manager' },
    { id: 15, name: 'Accountant' },
    { id: 16, name: 'Executive Assistant' },
    { id: 17, name: 'Research Scientist' },
    { id: 18, name: 'Legal Counsel' },
    { id: 19, name: 'Operations Analyst' },
    { id: 20, name: 'Systems Engineer' },
    // Add more as needed...
  ],
  type: 'jobTitle',
  placeholder: 'Job Title here',
};

const EmploymentType = {
  label: 'Employement Type',
  placeholder: 'Full time / Part time',
  items: [
    { id: 1, name: 'Full Time' },
    { id: 2, name: 'Part Time' },
  ],
  type: 'employmentType',
};

const Mode = {
  label: 'Mode of Job',
  placeholder: 'Remote / Hybrid / Onsite',
  items: [
    { id: 1, name: 'Remote' },
    { id: 2, name: 'Hybrid' },
    { id: 3, name: 'Onsite' },
  ],
  type: 'modeOfJob',
};
const startingYear = {
  label: 'Start Date',
  placeholder: 'Year here',
  type: 'startingYear',
};

const endingYear = {
  label: 'End Date',
  placeholder: 'Date here / Present',
  type: 'endingYear',
};

const WorkBadgePopup = ({ isPopup, setIsPopup, type, title, logo, placeholder, handleUserInfo, fetchUser }) => {
  const [companies, setCompanies] = useState([]);
  const [field1Data, setField1Data] = useState([]);
  const [field2Data, setField2Data] = useState([]);
  const [field3Data, setField3Data] = useState([]);
  const [field4Data, setField4Data] = useState([]);
  const [field5Data, setField5Data] = useState();
  const [field6Data, setField6Data] = useState();
  const [isPresent, setIsPresent] = useState(false);
  const [prevInfo, setPrevInfo] = useState({});
  const [deleteItem, setDeleteItem] = useState('');
  const [loading, setLoading] = useState(false);

  const [existingData, setExistingData] = useState();
  const [query, setQuery] = useState('');

  const searchCompanies = async () => {
    const companies = await api.post(`search/searchCompanies/?name=${query}`);
    setCompanies(companies.data);
  };
  useEffect(() => {
    searchCompanies();
  }, [query]);

  useEffect(() => {
    const param = fetchUser?.badges?.find((badge) => badge.personal && badge.personal.hasOwnProperty(type));
    setExistingData(param?.personal[type]);
  }, [fetchUser.badges]);

  const handleClose = () => setIsPopup(false);
  const handlefield5Change = (e) => setField5Data(e.target.value);
  const handlefield6Change = (e) => {
    setField6Data(e.target.value);
  };
  const handlePresentToggle = () => {
    setIsPresent(!isPresent);
    if (!isPresent) {
      setField6Data('Present');
    } else {
      setField6Data('');
    }
  };

  const handleAddPersonalBadge = async (data) => {
    try {
      if (
        field1Data.name === undefined ||
        field2Data.name === undefined ||
        field3Data.name === undefined ||
        field4Data.name === undefined ||
        field5Data === undefined ||
        field6Data === undefined ||
        field6Data === ''
      ) {
        toast.error('You cannot leave the field blank');
        setLoading(false);
        return;
      }

      if (field6Data < field5Data) {
        toast.warning('Please ensure the ending date is not earlier than the starting date.');
        setLoading(false);

        return;
      }
      if (field6Data < field5Data) {
        toast.warning('Please ensure the ending date is not same as the starting date.');
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

  const handleUpdateBadge = async (newData) => {
    try {
      if (
        prevInfo.companyName === field1Data.name &&
        prevInfo.jobTitle === field2Data.name &&
        prevInfo.employmentType === field3Data.name &&
        prevInfo.modeOfJob === field4Data.name &&
        prevInfo.startingYear === field5Data &&
        prevInfo.endingYear === field6Data
      ) {
        toast.error('Information already saved');
        setLoading(false);

        return;
      }
      if (field6Data < field5Data) {
        toast.warning('Please ensure the ending date is not earlier than the starting date.');
        setLoading(false);

        return;
      }
      if (field6Data < field5Data) {
        toast.warning('Please ensure the ending date is not same as the starting date.');
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

        handleClose();
        setLoading(false);
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

      setField1Data({ id: data.id, name: data.companyName, country: data.country });
      setField2Data({ name: data.jobTitle });
      setField3Data({ name: data.employmentType });
      setField4Data({ name: data.modeOfJob });
      setField5Data(data.startingYear);
      if (data.endingYear === 'Present') {
        setIsPresent(true);
        setField6Data(data.endingYear);
      } else {
        setField6Data(data.endingYear);
      }
    }
  };

  const renderWorkField = (field1, field2, field3, field4, field5, field6) => {
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
                <div className="flex w-full justify-between  rounded-[8.62px] border border-[#DEE6F7] bg-[#FBFBFB] px-[9px] py-3 text-[9.28px] font-medium leading-[11.23px] text-[#B6B4B4] focus:outline-none tablet:rounded-[21.06px] tablet:border-[3px] tablet:px-7 tablet:py-[25px] tablet:text-[18px] tablet:leading-[21px]">
                  <div>
                    <h4 className="max-w-[324px] text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:text-[22px] tablet:leading-[26.63px]">
                      {item.companyName}
                    </h4>
                    <div className="max-w-[270px]">
                      <h5 className="text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:text-[20px] tablet:leading-[26.63px]">
                        {item.jobTitle}
                      </h5>
                      <h6 className="text-[8.28px] font-medium leading-[10.93px] text-[#B6B4B4] tablet:text-[18px] tablet:leading-[26.63px]">
                        {item.modeOfJob}
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
                      {item.startingYear + '-' + item.endingYear}
                    </h4>
                  </div>
                </div>
              ),
            )}
            <div className="mt-4 flex justify-between">
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
                items={companies}
                placeholder={field1.placeholder}
                selected={field1Data}
                setSelected={setField1Data}
                query={query}
                setQuery={setQuery}
              />
            </div>
            <div className="mb-[5px] mt-[15px] tablet:mb-[15px]">
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
            <div className="flex items-center gap-[17.5px] tablet:gap-9">
              <div className="mb-[5px] w-full tablet:mb-[25px]">
                <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:mb-[14px] tablet:text-[20px] tablet:leading-[24.2px]">
                  {field3.label}
                </p>
                <div className="z-20 flex flex-col gap-[10px] tablet:gap-[15px]">
                  <ListBox
                    items={field3.items}
                    selected={field3Data}
                    setSelected={setField3Data}
                    placeholder={field3.placeholder}
                  />
                </div>
              </div>
              <div className="mb-[5px] w-full tablet:mb-[25px]">
                <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:mb-[14px] tablet:text-[20px] tablet:leading-[24.2px]">
                  {field4.label}
                </p>
                <div className="z-20 flex flex-col gap-[10px] tablet:gap-[15px]">
                  <ListBox
                    items={field4.items}
                    selected={field4Data}
                    setSelected={setField4Data}
                    placeholder={field4.placeholder}
                  />
                </div>
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
              I am currently working in this role
            </label>

            <div className="mt-[15px] flex gap-[17.5px] tablet:mb-5 tablet:mt-[25px] tablet:gap-[37px]">
              <div className="w-full">
                <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:mb-[14px] tablet:text-[20px] tablet:leading-[24.2px]">
                  {field5.label}
                </p>
                <input
                  type="date"
                  value={field5Data}
                  onChange={handlefield5Change}
                  placeholder={field5.placeholder}
                  className={`w-full rounded-[8.62px] border border-[#DEE6F7] bg-[#FBFBFB] px-[12px] py-2 text-[9.28px] font-medium leading-[11.23px] text-[#B6B4B4] focus:outline-none tablet:rounded-[10px] tablet:border-[3px] tablet:px-[28px] tablet:py-3 tablet:text-[18px] tablet:leading-[21px]`}
                />
              </div>
              {isPresent ? (
                <div className="w-full"></div>
              ) : (
                <div className="w-full">
                  <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:mb-[14px] tablet:text-[20px] tablet:leading-[24.2px]">
                    {field6.label}
                  </p>
                  <input
                    type="date"
                    value={field6Data}
                    onChange={handlefield6Change}
                    disabled={isPresent}
                    placeholder={field6.placeholder}
                    className={`w-full rounded-[8.62px] border border-[#DEE6F7] bg-[#FBFBFB] px-[12px] py-2 text-[9.28px] font-medium leading-[11.23px] text-[#B6B4B4] focus:outline-none tablet:rounded-[10px] tablet:border-[3px] tablet:px-[28px] tablet:py-3 tablet:text-[18px] tablet:leading-[21px]`}
                  />
                </div>
              )}
            </div>

            {/* {isError && <p className="text-red ml-1 text-[6.8px] tablet:text-[14px]">{`Invalid ${title}!`}</p>}{' '} */}
            <div className="mt-[10px] flex justify-between">
              {existingData && existingData.lenght !== 0 ? (
                <Button
                  variant="addOption"
                  onClick={() => {
                    setField1Data([]);
                    setField2Data([]);
                    setField3Data([]);
                    setField4Data([]);
                    setField5Data();
                    setField6Data();
                    setIsPresent(false);

                    setAddAnotherForm(false);
                  }}
                >
                  Cancel
                </Button>
              ) : (
                <div></div>
              )}
              <Button
                disabled={loading}
                variant="submit"
                onClick={() => {
                  const allFieldObject = {
                    ['id']: field1Data.id,
                    [field1.type]: field1Data.name,
                    ['country']: field1Data.country,
                    [field2.type]: field2Data.name,
                    [field3.type]: field3Data.name,
                    [field4.type]: field4Data.name,
                    [field5.type]: field5Data,
                    [field6.type]: field6Data,
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
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo}>
      {title === 'Work' && renderWorkField(CompanyName, jobTitles, EmploymentType, Mode, startingYear, endingYear)}
    </PopUp>
  );
};

export default WorkBadgePopup;
