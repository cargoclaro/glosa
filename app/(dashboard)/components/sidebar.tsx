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
        '-translate-x-full fixed top-0 z-20 h-screen w-48 bg-white transition-transform sm:translate-x-0',
        isAnalysisPage && 'hidden'
      )}
    >
      <div className="h-full overflow-y-auto">
        <div className="my-10 size-auto pr-10">
          <Image
            src="/assets/images/logo.webp"
            alt="Cargo Claro Logo"
            width={100}
            height={100}
            className="size-full"
            priority
          />
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
