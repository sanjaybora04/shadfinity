import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shadfinity: Advance components for shadcn",
  description: "Get Advance components for shadcn",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!),
  openGraph:{
    images: '/images/thumbnail.png'
  },
  twitter:{
    card: "summary_large_image",
    images: '/images/thumbnail.png'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <script dangerouslySetInnerHTML={{
          __html: `
          (function(w,d,s,l,i){w[l] = w[l] || [];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GOOGLE_TAG}');
        `}} />
        {/* End Google Tag Manager */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="favicon" href="/favicon.ico" />
        <link rel='apple-touch-icon' href='/favicon.ico' />
        {/* Adsense */}
        <meta name="google-adsense-account" content="ca-pub-1622367531310821"></meta>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1622367531310821"
          crossOrigin='anonymous'
          strategy='lazyOnload'
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript><iframe src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GOOGLE_TAG}`}
          height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe></noscript>
        {/* End Google Tag Manager (noscript) */}
        <Providers>
        {children}
        </Providers>
      </body>
    </html>
  );
}
