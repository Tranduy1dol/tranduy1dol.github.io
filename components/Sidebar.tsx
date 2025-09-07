import Image from 'next/image';
import { FaGithub, FaTwitter } from 'react-icons/fa';

const Sidebar = () => {
    return (
        <div className="space-y-8">
            {/* Profile Card */}
            <div className="p-4 bg-white dark:bg-neutral-800 rounded-2xl text-center">
                <Image
                    src="/profile.png" // NOTE: Add a profile picture to your `public` folder
                    alt="Profile Picture"
                    width={96}
                    height={96}
                    className="rounded-full mx-auto mb-4"
                />
                <h3 className="font-bold text-lg text-black dark:text-white">Lorem Ipsum</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    consectetur adipiscing elit, sed do eiusmod tempor.
                </p>
                <div className="flex justify-center space-x-4 mt-4">
                    <a href="#" aria-label="GitHub"><FaGithub className="text-neutral-500 hover:text-black dark:hover:text-white" size={24}/></a>
                    <a href="#" aria-label="Twitter"><FaTwitter className="text-neutral-500 hover:text-blue-400" size={24}/></a>
                </div>
            </div>

            {/* Categories Card */}
            <div className="p-4 bg-white dark:bg-neutral-800 rounded-2xl">
                <h3 className="font-bold mb-2 text-black dark:text-white">Categories</h3>
                <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-300">
                    <li className="flex justify-between items-center">
                        <a href="#" className="hover:text-fuchsia-500">Examples</a>
                        <span className="bg-neutral-200 dark:bg-neutral-700 text-xs px-2 py-1 rounded-full">4</span>
                    </li>
                    <li className="flex justify-between items-center">
                        <a href="#" className="hover:text-fuchsia-500">Guides</a>
                        <span className="bg-neutral-200 dark:bg-neutral-700 text-xs px-2 py-1 rounded-full">1</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;