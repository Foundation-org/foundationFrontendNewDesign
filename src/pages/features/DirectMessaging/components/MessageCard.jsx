import { Button } from '../../../../components/ui/Button';
import api from '../../../../services/api/Axios';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { calculateTimeAgo } from '../../../../utils/utils';
import { useNavigate } from 'react-router-dom';

export default function MessageCard({ setViewMsg, item, filter, handleViewMessage }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [resloading, setResLoading] = useState(false);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const persistedTheme = useSelector((state) => state.utils.theme);
  const timeAgo = useMemo(() => calculateTimeAgo(item.createdAt), [item.createdAt]);

  const handleDelete = (id, type) => {
    api
      .delete(`/directMessage/delete`, {
        data: {
          _id: id,
          messageType: type,
        },
      })
      .then(() => {
        queryClient.invalidateQueries('messages');
        toast.success('Message deleted permanently');
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error deleting message:', error);
        setLoading(false);
      });
  };

  const handleTrash = (id, type) => {
    api
      .post(`/directMessage/trash`, {
        _id: id,
        messageType: type,
      })
      .then(() => {
        queryClient.invalidateQueries('messages');
        toast.success('Message deleted successfully');
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error deleting message:', error);
        setLoading(false);
      });
  };

  const handleRestore = (id, type) => {
    api
      .post(`/directMessage/restore`, {
        _id: id,
        messageType: type,
      })
      .then(() => {
        queryClient.invalidateQueries('messages');
        toast.success('Message restored successfully');
        setResLoading(false);
      })
      .catch((error) => {
        console.error('Error deleting message:', error);
        setResLoading(false);
      });
  };

  const handleCancelAllSendMessages = (uuid, id) => {
    api
      .get(`/directMessage/cancleMessage/${uuid}/${id}`)
      .then(() => {
        queryClient.invalidateQueries('messages');
        toast.success('All messages cancelled successfully');
        setResLoading(false);
      })
      .catch((error) => {
        console.error('Error deleting message:', error);
        setResLoading(false);
      });
  };

  return (
    <div className="rounded-[15px] bg-white dark:bg-gray-200">
      {/* header */}
      <div className="flex items-center justify-between rounded-t-[15px] bg-[#FFFCB8] px-4 py-[6px] dark:bg-accent-100 tablet:px-7 tablet:py-3">
        <div className="flex items-center gap-1">
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/F.svg`}
            alt="logo"
            className="size-[12.325px] tablet:size-5"
          />
          <h1 className="max-w-44 truncate text-[12.325px] font-semibold leading-[12.325px] text-[#7C7C7C] dark:text-white tablet:max-w-72 tablet:text-[20px] tablet:leading-[20px]">
            {filter === 'sent' ? item.to : 'Foundation-IO.com'}
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/clock.svg' : 'assets/svgs/dashboard/clock-outline.svg'}`}
            alt="clock"
            className="h-[8.64px] w-[8.64px] tablet:h-[20.5px] tablet:w-[20.4px]"
          />
          <h2 className="whitespace-nowrap text-[13.071px] font-normal leading-[21.211px] text-[#9C9C9C] dark:text-white tablet:text-[21.211px] tablet:leading-[13.071px]">
            {timeAgo}
          </h2>
        </div>
      </div>
      {/* body */}
      <div className="rounded-b-[15px] border-x-[1.232px] border-y-[1.232px] border-[#D9D9D9] px-4 py-2 text-[#707175] dark:border-gray-100 dark:bg-gray-200 dark:text-gray-300 tablet:border-x-2 tablet:border-y-2 tablet:px-7 tablet:py-3">
        <h1 className="mb-[8.4px] text-[12.145px] font-semibold leading-[12.145px] tablet:mb-[11px] tablet:text-[22px] tablet:leading-[22px]">
          {item.subject}
        </h1>
        <h2 className="mb-2 truncate text-[8.097px] font-medium leading-[8.097px] tablet:mb-7 tablet:text-[20px] tablet:leading-normal">
          {filter === 'sent' ? item.message : item.shortMessage}
        </h2>
        <div className="flex justify-end gap-2">
          {item?.type === 'sent' && item?.to === 'Participants' && (
            <Button
              variant={'danger'}
              onClick={() => {
                handleCancelAllSendMessages(persistedUserInfo.uuid, item._id);
              }}
              disabled={loading}
            >
              {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Cancel All'}
            </Button>
          )}
          {filter !== 'sent' && filter !== 'draft' && (
            <Button
              variant={'danger'}
              onClick={() => {
                setLoading(true);
                filter === 'deleted' ? handleDelete(item._id, filter) : handleTrash(item._id, filter);
              }}
            >
              {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Delete'}
            </Button>
          )}
          {filter === 'deleted' ? (
            <Button
              variant={'submit'}
              onClick={() => {
                setResLoading(true);
                handleRestore(item._id, filter);
              }}
            >
              {resloading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Restore'}
            </Button>
          ) : filter === 'draft' ? (
            <Button
              variant={'submit'}
              onClick={() => {
                navigate('/direct-messaging/new-message', {
                  state: { draft: { id: item._id, to: item.to, subject: item.subject, message: item.message } },
                });
              }}
            >
              {resloading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Open'}
            </Button>
          ) : (
            <Button
              variant={'submit'}
              onClick={() => {
                setViewMsg(true);
                handleViewMessage(item._id, item.sender, item.receiver, filter === 'sent' ? item : false);
              }}
            >
              {item?.viewed ? 'Read Again' : 'Read'}{' '}
              <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[10px] tablet:text-[13px]">
                {(item?.to === 'Participants' || item.to === 'All') && !item?.viewed && `(+${item?.readReward} FDX)`}
              </span>
            </Button>
          )}
        </div>
        {filter === 'sent' && (
          <div className="mt-4 flex items-center justify-between gap-[15px]">
            <div className="flex items-center gap-1">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/directMessaging/msgSends.svg`}
                alt="msgSends"
                className="h-[15.5px] w-[12.44px] tablet:size-[26.8px]"
              />
              <p className="text-[8.097px] font-normal leading-[8.097px] text-[#707175] tablet:text-[14.2px] tablet:leading-[14.2px]">
                {item.send ? '1 Messages Sent' : '0 Messages Sent'}
              </p>
            </div>
            {/* <div className="flex items-center gap-1">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/directMessaging/msgFails.svg`}
                alt="msgFails"
                className="h-[15.5px] w-[12.44px] tablet:size-[26.8px]"
              />
              <p className="text-[8.097px] font-normal leading-[8.097px] text-[#707175] tablet:text-[14.2px] tablet:leading-[14.2px]">
                {item.fail ? '1 Fail' : '0 Fail'}
              </p>
            </div> */}
            <div className="flex items-center gap-1">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/directMessaging/msgNotViewed.svg`}
                alt="msgFails"
                className="h-[15.5px] w-[12.44px] tablet:size-[26.8px]"
              />
              <p className="text-[8.097px] font-normal leading-[8.097px] text-[#707175] tablet:text-[14.2px] tablet:leading-[14.2px]">
                {item?.deleteCount ? `${item?.deleteCount} Deleted` : '0 Deleted'}
              </p>
            </div>
            {/* <div className="flex items-center gap-1">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/directMessaging/msgNotViewed.svg`}
                alt="msgNotViewed"
                className="h-[15.5px] w-[12.44px] tablet:size-[26.8px]"
              />
              <p className="text-[8.097px] font-normal leading-[8.097px] text-[#707175] tablet:text-[14.2px] tablet:leading-[14.2px]">
                {`${item.unView} Not Viewed`}
              </p>
            </div> */}
            <div className="flex items-center gap-1">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/directMessaging/msgViewd.svg`}
                alt="msgViewd"
                className="h-[15.5px] w-[12.44px] tablet:size-[26.8px]"
              />
              <p className="text-[8.097px] font-normal leading-[8.097px] text-[#707175] tablet:text-[14.2px] tablet:leading-[14.2px]">
                {`${item.view} Viewed`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
