import { GrClose } from 'react-icons/gr';
import { useDispatch, useSelector } from 'react-redux';
import { getSeldonState, handleSeldonInput } from '../../../../features/seldon-ai/seldonSlice';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';

export default function SeldonInputs() {
  const dispatch = useDispatch();
  const seldonState = useSelector(getSeldonState);

  return (
    <div className="my-[15px] ml-[31px] hidden h-fit w-[18.75rem] min-w-[18.75rem] flex-col gap-8 rounded-[15px] bg-white py-[23px] pl-[1.3rem] pr-[2.1rem] dark:border dark:border-gray-100 dark:bg-gray-200 laptop:flex">
      <div className="relative">
        <div className="relative h-[45px] w-full">
          <input
            type="number"
            id="floating_outlined"
            className="peer block h-full w-full appearance-none rounded-[10px] border-2 border-[#707175] bg-transparent py-2 pl-5 pr-8 text-sm text-[#707175] focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-white-100 dark:text-white-100 dark:focus:border-blue-500 tablet:text-[18.23px]"
            value={seldonState.temperature}
            placeholder=""
            onChange={(e) => {
              dispatch(handleSeldonInput({ name: 'temperature', value: e.target.value }));
            }}
          />
          <label
            htmlFor="floating_outlined"
            className="absolute left-[15px] start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-sm text-[#707175] duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:bg-gray-200 dark:text-white-100 peer-focus:dark:text-blue-500 tablet:text-[17px] rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
          >
            Temperature
          </label>
        </div>
        {seldonState.temperature >= 0 && (
          <button
            className="absolute right-3 top-4"
            onClick={() => {
              dispatch(handleSeldonInput({ name: 'temperature', value: 0 }));
            }}
          >
            <GrClose className="h-4 w-4 text-[#ACACAC] dark:text-white" />
          </button>
        )}
      </div>
      <div className="relative">
        <div className="relative h-[45px] w-full">
          <input
            type="number"
            id="floating_outlined"
            className="peer block h-full w-full appearance-none rounded-[10px] border-2 border-[#707175] bg-transparent py-2 pl-5 pr-8 text-sm text-[#707175] focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-white-100 dark:text-white-100 dark:focus:border-blue-500 tablet:text-[18.23px]"
            value={seldonState.max_tokens}
            placeholder=""
            onChange={(e) => {
              dispatch(handleSeldonInput({ name: 'max_tokens', value: e.target.value }));
            }}
          />
          <label
            htmlFor="floating_outlined"
            className="absolute left-[15px] start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-sm text-[#707175] duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:bg-gray-200 dark:text-white-100 peer-focus:dark:text-blue-500 tablet:text-[17px] rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
          >
            Max Tokens
          </label>
        </div>
        {seldonState.max_tokens && (
          <button
            className="absolute right-3 top-4"
            onClick={() => {
              dispatch(handleSeldonInput({ name: 'max_tokens', value: 256 }));
            }}
          >
            <GrClose className="h-4 w-4 text-[#ACACAC] dark:text-white" />
          </button>
        )}
      </div>
      <div className="relative">
        <div className="relative h-[45px] w-full">
          <input
            type="number"
            id="floating_outlined"
            step="0.001"
            className="peer block h-full w-full appearance-none rounded-[10px] border-2 border-[#707175] bg-transparent py-2 pl-5 pr-8 text-sm text-[#707175] focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-white-100 dark:text-white-100 dark:focus:border-blue-500 tablet:text-[18.23px]"
            value={seldonState.top_p}
            placeholder=""
            onChange={(e) => {
              dispatch(handleSeldonInput({ name: 'top_p', value: parseFloat(e.target.value) }));
            }}
          />
          <label
            htmlFor="floating_outlined"
            className="absolute left-[15px] start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-sm text-[#707175] duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:bg-gray-200 dark:text-white-100 peer-focus:dark:text-blue-500 tablet:text-[17px] rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
          >
            Top P
          </label>
        </div>
        {seldonState.top_p >= 0 && (
          <button
            className="absolute right-3 top-4"
            onClick={() => {
              dispatch(handleSeldonInput({ name: 'top_p', value: 0.001 }));
            }}
          >
            <GrClose className="h-4 w-4 text-[#ACACAC] dark:text-white" />
          </button>
        )}
      </div>
      <div className="relative">
        <div className="relative h-[45px] w-full">
          <input
            type="number"
            id="floating_outlined"
            className="peer block h-full w-full appearance-none rounded-[10px] border-2 border-[#707175] bg-transparent py-2 pl-5 pr-8 text-sm text-[#707175] focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-white-100 dark:text-white-100 dark:focus:border-blue-500 tablet:text-[18.23px]"
            value={seldonState.frequency_penalty}
            placeholder=""
            onChange={(e) => {
              dispatch(handleSeldonInput({ name: 'frequency_penalty', value: e.target.value }));
            }}
          />
          <label
            htmlFor="floating_outlined"
            className="absolute left-[15px] start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-sm text-[#707175] duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:bg-gray-200 dark:text-white-100 peer-focus:dark:text-blue-500 tablet:text-[17px] rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
          >
            Frequency Penalty
          </label>
        </div>
        {seldonState.frequency_penalty >= 0 && (
          <button
            className="absolute right-3 top-4"
            onClick={() => {
              dispatch(handleSeldonInput({ name: 'frequency_penalty', value: 0 }));
            }}
          >
            <GrClose className="h-4 w-4 text-[#ACACAC] dark:text-white" />
          </button>
        )}
      </div>
      <div className="relative">
        <div className="relative h-[45px] w-full">
          <input
            type="number"
            id="floating_outlined"
            className="peer block h-full w-full appearance-none rounded-[10px] border-2 border-[#707175] bg-transparent py-2 pl-5 pr-8 text-sm text-[#707175] focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-white-100 dark:text-white-100 dark:focus:border-blue-500 tablet:text-[18.23px]"
            value={seldonState.presence_penalty}
            placeholder=""
            onChange={(e) => {
              dispatch(handleSeldonInput({ name: 'presence_penalty', value: e.target.value }));
            }}
          />
          <label
            htmlFor="floating_outlined"
            className="absolute left-[15px] start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-sm text-[#707175] duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:bg-gray-200 dark:text-white-100 peer-focus:dark:text-blue-500 tablet:text-[17px] rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
          >
            Presence Penalty
          </label>
        </div>
        {seldonState.presence_penalty >= 0 && (
          <button
            className="absolute right-3 top-4"
            onClick={() => {
              dispatch(handleSeldonInput({ name: 'presence_penalty', value: 0 }));
            }}
          >
            <GrClose className="h-4 w-4 text-[#ACACAC] dark:text-white" />
          </button>
        )}
      </div>
      <div className="relative">
        <div className="relative w-full">
          <TextareaAutosize
            id="floating_outlined"
            className="peer block h-full w-full resize-none appearance-none rounded-[10px] border-2 border-[#707175] bg-transparent py-2 pl-5 pr-8 text-sm text-[#707175] focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-white-100 dark:text-white-100 dark:focus:border-blue-500 tablet:text-[18.23px]"
            value={seldonState.system}
            placeholder=""
            onChange={(e) => {
              dispatch(handleSeldonInput({ name: 'system', value: e.target.value }));
            }}
          />
          <label
            htmlFor="floating_outlined"
            className="absolute left-[15px] start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-sm text-[#707175] duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:bg-gray-200 dark:text-white-100 peer-focus:dark:text-blue-500 tablet:text-[17px] rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
          >
            System
          </label>
        </div>
        {seldonState.system !== '' && (
          <button
            className="absolute right-3 top-4"
            onClick={() => {
              dispatch(
                handleSeldonInput({
                  name: 'system',
                  value:
                    "You are a very enthusiastic Foundation representative who loves to help people! Given the following sections from the Foundation documentation, answer the question using only that information, outputted in markdown format. If you are unsure and the answer is not explicitly written in the documentation, say 'Sorry, I don't know how to help with that.",
                }),
              );
            }}
          >
            <GrClose className="h-4 w-4 text-[#ACACAC] dark:text-white" />
          </button>
        )}
      </div>
    </div>
  );
}
