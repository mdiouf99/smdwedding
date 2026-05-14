import type { Metadata } from 'next';
import { Cormorant_Garamond, Italiana } from 'next/font/google';
import FloralSprite from '@/components/FloralSprite';
import RealisticFlowers from '@/components/RealisticFlowers';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const italiana = Italiana({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-italiana',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'S.M.D. & C.A.C. — 6 juin 2026',
  description: "S.M.D. & C.A.C. — Notre mariage le 6 juin 2026 à Sacré Cœur 3, Dakar, Sénégal.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${italiana.variable}`}>
      <body>
        <FloralSprite />
        <RealisticFlowers />
        {children}
      </body>
    </html>
  );
}
