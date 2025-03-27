import './styles/globals.css';
import {
  QueryClientProvider,
  ThemeComponent,
} from '@/shared/components/providers';
import { esMX } from '@clerk/localizations';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { cn } from '~/lib/utils';

// Initialize Inter font
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Ensures text remains visible during font loading
  variable: '--font-inter', // Optional: for use in CSS variables
});

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
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body
        suppressHydrationWarning
        className={cn(
          'mx-auto min-h-screen w-full max-w-[1440px] bg-[#f8f9fd]',
          inter.className
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
