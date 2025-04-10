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
      <Script
        src="https://run.confettipage.com/here.js"
        data-confetticode="U2FsdGVkX187KM4Zx1YXAsnt6AxUmpLjeruC9thTltw9aQh2fHvyO7j4np+1AiYPQVd6RC539cW4eXMWxIgS4pboc74XZFXiOFaVQ8jn2B2FOle2Sdz9vVbKFQOaz/Olx8W2CGon1L9uwgLAlkB4WKaaKI+kWuOF9wZly+szZtH0AsZbCjkL5lzGHix1NcriZetHNOJJjnHDR/XJerAosGwUkKdEBkU6bgE0BnpuRwTcKxD5L+dRKMsInKbLOLTV7aiDILZFrfy50EM5DcnvU60JXqSaqZxvQsmc5c2/W+ZCmHNdvMGmR8EyJCs5yjoi6EGLja/1KKGiaugZB0oVAGkdcBEHTYZtNt8QC9NA498dFAs0Cf52ZpLQddZgHs9AaNr7CGp4ddEa+p0td7gWa61UsJMlOnnSZVqKnNPtB8InJFh6Tt3DUb3bCP2bUakcH9BzgOk2M3IARtM2aE2V8cfytJArzxqna0Imm/7IjjTt1U9g4pLnr3MtiXGEH00vAK5J+UzGs8YB7IDC3XEHm1CwHljzj4CLcJPr2i74tv+Xu5pUrV9O46Q3RFN0vAvtcDFylrenjGfcuQFTjEpKUPk7jmCf+zzEK5rvTYPVkxYGluZmSQd+v/WDi9vttU8IJuam3b9+NLUJkqC8afndO3n+/jurY+AA8C5j7fUCoMdh2zQ5EjHpaHce+AmtcZgrkF2ajU+9cfbQOtweRp0B0UWPea9H+iDPr07e/CrIeJuL5uzZd59uMauht802VASH"
        strategy="afterInteractive"
      />
      <LaunchWrapper>
      <div className={`${poppins.variable} font-poppins`}>
        {children}
        <Toaster />
        <Footer />
        <WhatsAppFloatingButton />
      </div>
      </LaunchWrapper>
      
    </html>
  );
}