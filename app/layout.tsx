import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Azure AI — Enterprise AI Image Generator Studio & Admin Panel',
  description:
    'Production-ready AI image generation platform built with Next.js, Prisma, Framer Motion, and Azure Cloud integrations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-purple-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
