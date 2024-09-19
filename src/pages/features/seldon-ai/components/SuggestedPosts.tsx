import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { parseQuestionsAndOptions } from '../../../../utils/seldon';
import { questionValidation } from '../../../../services/api/questsApi';
import { addNewOption, addQuestion, setOptionsByArray } from '../../../../features/createQuest/createQuestSlice';
import ThreeDotsLoading from '../../../../components/ui/threedotsLoading';

interface Post {
  question: string;
  options: string[];
  postType: string;
  userCanAddOption: boolean;
  errorMessage: string | null;
}

export default function SuggestedPosts({ afterSuggestions }: { afterSuggestions: string }) {
  const dispatch = useDispatch();
  const [suggestedPosts, setSuggestedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const checkDuplicatePost = async (value: string) => {
    try {
      const { errorMessage } = await questionValidation({
        question: value,
        queryType: 'yes/no',
      });

      return { question: value, errorMessage };
    } catch (err) {
      console.error('Error during question validation:', err);
      return { question: value, errorMessage: 'ERROR' }; // Handle or return a default error
    }
  };

  const processQuestions = async () => {
    setLoading(true);
    try {
      const processedQuestions = parseQuestionsAndOptions(afterSuggestions);

      const results = await Promise.all(
        processedQuestions.map(async (item) => {
          const { errorMessage } = await checkDuplicatePost(item.question);
          return { ...item, errorMessage };
        }),
      );

      // Filter out items with 'Duplication' error message
      const filteredQuestions = results.filter((item) => item.errorMessage !== 'DUPLICATION');

      setSuggestedPosts(filteredQuestions);
    } catch (err) {
      console.error('Error processing questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    processQuestions();
  }, [afterSuggestions]);

  return (
    <div className="rounded-[10px] border-[1.85px] border-gray-250 bg-[#FDFDFD] px-5 py-[10px] text-[#85898C] dark:border-gray-100 dark:bg-gray-200 dark:text-gray-300 tablet:py-[18.73px]">
      <h1 className="text-[16px] font-bold">New Post Suggestions:</h1>
      <div className="mt-4 flex flex-col gap-4">
        {loading ? (
          <ThreeDotsLoading />
        ) : (
          suggestedPosts?.map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 tablet:gap-8">
              <div className="col-span-3">
                <h5 className="text-[12px] font-semibold tablet:text-[16px]">
                  {index + 1} - {item.question}
                </h5>
                <ul className="flex gap-4">
                  {item.options.map((option, index) => (
                    <li key={index} className="text-[12px] tablet:text-[16px]">
                      {option}
                    </li>
                  ))}
                  {item.userCanAddOption && <li className="text-[12px] tablet:text-[16px]">Other</li>}
                </ul>
              </div>
              <div className="col-span-1 flex w-full justify-end">
                <Link
                  to={item.postType === 'yes/no' ? '/post/yes-no' : '/post'}
                  state={{ postData: item }}
                  className="whitespace-nowrap text-[12px] font-semibold text-blue-200 underline dark:text-blue-600 tablet:text-[16px]"
                  onClick={() => {
                    dispatch(addQuestion(item.question));
                    item.options.slice(0, item.options.length - 2).forEach((_, index) => {
                      dispatch(addNewOption(index));
                    });
                    dispatch(setOptionsByArray(item.options));
                  }}
                >
                  Create Post
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
