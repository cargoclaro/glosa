import './styles/globals.css';
import {
  QueryClientProvider,
  ThemeComponent,
} from '@/shared/components/providers';
import { cn } from '@/shared/utils/cn';
import { esMX } from '@clerk/localizations';
import { ClerkProvider } from '@clerk/nextjs';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: {
    template: '%s | Cargo Claro',
    default: 'Cargo Claro',
  },
  description: 'Conectamos a Transfers con Agencias Aduanales.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning is used to prevent a warning in the console, delete after
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          'mx-auto min-h-screen w-full max-w-[1440px] bg-[#f8f9fd]',
          GeistSans.className
        )}
      >
        <ThemeComponent
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider localization={esMX}>
            <QueryClientProvider>{children}</QueryClientProvider>
          </ClerkProvider>
        </ThemeComponent>
      </body>
    </html>
  );
}
