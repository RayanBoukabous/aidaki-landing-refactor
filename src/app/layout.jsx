import { Poppins, Cairo } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})

export default function RootLayout({ children }) {
  return (
    <html>
      <body className={`${poppins.variable} ${cairo.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}