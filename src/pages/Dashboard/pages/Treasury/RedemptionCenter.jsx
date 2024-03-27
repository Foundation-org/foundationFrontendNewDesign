import { FaPlus, FaMinus } from 'react-icons/fa6';
import { Button } from '../../../../components/ui/Button';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addRedeemCode,
  createRedeeemCode,
  getHistoryData,
  getUnredeemedData,
} from '../../../../services/api/redemptionApi';
import { toast } from 'sonner';

export default function RedemptionCenter() {
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [fdx, setFdx] = useState(0);
  const [description, setDescription] = useState('');
  const [expiry, setExpiry] = useState('30 days');
  const [code, setCode] = useState('');

  const { mutateAsync: createRedemptionCode } = useMutation({
    mutationFn: createRedeeemCode,
    onSuccess: (resp) => {
      toast.success('Redemption Code created successfully');
      queryClient.invalidateQueries('unredeemedData');
      setExpiry('30 days');
      setDescription('');
      setFdx(0);
    },
    onError: (err) => {
      toast.error(err.response.data.message.split(':')[1]);
    },
  });
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
      toast.success('Code Redeemed Successfully');
      setCode('');
    },
    onError: (err) => {
      toast.error(err.response.data.message.split(':')[1]);
    },
  });

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
    if (code === '') return toast.error('Enter some code to Redeeem');

    const params = {
      uuid: persistedUserInfo?.uuid,
      code: code,
    };
    addRedemptionCode(params);
  };

  const handleCreate = () => {
    if (fdx === 0) return toast.error('Please select the amount');
    if (description === '') return toast.error('You cannot leave description empty');
    let newExpiryDate;

    console.log(expiry);
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

  return (
    <div className="flex flex-col gap-[10px] px-5 tablet:gap-[25px]">
      <div>
        <h1 className="mb-2 text-[12px] font-semibold leading-normal text-[#707175] tablet:mb-6 tablet:text-[24px]">
          Redemption center
        </h1>
      </div>
      <div className="flex flex-col gap-2 tablet:gap-[78px] laptop:flex-row">
        {/* Create */}
        <div className="w-full rounded-[5.85px] border-[0.72px] border-[#4A8DBD] bg-white px-4 py-[11px] tablet:rounded-[15px] tablet:border-[1.846px] tablet:px-[25px] tablet:py-[25px]">
          <div className="flex justify-between">
            <h1 className="mb-2 text-[10px] font-semibold leading-normal text-[#707175] tablet:mb-4 tablet:text-[22px]">
              Create Redemption Code
            </h1>
            <div className="flex items-baseline gap-[10px]">
              <p className="text-[7px] font-normal leading-normal text-[#85898C] tablet:text-[14.765px]">Expires in</p>
              <select
                name=""
                id=""
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="h-[13px] min-w-[40px] max-w-[40px] rounded-[2.706px] border-[2.279px] border-[#DEE6F7] bg-[#F9F9F9] text-[7.49px] font-semibold text-[#7C7C7C] focus:outline-none tablet:h-7 tablet:min-w-[82px] tablet:max-w-[82px] tablet:rounded-[5.376px] tablet:text-[13.6px]"
              >
                <option selected>30 days</option>
                <option>7 days</option>
                <option>Never</option>
              </select>
            </div>
          </div>
          <input
            type="text"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            placeholder="Description here....."
            className="w-full rounded-[2.76px] border-[1.17px] border-[#DEE6F7] bg-[#F9F9F9] p-1 text-[10px] font-medium leading-normal text-[#707175] focus:outline-none tablet:rounded-[7.07px] tablet:border-[3px] tablet:px-4 tablet:py-3 tablet:text-[16px]"
          />
          <p className="my-[5px] text-[7.5px] font-normal leading-normal text-[#85898C] tablet:my-[15px] tablet:text-[14.7px]">
            Create FDX and maximize your access to all features.
          </p>
          <div className="flex items-center gap-5 tablet:gap-9">
            <h2 className="text-[10px] font-semibold leading-normal text-[#7C7C7C] tablet:text-[20px]">FDX</h2>
            <div className="flex w-full max-w-[70px] items-center justify-between rounded-[2.76px] border-[1.17px] border-[#DEE6F7] bg-[#F9F9F9] px-[6px] py-[3px] text-[#7C7C7C] tablet:max-w-[178px] tablet:rounded-[7px] tablet:border-[3px] tablet:px-[18px] tablet:py-2">
              <FaMinus
                className="w-[7px] cursor-pointer tablet:w-[23px]"
                onClick={() => {
                  if (fdx - 1 > 0) setFdx(fdx - 1);
                  else setFdx(0);
                }}
              />
              <h2 className="text-[10px] font-semibold leading-normal text-[#7C7C7C] tablet:text-[20px]">
                {fdx.toFixed(2)}
              </h2>
              <FaPlus
                className="w-[7px] cursor-pointer tablet:w-[23px]"
                onClick={() => {
                  if (persistedUserInfo.balance.toFixed(2) - 1 > fdx) {
                    setFdx(fdx + 1);
                  } else {
                    setFdx(fdx + (persistedUserInfo.balance.toFixed(2) - fdx));
                  }
                }}
              />
            </div>
          </div>
          <div className="flex w-full justify-end">
            <Button variant={'cancel'} onClick={handleCreate}>
              Create
            </Button>
          </div>
        </div>
        {/* Add  */}
        <div className="w-full rounded-[5.85px] border-[0.72px] border-[#F2DB12] bg-white px-4 py-[11px] tablet:rounded-[15px] tablet:border-[1.846px] tablet:px-[25px] tablet:py-[25px]">
          <h1 className="mb-2 text-[10px] font-semibold leading-normal text-[#707175] tablet:mb-4 tablet:text-[22px]">
            Add Redemption Code
          </h1>
          <p className="my-[5px] text-[7.5px] font-normal leading-normal text-[#85898C] tablet:my-[15px] tablet:text-[14.7px]">
            You can add redemption code and earn reworded coins
          </p>
          <div className="flex items-center gap-4 tablet:gap-9">
            <h2 className="text-[10px] font-semibold leading-normal text-[#7C7C7C] tablet:text-[20px]">Code</h2>
            <input
              type="text"
              placeholder="45kLM0p"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="min-w-[70px] max-w-[70px] rounded-[2.76px] border-[1.17px] border-[#F2E56D] bg-[#FFFEF3] px-3 py-1 text-[7.8px] font-semibold leading-[7.8px] text-[#7C7C7C] focus:outline-none tablet:min-w-[178px] tablet:max-w-[178px] tablet:rounded-[7.07px] tablet:border-[3px] tablet:px-7 tablet:py-2 tablet:text-[25px] tablet:leading-[25px]"
            />
          </div>
          <div className="flex w-full justify-end">
            <Button variant={'cancel'} onClick={handleAdd}>
              Add
            </Button>
          </div>
        </div>
      </div>

      <div>
        <h1 className="mb-2 text-[12px] font-semibold leading-normal text-[#707175] tablet:mb-6 tablet:text-[24px]">
          Un-Redeemed Codes
        </h1>
        {!unredeemedData || unredeemedData.data.data.length === 0 ? (
          <div className="rounded-[5.85px] border-[1.84px] border-[#D9D9D9] bg-white py-2 tablet:rounded-[15px] tablet:py-6">
            <p className="text-center text-[11px] font-medium leading-normal text-[#C9C8C8] tablet:text-[22px]">
              Your have no un-redeemed codes
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-2 ml-3 flex items-center gap-[10px] tablet:mb-[13px] tablet:ml-[60px] tablet:gap-[35px]">
              <p className="min-w-[20px] max-w-[20px] text-[10px] font-medium leading-normal text-[#707175] tablet:min-w-[89px] tablet:max-w-[89px] tablet:text-[22px]">
                FDX
              </p>
              <p className="min-w-[95px] max-w-[95px] text-[10px] font-medium leading-normal text-[#707175] tablet:min-w-[189px] tablet:max-w-[189px] tablet:text-[22px]">
                Description
              </p>
              <p className="min-w-[40px] max-w-[40px] text-[10px] font-medium leading-normal text-[#707175] tablet:min-w-[89px] tablet:max-w-[89px] tablet:text-[22px]">
                Code
              </p>
              <p className="min-w-[40px] max-w-[40px] text-[10px] font-medium leading-normal text-[#707175] tablet:min-w-[89px] tablet:max-w-[89px] tablet:text-[22px]">
                Expiry
              </p>
            </div>
            <div className="rounded-[5.85px] border-[1.84px] border-[#0FB063] bg-white tablet:rounded-[15px]">
              {unredeemedData?.data?.data?.map((item, index) => (
                <div>
                  <div
                    className="flex flex-col justify-between gap-2 py-2 pl-[13px] pr-4 tablet:gap-4 tablet:py-5 tablet:pl-[60px] tablet:pr-6 laptop:flex-row laptop:items-center laptop:gap-0"
                    key={index}
                  >
                    <div className="flex items-center gap-[10px] tablet:gap-[35px]">
                      <p className="min-w-[20px] max-w-[20px] text-[10px] font-medium leading-normal text-[#707175] tablet:min-w-[89px] tablet:max-w-[89px] tablet:text-[20px]">
                        {item.amount}
                      </p>
                      <p className="min-w-[95px] max-w-[95px] text-[10px] font-medium leading-normal text-[#707175] tablet:min-w-[189px] tablet:max-w-[189px] tablet:text-[20px]">
                        {item.description}
                      </p>
                      <p className="min-w-[40px] max-w-[40px] text-[10px] font-medium leading-normal text-[#707175] tablet:min-w-[89px] tablet:max-w-[89px] tablet:text-[20px]">
                        {item.code}
                      </p>
                      <p className="min-w-[40px] max-w-[40px] text-[10px] font-medium leading-normal text-[#707175] tablet:min-w-[89px] tablet:max-w-[89px] tablet:text-[20px]">
                        {calculateExpiry(item.expiry)}
                      </p>
                    </div>
                    <div className="flex items-center justify-end gap-[10px] tablet:gap-[35px]">
                      <Button variant="danger" className={'bg-[#BABABA]'}>
                        Share Link
                      </Button>
                      <Button
                        variant="submit"
                        onClick={() => {
                          copyToClipboard(item.code);
                          toast.success('Code Copied!');
                        }}
                      >
                        Copy
                      </Button>
                      <Button variant="result">Redeem</Button>
                    </div>
                  </div>
                  <div className="mx-[7px] h-[1.84px] rounded-md bg-[#EEE] tablet:mx-6" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <h1 className="mb-2 text-[12px] font-semibold leading-normal text-[#707175] tablet:mb-6 tablet:text-[24px]">
          History
        </h1>

        {!history || history.data.data.length === 0 ? (
          <div className="rounded-[5.85px] border-[1.84px] border-[#D9D9D9] bg-white py-2 tablet:rounded-[15px] tablet:py-6">
            <p className="text-center text-[11px] font-medium leading-normal text-[#C9C8C8] tablet:text-[22px]">
              You have no records.
            </p>
          </div>
        ) : (
          history?.data?.data?.map((item, index) => (
            <div
              key={index + 1}
              className="flex flex-col justify-between gap-2 rounded-[5.85px] border-[1.84px] border-[#0FB063] bg-white py-2 pl-[13px] pr-4 tablet:gap-4 tablet:rounded-[15px] tablet:py-5 tablet:pl-[60px] tablet:pr-6 laptop:flex-row laptop:items-center laptop:gap-0"
            >
              <div className="flex items-center gap-[10px] tablet:gap-[35px]">
                <p className="min-w-[20px] max-w-[20px] text-[10px] font-medium leading-normal text-[#707175] tablet:min-w-[89px] tablet:max-w-[89px] tablet:text-[20px]">
                  {item.amount}
                </p>
                <p className="min-w-[95px] max-w-[95px] text-[10px] font-medium leading-normal text-[#707175] tablet:min-w-[189px] tablet:max-w-[189px] tablet:text-[20px]">
                  {item.description}
                </p>
                <p className="min-w-[40px] max-w-[40px] text-[10px] font-medium leading-normal text-[#707175] tablet:min-w-[89px] tablet:max-w-[89px] tablet:text-[20px]">
                  {item.code}
                </p>
                <p className="min-w-[40px] max-w-[40px] text-[10px] font-medium leading-normal text-[#707175] tablet:min-w-[89px] tablet:max-w-[89px] tablet:text-[20px]">
                  {calculateExpiry(item.expiry)}
                </p>
              </div>
              <div className="flex items-center justify-end gap-[10px] tablet:gap-[35px]">
                <p className="text-[9px] font-medium leading-normal text-[#A3A3A3] tablet:text-[20px]">Redeemed</p>
                <p className="text-[20px] font-medium leading-normal text-[#707175]">12,May-23</p>
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/trash2.svg`}
                  alt="trash"
                  className="h-3 w-[9px] cursor-pointer tablet:h-[23px] tablet:w-[17.6px]"
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
