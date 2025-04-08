"use client"
import './globals.css';
import { Poppins } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import { Footer } from '@/components/Footer';
import { RecoilRoot } from 'recoil';
import { WhatsAppFloatingButton } from '@/components/FloatingWhatsappIcon';
import Head from 'next/head';
import Script from 'next/script';

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
      <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>
      <body className={`${poppins.variable} font-poppins`}>
        {children}
        <Toaster />
        <Footer />
        <WhatsAppFloatingButton />
      </body>
    </html>
    </RecoilRoot>
  );
}