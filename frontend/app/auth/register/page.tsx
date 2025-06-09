"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { AuthLayout } from "@/components/auth/auth-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ModalProvider, useModal } from "@/components/ui/modal"
import { Mail } from "lucide-react"
import Link from "next/link"

function RegisterForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { showModal } = useModal()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      if (data?.user?.identities?.length === 0) {
        setError("An account with this email already exists")
        return
      }

      // Show success modal
      showModal({
        title: "Registration Successful!",
        description: "We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.",
        icon: <Mail className="w-8 h-8 text-green-600" />,
      })
      
      // Redirect to verify email page after modal is closed
      setTimeout(() => {
        router.push("/auth/verify-email")
      }, 500)
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred during registration")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout type="register">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Create an account
        </h1>
        <p className="text-sm text-gray-700">
          Enter your details to get started with GeoPal
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-900">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white/50 backdrop-blur-sm border-green-100 focus:border-green-500 focus:ring-green-500 text-gray-900 placeholder:text-gray-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-900">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-white/50 backdrop-blur-sm border-green-100 focus:border-green-500 focus:ring-green-500 text-gray-900 placeholder:text-gray-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-gray-900">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="bg-white/50 backdrop-blur-sm border-green-100 focus:border-green-500 focus:ring-green-500 text-gray-900 placeholder:text-gray-500"
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <div className="text-center text-sm">
        <span className="text-gray-700">Already have an account? </span>
        <Link
          href="/auth/login"
          className="text-green-700 hover:text-green-800 font-medium"
        >
          Sign in
        </Link>
      </div>
    </AuthLayout>
  )
}

export default function RegisterPage() {
  return (
    <ModalProvider>
      <RegisterForm />
    </ModalProvider>
  )
} 