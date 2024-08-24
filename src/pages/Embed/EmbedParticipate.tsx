import { useLocation } from 'react-router-dom';

export default function EmbedParticipate({ postProperties }: { postProperties: string }) {
  const location = useLocation();
  const match = location.pathname.match(/\/embed\/([^\/]+)/);

  return (
    <>
      {postProperties === 'Embed' ? (
        <div className="flex w-full justify-center">
          {match && (
            <a
              href={`https://localhost:5173/p/${match[1]}`}
              target="_blank"
              className="cursor-pointer text-[14px] font-normal leading-[121.4%] text-blue-200 hover:underline dark:text-blue-600 tablet:text-[20px]"
            >
              Click to participate
            </a>
          )}
        </div>
      ) : null}
    </>
  );
}
