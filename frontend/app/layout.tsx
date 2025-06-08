import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TravelAI - Intelligent Travel Platform | AI-Powered Route Optimization",
  description:
    "Transform your travel planning with TravelAI's AI-powered platform. Optimize routes, discover POIs, and plan perfect trips with advanced algorithms and real-time intelligence.",
  keywords: "travel AI, route optimization, travel planning, AI travel assistant, smart routing, travel intelligence",
  authors: [{ name: "TravelAI Team" }],
  creator: "TravelAI",
  publisher: "TravelAI",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://travelai.com",
    title: "TravelAI - Intelligent Travel Platform",
    description: "AI-powered travel optimization and intelligent route planning for smarter journeys.",
    siteName: "TravelAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "TravelAI - Intelligent Travel Platform",
    description: "AI-powered travel optimization and intelligent route planning for smarter journeys.",
    creator: "@travelai",
  },
    generator: 'v0.dev'
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
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
