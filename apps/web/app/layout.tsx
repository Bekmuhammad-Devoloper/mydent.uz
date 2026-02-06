import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'MedBook - Tibbiy navbat tizimi',
  description: 'Online tibbiy navbat olish tizimi',
  icons: {
    icon: '/logo.PNG',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
