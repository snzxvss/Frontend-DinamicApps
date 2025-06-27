import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Citas Médicas',
  description: 'Created by DinamicApps',
  generator: 'Camilo Sanz',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
