import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { Button } from '../../../../components/ui/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate, useOutletContext, useSearchParams } from 'react-router-dom';
import { getConstantsValues } from '../../../../features/constants/constantsSlice';
import { createDraftMessage, fetchOptionParticipants } from '../../../../services/api/directMessagingApi';
import SelectionOption from '../../../../components/SelectionOption';
import FilterAnalyzedOptions from '../../advance-analytics/components/FilterAnalyzedOptions';

export default function NewMessageForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const persistedConstants = useSelector(getConstantsValues);
  const sendAmount = persistedConstants?.MESSAGE_SENDING_AMOUNT ?? 0;
  const defaultReadReward = persistedConstants?.MINIMUM_READ_REWARD;
  const { draft, questStartData, selectedOptions, params } = location?.state || {};
  // const { questStartData, selectedOptions, params } = useOutletContext();

  const [optionsArr, setOptionsArr] = useState(selectedOptions);
  const [to, setTo] = useState(questStartData ? 'advance-analytics' : draft?.to || '');
  const [sub, setSub] = useState(draft?.subject || params?.message || '');
  const [msg, setMsg] = useState(draft?.message || params?.subject || '');
  const [readReward, setReadReward] = useState(params?.readReward || defaultReadReward);
  const [participants, setParticipants] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [searchParams] = useSearchParams();
  const advanceAnalytics = searchParams.get('advance-analytics');

  const handleHideModal = () => setShowModal(false);

  function formatRecipient(to) {
    const trimmedTo = to?.trim().toLowerCase();

    if (trimmedTo === 'all') {
      return 'All';
    } else if (trimmedTo === 'list') {
      return 'List';
    } else if (trimmedTo) {
      return to;
    } else {
      return undefined;
    }
  }

  const { mutateAsync: fetchParticipants } = useMutation({
    mutationFn: fetchOptionParticipants,
    onSuccess: (resp) => {
      setParticipants(resp?.data.dynamicParticipantsCount);
    },
    onError: (err) => {
      console.log(err);
      toast.error(err.response.data.message);
    },
  });

  const handlePreview = () => {
    if (readReward < defaultReadReward) {
      toast.error(`Read Reward must be at least ${defaultReadReward}`);
      return;
    }

    if (sub === '' || msg === '') {
      toast.error(`Subject and message cannot be empty`);
      return;
    }

    const params = {
      from: persistedUserInfo.email,
      subject: sub,
      message: msg,
      type: location.state?.draft ? 'draft' : 'new',
      draftId: location.state?.draft?.id ? location.state?.draft.id : '',
      sendAmount,
      readReward: readReward,
      uuid: persistedUserInfo.uuid,
    };

    // Only include 'to' if it's not empty or undefined
    if (formatRecipient(to)) {
      params.to = formatRecipient(to);
    }

    // Add additional fields for 'advance-analytics' page
    if (questStartData?.page === 'advance-analytics') {
      const selectedQuestions = selectedOptions.filter((option) => option.selected).map((option) => option.question);

      params.questForeignKey = questStartData._id;
      params.to = 'Participants'; // Override 'to' if on 'advance-analytics' page
      params.options = selectedQuestions;
    }

    navigate('/direct-messaging/preview?advance-analytics=true', { state: { params, questStartData, participants } });
  };

  const { mutateAsync: createDraft } = useMutation({
    mutationFn: createDraftMessage,
    onSuccess: () => {
      queryClient.invalidateQueries('messages');
      toast.success('Message saved to Draft');
      setMsg('');
      setTo('');
      setSub('');
    },
    onError: (err) => {
      console.log(err);
      toast.error(err.response.data.message.split(':')[1]);
    },
  });

  const handleDraft = () => {
    if (sub !== '' || msg !== '') {
      const params = {
        from: persistedUserInfo.email,
        to: to,
        subject: sub,
        message: msg,
        id: location.state?.draft?.id,
      };

      createDraft(params);
      setMsg();
      setTo();
      setSub();
      navigate('/direct-messaging');
    } else {
      toast.warning('Subject and message cannot be empty');
    }
  };

  useEffect(() => {
    const selectedQuestions = selectedOptions?.filter((option) => option.selected).map((option) => option.question);
    const params = {
      questForeignKey: questStartData?._id,
      uuid: persistedUserInfo.uuid,
      options: selectedQuestions,
    };

    fetchParticipants(params);
  }, [optionsArr]);

  const handleNoOfUsers = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (to === 'advance-analytics') {
      return participants;
    } else if (formatRecipient(to) === 'All') {
      return persistedUserInfo?.allCount;
    } else if (formatRecipient(to) === 'List') {
      return persistedUserInfo?.mailCount;
    } else if (emailRegex.test(to)) {
      return 1;
    } else {
      return 0;
    }
  };

  const sortSelectedOptionsBySelectedStatus = () => {
    setOptionsArr((prevSelected) => {
      return [...prevSelected].sort((a, b) => {
        return a.selected === b.selected ? 0 : a.selected ? -1 : 1;
      });
    });
  };

  useEffect(() => {
    if (advanceAnalytics && optionsArr.length > 0) {
      setOptionsArr(selectedOptions);
      sortSelectedOptionsBySelectedStatus();
    }
  }, [selectedOptions]);

  return (
    <div className="space-y-[9px] tablet:space-y-[15px]">
      {showModal && (
        <FilterAnalyzedOptions
          handleClose={handleHideModal}
          modalVisible={showModal}
          title={'Message Participants'}
          image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/analyze-dialogbox.svg`}
          questStartData={questStartData}
          submitBtn="Update"
          optionsArr={optionsArr}
        />
      )}
      {/* Selected Post */}
      {advanceAnalytics && (
        <div className="relative h-fit w-full max-w-[730px] rounded-[15px] border-2 border-[#D9D9D9] bg-white px-[11px] py-[15px] dark:border-gray-100 dark:bg-gray-200 dark:text-gray-300 tablet:mx-auto tablet:px-5 tablet:py-6">
          <div className="flex flex-col items-center justify-center gap-[15px]">
            <ul className="flex h-full max-h-[236px] w-full flex-col gap-[5.7px] overflow-y-scroll tablet:max-h-[472px] tablet:gap-[10px]">
              <h1 className="text-[10px] font-medium leading-[12px] text-gray-150 dark:text-gray-300 tablet:text-[20px] tablet:leading-[24.2px]">
                {questStartData.Question}
              </h1>
              {optionsArr?.map((post) => (
                <SelectionOption
                  key={post.id}
                  data={post}
                  page="filterAnalyzedOptions"
                  questStartData={questStartData}
                />
              ))}
            </ul>
          </div>
        </div>
      )}
      {/* You are sending 4 participants */}
      <div className="relative h-fit w-full max-w-[730px] rounded-[15px] border-2 border-[#D9D9D9] bg-white px-[11px] py-[15px] dark:border-gray-100 dark:bg-gray-200 dark:text-gray-300 tablet:mx-auto tablet:px-5 tablet:py-6">
        <div className="flex items-center justify-between">
          <p className="summary-text text-center">
            You are sending a message to {advanceAnalytics ? <b>{participants}</b> : <b>{handleNoOfUsers()}</b>} total
            participants
          </p>
          {advanceAnalytics && (
            <p
              className="summary-text cursor-pointer text-blue-100 underline"
              onClick={() => {
                setShowModal(true);
              }}
            >
              Edit
            </p>
          )}
        </div>
      </div>
      {/* Message Card */}
      <div className="relative h-fit w-full max-w-[730px] space-y-[9px] rounded-[15px] border-2 border-[#D9D9D9] bg-white px-[11px] py-[15px] dark:border-gray-100 dark:bg-gray-200 dark:text-gray-300 tablet:mx-auto tablet:mb-8 tablet:space-y-[15px] tablet:px-5 tablet:py-6">
        {questStartData?.page !== 'advance-analytics' && (
          <div className="flex rounded-[3.817px] border border-[#DEE6F7] bg-[#FDFDFD] px-3 py-[6px] dark:border-gray-100 dark:bg-accent-100 tablet:rounded-[9.228px] tablet:border-[2.768px] tablet:px-5 tablet:py-3">
            <p className="text-[10px] font-semibold leading-[10px] text-[#707175] dark:text-white tablet:text-[22px] tablet:leading-[22px]">
              To:
            </p>
            <input
              type="text"
              value={questStartData?.page === 'advance-analytics' ? `${participants} Participants` : to}
              className="w-full bg-transparent pl-2 text-[10px] leading-[10px] focus:outline-none dark:bg-accent-100 dark:text-white-400 tablet:text-[22px] tablet:leading-[22px]"
              onChange={(e) => {
                setTo(e.target.value);
              }}
            />
          </div>
        )}
        {/* Subject */}
        <div className="flex rounded-[3.817px] border border-[#DEE6F7] bg-[#FDFDFD] px-3 py-[6px] dark:border-gray-100 dark:bg-accent-100 tablet:rounded-[9.228px] tablet:border-[2.768px] tablet:px-5 tablet:py-3">
          <p className="text-[10px] font-semibold leading-[10px] text-[#707175] dark:text-white tablet:text-[22px] tablet:leading-[22px]">
            Subject:
          </p>
          <input
            type="text"
            value={sub}
            className="w-full bg-transparent px-2 text-[10px] leading-[10px] focus:outline-none dark:bg-accent-100 dark:text-white-400 tablet:text-[22px] tablet:leading-[22px]"
            onChange={(e) => {
              const inputValue = e.target.value;
              if (inputValue.length <= 200) {
                setSub(inputValue);
              }
            }}
          />
          {sub?.length}/200
        </div>
        {/* Message */}
        <div className="flex rounded-[3.817px] border border-[#DEE6F7] bg-[#FDFDFD] px-3 py-[6px] dark:border-[2.768px] dark:border-gray-100 dark:bg-accent-100 tablet:rounded-[9.228px] tablet:px-5 tablet:py-3">
          <p className="text-[10px] font-semibold leading-[10px] text-[#707175] dark:text-white tablet:text-[22px] tablet:leading-[22px]">
            Message:
          </p>
          <textarea
            type="text"
            rows="14"
            value={msg}
            className="w-full bg-transparent px-2 text-[10px] leading-[10px] focus:outline-none dark:bg-accent-100 dark:text-white-400 tablet:text-[22px] tablet:leading-[22px]"
            onChange={(e) => {
              const inputValue = e.target.value;
              if (inputValue.length <= 500) {
                setMsg(inputValue);
              }
            }}
          />
          <div className="flex items-end">{msg?.length}/500</div>
        </div>
        {/* Read Reward */}
        <div
          className={`${formatRecipient(to) === 'All' || to === 'advance-analytics' ? '' : 'opacity-50'} flex items-center rounded-[3.817px] border border-[#DEE6F7] bg-[#FDFDFD] px-3 py-[6px] dark:border-gray-100 dark:bg-accent-100 tablet:rounded-[9.228px] tablet:border-[2.768px] tablet:px-5 tablet:py-3`}
        >
          <p className="w-fit whitespace-nowrap text-[10px] font-semibold leading-[10px] text-[#707175] dark:text-white tablet:text-[22px] tablet:leading-[22px]">
            Read Reward:
          </p>
          <input
            type="number"
            value={readReward}
            placeholder={defaultReadReward}
            className="w-fit bg-transparent pl-2 text-[10px] leading-[10px] focus:outline-none dark:bg-accent-100 dark:text-white-400 tablet:text-[22px] tablet:leading-[22px]"
            onChange={(e) => {
              setReadReward(e.target.value);
            }}
            disabled={to !== 'advance-analytics' && formatRecipient(to) !== 'All'}
          />
        </div>
        <h1 className="px-2 py-[5.7px] text-[8.52px] font-normal italic leading-none text-[#435059] dark:text-[#D3D3D3] tablet:px-[18px] tablet:py-3 tablet:text-[19px]">
          Enter the amount of FDX a participant will earn from reading your message. FDX will only be deducted from your
          balance if a message is read
        </h1>
      </div>
      {/* Total FDX to send message*/}
      <div className="relative h-fit w-full max-w-[730px] rounded-[15px] border-2 border-[#D9D9D9] bg-white px-[11px] py-[15px] dark:border-gray-100 dark:bg-gray-200 dark:text-gray-300 tablet:mx-auto tablet:px-5 tablet:py-6">
        <div className="flex justify-between rounded-[3.817px] border border-[#DEE6F7] bg-[#FDFDFD] px-3 py-[6px] text-[#707175] dark:border-gray-100 dark:bg-accent-100 dark:text-white-400 tablet:rounded-[9.228px] tablet:border-[2.768px] tablet:px-5 tablet:py-3">
          <p className="whitespace-nowrap text-[10px] font-semibold leading-[10px] tablet:text-[22px] tablet:leading-[22px]">
            Total FDX to send message
          </p>
          <p className="whitespace-nowrap text-[10px] font-semibold leading-[10px] tablet:text-[22px] tablet:leading-[22px]">
            {`${handleNoOfUsers()} participants = ${formatRecipient(to) === 'List' ? `0 FDX` : `${handleNoOfUsers() * sendAmount} FDX`}`}
          </p>
        </div>
      </div>
      {/* Last Section Buttons */}
      <div className="flex h-fit w-full max-w-[730px] justify-between gap-4 tablet:mx-auto">
        <Button
          variant="cancel"
          onClick={() => {
            navigate('/direct-messaging');
          }}
        >
          Cancel
        </Button>
        <div className="flex gap-4">
          <Button
            variant="hollow-submit"
            onClick={() => {
              handleDraft();
            }}
          >
            Save as draft
          </Button>
          <Button variant={'submit'} onClick={handlePreview}>
            Preview
          </Button>
        </div>
      </div>
    </div>
  );
}
