import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://arfurniture.co.in'),
  title: {
    default: 'AR FURNITURE | Premium Furniture in Vadodara',
    template: '%s | AR FURNITURE'
  },
  description: 'Discover stylish, bespoke and quality furniture for your home and workspace. Customisation available. Located in Vadodara, Gujarat.',
  keywords: [
    'furniture shop in Vadodara',
    'furniture in Vadodara',
    'sofa in Vadodara',
    'sofa cum bed in Vadodara',
    'home furniture Vadodara',
    'premium furniture Vadodara',
    'custom furniture Vadodara',
    'furniture showroom Vadodara'
  ],
  authors: [{ name: 'AR FURNITURE' }],
  creator: 'AR FURNITURE',
  publisher: 'AR FURNITURE',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://arfurniture.co.in',
  },
  openGraph: {
    title: 'AR FURNITURE | Premium Furniture in Vadodara',
    description: 'Discover stylish, comfortable and quality furniture for your home and workspace. Custom furniture manufactured in Vadodara, Gujarat.',
    url: 'https://arfurniture.co.in',
    siteName: 'AR FURNITURE',
    images: [
      {
        url: 'https://arfurniture.co.in/home_hero.webp',
        width: 1200,
        height: 630,
        alt: 'AR FURNITURE Vadodara',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AR FURNITURE | Premium Furniture in Vadodara',
    description: 'Discover stylish, comfortable and quality custom furniture in Vadodara.',
    images: ['https://arfurniture.co.in/home_hero.webp'],
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
