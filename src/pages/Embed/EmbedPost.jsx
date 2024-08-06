import { useParams } from 'react-router-dom';
import QuestionCardWithToggle from '../Dashboard/pages/QuestStartSection/components/QuestionCardWithToggle';
import { useQuery } from '@tanstack/react-query';
import { fetchResults } from '../../services/api/questsApi';
import { FaSpinner } from 'react-icons/fa';
import { changeThemeTo } from '../../features/utils/utilsSlice';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

const EmbedPost = () => {
  let { link } = useParams();
  const dispatch = useDispatch();
  const [resultsMode, setResultsMode] = useState(true);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    setResultsMode(queryParams.get('resultsMode') == 'true' ? true : false);
    dispatch(changeThemeTo(queryParams.get('darkMode') == 'true' ? 'dark' : 'light'));
  }, [location.search]);

  const { data: singleQuestData, isLoading } = useQuery({
    queryKey: ['emdedPost', resultsMode],
    queryFn: () => fetchResults(link, resultsMode),
  });

  return (
    <div className="mx-auto bg-white dark:bg-gray-200">
      <div className="mx-auto w-full max-w-[600px]">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <FaSpinner className="animate-spin text-[#EAEAEA]" />
          </div>
        ) : (
          singleQuestData &&
          singleQuestData?.data?.map((item, index) => (
            <QuestionCardWithToggle
              key={index + 1}
              questStartData={item}
              isBookmarked={false}
              isSingleQuest={true}
              postLink={link}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default EmbedPost;
