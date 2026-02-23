import type { Metadata, Viewport } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: "Sanjeev Sekar's Blog",
    template: "%s | Sanjeev Sekar's Blog",
  },
  description: 'Personal blog by Sanjeev Sekar - thoughts on software engineering, technology, and more.',
  keywords: ['blog', 'software engineering', 'technology', 'programming', 'web development'],
  authors: [{ name: 'Sanjeev Sekar' }],
  creator: 'Sanjeev Sekar',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://blog.sankumsek.bio',
    siteName: "Sanjeev Sekar's Blog",
    title: "Sanjeev Sekar's Blog",
    description: 'Personal blog by Sanjeev Sekar - thoughts on software engineering, technology, and more.',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Sanjeev Sekar's Blog",
    description: 'Personal blog by Sanjeev Sekar - thoughts on software engineering, technology, and more.',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Header title="Sanjeev Sekar's Blog" />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
