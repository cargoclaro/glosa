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
        '-translate-x-full fixed top-0 z-20 h-screen w-48 bg-[#F1F5F9] transition-transform sm:translate-x-0',
        isAnalysisPage && 'hidden'
      )}
    >
      <div className="h-full overflow-y-auto">
        <div className="flex flex-col items-center justify-center my-6 px-3">
          <div className="flex items-center gap-2">
            <Image
              src="/assets/images/logo_transparente.png"
              alt="Cargo Claro Icon"
              width={35}
              height={30}
              className="object-contain h-auto"
              priority
            />
            <span className="text-lg font-semibold text-gray-800">Cargo Claro</span>
          </div>
        </div>
        <ul className="space-y-2">
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
    <Link href={to} className="group flex gap-1">
      <div
        className={cn(
          'h-auto w-1 rounded-e-3xl group-hover:bg-primary',
          isActive && 'bg-primary'
        )}
      />
      <div
        className={cn(
          'flex w-full gap-2 px-4 py-2 group-hover:bg-primary/30',
          isActive && 'bg-primary/30'
        )}
      >
        {icon === 'home' ? <Square2x2 /> : <GlobeAlt strokeWidth={1} />}
        <span>{span}</span>
      </div>
    </Link>
  );
};
