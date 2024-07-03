'use client';

import {
    UserGroupIcon,
    HomeIcon,
    DocumentDuplicateIcon,
    Squares2X2Icon,
    SquaresPlusIcon
  } from '@heroicons/react/24/outline';
  import Link from 'next/link';
  import { usePathname } from 'next/navigation';
  import clsx from 'clsx';

const links = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    {
      name: 'Projects',
      href: '/projects',
      icon: Squares2X2Icon,
    },
    { name: 'AddProjects', href: '/projects/addProject', icon: SquaresPlusIcon },
  ];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="ml-2 mb-2 w-full md:w-64 bg-neutral-800 rounded border border-neutral-600">
            {links.map((link) => {
                const LinkIcon = link.icon;
                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={clsx(
                            'flex h-[48px] grow items-center justify-center gap-2 p-3 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3',
                            {
                                'bg-neutral-100 text-neutral-600': pathname === link.href,
                            },
                        )}
                    >
                        <LinkIcon className="w-6" />
                        <p className="hidden md:block">{link.name}</p>
                    </Link>
                );
            })}
        </div>
    )
}