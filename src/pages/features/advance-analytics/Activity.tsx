import { useState, useReducer } from 'react';
import { useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { Button } from '../../../components/ui/Button';
import { ActivityType, HideOptionProps } from '../../../types/advanceAnalytics';
import { useAnalyzeActivityMutation } from '../../../services/mutations/advance-analytics';
import { activityList } from '../../../constants/advanceAnalytics';
import ActivitySex from './activity-components/activity-sex';
import ActivityRelationShip from './activity-components/activity-relationship';
import ActivityWork from './activity-components/activity-work';
import ActivityEducation from './activity-components/activity-education';
import ActivityFollowers from './activity-components/activity-followers';
import ActivityDob from './activity-components/activity-dob';
import ActivityCurrentCity from './activity-components/activity-currentCity';

const initialState = {
  twitter: { subtype: 'twitter', followers: 0, name: '', operand: 1 },
  dob: { subtype: 'dateOfBirth', from: '', to: '' },
  currentCity: { subtype: 'currentCity', currentCity: '' },
  homeTown: { subtype: 'homeTown', homeTown: '' },
  sex: { subtype: 'sex', sex: '' },
  relationship: { subtype: 'relationship', relationshipStatus: '' },
  work: { subtype: 'work', fieldName: '', fieldValue: '' },
  education: { subtype: 'education', fieldName: '', fieldValue: '' },
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case 'SET_TWITTER_NAME':
      return { ...state, twitter: { ...state.twitter, name: action.payload } };
    case 'SET_TWITTER_FOLLOWERS':
      return { ...state, twitter: { ...state.twitter, followers: action.payload } };
    case 'SET_TWITTER_OPERAND':
      return { ...state, twitter: { ...state.twitter, operand: action.payload } };
    case 'SET_SEX':
      return { ...state, sex: { ...state.sex, sex: action.payload } };
    case 'SET_DOB_FROM':
      return { ...state, dob: { ...state.dob, from: action.payload } };
    case 'SET_DOB_TO':
      return { ...state, dob: { ...state.dob, to: action.payload } };
    case 'SET_CURRENT_CITY':
      return { ...state, currentCity: { ...state.currentCity, currentCity: action.payload?.name } };
    case 'SET_HOME_TOWN':
      return { ...state, homeTown: { ...state.homeTown, homeTown: action.payload?.name } };
    case 'SET_RELATIONSHIP_STATUS':
      return { ...state, relationship: { ...state.relationship, relationshipStatus: action.payload } };
    case 'SET_WORK_FIELD_NAME':
      return { ...state, work: { ...state.work, fieldName: action.payload } };
    case 'SET_WORK_FIELD_VALUE':
      return { ...state, work: { ...state.work, fieldValue: action.payload?.name } };
    case 'SET_EDUCATION_FIELD_NAME':
      return { ...state, education: { ...state.education, fieldName: action.payload } };
    case 'SET_EDUCATION_FIELD_VALUE':
      return { ...state, education: { ...state.education, fieldValue: action.payload?.name } };
    default:
      return state;
  }
}

export default function Activity({ handleClose, questStartData, update, selectedItem }: HideOptionProps) {
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState('');
  const [state, dispatch] = useReducer(reducer, initialState);

  const { mutateAsync: handleAnalyzePost, isPending } = useAnalyzeActivityMutation({ handleClose });

  const toggleDropdown = () => setIsOpen(!isOpen);

  const showSelectedBadge = (data: string) => {
    switch (data) {
      case 'Twitter':
        return <ActivityFollowers state={state} dispatch={dispatch} />;
      case 'Date of Birth':
        return <ActivityDob dispatch={dispatch} />;
      case 'Current City':
        return <ActivityCurrentCity dispatch={dispatch} type={'current-city'} />;
      case 'Home Town':
        return <ActivityCurrentCity dispatch={dispatch} type={'hometown'} />;
      case 'Sex':
        return <ActivitySex state={state} dispatch={dispatch} parentDropdown={isOpen} />;
      case 'Relationship':
        return <ActivityRelationShip state={state} dispatch={dispatch} parentDropdown={isOpen} />;
      case 'Work':
        return <ActivityWork dispatch={dispatch} parentDropdown={isOpen} />;
      case 'Education':
        return <ActivityEducation dispatch={dispatch} parentDropdown={isOpen} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col">
      <h1 className="my-2 text-center text-[10px] font-normal leading-[12px] text-accent-400 dark:text-gray-300 tablet:my-4 tablet:text-[16px] tablet:leading-[16px]">
        You can Hide an option
      </h1>
      <div className="relative inline-block w-full space-y-3">
        <button
          onClick={toggleDropdown}
          className="flex w-full items-center justify-between rounded border border-white-500 px-2 py-1 text-start text-[10px] text-accent-600 focus:outline-none dark:border-gray-100 dark:text-gray-300 tablet:rounded-[10px] tablet:border-[3px] tablet:px-4 tablet:py-2 tablet:text-[20px]"
        >
          {selectedBadge === '' ? 'Select an option' : selectedBadge}
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/arrow-right.svg`}
            alt="arrow-right.svg"
            className={`size-[10px] transition-all duration-500 tablet:size-6 ${isOpen ? '-rotate-90' : 'rotate-90'}`}
          />
        </button>
        {isOpen && (
          <ul className="absolute z-10 mt-2 max-h-32 w-full min-w-[160px] overflow-y-scroll rounded border border-white-500 bg-white text-[10px] dark:border-gray-100 dark:bg-gray-200 tablet:max-h-48 tablet:border-[2px] tablet:text-[20px]">
            {activityList?.map((activity: ActivityType) => (
              <li
                key={activity.id}
                className="block cursor-pointer px-2 py-1 text-accent-600 hover:bg-blue-300 hover:text-white dark:text-gray-300 tablet:px-4 tablet:py-2"
                onClick={() => {
                  setSelectedBadge(activity.name);
                  toggleDropdown();
                }}
              >
                {activity.name}
              </li>
            ))}
          </ul>
        )}
        {showSelectedBadge(selectedBadge)}
      </div>
      <div className="mt-2 flex w-full justify-end tablet:mt-4">
        <Button
          variant="submit"
          className=""
          rounded={false}
          onClick={() => {
            handleAnalyzePost({
              userUuid: persistedUserInfo.uuid,
              questForeignKey: questStartData._id,
              allParams:
                selectedBadge === 'Twitter'
                  ? state.twitter
                  : selectedBadge === 'Date of Birth'
                    ? state.dob
                    : selectedBadge === 'Current City'
                      ? state.currentCity
                      : selectedBadge === 'Home Town'
                        ? state.homeTown
                        : selectedBadge === 'Sex'
                          ? state.sex
                          : selectedBadge === 'Relationship'
                            ? state.relationship
                            : selectedBadge === 'Work'
                              ? state.work
                              : selectedBadge === 'Education'
                                ? state.education
                                : null,
              actionType: 'create',
              id: update ? selectedItem._id : null,
              order: update ? selectedItem?.order : null,
            } as any);
          }}
        >
          {isPending === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Hide'}
        </Button>
      </div>
    </div>
  );
}
