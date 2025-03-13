import "./styles/globals.css";
import { cn } from "@/app/shared/utils/cn";
import { GeistSans } from "geist/font/sans";
import { ThemeComponent } from "@/app/shared/components";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { esMX } from '@clerk/localizations'

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    template: "%s | Cargo Claro",
    default: "Cargo Claro",
  },
  description: "Conectamos a Transfers con Agencias Aduanales.",
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
          "bg-[#f8f9fd] w-full min-h-screen max-w-[1440px] mx-auto",
          GeistSans.className
        )}
      >
        <ThemeComponent
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider localization={esMX}>{children}</ClerkProvider>
        </ThemeComponent>
      </body>
    </html>
  );
}
