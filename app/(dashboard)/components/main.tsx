'use client';

import { usePathname } from 'next/navigation';
import { cn } from '~/lib/utils';

const Main = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isAnalysisPage = pathname.endsWith('analysis');
  return (
    <main className={cn('p-4', !isAnalysisPage && 'sm:ml-48 ')}>
      {children}
    </main>
  );
};

export default Main;
