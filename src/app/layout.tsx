import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://www.arfurniture.co.in'),
  title: 'AR FURNITURE | Premium Furniture in Vadodara',
  description: 'Discover stylish, comfortable and quality furniture for your home and workspace. Customisation available. Located in Vadodara, Gujarat.',
  keywords: 'furniture shop in Vadodara, furniture in Vadodara, sofa in Vadodara, sofa cum bed in Vadodara, home furniture Vadodara, premium furniture Vadodara, custom furniture Vadodara, furniture showroom Vadodara',
  openGraph: {
    title: 'AR FURNITURE | Premium Furniture in Vadodara',
    description: 'Discover stylish, comfortable and quality furniture for your home and workspace.',
    url: 'https://www.arfurniture.co.in',
    siteName: 'AR FURNITURE',
    locale: 'en_IN',
    type: 'website',
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
        {/* <Toaster /> if using toaster */}
      </body>
    </html>
  )
}
