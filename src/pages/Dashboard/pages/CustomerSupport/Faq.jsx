import { faqData } from '../../../../constants/faq';
import { Button } from '../../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const Faq = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full overflow-y-auto bg-white  text-[#707175]">
      <div className="flex w-full flex-col gap-1 bg-[#4A8DBD]  py-3 text-[#E7E7E7] tablet:gap-2 tablet:py-[47px]">
        <p className="text-center text-[7px] font-semibold leading-none tablet:text-[11.77px]">FAQ</p>
        <h1 className="text-center text-[12px] font-semibold leading-none -tracking-[2%] text-white tablet:text-[35.3px]">
          Ask us anything
        </h1>
        <p className="text-center text-[8px] font-normal leading-none tablet:text-[14.71px]">
          Have any questions? We're here to assist you.
        </p>
      </div>
      <div className="px-5 tablet:px-[70px] tablet:py-[25px]">
        <div className="mt-3 flex flex-col gap-[10px] tablet:mt-[15px] tablet:gap-[26px]">
          {faqData.map((item) => (
            <div key={item.id} className="flex items-start gap-[10px] tablet:gap-[26px]">
              <div className="flex min-w-[20px] justify-center tablet:min-w-[50px]">
                <img
                  src={item.img}
                  alt={item.id}
                  className="h-[20px] w-[20px] object-contain tablet:h-[50px] tablet:w-[50px]"
                />
              </div>
              <div className="text-[10px] leading-[14.62px] tablet:text-[20px] tablet:leading-[29px]">
                <h1 className="font-semibold">{item.title}</h1>
                <h1 className="font-normal">{item.desc}</h1>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="my-[30px] flex w-full justify-center">
        <div className="flex items-center gap-4 rounded-[11.77px] bg-[#F4F4F4] px-4 py-2 tablet:gap-28 tablet:py-[42px] tablet:pl-[42px] tablet:pr-[30px]">
          <div className="text-[#0B0B0B]">
            <h1 className="text-[10px] font-semibold tablet:text-[20.88px]">Still have questions?</h1>
            <p className="text-[8px] font-normal tablet:text-[18.79px]">
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
