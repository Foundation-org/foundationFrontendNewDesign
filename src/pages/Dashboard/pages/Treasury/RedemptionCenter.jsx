import { FaPlus, FaMinus } from 'react-icons/fa6';
import { Button } from '../../../../components/ui/Button';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { createRedeeemCode } from '../../../../services/api/redemptionApi';
import { toast } from 'sonner';

export default function RedemptionCenter() {
  const [fdx, setFdx] = useState(0);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [description, setDescription] = useState('');
  const [expiry, setExpiry] = useState('');

  const { mutateAsync: createRedemptionCode } = useMutation({
    mutationFn: createRedeeemCode,
    onSuccess: (resp) => {
      console.log(resp.data);
      toast.success('Redemption Code created successfully');

      setExpiry('30 days');
      setDescription('');
      setFdx(0);
    },

    onError: (err) => {
      console.log(err);
    },
  });
  console.log(expiry);

  const handleSubmit = () => {
    if (fdx === 0) return toast.error('Please select the amount');
    if (description === '') return toast.error('You cannot leave description empty');
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
  };
  return (
    <div className="flex flex-col gap-[25px]">
      <div>
        <h1 className="mb-6 text-[24px] font-semibold leading-normal text-[#707175]">Redemption center</h1>
        <div className="flex gap-[78px]">
          {/* Create  */}
          <div className="w-full rounded-[15px] border-[1.846px] border-[#4A8DBD] bg-white px-[25px] py-[25px]">
            <div className="flex justify-between">
              <h1 className="mb-4 text-[22px] font-semibold leading-normal text-[#707175]">Create Redemption Code</h1>
              <div className="flex items-baseline gap-[10px]">
                <p className="text-[14.765px] font-normal leading-normal text-[#85898C]">Expires in</p>
                <select
                  name=""
                  id=""
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="h-7 min-w-[82px] max-w-[82px] rounded-[5.376px] border-[2.279px] border-[#DEE6F7] bg-[#F9F9F9] text-[13.6px] font-semibold text-[#7C7C7C] focus:outline-none"
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
              className="w-full rounded-[7.07px] border-[3px] border-[#DEE6F7] bg-[#F9F9F9] px-4 py-3 text-[16px] font-medium leading-normal text-[#707175] focus:outline-none"
            />
            <p className="my-[15px] text-[14.7px] font-normal leading-normal text-[#85898C]">
              Create FDX and maximize your access to all features.
            </p>
            <div className="flex items-center gap-9">
              <h2 className="text-[20px] font-semibold leading-normal text-[#7C7C7C]">FDX</h2>
              <div className="flex w-full max-w-[178px] items-center justify-between rounded-[7px] border-[3px] border-[#DEE6F7] bg-[#F9F9F9] px-[18px] py-2 text-[#7C7C7C]">
                <FaPlus
                  className="w-[23px] cursor-pointer"
                  onClick={() => {
                    if (persistedUserInfo.balance.toFixed(2) - 0.5 > fdx) {
                      setFdx(fdx + 0.5);
                    } else {
                      setFdx(fdx + (persistedUserInfo.balance.toFixed(2) - fdx));
                    }
                  }}
                />
                <h2 className="text-[20px] font-semibold leading-normal text-[#7C7C7C]">{fdx}</h2>
                <FaMinus
                  className="w-[23px] cursor-pointer"
                  onClick={() => {
                    if (fdx !== 0) setFdx(fdx - 0.5);
                  }}
                />
              </div>
            </div>
            <div className="flex w-full justify-end">
              <Button variant={'cancel'} onClick={handleSubmit}>
                Create
              </Button>
            </div>
          </div>
          <div className="w-full rounded-[15px] border-[1.846px] border-[#F2DB12] bg-white px-[25px] py-[25px]">
            <h1 className="mb-4 text-[22px] font-semibold leading-normal text-[#707175]">Add Redemption Code</h1>
            <p className="my-[15px] text-[14.7px] font-normal leading-normal text-[#85898C]">
              You can add redemption code and earn reworded coins
            </p>
            <div className="flex items-center gap-9">
              <h2 className="text-[20px] font-semibold leading-normal text-[#7C7C7C]">Code</h2>
              <input
                type="text"
                placeholder="45kLM0p"
                className="min-w-[178px] max-w-[178px] rounded-[7.07px] border-[3px] border-[#F2E56D] bg-[#FFFEF3] px-7 py-2 text-[25px] font-semibold leading-[25px] text-[#7C7C7C] focus:outline-none"
              />
            </div>
            <div className="flex w-full justify-end">
              <Button variant={'cancel'}>Add</Button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h1 className="mb-6 text-[24px] font-semibold leading-normal text-[#707175]">Un-Redeemed Codes</h1>
        <div className="rounded-[15px] border-[1.84px] border-[#D9D9D9] bg-white py-6">
          <p className="text-center text-[22px] font-medium leading-normal text-[#C9C8C8]">
            Your have no un-redeemed codes
          </p>
        </div>
        <div>
          <div className="mb-[13px] ml-[60px] flex items-center gap-[35px]">
            <p className="min-w-[89px] max-w-[89px] text-[22px] font-medium leading-normal text-[#707175]">FDX</p>
            <p className="min-w-[189px] max-w-[189px] text-[22px] font-medium leading-normal text-[#707175]">
              Description
            </p>
            <p className="min-w-[89px] max-w-[89px] text-[22px] font-medium leading-normal text-[#707175]">Code</p>
            <p className="min-w-[89px] max-w-[89px] text-[22px] font-medium leading-normal text-[#707175]">Expiray</p>
          </div>
          <div className="flex items-center justify-between rounded-[15px] border-[1.84px] border-[#0FB063] bg-white py-5 pl-[60px] pr-6">
            <div className="flex items-center gap-[35px]">
              <p className="min-w-[89px] max-w-[89px] text-[20px] font-medium leading-normal text-[#707175]">10</p>
              <p className="min-w-[189px] max-w-[189px] text-[20px] font-medium leading-normal text-[#707175]">
                Get 75 bonus Posts
              </p>
              <p className="min-w-[89px] max-w-[89px] text-[20px] font-medium leading-normal text-[#707175]">35KLM06</p>
              <p className="min-w-[89px] max-w-[89px] text-[20px] font-medium leading-normal text-[#707175]">7 Days</p>
            </div>
            <div className="flex items-center gap-[35px]">
              <Button variant="danger" className={'bg-[#BABABA]'}>
                Share Link
              </Button>
              <Button variant="submit">Copy</Button>
              <Button variant="result">Redeem</Button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h1 className="mb-6 text-[24px] font-semibold leading-normal text-[#707175]">History</h1>
        <div className="rounded-[15px] border-[1.84px] border-[#D9D9D9] bg-white py-6">
          <p className="text-center text-[22px] font-medium leading-normal text-[#C9C8C8]">You have no records.</p>
        </div>

        <div className="flex items-center justify-between rounded-[15px] border-[1.84px] border-[#0FB063] bg-white py-6 pl-[60px] pr-6">
          <div className="flex items-center gap-[35px]">
            <p className="min-w-[89px] max-w-[89px] text-[20px] font-medium leading-normal text-[#707175]">10</p>
            <p className="min-w-[189px] max-w-[189px] text-[20px] font-medium leading-normal text-[#707175]">
              Get 75 bonus Posts
            </p>
            <p className="min-w-[89px] max-w-[89px] text-[20px] font-medium leading-normal text-[#707175]">35KLM06</p>
            <p className="min-w-[89px] max-w-[89px] text-[20px] font-medium leading-normal text-[#707175]">7 Days</p>
          </div>
          <div className="flex items-center gap-[35px]">
            <p className="text-[20px] font-medium leading-normal text-[#A3A3A3]">Redeemed</p>
            <p className="text-[20px] font-medium leading-normal text-[#707175]">12,May-23</p>
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/trash2.svg`}
              alt="trash"
              className="h-3 w-[9px] cursor-pointer tablet:h-[23px] tablet:w-[17.6px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
