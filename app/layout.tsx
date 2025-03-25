import './globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import { Footer } from '@/components/Footer';

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Organic Haven - Natural & Organic Products',
  description: 'Your one-stop shop for premium organic products',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      
      <body className={`${poppins.variable} font-poppins`}>
        {children}
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}