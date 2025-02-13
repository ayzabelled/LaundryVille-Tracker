
import type { Metadata } from "next";
import { Montserrat } from 'next/font/google'
import "./globals.css";

const montserrat = Montserrat({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "LaundryVille LaundryStation",
  description: "Designed and Developed by Allana Yzabelle Diaz",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <body
        className={montserrat.className}
      >
        {children}
      </body>
    </html>
  )
}
