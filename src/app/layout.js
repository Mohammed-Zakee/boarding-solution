import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Boarding Solution - Find Your Perfect Student Housing in Sri Lanka",
  description: "Find verified boarding houses, apartments, and roommates near SLIIT, University of Colombo, and other universities in Sri Lanka. Safe, affordable student accommodation with real reviews.",
  keywords: "boarding houses Sri Lanka, student accommodation, rooms for rent, SLIIT boarding, University of Colombo housing, roommate finder, student housing",
  authors: [{ name: "Boarding Solution" }],
  creator: "Boarding Solution",
  publisher: "Boarding Solution",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://boarding-solution.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Boarding Solution - Find Your Perfect Student Housing",
    description: "Discover safe and affordable boarding houses near your university in Sri Lanka",
    url: 'https://boarding-solution.vercel.app',
    siteName: 'Boarding Solution',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Boarding Solution - Student Housing Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Boarding Solution - Find Your Perfect Student Housing',
    description: 'Safe, verified boarding houses near universities in Sri Lanka',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes later
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
