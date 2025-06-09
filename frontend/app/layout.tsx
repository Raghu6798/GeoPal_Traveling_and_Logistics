import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import MainNavbar from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GeoPal-Where your odyssey begins",
  description: "Plan your perfect trip with our AI-powered travel agent. Get personalized recommendations, real-time updates, and seamless booking experience.",
  icons: {
    icon: "https://cdn-user-icons.flaticon.com/203560/203560053/1749458190312.svg?token=exp=1749462162~hmac=1c1946c012d6bba51fa7e41d563443df",
    shortcut: "https://cdn-user-icons.flaticon.com/203560/203560053/1749458190312.svg?token=exp=1749462162~hmac=1c1946c012d6bba51fa7e41d563443df",
    apple: "https://cdn-user-icons.flaticon.com/203560/203560053/1749458190312.svg?token=exp=1749462162~hmac=1c1946c012d6bba51fa7e41d563443df",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <link
          rel="icon"
          type="image/svg+xml"
          href="https://cdn-user-icons.flaticon.com/203560/203560053/1749458190312.svg?token=exp=1749462162~hmac=1c1946c012d6bba51fa7e41d563443df"
        />
        <link
          rel="apple-touch-icon"
          href="https://cdn-user-icons.flaticon.com/203560/203560053/1749458190312.svg?token=exp=1749462162~hmac=1c1946c012d6bba51fa7e41d563443df"
        />
      </head>
      <body className={inter.className}>
        <MainNavbar />
        {children}
      </body>
    </html>
  )
}
