import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import { Header } from '@/components/Header'
import './globals.css'

const roboto = Roboto({ weight: "400", subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'App'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Header />
        {children}
      </body>
    </html>
  )
}
