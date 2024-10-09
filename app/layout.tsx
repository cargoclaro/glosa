import "./globals.css";
import { cn } from "@/app/utils/cn";
import { GeistSans } from "geist/font/sans";
import { ThemeComponent } from "@/app/components";
import type { Metadata } from "next";

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
      <body suppressHydrationWarning className={cn(GeistSans.className)}>
        <ThemeComponent
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="w-full min-h-screen max-w-[1440px] mx-auto">
            {children}
          </main>
        </ThemeComponent>
      </body>
    </html>
  );
}
