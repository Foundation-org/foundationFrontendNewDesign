import { useParams } from 'react-router-dom';
import QuestionCardWithToggle from '../Dashboard/pages/QuestStartSection/components/QuestionCardWithToggle';
import { useQuery } from '@tanstack/react-query';
import { fetchResults } from '../../services/api/questsApi';
import { FaSpinner } from 'react-icons/fa';

const EmbedPost = () => {
  let { id } = useParams();

  const { data: singleQuestData, isLoading } = useQuery({
    queryKey: ['emdedPost'],
    queryFn: () => fetchResults(id),
  });

  return (
    <div className="mx-auto w-full max-w-[730px]">
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
            postLink={id}
          />
        ))
      )}
    </div>
  );
};

export default EmbedPost;
