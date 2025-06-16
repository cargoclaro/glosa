'use client';
import React from 'react';
import { HelpCircle } from 'lucide-react';
// import NotificationsMenu from "./NotificationsMenu";
import { usePathname } from 'next/navigation';
import { cn } from '../../../../lib/utils';
import { useClientDate } from '../../../shared/hooks';
import ProfileMenuWrapper from './profile-menu-wrapper';

const Header = () => {
  const pathname = usePathname();
  const isAnalysisPage = pathname.endsWith('analysis');
  const { currentDate, isMounted } = useClientDate();

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
              {isMounted ? currentDate : ''}
            </small>
          </li>
          <li>
            <ul className="flex items-center gap-3">
              <li className="flex items-center">
                <button
                  onClick={handleWhatsAppHelp}
                  className="inline-flex items-center gap-1.5 rounded-md border border-green-500 bg-white px-3 py-1.5 font-medium text-gray-700 text-sm shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  aria-label="Ayuda por WhatsApp"
                >
                  <span>Ayuda</span>
                  <HelpCircle className="ml-0.5 h-4 w-4" />
                </button>
              </li>
              <li className="flex items-center">
                <div className="border-gray-200 border-l pl-2">
                  <ProfileMenuWrapper />
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
