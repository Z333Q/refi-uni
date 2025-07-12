import './globals.css'
import { Providers } from './providers'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'ReFinity Dashboard',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0E1117] text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
