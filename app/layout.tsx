"use client"
import './globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import { Footer } from '@/components/Footer';
import { RecoilRoot } from 'recoil';

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RecoilRoot>
    <html lang="en">
      <body className={`${poppins.variable} font-poppins`}>
        {children}
        <Toaster />
        <Footer />
      </body>
    </html>
    </RecoilRoot>
  );
}