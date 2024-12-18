// src/app/layout.tsx

import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/navigation';
import { ProfileProvider } from '@/context/profile-context';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ProfileProvider>
          {children}
          <Navigation />
        </ProfileProvider>
      </body>
    </html>
  );
}
