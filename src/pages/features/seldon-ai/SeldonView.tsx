import { extractSections, processPromptResponse } from '../../../utils/seldon';
import Markdown from 'react-markdown';
import SuggestedPosts from './components/SuggestedPosts';
import SourcePosts from './components/SourcePosts';
import DotsLoading from '../../../components/ui/DotsLoading';
import { useLocation } from 'react-router-dom';
import { getArticles } from '../../../services/api/seldon';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '../../Dashboard/components/DashboardLayout';
import Topbar from '../../Dashboard/components/Topbar';
import { useEffect, useState } from 'react';

export default function SeldonView() {
  const location = useLocation();
  const [promptSources, setPromptSources] = useState([]);

  const { data: response, isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: () => getArticles(location.pathname.split('/').pop()),
  });

  const { title, abstract, findings } = extractSections(processPromptResponse(response?.data?.body || '').before);

  useEffect(() => {
    setPromptSources(response?.data?.source);
  }, [response]);

  return (
    <>
      <Topbar />
      <div className="w-full bg-[#F2F3F5] dark:bg-black">
        <DashboardLayout>
          <div className="mx-auto mb-[10px] rounded-[10px] px-4 tablet:mb-[15px] tablet:max-w-[730px] tablet:px-0">
            <div className="flex h-[43px] items-center justify-center tablet:h-[78px]">
              <h1 className="text-[12px] font-semibold leading-normal text-[#7C7C7C] dark:text-gray-300 tablet:text-[24px] tablet:leading-[24px]">
                Article
              </h1>
            </div>
            {isLoading ? (
              <DotsLoading />
            ) : (
              response?.data?.body && (
                <div className="flex h-[calc(100dvh-134px)] flex-col gap-4 overflow-y-auto pb-5 no-scrollbar tablet:h-[calc(100dvh-147px)]">
                  <div className="rounded-[10px] border-[1.85px] border-gray-250 bg-[#FDFDFD] px-5 py-[10px] text-[#85898C] dark:border-gray-100 dark:bg-gray-200 dark:text-gray-300 tablet:py-[18.73px]">
                    <h1 className="text-[16px] font-bold">{title}</h1>
                  </div>
                  <div className="rounded-[10px] border-[1.85px] border-gray-250 bg-[#FDFDFD] px-5 py-[10px] text-[#85898C] dark:border-gray-100 dark:bg-gray-200 dark:text-gray-300 tablet:py-[18.73px]">
                    <h1 className="text-[16px] font-bold">Abstract:</h1>
                    <p className="text-[12px] tablet:text-[16px]">{abstract}</p>
                  </div>
                  <div className="rounded-[10px] border-[1.85px] border-gray-250 bg-[#FDFDFD] px-5 py-[10px] text-[#85898C] dark:border-gray-100 dark:bg-gray-200 dark:text-gray-300 tablet:py-[18.73px]">
                    <h1 className="text-[16px] font-bold">Findings:</h1>
                    <Markdown>{findings}</Markdown>
                  </div>
                  <h1 className="text-[16px] font-bold">Sourced Posts:</h1>
                  <SourcePosts promptSources={promptSources} />
                  <SuggestedPosts
                    afterSuggestions={processPromptResponse(response?.data?.body).after}
                    promptResponse={response?.data?.body}
                    promptSources={promptSources}
                    title={title}
                  />
                </div>
              )
            )}
          </div>
        </DashboardLayout>
      </div>
    </>
  );
}
