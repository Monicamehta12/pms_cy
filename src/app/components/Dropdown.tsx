import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Dropdown() {
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    return (
        <div className="relative inline-block text-left">
            <Menu as="div">
                <Menu.Button className="flex items-center text-white focus:outline-none">
                    <img src="images/p-img (2).jpg" alt="Profile" className="h-8 w-8 rounded-full" />
                    <ChevronDownIcon className="w-5 h-5 ml-2" />
                </Menu.Button>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white dark:bg-neutral-800 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            {/* <Menu.Item>
                                {({ active }) => (
                                    <Link href="/profile">
                                        <div className={`${active ? 'bg-gray-100 dark:bg-neutral-700' : ''} flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}>
                                            Profile
                                        </div>
                                    </Link>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <Link href="/settings">
                                        <div className={`${active ? 'bg-gray-100 dark:bg-neutral-700' : ''} flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}>
                                            Settings
                                        </div>
                                    </Link>
                                )}
                            </Menu.Item> */}
                            <Menu.Item>
                                {({ active }) => (
                                    <Link href="/">
                                        <div className={`${active ? 'bg-gray-100 dark:bg-neutral-700' : ''} flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                                            onClick={() => {handleLogout()}}>
                                            Logout
                                        </div>
                                    </Link>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    );
}
