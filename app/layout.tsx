
import type { Metadata } from 'next';
import './globals.css';
// import { AppShell } from 'C:/Users/User/Downloads/src/components/layout/AppShell';
import { AppShell } from '../components/layout/AppShell';
import { Inter } from 'next/font/google';
// import { Toaster } from "C:/Users/User/Downloads/src/components/ui/toaster";
import { Toaster } from '../components/ui/toaster';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AYA Admin Center',
  description: 'Admin dashboard for AYA AI Sales Assistant',
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <AppShell>{children}</AppShell>
        <Toaster />
      </body>
    </html>
  );
}
