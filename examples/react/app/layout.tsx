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

        <script src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js" type="text/javascript" data-domain-script="01985d0a-1347-7874-a68a-836a25dab7de" />
      </body>
    </html>
  )
}
