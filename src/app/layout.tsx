import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Aarush Inamdar | Web-OS Portfolio',
  description:
    'Senior-level portfolio — a cyber-brutalist Web-OS showcasing systems engineering at Adobe, mobile development at Apple, and AI backend at Series.so.',
  keywords: ['portfolio', 'software engineer', 'Adobe', 'Apple', 'C++', 'SwiftUI', 'React', 'AI'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-kernel-black text-white font-inter antialiased">
        {children}
      </body>
    </html>
  );
}
