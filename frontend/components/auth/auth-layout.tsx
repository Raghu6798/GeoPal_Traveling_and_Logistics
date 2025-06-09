"use client"

import { motion } from "framer-motion"
import { Navigation } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface AuthLayoutProps {
  children: React.ReactNode
  type: "login" | "register"
}

export function AuthLayout({ children, type }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Aurora Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-indigo-50/20 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-100/30 via-blue-50/10 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
      </div>

      {/* Blue Clouds */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-blue-200/20 to-indigo-200/20 backdrop-blur-sm"
            style={{
              width: Math.random() * 300 + 100,
              height: Math.random() * 100 + 50,
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              filter: "blur(20px)",
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 50 - 25],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-100"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-xl"
                whileHover={{ scale: 1.05 }}
              >
                <Navigation className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  GeoPal
                </h1>
                <p className="text-sm text-gray-600">Intelligent Travel Platform</p>
              </div>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 pt-20">
        {/* Left Column - Branding */}
        <div className="relative hidden h-full flex-col p-10 text-white lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-indigo-700/90" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <div className="bg-white/20 p-2 rounded-xl mr-3">
              <Navigation className="h-6 w-6" />
            </div>
            GeoPal
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                "GeoPal has revolutionized how I plan my travels. The AI-powered recommendations and route optimization are simply outstanding!"
              </p>
              <footer className="text-sm text-white/80">Sarah Chen, Travel Enthusiast</footer>
            </blockquote>
          </div>
        </div>

        {/* Right Column - Auth Form */}
        <div className="lg:p-8">
          <motion.div
            className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {children}

            {/* OAuth Buttons */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3">
              <Button
                variant="outline"
                className="w-[200px] bg-white hover:bg-gray-50 border border-gray-200 h-12 relative"
                onClick={() => {/* TODO: Implement Google OAuth */}}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
                    alt="Google"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
              </Button>
              <Button
                variant="outline"
                className="w-[200px] bg-white hover:bg-gray-50 border border-gray-200 h-12 relative"
                onClick={() => {/* TODO: Implement Microsoft OAuth */}}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="https://purepng.com/public/uploads/large/purepng.com-microsoft-logo-iconlogobrand-logoiconslogos-251519939091wmudn.png"
                    alt="Microsoft"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 