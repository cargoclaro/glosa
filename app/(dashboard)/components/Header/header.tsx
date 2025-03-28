'use client';
import todayIs from '@/shared/utils/today-is';
import { MessageCircle } from 'lucide-react';
// import NotificationsMenu from "./NotificationsMenu";
import { usePathname } from 'next/navigation';
import { cn } from '~/lib/utils';
import ProfileMenu from './profile-menu';

const Header = () => {
  const pathname = usePathname();
  const isAnalysisPage = pathname.endsWith('analysis');

  const handleWhatsAppHelp = () => {
    window.open('https://wa.me/5215585788967', '_blank');
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-10 border-gray-100 border-b bg-white shadow-sm',
        isAnalysisPage && 'hidden'
      )}
    >
      <nav className="mx-auto max-w-7xl p-3 sm:ml-48">
        <ul className="flex w-full items-center justify-between">
          <li className="flex flex-col">
            <p className="font-semibold text-gray-800 text-lg">Bienvenido</p>
            <small className="text-gray-500 text-sm">
              {todayIs(new Date())}
            </small>
          </li>
          <li>
            <ul className="flex items-center gap-3">
              <li className="flex items-center">
                <button
                  onClick={handleWhatsAppHelp}
                  className="hover:-translate-y-0.5 flex transform items-center gap-1.5 rounded-full bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 font-medium text-sm text-white shadow-sm transition-all duration-300 ease-in-out hover:from-green-600 hover:to-green-700 hover:shadow-md"
                  aria-label="Ayuda por WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Ayuda</span>
                </button>
              </li>
              <li className="flex items-center">
                <div className="border-gray-200 border-l pl-2">
                  <ProfileMenu />
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
