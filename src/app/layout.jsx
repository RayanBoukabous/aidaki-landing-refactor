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
})

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${poppins.variable} ${cairo.variable} font-poppins antialiased`}>
        {children}
      </body>
    </html>
  )
}