import { useEffect, useState } from 'react';
import { DateInput } from '../../../../components/ui/DateInput';
import { ActivityProps } from '../../../../types/advanceAnalytics';

export default function ActivityDob({ dispatch }: ActivityProps) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  useEffect(() => {
    if (from) {
      dispatch({ type: 'SET_DOB_FROM', payload: from });
    }
    if (to) {
      dispatch({ type: 'SET_DOB_TO', payload: to });
    }
  }, [from, to]);

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="w-full">
        <label htmlFor="dateInput-from" className="text-[20px]">
          From
        </label>
        <DateInput value={from} setVal={setFrom} id="dateInput-from" />
      </div>
      <div className="w-full">
        <label htmlFor="dateInput-to" className="text-[20px]">
          To
        </label>
        <DateInput value={to} setVal={setTo} id="dateInput-to" />
      </div>
    </div>
  );
}
