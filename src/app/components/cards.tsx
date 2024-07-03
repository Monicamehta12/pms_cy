import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
  TrashIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export interface User {
  userId: string;
  firstname: string;
}

interface CardProps {
  projectId: string;
  projectName: string;
  projectManager: string;
  startDate: string;
  status: string;
  userCategory: string | null | undefined; // Add userCategory prop
  users: User[]; // Add users prop
  onDelete?: () => void; // onDelete function type
}

function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

const getStatusBgColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'complete':
      return 'bg-green-600';
    case 'not complete':
      return 'bg-red-600';
    case 'on going':
      return 'bg-sky-500';
    case 'on hold':
      return 'bg-yellow-500';
    default:
      return 'bg-gray-300'; // default color if status is unknown
  }
};

export default function Card({
  projectId,
  projectName,
  projectManager,
  startDate,
  status,
  userCategory,
  users,
  onDelete
}: CardProps) {

  return (
    // <div className="rounded-xl bg-neutral-700 p-3 shadow-sm md:w-[24%] w-full h-[220px] flex flex-col justify-between mr-3 mb-3">
    <Link href={{
      pathname: `/projects/${projectId}`,
      query: { users: encodeURIComponent(JSON.stringify(users)) }
    }} className="rounded-xl bg-neutral-700 p-3 shadow-sm md:w-[24%] w-full h-[220px] flex flex-col justify-between mr-3 mb-3">
        <div className="">
          <h2 className="">{projectName}</h2>
        </div>
        <div>
          <p className='text-sm font-medium'>Project Manager: {projectManager}</p>
          <div className='text-sm font-medium'>Start Date: {formatDate(startDate)}</div>
          <div className='flex justify-between align-center mt-2 text-sm font-medium'>
            <div className={`border-0 rounded-full px-4 py-2 text-center ${getStatusBgColor(status)}`}>{status}</div>
            {userCategory === 'mentor' ? ( // Render delete icon if userCategory is mentor and onDelete function is provided
              <div className='flex self-center'>
                <TrashIcon className="h-[25px] text-red-500" onClick={onDelete} />
              </div>
            ) : ""}
          </div>
        </div>
      </Link>
    // </div>
  );
}
