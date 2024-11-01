import showToast from '../../components/ui/Toast';
import api from './Axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const handleCreateUniqueLink = async (data) => {
  const { uuid, id, customLink } = data;
  const body = customLink ? { id, customLink, uuid } : { id, uuid };

  const resp = await api.post('/article/uniqueLink', body);
  return resp.data;
};

export const useGenerateArticleLink = (setPostLink) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleCreateUniqueLink,
    onSuccess: (resp) => {
      setPostLink(resp?.article?.articleSetting.uniqueLink);
      queryClient.invalidateQueries({ queryKey: ['news-feed', ''] });
      showToast('success', 'customLinkGenerated');
    },
    onError: (err) => {
      console.log(err);
      showToast('error', 'error', {}, err.response.data.message);
    },
  });
};
