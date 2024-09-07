import { Link } from 'react-router-dom';

export default function AAParticipate({ questStartData }: { questStartData: any }) {
  return (
    <div className="absolute top-1/2 flex w-full -translate-y-1/2 justify-center">
      <p className="summary-text">
        {questStartData?.participantsCount ?? questStartData?.submitCounter} Participants -{' '}
        <Link to={'/direct-messaging'} state={questStartData} className="border-b border-blue-100 text-blue-100">
          Direct Message these Users
        </Link>
      </p>
    </div>
  );
}
