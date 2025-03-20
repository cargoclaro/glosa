'use client';

import { cn } from '@/shared/utils/cn';
import todayIs from '@/shared/utils/today-is';
// import NotificationsMenu from "./NotificationsMenu";
import { usePathname } from 'next/navigation';
import ProfileMenu from './ProfileMenu';

const Header = () => {
  const pathname = usePathname();
  const isAnalysisPage = pathname.endsWith('analysis');
  return (
    <header
      className={cn(
        'sticky top-0 z-10 bg-[#f8f9fd]',
        isAnalysisPage && 'hidden'
      )}
    >
      <nav className="p-4 sm:ml-48">
        <ul className="flex w-full items-center justify-between gap-4">
          <li className="flex flex-col gap-0">
            <p className="font-semibold">Bienvenido</p>
            <small className="text-gray-500">{todayIs(new Date())}</small>
          </li>
          <li>
            <ul className="flex gap-4">
              {/* <li className="flex items-center">
                <NotificationsMenu notifications={notifications} />
              </li> */}
              <li className="flex items-center gap-2">
                <ProfileMenu />
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
