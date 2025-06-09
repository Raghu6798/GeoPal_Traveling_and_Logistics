"use client"

import { motion } from "framer-motion"
import { Mail } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AuthLayout } from "@/components/auth/auth-layout"

export default function VerifyEmailPage() {
  return (
    <AuthLayout type="register">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center space-y-6"
      >
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <Mail className="w-8 h-8 text-green-600" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Check your email
          </h1>
          <p className="text-sm text-gray-700 max-w-sm">
            We've sent you a verification link to your email address. Please check your inbox and click the link to verify your account.
          </p>
        </div>

        <div className="space-y-4 w-full">
          <div className="text-sm text-gray-700 space-y-2">
            <p>Didn't receive the email?</p>
            <ul className="list-disc list-inside space-y-1 text-left">
              <li>Check your spam folder</li>
              <li>Make sure the email address is correct</li>
              <li>Wait a few minutes and try again</li>
            </ul>
          </div>

          <div className="flex flex-col space-y-3">
            <Button
              variant="outline"
              className="w-full bg-white hover:bg-gray-50"
              onClick={() => window.location.reload()}
            >
              Resend verification email
            </Button>
            <Link href="/auth/login" className="w-full">
              <Button
                variant="ghost"
                className="w-full text-green-700 hover:text-green-800 hover:bg-green-50"
              >
                Back to login
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </AuthLayout>
  )
} 