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
    onSuccess: (resp, variables) => {
      const { customLink } = variables;
      setPostLink(resp?.article?.articleSetting.uniqueLink);
      queryClient.invalidateQueries({ queryKey: ['news-feed', ''] });
      if (customLink) {
        showToast('success', 'customLinkGenerated');
      } else {
        showToast('success', 'linkCreated');
      }
    },
    onError: (err) => {
      console.log(err);
      showToast('error', 'error', {}, err.response.data.message);
    },
  });
};
