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

        {/* Replace mock-gpp-bundle.js with actual GPP-compliant consent provider */}
        <script src="/mock-gpp-bundle.js"></script>
      </body>
    </html>
  )
}
