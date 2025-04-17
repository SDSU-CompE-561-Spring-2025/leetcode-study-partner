'use client';

import Logo from '@/components/Logo';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const user = null; // Replace with actual user data
const isLoggedIn = !!user;

const navList = [
	{
		label: 'Dashboard',
		link: '/dashboard',
	},
	{
		label: 'Match',
		link: '/match',
	},
	{
		label: 'About',
		link: '/about',
	},
];

function Navbar() {
	const pathname = usePathname();
	// const isActive = pathname === '/';

	return (
		<nav className='flex h-[80px] items-center justify-between border-b px-8' style={{ backgroundColor: 'oklch(70.5% 0.213 47.604)' }} >
			<Logo />
			<div className='flex gap-x-6 absolute left-1/2 -translate-x-1/2 text-white'>
				{navList.map((item) => (
					<NavbarItem 
						key={item.label} 
						link={item.link} 
						label={item.label} 
					/>
				))}
			</div>
			<NavbarItem link='/sign-in' label='Sign In' withIcon />
    	</nav>
	);
}

interface NavbarItemProps {
	link: string;
	label: string;
	withIcon?: boolean;
	clickCallBack?: () => void;
}

function NavbarItem({ link, label, clickCallBack }: NavbarItemProps) {
	const pathname = usePathname();
	const isActive = pathname === link;
	return (
		<>
			<div className="relative flex items-center">
				<Link
					href={link}
					className={cn(
						buttonVariants({ variant: 'ghost' }),
						'w-full justify-start text-lg text-white hover:text-black',
						isActive && 'text-white'
					)}
					onClick={() => {
						if (clickCallBack) clickCallBack();
					}}
				>
					{label}
				</Link>
				{isActive && (
					<div className="absolute -bottom-[2px] left-1/2 hidden h-[5px] w-[80%] -translate-x-1/2 rounded-xl bg-white md:block" />
				)}
			</div>
		</>
	);
}

export default Navbar;
