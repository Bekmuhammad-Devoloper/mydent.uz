import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'BookMed - Tibbiy navbat tizimi',
  description: 'Online tibbiy navbat olish tizimi',
  icons: {
    icon: '/logo.PNG',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
