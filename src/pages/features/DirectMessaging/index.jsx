import { useEffect, useState } from 'react';
import Topbar from '../../Dashboard/components/Topbar';
import MessageCard from './components/MessageCard';
import NewMessageForm from './components/NewMessageForm';
import ViewMessage from './components/ViewMessage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createDraftMessage,
  getDeletedMessages,
  getDraftdMessages,
  getRecievedMessages,
  getSentMessages,
  viewMessage,
} from '../../../services/api/directMessagingApi';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';

const dmTabs = [
  {
    id: 1,
    text: 'Received',
    val: 'received',
  },
  {
    id: 2,
    text: 'Sent',
    val: 'sent',
  },
  {
    id: 3,
    text: 'Deleted',
    val: 'deleted',
  },
  {
    id: 4,
    val: 'draft',
    text: 'Draft',
  },
];

export default function DirectMessaging() {
  const [selectedTab, setSelectedTab] = useState('received');
  const [addNewMsg, setAddNewMsg] = useState(false);
  const [viewMsg, setViewMsg] = useState(false);
  const [viewMessageData, setViewMessageData] = useState();
  const [search, setSearch] = useState('');
  const [to, setTo] = useState();
  const [sub, setSub] = useState();
  const [msg, setMsg] = useState();
  const [draftId, setDraftId] = useState('');
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const queryClient = useQueryClient();
  const [isDraft, setIsDraft] = useState(false);

  const { mutateAsync: ViewAMessage } = useMutation({
    mutationFn: viewMessage,
    onSuccess: (resp) => {
      console.log(resp);
      setViewMessageData(resp.data.data);
    },
    onError: (err) => {
      toast.error(err.response.data.message.split(':')[1]);
    },
  });

  const { data: messages } = useQuery({
    queryFn: async () => {
      if (selectedTab === 'sent') {
        return await getSentMessages(persistedUserInfo.uuid);
      } else if (selectedTab === 'received') {
        return await getRecievedMessages(persistedUserInfo.uuid);
      } else if (selectedTab === 'deleted') {
        return await getDeletedMessages(persistedUserInfo.uuid);
      } else if (selectedTab === 'draft') {
        return await getDraftdMessages(persistedUserInfo.uuid);
      }
    },
    queryKey: ['messages', selectedTab],
  });

  const handleViewMessage = (id, sender, receiver, item) => {
    if (item) {
      setAddNewMsg(false);
      setViewMessageData(item);
      return;
    }

    const params = {
      id: id,
      sender: sender,
      receiver: receiver,
    };
    ViewAMessage(params);
  };

  const handleDraft = () => {
    const params = {
      from: persistedUserInfo.email,
      to: to,
      subject: sub,
      message: msg,
      id: draftId,
    };

    createDraft(params);
    setMsg();
    setTo();
    setSub();
  };

  useEffect(() => {
    if ((to !== undefined || sub !== undefined || msg !== undefined) && !addNewMsg) {
      handleDraft();
    }
  }, [addNewMsg]);

  const { mutateAsync: createDraft } = useMutation({
    mutationFn: createDraftMessage,
    onSuccess: () => {
      queryClient.invalidateQueries('messages');
      toast.success('Message saved to Draft');
      setMsg('');
      setTo('');
      setSub('');
      setAddNewMsg(false);
    },
    onError: (err) => {
      console.log(err);
      toast.error(err.response.data.message.split(':')[1]);
    },
  });

  const handleDraftOpen = (id, to, sub, msg) => {
    setDraftId(id);
    setTo(to);
    setSub(sub);
    setMsg(msg);
    setAddNewMsg(true);
    setIsDraft(true);
  };

  return (
    <>
      <Topbar />
      <div className="h-full max-h-[calc(100vh-58px)] min-h-[calc(100vh-58px)] bg-[#F2F3F5] tablet:max-h-[calc(100vh-155.5px)] tablet:min-h-[calc(100vh-70px)]">
        <div className="mx-auto flex w-full max-w-[1378px] gap-6">
          {/* Left Side */}
          <div
            className={`h-full w-full max-w-[582px] rounded-[15px] border-[#BABABA] bg-[#F3F3F3] tablet:mt-5 tablet:h-[calc(100vh-140px)] tablet:border tablet:[box-shadow:0px_0px_8px_0px_rgba(0,_0,_0,_0.20)_inset] ${addNewMsg || viewMsg ? 'hidden tablet:block' : 'block'}`}
          >
            <div className="flex justify-between border-b-4 border-[#D9D9D9] px-1 py-3 tablet:px-5 tablet:py-3">
              <div className="flex gap-[10px]">
                {dmTabs?.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedTab(item.val);
                      setViewMsg(false);
                    }}
                    className={`${selectedTab === item.val ? 'bg-[#4A8DBD] text-white' : 'border-[#ACACAC] bg-white text-[#707175]'} rounded-[7px] border-[1.86px] px-[9px] py-2 text-[10.8px] font-semibold leading-[10.8px] tablet:rounded-[13.579px] tablet:py-3 tablet:text-[18.84px] tablet:leading-[22px]`}
                  >
                    {item.text}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setViewMsg(false);
                  setIsDraft(false);
                  setDraftId('');
                  setAddNewMsg(true);
                }}
                className="rounded-[7px] bg-[#D9D9D9] px-[9px] py-2 text-[10.8px] font-normal leading-[10.8px] text-[#435059] [box-shadow:0px_0px_6.46px_0px_rgba(0,_0,_0,_0.15)_inset] tablet:py-[11px] tablet:text-[18.456px] tablet:leading-[22px]"
              >
                + New Message
              </button>
            </div>
            <div className="px-[13px] py-2 tablet:px-5 tablet:py-7">
              <div className="relative h-[30px] tablet:h-[42px]">
                <input
                  type="text"
                  id="floating_outlined"
                  className="peer block h-full w-full appearance-none rounded-[8px] border-[0.59px] border-[#707175] bg-transparent py-2 pl-5 pr-8 text-sm text-[#707175] focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-[#707175] tablet:rounded-[10px] tablet:border-2 tablet:text-[18.23px]"
                  value={search}
                  placeholder=""
                  onChange={(e) => setSearch(e.target.value)}
                />
                <label
                  htmlFor="floating_outlined"
                  className="te xt-sm absolute left-[15px] start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-[#F3F3F3] px-2 text-[#707175] duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:bg-[#0A0A0C] peer-focus:dark:text-blue-500 tablet:text-[17px] rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
                >
                  Search
                </label>
              </div>
              <div className="mt-[15px] flex h-[calc(100vh-320px)] flex-col gap-[10px] overflow-scroll no-scrollbar">
                {messages?.data?.data.length <= 0 ? (
                  <div className="flex h-[calc(100%-68px)] w-full items-center justify-center">
                    <p className="text-[24px] font-semibold text-[#BBB]">No Message Yet!</p>
                  </div>
                ) : (
                  messages?.data?.data
                    .filter(
                      (data) =>
                        data.subject?.toLowerCase().includes(search?.toLowerCase()) ||
                        data.shortMessage?.toLowerCase().includes(search?.toLowerCase()),
                    )
                    .map((item, index) => (
                      <MessageCard
                        setViewMsg={setViewMsg}
                        item={item}
                        key={index}
                        handleViewMessage={handleViewMessage}
                        filter={selectedTab}
                        handleDraftOpen={handleDraftOpen}
                      />
                    ))
                )}
              </div>
            </div>
          </div>
          {/* Right Side */}
          {addNewMsg && (
            <NewMessageForm
              draftId={draftId}
              to={to}
              sub={sub}
              msg={msg}
              setTo={setTo}
              setSub={setSub}
              setMsg={setMsg}
              setAddNewMsg={setAddNewMsg}
              isDraft={isDraft}
              setIsDraft={setIsDraft}
            />
          )}
          {viewMsg && <ViewMessage setViewMsg={setViewMsg} viewMessageData={viewMessageData} filter={selectedTab} />}
        </div>
      </div>
    </>
  );
}
