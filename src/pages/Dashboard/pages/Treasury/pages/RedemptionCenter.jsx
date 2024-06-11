import { FaPlus, FaMinus } from 'react-icons/fa6';
import { Button } from '../../../../../components/ui/Button';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addRedeemCode,
  createRedeeemCode,
  getHistoryData,
  getUnredeemedData,
} from '../../../../../services/api/redemptionApi';
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';
import DeleteHistoryPopup from '../../../../../components/dialogue-boxes/deleteHistoryPopup';

export default function RedemptionCenter() {
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [fdx, setFdx] = useState(0);
  const [description, setDescription] = useState('');
  const [expiry, setExpiry] = useState('30 days');
  const [code, setCode] = useState('');
  const [isPulse, setIsPulse] = useState(false);
  const [addCodeLoading, setAddCodeLoading] = useState(false);
  const [radeemLoading, setRadeemLoading] = useState('');
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [deleteHistoryCode, setDeleteHistoryCode] = useState(false);

  const handleClose = () => setIsDeleteModal(false);

  const { mutateAsync: createRedemptionCode, isPending: createPending } = useMutation({
    mutationFn: createRedeeemCode,
    onSuccess: (resp) => {
      toast.success('Redemption Code created successfully');
      queryClient.invalidateQueries(['userInfo']);
      queryClient.invalidateQueries('unredeemedData');
      setExpiry('30 days');
      setDescription('');
      setFdx(0);
    },
    onError: (err) => {
      toast.error(err.response.data.message.split(':')[1]);
    },
  });

  useEffect(() => {
    const url = window.location.href;
    // const extractedCode = url.substring(url.lastIndexOf('/') + 1);
    const extractedCode = new URL(url).pathname;
    if (extractedCode !== '/dashboard/treasury/redemption-center') {
      const parts = extractedCode.split('/');
      const extractedText = parts[2];
      setCode(extractedText);
      setTimeout(() => {
        if (extractedText) toast.info('Hit add to redeem');
      }, 500);
    }
  }, []);

  const handleShareLink = async (code) => {
    const url = window.location.href + '/' + code;
    try {
      await navigator.clipboard.writeText(url);
    } catch (err) {
      console.error('Unable to copy text to clipboard:', err);
    }
  };

  const copyToClipboard = async (code) => {
    const textToCopy = code;

    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch (err) {
      console.error('Unable to copy text to clipboard:', err);
    }
  };

  const { mutateAsync: addRedemptionCode } = useMutation({
    mutationFn: addRedeemCode,
    onSuccess: (resp) => {
      queryClient.invalidateQueries(['userInfo']);
      queryClient.invalidateQueries('history');
      toast.success('Code Redeemed Successfully');
      setCode('');
      setIsPulse(true);
      setAddCodeLoading(false);
      setRadeemLoading('');
    },
    onError: (err) => {
      setAddCodeLoading(false);
      setRadeemLoading('');
      toast.error(err.response.data.message.split(':')[1]);
    },
  });

  // const { mutateAsync: redeem } = useMutation({
  //   mutationFn: redeemCode,
  //   onSuccess: (resp) => {
  //     queryClient.invalidateQueries('unredeemedData');
  //     toast.success('Code Redeemed Successfully');
  //     setCode('');
  //   },
  //   onError: (err) => {
  //     toast.error(err.response.data.message.split(':')[1]);
  //   },
  // });

  const { data: unredeemedData } = useQuery({
    queryFn: async () => {
      return await getUnredeemedData(persistedUserInfo._id, persistedUserInfo.uuid);
    },
    queryKey: ['unredeemedData'],
  });

  const { data: history } = useQuery({
    queryFn: async () => {
      return await getHistoryData(persistedUserInfo._id, persistedUserInfo.uuid);
    },
    queryKey: ['history'],
  });

  const handleAdd = () => {
    if (persistedUserInfo?.role === 'guest') {
      toast.warning(
        <p>
          Please{' '}
          <span className="cursor-pointer text-[#389CE3] underline" onClick={() => navigate('/guest-signup')}>
            Create an Account
          </span>{' '}
          to unlock this feature
        </p>,
      );
      return;
    } else {
      if (code === '') return toast.error('Enter some code to Redeeem');
      setAddCodeLoading(true);

      const params = {
        uuid: persistedUserInfo?.uuid,
        code: code,
      };
      addRedemptionCode(params);
    }
  };

  const handleRedeeem = (code) => {
    if (code === '') return toast.error('Enter some code to Redeem');
    setRadeemLoading(code);

    const params = {
      uuid: persistedUserInfo?.uuid,
      code: code,
    };
    addRedemptionCode(params);
  };

  const handleCreate = () => {
    if (persistedUserInfo?.role === 'guest') {
      toast.warning(
        <p>
          Please{' '}
          <span className="cursor-pointer text-[#389CE3] underline" onClick={() => navigate('/guest-signup')}>
            Create an Account
          </span>{' '}
          to unlock this feature
        </p>,
      );
      return;
    } else {
      if (fdx === 0) return toast.error('Please select the amount');
      if (description === '') return toast.error('You cannot leave the description field blank');
      let newExpiryDate;

      if (expiry === '30 days') {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 30);
        newExpiryDate = currentDate.toISOString().split('T')[0];
      } else if (expiry === '7 days') {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 7);
        newExpiryDate = currentDate.toISOString();
      } else {
        newExpiryDate = null;
      }

      const params = {
        creator: persistedUserInfo._id,
        owner: persistedUserInfo._id,
        uuid: persistedUserInfo.uuid,
        amount: fdx,
        description: description,
        to: 'any',
        expiry: newExpiryDate,
      };

      createRedemptionCode(params);
    }
  };

  const calculateExpiry = (expiry) => {
    if (expiry) {
      const targetDate = new Date(expiry);
      const currentDate = new Date();
      // Calculate the difference in milliseconds
      const differenceMs = targetDate - currentDate;
      // Convert milliseconds to days
      const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

      return differenceDays + ' ' + 'days'; // Output the difference in days
    } else {
      return 'Never';
    }
  };

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  }

  useEffect(() => {
    if (isPulse) {
      const timer = setTimeout(() => {
        setIsPulse(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isPulse]);

  return (
    <div className="mx-auto mb-4 flex max-w-[778px] flex-col gap-3 px-4 tablet:mb-8 tablet:gap-6 tablet:px-6">
      <div className="flex flex-col gap-2 tablet:gap-6">
        {/* Create */}
        <div>
          <div className="flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px]">
            <div className="flex items-center gap-2">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/redemption-code-activity.svg`}
                alt={'redemption-code-activity'}
                className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
              />
              <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">
                Create Redemption Code
              </h1>
            </div>
          </div>
          <div className="flex flex-col gap-[5px] rounded-b-[10px] border-[#D9D9D9] bg-[#FDFDFD] px-5 py-[10px] tablet:gap-[15px] tablet:border-[1.85px] tablet:px-12 tablet:py-[18.73px]">
            <input
              type="text"
              value={description}
              onChange={(e) => {
                if (e.target.value.length <= 35) {
                  setDescription(e.target.value);
                }
              }}
              placeholder="Description here....."
              className="w-full max-w-[368px] rounded-[2.76px] border-[1.17px] border-[#DEE6F7] bg-[#F9F9F9] p-1 text-[10px] font-medium leading-normal text-[#707175] focus:outline-none tablet:rounded-[7.07px] tablet:border-[3px] tablet:px-4 tablet:py-3 tablet:text-[16px]"
            />
            <p className="text-[7.5px] font-normal leading-normal text-[#85898C] tablet:text-[14.7px]">
              Create FDX and maximize your access to all features.
            </p>
            <div className="flex items-center gap-5 tablet:gap-6">
              <h2 className="text-[10px] font-semibold leading-normal text-[#7C7C7C] tablet:text-[20px]">FDX</h2>
              <div className="flex w-full max-w-[70px] items-center justify-between rounded-[2.76px] border-[1.17px] border-[#DEE6F7] bg-[#F9F9F9] px-[6px] py-[3px] text-[#7C7C7C] tablet:max-w-[124px] tablet:rounded-[7px] tablet:border-[3px] tablet:px-[18px] tablet:py-2">
                <FaMinus
                  className="w-[7px] cursor-pointer tablet:w-[23px]"
                  onClick={() => {
                    if (fdx * 1 - 1 > 0) setFdx(fdx - 1);
                    else setFdx(0);
                  }}
                />
                <input
                  type="number"
                  className="hide-input-arrows w-full bg-transparent text-center text-[10px] font-semibold leading-normal text-[#7C7C7C] focus:outline-none tablet:text-[20px]"
                  value={fdx === 0 ? '' : fdx}
                  placeholder="0"
                  onChange={(e) => {
                    let x = parseFloat(e.target.value);
                    if (!isNaN(x)) {
                      x = Math.round(x * 100) / 100;
                      if (Number.isInteger(x)) {
                        setFdx(x.toString());
                      } else {
                        setFdx(x);
                      }
                    } else {
                      setFdx(0);
                    }
                  }}
                />

                <FaPlus
                  className="w-[7px] cursor-pointer tablet:w-[23px]"
                  onClick={() => {
                    if (persistedUserInfo.balance - 1 > fdx) {
                      setFdx(fdx * 1 + 1);
                    } else {
                      setFdx(fdx * 1 + (Math.floor(persistedUserInfo.balance) - fdx));
                    }
                  }}
                />
              </div>
            </div>
            <div className="flex w-full justify-center">
              <Button variant={'submit'} onClick={handleCreate}>
                {createPending === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Create'}
              </Button>
            </div>
          </div>
        </div>
        {/* Add  */}
        <div>
          <div className="flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px]">
            <div className="flex items-center gap-2">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/add-redemption.svg`}
                alt={'add-redemption'}
                className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
              />
              <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">
                Add Redemption Code
              </h1>
            </div>
          </div>
          <div className="flex flex-col gap-[5px] rounded-b-[10px] border-[#D9D9D9] bg-[#FDFDFD] px-5 py-[10px] tablet:gap-[15px] tablet:border-[1.85px] tablet:px-12 tablet:py-[18.73px]">
            <p className="text-[7.5px] font-normal leading-normal text-[#85898C] tablet:text-[14.7px]">
              You can add redemption code and earn reworded coins
            </p>
            <div className="flex items-center gap-4 tablet:gap-9">
              <h2 className="text-[10px] font-semibold leading-normal text-[#7C7C7C] tablet:text-[20px]">Code</h2>
              <input
                type="text"
                placeholder="eg (rG57HK)"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="min-w-[80px] max-w-[80px] rounded-[2.76px] border-[1.17px] border-[#DEE6F7] bg-[#FFFEF3] px-2 py-1 text-[7.8px] font-semibold leading-[7.8px] text-[#7C7C7C] focus:outline-none tablet:min-w-[230px] tablet:max-w-[230px] tablet:rounded-[7.07px] tablet:border-[3px] tablet:py-2 tablet:text-[25px] tablet:leading-[25px]"
              />
            </div>
            <div className="flex w-full justify-center">
              <Button variant={'submit'} onClick={handleAdd}>
                {addCodeLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Add'}
              </Button>
            </div>
          </div>
        </div>
        {/* UnRedeemed Code */}
        <div>
          <div className="flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px]">
            <div className="flex items-center gap-2">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/un-radeem.svg`}
                alt={'un-radeem'}
                className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
              />
              <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">
                Un-Redeemed Codes
              </h1>
            </div>
          </div>
          <div className="flex flex-col gap-[5px] rounded-b-[10px] border-[#D9D9D9] bg-[#FDFDFD] px-5 py-[10px] tablet:gap-[15px] tablet:border-[1.85px] tablet:px-9 tablet:py-[18.73px]">
            <div className="rounded-[7.546px] border-[2.792px] border-[#D9D9D9]">
              <div className="grid grid-cols-12 border-b-[2.792px] border-[#D9D9D9]">
                <div className="col-span-2 px-[15px] py-3">
                  <h1 className="text-[12px] font-semibold text-[#85898C] tablet:text-[16px]">Code</h1>
                </div>
                <div className="col-span-6 border-l-[2.792px] border-[#D9D9D9] px-[15px] py-3">
                  <h1 className="text-[12px] font-semibold text-[#85898C] tablet:text-[16px]">Description</h1>
                </div>
                <div className="col-span-2 border-l-[2.792px] border-[#D9D9D9] px-[15px] py-3">
                  <h1 className="text-[12px] font-semibold text-[#85898C] tablet:text-[16px]">FDX cost</h1>
                </div>
                <div className="col-span-2 border-l-[2.792px] border-[#D9D9D9]  px-[15px] py-3">
                  <h1 className="text-[12px] font-semibold text-[#85898C] tablet:text-[16px]">Expiration date</h1>
                </div>
              </div>
              {!unredeemedData || unredeemedData.data.data.length === 0 ? (
                <div className="bg-white py-2 tablet:py-6">
                  <p className="text-center text-[11px] font-medium leading-normal text-[#C9C8C8] tablet:text-[22px]">
                    Your have no un-redeemed codes
                  </p>
                </div>
              ) : (
                unredeemedData?.data?.data?.map((item, index) => (
                  <div className="grid grid-cols-12" key={index + 1}>
                    <div className="col-span-2 px-[15px] py-3">
                      <h1 className="text-[12px] font-normal text-[#85898C] tablet:text-[16px]">{item.code}</h1>
                    </div>
                    <div className="col-span-6 border-l-[2.792px] border-[#D9D9D9] px-[15px] py-3">
                      <h1 className="text-[12px] font-normal text-[#85898C] tablet:text-[16px]">{item.description}</h1>
                    </div>
                    <div className="col-span-2 border-l-[2.792px] border-[#D9D9D9] px-[15px] py-3">
                      <h1 className="text-[12px] font-normal text-[#85898C] tablet:text-[16px]">{item.amount} FDX</h1>
                    </div>
                    <div className="col-span-2 border-l-[2.792px] border-[#D9D9D9] px-[15px] py-3">
                      <h1 className="text-[12px] font-normal text-[#85898C] tablet:text-[16px]">
                        {/* {calculateExpiry(item.expiry)} */}
                        Never
                      </h1>
                    </div>
                    <div className="col-span-12 flex w-full justify-center gap-6 border-y-[2.792px] border-[#D9D9D9] px-[15px] py-3">
                      <Button
                        variant="share-link"
                        className={'max-w-[141px] tablet:h-[50px]'}
                        onClick={() => {
                          handleShareLink(item.code);
                          toast.success('Share Link copied!');
                        }}
                      >
                        Share Link
                      </Button>
                      <Button
                        variant="share-link-submit"
                        className={'max-w-[152px]'}
                        onClick={() => {
                          copyToClipboard(item.code);
                          toast.success('Code Copied!');
                        }}
                      >
                        Copy Code
                      </Button>
                      <Button variant="result" className={'max-w-[124px]'} onClick={() => handleRedeeem(item.code)}>
                        {radeemLoading === item.code ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Redeem'}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        {/* Referral code activity */}
        <div>
          <DeleteHistoryPopup
            isDeleteModal={isDeleteModal}
            handleClose={handleClose}
            deleteHistoryCode={deleteHistoryCode}
          />
          <div className="flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px]">
            <div className="flex items-center gap-2">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/raferral-code-activity.svg`}
                alt={'raferral-code-activity'}
                className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
              />
              <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">
                Referral code activity
              </h1>
            </div>
          </div>
          <div className="flex flex-col gap-[5px] rounded-b-[10px] border-[#D9D9D9] bg-[#FDFDFD] px-5 py-[10px] tablet:gap-[15px] tablet:border-[1.85px] tablet:px-9 tablet:py-[18.73px]">
            <div className="rounded-[7.546px] border-[2.792px] border-[#D9D9D9]">
              <div className="grid grid-cols-12 border-b-[2.792px] border-[#D9D9D9]">
                <div className="col-span-2 px-[15px] py-3">
                  <h1 className="text-[12px] font-semibold text-[#85898C] tablet:text-[16px]">Code</h1>
                </div>
                <div className="col-span-6 border-l-[2.792px] border-[#D9D9D9] px-[15px] py-3">
                  <h1 className="text-[12px] font-semibold text-[#85898C] tablet:text-[16px]">Description</h1>
                </div>
                <div className="col-span-2 border-l-[2.792px] border-[#D9D9D9] px-[15px] py-3">
                  <h1 className="text-[12px] font-semibold text-[#85898C] tablet:text-[16px]">FDX cost</h1>
                </div>
                <div className="col-span-2 border-l-[2.792px] border-[#D9D9D9]  px-[15px] py-3">
                  <h1 className="text-[12px] font-semibold text-[#85898C] tablet:text-[16px]">Expiration date</h1>
                </div>
              </div>
              {!history || history.data.data.length === 0 ? (
                <div className="border-[#D9D9D9] bg-white py-2 tablet:py-6">
                  <p className="text-center text-[11px] font-medium leading-normal text-[#C9C8C8] tablet:text-[22px]">
                    You have no records.
                  </p>
                </div>
              ) : (
                history?.data?.data
                  ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((item, index) => (
                    <div
                      className={`grid grid-cols-12 ${index === 0 && isPulse ? 'text-[#049952]' : 'text-[#A3A3A3]'}`}
                      key={index + 1}
                    >
                      <div className="col-span-2 px-[15px] py-3">
                        <h1 className="text-[12px] font-normal text-[#85898C] tablet:text-[16px]">{item.code}</h1>
                      </div>
                      <div className="col-span-6 border-l-[2.792px] border-[#D9D9D9] px-[15px] py-3">
                        <h1 className="text-[12px] font-normal text-[#85898C] tablet:text-[16px]">
                          {item.description}
                        </h1>
                      </div>
                      <div className="col-span-2 border-l-[2.792px] border-[#D9D9D9] px-[15px] py-3">
                        <h1 className="text-[12px] font-normal text-[#85898C] tablet:text-[16px]">{item.amount} FDX</h1>
                      </div>
                      <div className="col-span-2 border-l-[2.792px] border-[#D9D9D9] px-[15px] py-3">
                        <h1 className="text-[12px] font-normal text-[#85898C] tablet:text-[16px]">
                          {/* {calculateExpiry(item.expiry)} */}
                          Never
                        </h1>
                      </div>
                      <div className="col-span-12 flex w-full justify-center gap-6 border-y-[2.792px] border-[#D9D9D9] px-[15px] py-3">
                        <p className="text-[9px] font-medium leading-normal tablet:text-[20px]">
                          {formatDate(item.createdAt)}
                        </p>
                        <img
                          src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/trash2.svg`}
                          alt="trash"
                          className="h-3 w-[9px] cursor-pointer tablet:h-[23px] tablet:w-[17.6px]"
                          onClick={() => {
                            setDeleteHistoryCode(item.code);
                            setIsDeleteModal(true);
                          }}
                        />
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
