import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Blog | Sankumsek',
  description: 'Personal blog by Sankumsek',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
