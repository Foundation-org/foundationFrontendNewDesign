import { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { createMessage } from '../../../services/api/directMessagingApi';
import { useSelector } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { FaSpinner } from 'react-icons/fa';

export default function NewMessageForm({ to, sub, msg, setTo, setMsg, setSub, setAddNewMsg, isDraft, setIsDraft }) {
  const queryClient = useQueryClient();

  const persistedUserInfo = useSelector((state) => state.auth.user);

  const handleNewMessage = () => {
    const params = {
      from: persistedUserInfo.email,
      to: to,
      subject: sub,
      message: msg,
      type: isDraft ? 'draft' : 'new',
    };
    createNewMessage(params);
  };

  const { mutateAsync: createNewMessage, isPending } = useMutation({
    mutationFn: createMessage,
    onSuccess: () => {
      queryClient.invalidateQueries('messages');
      toast.success('Message sent');
      setMsg();
      setTo();
      setSub();
      setAddNewMsg(false);
      setIsDraft(false);
    },
    onError: (err) => {
      console.log(err);
      toast.error(err.response.data.message.split(':')[1]);
    },
  });
  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    handleNewMessage();
  };

  return (
    <div className="relative mx-[13px] mt-5 h-fit max-h-[calc(100vh-140px)] w-full rounded-[15px] border-2 border-[#D9D9D9] bg-white px-[11px] pb-[15px] pt-[37px] tablet:mx-0 tablet:px-5 tablet:pb-6 tablet:pt-[50px]">
      <img
        src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/directMessaging/darkCross.svg`}
        alt="msgNotViewed"
        className="absolute right-[15px] top-[14px] h-[15.5px] w-[12.44px] cursor-pointer tablet:size-[22.026px]"
        onClick={() => setAddNewMsg(false)}
      />
      <form onSubmit={handleFormSubmit} className="space-y-[9px] tablet:space-y-[15px]">
        <div className="flex rounded-[3.817px] border-[2.768px] border-[#DEE6F7] bg-[#FDFDFD] px-3 py-[6px] tablet:rounded-[9.228px] tablet:px-5 tablet:py-3">
          <p className="text-[10px] font-semibold leading-[10px] text-[#707175] tablet:text-[22px] tablet:leading-[22px]">
            To:
          </p>
          <input
            type="text"
            value={to}
            className="w-full bg-transparent pl-2 text-[10px] leading-[10px] focus:outline-none tablet:text-[22px] tablet:leading-[22px]"
            onChange={(e) => {
              setTo(e.target.value);
            }}
          />
        </div>
        <div className="flex rounded-[3.817px] border-[2.768px] border-[#DEE6F7] bg-[#FDFDFD] px-3 py-[6px] tablet:rounded-[9.228px] tablet:px-5 tablet:py-3">
          <p className="text-[10px] font-semibold leading-[10px] text-[#707175] tablet:text-[22px] tablet:leading-[22px]">
            Subject:
          </p>
          <input
            type="text"
            value={sub}
            className="w-full bg-transparent pl-2 text-[10px] leading-[10px] focus:outline-none tablet:text-[22px] tablet:leading-[22px]"
            onChange={(e) => {
              setSub(e.target.value);
            }}
          />
        </div>
        <div className="flex rounded-[3.817px] border-[2.768px] border-[#DEE6F7] bg-[#FDFDFD] px-3 py-[6px] tablet:rounded-[9.228px] tablet:px-5 tablet:py-3">
          <p className="text-[10px] font-semibold leading-[10px] text-[#707175] tablet:text-[22px] tablet:leading-[22px]">
            Message:
          </p>
          <textarea
            type="text"
            rows="14"
            value={msg}
            className="w-full bg-transparent pl-2 text-[10px] leading-[10px] focus:outline-none tablet:text-[22px] tablet:leading-[22px]"
            onChange={(e) => {
              setMsg(e.target.value);
            }}
          />
        </div>
        <div className="flex justify-end pt-[2px] tablet:pt-[10px]">
          <Button variant={'submit'}>
            {' '}
            {isPending === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Send (+ 0.002FDX)'}
          </Button>
        </div>
      </form>
    </div>
  );
}
