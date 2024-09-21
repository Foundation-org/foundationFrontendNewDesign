import { useEffect, useState } from 'react';
import { extractSections, processPromptResponse } from '../../../utils/seldon';
import Markdown from 'react-markdown';
import SuggestedPosts from './components/SuggestedPosts';
import SourcePosts from './components/SourcePosts';
import DotsLoading from '../../../components/ui/DotsLoading';
import { useLocation, useParams } from 'react-router-dom';
import { getArticles } from '../../../services/api/seldon';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '../../Dashboard/components/DashboardLayout';
import Topbar from '../../Dashboard/components/Topbar';

export default function SeldonView() {
  const location = useLocation();

  const { data: response, isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: () => getArticles(location.pathname.split('/').pop()),
  });
  console.log({ response });

  const ids = response?.data?.source
    .filter((fileName: string) => fileName.startsWith('post_'))
    .map((fileName: any) => fileName.match(/post_(\w+)\.pdf/)[1]);

  const { title, abstract, findings } = extractSections(processPromptResponse(response?.data?.body || '').before);

  return (
    <div className="bg-black">
      <div className="mx-auto mb-[10px] rounded-[10px] px-4 tablet:mb-[15px] tablet:max-w-[730px] tablet:px-0">
        <div className="w-full bg-[#F2F3F5] dark:bg-black">
          {isLoading ? (
            <DotsLoading />
          ) : (
            response?.data?.body && (
              <div className="flex flex-col gap-4 pt-4 tablet:pt-8">
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
                <SourcePosts promptSources={ids} />
                <SuggestedPosts
                  afterSuggestions={processPromptResponse(response?.data?.body).after}
                  promptResponse={response?.data?.body}
                  promptSources={ids}
                  title={title}
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
