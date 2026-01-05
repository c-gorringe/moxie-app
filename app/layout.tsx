import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MOXIE - Sales Tracker',
  description: 'Track your sales performance and compete with your team',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#4F46E5',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
