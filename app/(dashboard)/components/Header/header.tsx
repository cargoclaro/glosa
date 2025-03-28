'use client';

import React from 'react';
import todayIs from '@/shared/utils/today-is';
// import NotificationsMenu from "./NotificationsMenu";
import { usePathname } from 'next/navigation';
import { cn } from '~/lib/utils';
import ProfileMenu from './profile-menu';
import { MessageCircle } from 'lucide-react';

const Header = () => {
  const pathname = usePathname();
  const isAnalysisPage = pathname.endsWith('analysis');
  
  const handleWhatsAppHelp = () => {
    window.open('https://wa.me/5215585788967', '_blank');
  };
  
  return (
    <header
      className={cn(
        'sticky top-0 z-10 bg-white shadow-sm border-b border-gray-100',
        isAnalysisPage && 'hidden'
      )}
    >
      <nav className="p-3 sm:ml-48 max-w-7xl mx-auto">
        <ul className="flex w-full items-center justify-between">
          <li className="flex flex-col">
            <p className="font-semibold text-gray-800 text-lg">Bienvenido</p>
            <small className="text-gray-500 text-sm">{todayIs(new Date())}</small>
          </li>
          <li>
            <ul className="flex items-center gap-3">
              <li className="flex items-center">
                <button
                  onClick={handleWhatsAppHelp}
                  className="flex items-center gap-1.5 text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-300 ease-in-out rounded-full px-4 py-2 text-sm font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                  aria-label="Ayuda por WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Ayuda</span>
                </button>
              </li>
              <li className="flex items-center">
                <div className="pl-2 border-l border-gray-200">
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
