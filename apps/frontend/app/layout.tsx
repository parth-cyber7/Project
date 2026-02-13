import type { Metadata } from 'next';
import { Space_Grotesk, Source_Sans_3 } from 'next/font/google';
import { Header } from '@/components/Header';
import './globals.css';

const titleFont = Space_Grotesk({
  variable: '--font-title',
  subsets: ['latin']
});

const bodyFont = Source_Sans_3({
  variable: '--font-body',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'CommerceCraft',
  description: 'Enterprise-grade full-stack eCommerce platform'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${titleFont.variable} ${bodyFont.variable}`}>
      <body className="font-[var(--font-body)]">
        <Header />
        <main className="mx-auto min-h-[calc(100vh-73px)] max-w-7xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
