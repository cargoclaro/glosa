'use client';
import { GlobeAlt, Square2x2 } from '@/shared/icons';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '~/lib/utils';

const Sidebar = () => {
  const pathname = usePathname();
  const isAnalysisPage = pathname.endsWith('analysis');

  return (
    <aside
      className={cn(
        '-translate-x-full fixed top-0 z-20 h-screen w-48 border-gray-100 border-r bg-white shadow-md transition-transform sm:translate-x-0',
        isAnalysisPage && 'hidden'
      )}
    >
      <div className="h-full overflow-y-auto">
        <div className="my-6 flex flex-col items-center justify-center px-3">
          <Link href="/home" className="transition-transform hover:scale-105">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/images/logo_transparente.png"
                alt="Cargo Claro Icon"
                width={35}
                height={30}
                className="h-auto object-contain"
                priority
              />
              <span className="font-semibold text-gray-800 text-lg">
                Cargo Claro
              </span>
            </div>
          </Link>
        </div>
        <ul className="mt-6 space-y-1 px-2">
          <li>
            <LinkComp to="/home" span="Administración" icon="home" />
          </li>
          <li>
            <LinkComp to="/gloss" span="Operaciones" icon="globe" />
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;

interface ILinkComp {
  to: string;
  span: string;
  icon: string;
}

const LinkComp = ({ to, span, icon }: ILinkComp) => {
  const pathname = usePathname();
  const isActive = pathname.startsWith(to);

  return (
    <Link href={to} className="group flex">
      <div
        className={cn(
          'flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 ease-in-out',
          isActive
            ? 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-600 shadow-sm'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        )}
      >
        <div className="flex h-6 w-6 items-center justify-center">
          {icon === 'home' ? (
            <Square2x2
              className={cn('h-5 w-5', isActive && 'text-orange-600')}
            />
          ) : (
            <GlobeAlt
              strokeWidth={1.5}
              className={cn('h-5 w-5', isActive && 'text-orange-600')}
            />
          )}
        </div>
        <span className="font-medium text-sm">{span}</span>
      </div>
    </Link>
  );
};
