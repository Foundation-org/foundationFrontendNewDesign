import { toast } from 'sonner';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { Button } from '../../../../components/ui/Button';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getConstantsValues } from '../../../../features/constants/constantsSlice';
import { createDraftMessage, createMessage } from '../../../../services/api/directMessagingApi';

export default function NewMessageForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const persistedConstants = useSelector(getConstantsValues);
  const sendAmount = persistedConstants?.MESSAGE_SENDING_AMOUNT ?? 0;
  const { draft } = location?.state || {};
  const { questStartData } = useOutletContext();
  const [to, setTo] = useState(questStartData ? 'advance-analytics' : draft?.to || '');
  const [sub, setSub] = useState(draft?.subject || '');
  const [msg, setMsg] = useState(draft?.message || '');
  const [readReward, setReadReward] = useState();

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

  const { mutateAsync: createNewMessage, isPending } = useMutation({
    mutationFn: createMessage,
    onSuccess: () => {
      queryClient.invalidateQueries('messages');
      toast.success('Message sent');
      setMsg();
      setTo();
      setSub();
      navigate('/direct-messaging');
    },
    onError: (err) => {
      console.log(err);
      toast.error(err.response.data.message);
    },
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const params = {
      from: persistedUserInfo.email,
      subject: sub,
      message: msg,
      type: location.state?.draft ? 'draft' : 'new',
      draftId: location.state?.draft.id ? location.state?.draft.id : '',
      sendAmount,
      readReward,
      uuid: persistedUserInfo.uuid,
    };

    // Only include 'to' if it's not empty or undefined
    if (formatRecipient(to)) {
      params.to = formatRecipient(to);
    }

    // Add additional fields for 'advance-analytics' page
    if (questStartData?.page === 'advance-analytics') {
      params.questForeignKey = questStartData._id;
      params.to = 'Participants'; // Override 'to' if on 'advance-analytics' page
    }

    createNewMessage(params);
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
    if (to !== '' || sub !== '' || msg !== '') {
      const params = {
        from: persistedUserInfo.email,
        to: to,
        subject: sub,
        message: msg,
        id: location.state?.draft.id,
      };

      createDraft(params);
      setMsg();
      setTo();
      setSub();
    }
  };

  const handleBalance = () => {
    if (to === 'advance-analytics') {
      return ((questStartData?.participantsCount ?? questStartData?.submitCounter) || sendAmount) * sendAmount;
    } else if (formatRecipient(to) === 'All') {
      return persistedUserInfo?.allCount * sendAmount;
    } else if (formatRecipient(to) === 'List') {
      return persistedUserInfo?.mailCount * sendAmount;
    } else {
      return sendAmount;
    }
  };

  const handleNoOfUsers = () => {
    if (to === 'advance-analytics') {
      return ((questStartData?.participantsCount ?? questStartData?.submitCounter) || sendAmount) * sendAmount;
    } else if (formatRecipient(to) === 'All') {
      return persistedUserInfo?.allCount;
    } else if (formatRecipient(to) === 'List') {
      return persistedUserInfo?.mailCount;
    } else {
      return 0;
    }
  };

  return (
    <div className="relative h-fit max-h-[calc(100vh-140px)] w-full max-w-[730px] rounded-[15px] border-2 border-[#D9D9D9] bg-white px-[11px] py-[15px] dark:border-gray-100 dark:bg-gray-200 dark:text-gray-300 tablet:mx-auto tablet:px-5 tablet:py-6">
      <form onSubmit={handleFormSubmit} className="space-y-[9px] tablet:space-y-[15px]">
        <div className="flex rounded-[3.817px] border border-[#DEE6F7] bg-[#FDFDFD] px-3 py-[6px] dark:border-gray-100 dark:bg-accent-100 tablet:rounded-[9.228px] tablet:border-[2.768px] tablet:px-5 tablet:py-3">
          <p className="text-[10px] font-semibold leading-[10px] text-[#707175] dark:text-white tablet:text-[22px] tablet:leading-[22px]">
            To:
          </p>
          <input
            type="text"
            value={
              questStartData?.page === 'advance-analytics'
                ? `${questStartData?.participantsCount ?? questStartData?.submitCounter} Participants`
                : to
            }
            className="w-full bg-transparent pl-2 text-[10px] leading-[10px] focus:outline-none dark:bg-accent-100 dark:text-white-400 tablet:text-[22px] tablet:leading-[22px]"
            onChange={(e) => {
              setTo(e.target.value);
            }}
          />
        </div>
        <div className="flex rounded-[3.817px] border border-[#DEE6F7] bg-[#FDFDFD] px-3 py-[6px] dark:border-gray-100 dark:bg-accent-100 tablet:rounded-[9.228px] tablet:border-[2.768px] tablet:px-5 tablet:py-3">
          <p className="text-[10px] font-semibold leading-[10px] text-[#707175] dark:text-white tablet:text-[22px] tablet:leading-[22px]">
            Subject:
          </p>
          <input
            type="text"
            value={sub}
            className="w-full bg-transparent pl-2 text-[10px] leading-[10px] focus:outline-none dark:bg-accent-100 dark:text-white-400 tablet:text-[22px] tablet:leading-[22px]"
            onChange={(e) => {
              setSub(e.target.value);
            }}
          />
        </div>
        <div className="flex rounded-[3.817px] border border-[#DEE6F7] bg-[#FDFDFD] px-3 py-[6px] dark:border-[2.768px] dark:border-gray-100 dark:bg-accent-100 tablet:rounded-[9.228px] tablet:px-5 tablet:py-3">
          <p className="text-[10px] font-semibold leading-[10px] text-[#707175] dark:text-white tablet:text-[22px] tablet:leading-[22px]">
            Message:
          </p>
          <textarea
            type="text"
            rows="14"
            value={msg}
            className="w-full bg-transparent pl-2 text-[10px] leading-[10px] focus:outline-none dark:bg-accent-100 dark:text-white-400 tablet:text-[22px] tablet:leading-[22px]"
            onChange={(e) => {
              setMsg(e.target.value);
            }}
          />
        </div>
        <div className="flex justify-between rounded-[3.817px] border border-[#DEE6F7] bg-[#FDFDFD] px-3 py-[6px] text-[#707175] dark:border-gray-100 dark:bg-accent-100 dark:text-white-400 tablet:rounded-[9.228px] tablet:border-[2.768px] tablet:px-5 tablet:py-3">
          <p className="whitespace-nowrap text-[10px] font-semibold leading-[10px] tablet:text-[22px] tablet:leading-[22px]">
            You will reach {handleNoOfUsers()} Users
          </p>
          <p className="whitespace-nowrap text-[10px] font-semibold leading-[10px] tablet:text-[22px] tablet:leading-[22px]">
            {handleNoOfUsers()} * {sendAmount} FDX
          </p>
        </div>
        <div
          className={`${formatRecipient(to) === 'All' || to === 'advance-analytics' ? '' : 'opacity-50'} flex items-center rounded-[3.817px] border border-[#DEE6F7] bg-[#FDFDFD] px-3 py-[6px] dark:border-gray-100 dark:bg-accent-100 tablet:rounded-[9.228px] tablet:border-[2.768px] tablet:px-5 tablet:py-3`}
        >
          <p className="whitespace-nowrap text-[10px] font-semibold leading-[10px] text-[#707175] dark:text-white tablet:text-[22px] tablet:leading-[22px]">
            Read Reward:
          </p>
          <input
            type="number"
            value={readReward}
            className="w-full bg-transparent pl-2 text-[10px] leading-[10px] focus:outline-none dark:bg-accent-100 dark:text-white-400 tablet:text-[22px] tablet:leading-[22px]"
            onChange={(e) => {
              setReadReward(e.target.value);
            }}
            disabled={to !== 'advance-analytics' && formatRecipient(to) !== 'All'}
          />
        </div>
        <div className="flex justify-end gap-4 pt-[2px] tablet:pt-[10px]">
          <Button
            variant="cancel"
            onClick={() => {
              handleDraft();
              navigate('/direct-messaging');
            }}
          >
            Go Back
          </Button>
          <Button variant={'submit'}>
            {isPending === true ? (
              <FaSpinner className="animate-spin text-[#EAEAEA]" />
            ) : (
              `Send (+${handleBalance()}FDX)`
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
