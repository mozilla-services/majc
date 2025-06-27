import type { Metadata } from "next"
import "./globals.css"

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: "Example Article with Ads",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
