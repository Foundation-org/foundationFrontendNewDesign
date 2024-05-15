import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

const SystemNotificationCard = ({ post }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-2 rounded-[13.842px] border-[1.846px] border-[#D9D9D9] bg-[#F4F8FF] px-7 py-[14px] tablet:gap-4 tablet:px-[44px] tablet:py-6">
      <h1 className="text-[13px] font-bold leading-normal text-[#5B5B5B] tablet:text-[22px]">{post.header}</h1>
      <p className="text-[12px] font-normal leading-normal text-[#7C7C7C] tablet:text-[18px] tablet:leading-[25px]">
        {post.text}
      </p>
      <div className="flex justify-end">
        <Button
          variant="hollow-submit"
          className="w-fit bg-white"
          onClick={() => {
            navigate(post.buttonUrl);
          }}
        >
          {post.buttonText}
        </Button>
      </div>
    </div>
  );
};

export default SystemNotificationCard;
