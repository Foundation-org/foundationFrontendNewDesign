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
  console.log(singleQuestData);
  console.log('coming', isLoading);
  return (
    <div>
      {singleQuestData &&
        singleQuestData?.data?.map((item, index) => (
          <QuestionCardWithToggle questStartData={item} isBookmarked={false} isSingleQuest={true} postLink={id} />
        ))}
    </div>
  );
};

export default EmbedPost;
