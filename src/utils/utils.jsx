import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const formatCountNumber = (num) => {
  if (num >= 1000) {
    const formatted = (num / 1000).toLocaleString(undefined, { minimumFractionDigits: num % 1000 !== 0 ? 1 : 0 });
    return formatted + 'k';
  }
  return num.toLocaleString();
};

export function formatDate(timestamp) {
  const date = new Date(timestamp);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;
  return formattedDate;
}

export const showToastWarning = () => {
  const navigate = useNavigate();

  toast.warning(
    <p>
      Please{' '}
      <span className="cursor-pointer text-[#389CE3] underline" onClick={() => navigate('/guest-signup')}>
        Create an Account
      </span>{' '}
      to unlock this feature
    </p>,
  );
};
