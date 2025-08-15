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

        <script src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js" type="text/javascript" data-domain-script="0198ae37-ce9e-7da0-b98e-269bd00d6e36" />
      </body>
    </html>
  )
}
