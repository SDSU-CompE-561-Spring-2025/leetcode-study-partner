'use client';

import Logo from '@/components/Logo';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LogIn, UserRoundPlus, ChevronDown } from 'lucide-react';
import { ThemeSwitcherButton } from '@/components/ThemeSwitcherButton';
import UserButton from '@/components/UserButton';
import { useState } from 'react';

const navList = [
  {
    label: 'Home',
    link: '/',
  },
  {
    label: 'Dashboard',
    link: '/dashboard',
  },
  {
    label: 'Matchmaking',
    link: '/matchmaking',
  },
  {
    label: 'About',
    link: '/about',
  },
];

function Navbar() {
  return (
    <div className="hidden border-separate border-b bg-background md:block">
      <nav className=" w-full max-w-screen-xl">
        <div className="flex h-[80px] items-center">
          <div className="flex-auto">
            <Logo />
          </div>
          
          <div className="flex-1/7 justify-center">
            <div className="flex items-center gap-x-8">
              {navList.map((item) => (
                <NavbarItem
                  key={item.label}
                  link={item.link}
                  label={item.label}
                />
              ))}
            </div>
          </div>
          <div className="absolute right-0 flex justify-end items-end gap-4 mx-3">
            <ThemeSwitcherButton />
            <UserButton />
          </div>
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
        {dropdownItems && (
          <button onClick={toggleDropdown} className="ml-1">
            <ChevronDown
              className={cn('h-5 w-5 text-muted-foreground', isOpen && 'rotate-180')}
            />
          </button>
        )}
      </div>

      {isActive && !dropdownItems && (
        <div className="absolute -bottom-[2px] left-1/2 hidden h-[5px] w-[80%] -translate-x-1/2 rounded-xl bg-amber-500 md:block" />
      )}

      {dropdownItems && isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg z-10">
          {dropdownItems.map((item) => (
            <Link
              key={item.label}
              href={item.link}
              className="block px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Navbar;