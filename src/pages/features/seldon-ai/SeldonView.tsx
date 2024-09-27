import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link as ScrollLink } from 'react-scroll';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getArticles } from '../../../services/api/seldon';
import { setSeldonData } from '../../../features/seldon-ai/seldonDataSlice';
import SourcePosts from './components/SourcePosts';
import Topbar from '../../Dashboard/components/Topbar';
import SuggestedPosts from './components/SuggestedPosts';
import DotsLoading from '../../../components/ui/DotsLoading';
import DashboardLayout from '../../Dashboard/components/DashboardLayout';
import { formatDate } from '../../../utils/utils';

export default function SeldonView() {
  const location = useLocation();
  const dispatch = useDispatch();

  const { data: response, isLoading } = useQuery({
    queryKey: ['articles', location.pathname.split('/').pop()],
    queryFn: () => getArticles(location.pathname.split('/').pop()),
  });

  useEffect(() => {
    dispatch(
      setSeldonData({
        debug: '',
        title: response?.data.title,
        abstract: response?.data.abstract,
        seoSummary: response?.data.seoSummary,
        findings: response?.data.findings,
        suggestions: response?.data.suggestions,
        sources: response?.data?.source,
        articleId: response?.data._id,
        prompt: response?.data.prompt,
      }),
    );
  }, [response]);

  return (
    <>
      <Topbar />
      <div className="w-full bg-[#F2F3F5] dark:bg-black">
        <DashboardLayout>
          {isLoading ? (
            <DotsLoading />
          ) : (
            response?.data && (
              <div className="mx-auto rounded-[10px] text-gray-200 tablet:max-w-[778px] tablet:px-6">
                <div
                  id="containerElement"
                  className="flex h-[calc(100dvh-91px)] flex-col gap-4 overflow-y-auto p-4 no-scrollbar tablet:h-[calc(100dvh-69px)] tablet:gap-6 tablet:px-0 tablet:py-8"
                >
                  <Link
                    to={'/news'}
                    className="cursor-pointer text-[14px] font-normal leading-[121.4%] text-blue-200 hover:underline dark:text-blue-600 tablet:-mt-3 tablet:text-[20px]"
                  >
                    {'<'} Back to all news
                  </Link>
                  <div className="space-y-1">
                    <h1 className="text-[16px] font-bold tablet:text-[24px]">{response?.data?.title}</h1>
                    <h5 className="text-[14px] tablet:text-[20px]">Foundation News</h5>
                    <p className="text-[10px] tablet:text-[16px]">Posted: {formatDate(response?.data.createdAt)}</p>
                  </div>
                  <p className="text-[12px] tablet:text-[20px]">{response?.data?.abstract}</p>
                  <div className="flex flex-col gap-2 tablet:mt-[10px] tablet:gap-5">
                    <ScrollLink
                      to="posts-list"
                      containerId="containerElement"
                      spy={true}
                      smooth={true}
                      offset={-70}
                      duration={500}
                      className="cursor-pointer text-[14px] font-normal leading-[121.4%] text-blue-200 hover:underline dark:text-blue-600 tablet:-mt-3 tablet:text-[20px]"
                    >
                      View posts that informed this article
                    </ScrollLink>
                    <ScrollLink
                      to="posts-ideas"
                      containerId="containerElement"
                      spy={true}
                      smooth={true}
                      offset={-70}
                      duration={500}
                      className="cursor-pointer text-[14px] font-normal leading-[121.4%] text-blue-200 hover:underline dark:text-blue-600 tablet:-mt-3 tablet:text-[20px]"
                    >
                      Get post ideas and earn FDX
                    </ScrollLink>
                  </div>
                  <h1 className="text-[16px] font-bold tablet:text-[24px]">Findings</h1>
                  <ol className="list-disc space-y-4">
                    {response?.data?.findings.map((item: { heading: string; content: string }, index: number) => (
                      <li key={index} className="ml-6 text-[12px] tablet:ml-10 tablet:text-[20px]">
                        <strong className="font-bold">{item.heading}:</strong> {item.content}
                      </li>
                    ))}
                  </ol>
                  <SourcePosts />
                  <SuggestedPosts />
                </div>
              </div>
            )
          )}
        </DashboardLayout>
      </div>
    </>
  );
}
