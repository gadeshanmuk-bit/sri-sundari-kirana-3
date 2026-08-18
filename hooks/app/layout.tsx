import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { CartProvider } from '@/lib/cart-context';
import { Toaster } from '@/components/ui/sonner';
 import'./globals.css'

const geist = Geist({ 
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({ 
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'Sri Sundari Kirana & General Stores | Rajamahendravaram',
  description: 'Your trusted local grocery store in Rajamahendravaram, Andhra Pradesh. Fresh groceries, daily essentials, and home delivery available. Quality products at best prices.',
  keywords: ['grocery store', 'kirana store', 'Rajamahendravaram', 'Andhra Pradesh', 'home delivery', 'daily essentials', 'Sri Sundari'],
  authors: [{ name: 'Sri Sundari Kirana & General Stores' }],
  openGraph: {
    title: 'Sri Sundari Kirana & General Stores',
    description: 'Your trusted local grocery store in Rajamahendravaram with home delivery',
    type: 'website',
    locale: 'en_IN',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#c4500a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} bg-background`}>
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased min-h-screen">
        <CartProvider>
          {children}
          <Toaster position="top-center" richColors />
        </CartProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
