import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { Button } from '../../../components/ui/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMessage } from '../../../services/api/directMessagingApi';
import MessageCard from './components/MessageCard';
import ViewMessage from './components/ViewMessage';

export default function DMPreview() {
  const currentDate = new Date();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state: any) => state.auth.user);

  const transformedOptions = {
    selected: location.state.params.options?.map((question: string) => ({ question })), // Map each question into an object
    contended: [],
    created: currentDate.toISOString(),
  };

  const filterOutOptions = () => {
    return location.state.questStartData?.QuestAnswers.filter((answer: any) =>
      location.state.params.options.includes(answer.question),
    );
  };

  const { mutateAsync: createNewMessage, isPending } = useMutation({
    mutationFn: createMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast.success('Message sent');

      navigate('/direct-messaging');
    },
    onError: (err: any) => {
      console.log(err);
      toast.error(err?.response.data.message);
    },
  });

  const handleNoOfUsers = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (location.state.params.to === 'Participants') {
      return location.state.participants;
    } else if (location.state.params.to === 'All') {
      return persistedUserInfo?.allCount;
    } else if (location.state.params.to === 'List') {
      return persistedUserInfo?.mailCount;
    } else if (emailRegex.test(location.state.params.to)) {
      return 1;
    } else {
      return 0;
    }
  };

  return (
    <div className="space-y-[9px] tablet:space-y-[15px]">
      <div className="relative h-fit w-full max-w-[730px] space-y-[9px] rounded-[15px] border-2 border-[#D9D9D9] bg-white px-[11px] py-[15px] dark:border-gray-100 dark:bg-gray-200 dark:text-gray-300 tablet:mx-auto tablet:space-y-[15px] tablet:px-5 tablet:py-6">
        <h1 className="text-[0.75rem] font-semibold leading-[15px] text-gray-900 dark:text-white-400 tablet:text-[1.25rem] tablet:leading-[23px]">
          Subject Preview
        </h1>
        <MessageCard
          filter="receive"
          item={{
            postQuestion: location.state.questStartData?.Question,
            whichTypeQuestion: location.state.questStartData?.whichTypeQuestion,
            opinion: location.state.params.options,
            _id: persistedUserInfo.uuid,
            sender: persistedUserInfo.uuid,
            receiver: '1',
            subject: location.state.params.subject,
            shortMessage: location.state.params.subject,
            viewed: false,
            senderMessageId: persistedUserInfo.uuid,
            isDeleted: false,
            readReward: location.state.params.readReward,
            __v: 0,
            createdAt: currentDate.toISOString(),
            updatedAt: currentDate.toISOString(),
          }}
          key={1}
          setViewMsg={null}
          handleViewMessage={null}
        />
        <h1 className="text-[0.75rem] font-semibold leading-[15px] text-gray-900 dark:text-white-400 tablet:text-[1.25rem] tablet:leading-[23px]">
          Message Preview
        </h1>
        <ViewMessage
          viewMessageData={{
            _id: '1',
            sender: persistedUserInfo.uuid,
            receiver: '1',
            subject: location.state.params.subject,
            shortMessage: location.state.params.subject,
            viewed: false,
            senderMessageId: persistedUserInfo.uuid,
            isDeleted: false,
            readReward: location.state.params.readReward,
            postQuestion: location.state.questStartData?.Question,
            whichTypeQuestion: location.state.questStartData?.whichTypeQuestion,
            opinion: transformedOptions,
            __v: 0,
            createdAt: currentDate.toISOString(),
            updatedAt: currentDate.toISOString(),
          }}
          filter="receive"
          questStartData={{ ...location.state.questStartData, questAnswers: filterOutOptions() }}
          page="preview"
        />
      </div>
      <div className="flex h-fit w-full max-w-[730px] justify-end gap-4 tablet:mx-auto">
        <Button
          variant="cancel"
          onClick={() => {
            navigate('/direct-messaging');
          }}
        >
          Continue editing
        </Button>
        <Button
          variant={'submit'}
          onClick={() => {
            createNewMessage(location.state.params);
          }}
        >
          {isPending === true ? (
            <FaSpinner className="animate-spin text-[#EAEAEA]" />
          ) : (
            <>
              Send
              <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[10px] tablet:text-[13px]">
                {location.state.params.to === 'List'
                  ? `+0 FDX`
                  : `+${handleNoOfUsers() * location.state.params.sendAmount} FDX`}
              </span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
