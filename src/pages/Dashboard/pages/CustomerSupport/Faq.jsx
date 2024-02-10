import { faqData } from '../../../../constants/faq';
import { Button } from '../../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const Faq = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white w-full h-full overflow-y-auto pt-[12px] pb-[70px] tablet:py-[25px] text-[#707175]">
      <div className="px-5 tablet:px-[70px]">
        <div className="flex flex-col gap-1 tablet:gap-2">
          <p className="text-[7px] tablet:text-[11.77px] font-semibold text-center leading-none">FAQ</p>
          <h1 className="text-[12px] tablet:text-[35.3px] font-semibold text-center -tracking-[2%] leading-none">
            Ask us anything
          </h1>
          <p className="text-[8px] tablet:text-[14.71px] font-normal text-center leading-none">
            Have any questions? We're here to assist you.
          </p>
        </div>

        <div className="flex flex-col gap-[10px] tablet:gap-[26px] mt-2 tablet:mt-[15px]">
          {faqData.map((item) => (
            <div key={item.id} className="flex items-start gap-[10px] tablet:gap-[26px]">
              <div className="min-w-[20px] tablet:min-w-[50px] flex justify-center">
                <img
                  src={item.img}
                  alt={item.id}
                  className="object-contain w-[20px] h-[20px] tablet:w-[50px] tablet:h-[50px]"
                />
              </div>
              <div className="text-[10px] tablet:text-[20px] leading-[14.62px] tablet:leading-[29px]">
                <h1 className="font-semibold">{item.title}</h1>
                <h1 className="font-normal">{item.desc}</h1>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full flex justify-center my-[30px]">
        <div className="bg-[#F4F4F4] py-2 tablet:py-[42px] px-4 tablet:pl-[42px] tablet:pr-[30px] flex gap-4 tablet:gap-28 rounded-[11.77px] items-center">
          <div className="text-[#0B0B0B]">
            <h1 className="text-[10px] tablet:text-[20.88px] font-semibold">Still have questions?</h1>
            <p className="text-[8px] tablet:text-[18.79px] font-normal">
              Can’t find the answer you’re looking for? Please chat to our friendly team.
            </p>
          </div>
          <Button variant="getintouch" onClick={() => navigate('/dashboard/faq/contact-us')}>
            Get in touch
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Faq;
