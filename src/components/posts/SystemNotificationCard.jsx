import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

const SystemNotificationCard = ({ post, innerRef }) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col gap-2 rounded-[13.842px] border-2 border-[#6BA5CF] bg-[#F4F8FF] px-7 pb-[15px] pt-[14px] tablet:gap-4 tablet:border-[3.5px] tablet:px-[44px] tablet:py-6"
      ref={innerRef}
    >
      <h1 className="text-[13px] font-bold leading-normal text-[#5B5B5B] tablet:text-[22px]">{post.header}</h1>
      {post?.text?.map((item, index) => (
        <p
          key={index + 1}
          className="text-[13px] font-normal leading-normal text-[#7C7C7C] tablet:text-[18px] tablet:leading-[25px]"
        >
          {item}
        </p>
      ))}
      {post.buttonText && post.buttonUrl && (
        <div className="flex justify-end tablet:mt-2">
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
      )}
    </div>
  );
};

export default SystemNotificationCard;
