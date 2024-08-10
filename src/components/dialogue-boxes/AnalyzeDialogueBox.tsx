import { useState } from 'react';
import { Button } from '../ui/Button';
import { useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { analyzePost } from '../../services/mutations/advance-analytics';
import PopUp from '../ui/PopUp';

interface Props {
  handleClose: () => void;
  modalVisible: boolean;
  title: string;
  image: string;
  questStartData: any;
}

type Post = {
  id: number;
  question: string;
};

const headerButtons = [
  {
    id: 1,
    title: 'Hide',
  },
  {
    id: 2,
    title: 'Contributions',
  },
  {
    id: 3,
    title: 'Target',
  },
  {
    id: 4,
    title: 'Badge',
  },
];

export default function AnalyzeDialogueBox({ handleClose, modalVisible, title, image, questStartData }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBtn, setSelectedBtn] = useState('Hide');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const { mutateAsync: handleAnalyzePost, isPending } = analyzePost();

  // console.log(questStartData?.QuestAnswers);
  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <PopUp
      logo={image}
      title={title}
      open={modalVisible}
      handleClose={handleClose}
      customStyle={''}
      customClasses={''}
      closeIcon={''}
      isBackground={''}
      remove={''}
      autoSize={''}
    >
      <div className="px-[18px] py-[10px] tablet:px-[55px] tablet:py-[25px]">
        <div className="flex items-center justify-center gap-[15px]">
          {headerButtons?.map((item) => (
            <button
              key={item.id}
              className={`${selectedBtn === item.title ? 'slider-link-active' : 'slider-inactive'} slider-link tablet:min-w-[120px]`}
              onClick={() => setSelectedBtn(item.title)}
            >
              {item.title}
            </button>
          ))}
        </div>
        {selectedBtn === 'Hide' ? (
          <div>
            <h1 className="text-center text-[10px] font-normal leading-[12px] text-accent-400 tablet:my-4 tablet:text-[16px] tablet:leading-[16px] dark:text-gray-300">
              You can Hide an option
            </h1>
            <div className="relative inline-block w-full">
              <button
                onClick={toggleDropdown}
                className="w-full rounded border-[3px] border-white-500 px-4 py-2 text-start text-accent-600 focus:outline-none tablet:rounded-[10px]"
              >
                {selectedOptions.length > 0 ? selectedOptions[0] : 'Select an option'}
              </button>
              {isOpen && (
                <ul className="absolute z-10 mt-2 w-full min-w-[160px] rounded bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
                  {questStartData?.QuestAnswers.map((post: Post) => (
                    <li
                      key={post.id}
                      className="block cursor-pointer px-4 py-2 text-accent-600 hover:bg-blue-300 hover:text-white"
                      onClick={() => {
                        setSelectedOptions([post.question]);
                        toggleDropdown();
                      }}
                    >
                      {post.question}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-4 flex w-full justify-end">
              <Button
                variant={'submit'}
                className=""
                rounded=""
                onClick={() => {
                  handleAnalyzePost({
                    userUuid: persistedUserInfo.uuid,
                    questForeignKey: questStartData._id,
                    hiddenOptionsArray: selectedOptions,
                  });
                }}
              >
                {isPending === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Hide'}
              </Button>
            </div>
          </div>
        ) : (
          <h1 className="text-center text-[10px] font-semibold leading-[12px] text-accent-400 tablet:my-14 tablet:text-[22px] tablet:leading-[22px] dark:text-gray-300">
            Coming Soon!
          </h1>
        )}
      </div>
    </PopUp>
  );
}
