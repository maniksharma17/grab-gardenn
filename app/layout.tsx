import "./globals.css";
import { Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { Footer } from "@/components/Footer";
import { WhatsAppFloatingButton } from "@/components/FloatingWhatsappIcon";
import Script from "next/script";
import { Metadata } from "next";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "GrabGardenn - Live Now!",
  description: "Healthy & Natural Foods",
  icons: {
    icon: "/logo.jpeg",
  },
  openGraph: {
    title: "GrabGardenn - Live Now!",
    description: "Healthy & Natural Foods",
    url: "https://grabgardenn.com",
    siteName: "GrabGardenn",
    images: [
      {
        url: "https://grabgardenn.com/new-logo.png",
        width: 1200,
        height: 630,
        alt: "GrabGardenn Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GrabGardenn - Live Now!",
    description: "Healthy & Natural Foods",
    images: ["https://grabgardenn.com/new-logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} font-poppins`}>
      <head>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://accounts.google.com/gsi/client"
          async
          defer
          strategy="afterInteractive"
        />
        <Script
          id="facebook-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1183556200279073');
fbq('track', 'PageView');

            `,
          }}
        />
      </head>
      <body>
        <div className={`${poppins.variable} font-poppins`}>
          {children}
          <Toaster />
          <Footer />
          <WhatsAppFloatingButton />
        </div>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            alt="img"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1183556200279073&ev=PageView&noscript=1"
          />
        </noscript>
      </body>
    </html>
  );
}
