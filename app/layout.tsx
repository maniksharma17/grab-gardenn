import './globals.css';
import { Poppins } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import { Footer } from '@/components/Footer';
import { WhatsAppFloatingButton } from '@/components/FloatingWhatsappIcon';
import Script from 'next/script';
import { Metadata } from 'next';
import LaunchWrapper from '@/components/LaunchWrapper';

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'GrabGardenn - Live Now!',
  description: 'Healthy & Natural Foods',
  icons: {
    icon: '/grab-gardenn-logo.png', // <-- make sure this exists in /public
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>
      <div className={`${poppins.variable} font-poppins`}>
        {children}
        <Toaster />
        <Footer />
        <WhatsAppFloatingButton />
      </div>
      
    </html>
  );
}