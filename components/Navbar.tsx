import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    return (
        <nav className="bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="font-bold text-xl text-fuchsia-500">
                            FuwaFuwa
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link href="/" className="text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white">Home</Link>
                        <Link href="#" className="text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white">About</Link>
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;