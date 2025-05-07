'use client';

import { useSession, signOut } from 'next-auth/react';
import Logo from '@/components/Navigation/Logo';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ThemeSwitcherButton } from '@/components/theme-switcher-button';
// import UserButton from '@/components/user-button';
import { useState } from 'react';

const navList = [
  { label: 'Home', link: '/' },
  { label: 'Dashboard', link: '/dashboard' },
  { label: 'Matchmaking', link: '/matchmaking' },
  { label: 'About', link: '/about' },
];

function Navbar() {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="hidden border-separate border-b bg-background md:block">
      <nav className="flex items-center justify-between h-[80px] px-8 w-full max-w-screen-xl mx-auto">
        <div className="flex items-center gap-x-4">
          <Logo />
        </div>

        <div className="flex items-center justify-center flex-1 gap-x-6">
          {navList.map((item) => (
            <NavbarItem key={item.label} link={item.link} label={item.label} />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeSwitcherButton />
          {session ? (
            <div className="transform translate-y-[-8px]">
              <Button onClick={handleLogout} variant="outline">
                Log out
              </Button>
            </div>
          ) : (
            <>
              <Button asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}

interface NavbarItemProps {
  link: string;
  label: string;
  dropdownItems?: { label: string; link: string }[];
  clickCallBack?: () => void;
}

function NavbarItem({ link, label, dropdownItems, clickCallBack }: NavbarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === link;
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative flex items-center">
      <div className="flex items-center">
        <Link
          href={dropdownItems ? '#' : link}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'text-lg text-muted-foreground hover:text-foreground',
            isActive && 'text-amber-500'
          )}
          onClick={() => {
            if (dropdownItems) {
              toggleDropdown();
            } else if (clickCallBack) {
              clickCallBack();
            }
          }}
        >
          {label}
        </Link>
      </div>
      {isActive && !dropdownItems && (
        <div className="absolute -bottom-[2px] left-1/2 hidden h-[5px] w-[80%] -translate-x-1/2 rounded-xl bg-amber-500 md:block" />
      )}
    </div>
  );
}

export default Navbar;