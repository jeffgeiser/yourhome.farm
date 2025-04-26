"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSupabase } from '@/components/supabase-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Leaf, Loader2 } from 'lucide-react'
import { Alert } from '@/components/ui/alert'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const { signIn } = useSupabase()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)
    
    try {
      const { error } = await signIn(email, password)
      if (error) {
        if (error.message === 'Email not confirmed') {
          setError('Please check your email and confirm your account before logging in.')
        } else {
          setError('Invalid email or password')
        }
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendConfirmation = async () => {
    if (!email) {
      setError('Please enter your email address')
      return
    }

    setResending(true)
    setError(null)
    setMessage(null)

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      })

      if (error) {
        setError('Error sending confirmation email. Please try again.')
      } else {
        setMessage('Confirmation email sent! Please check your inbox.')
      }
    } catch (error) {
      console.error('Resend error:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#F0F2F5] p-4">
      <Card className="w-full max-w-[400px] shadow-md rounded-[10px]">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Leaf className="h-12 w-12 text-[#4CAF50]" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="text-sm">
                {error}
                {error.includes('confirm') && (
                  <Button
                    variant="link"
                    className="p-0 h-auto font-normal text-sm underline text-destructive-foreground hover:text-destructive-foreground/90"
                    onClick={handleResendConfirmation}
                    disabled={resending}
                  >
                    {resending ? 'Sending...' : 'Resend confirmation email'}
                  </Button>
                )}
              </Alert>
            )}
            {message && (
              <Alert className="text-sm bg-green-50 text-green-800 border-green-200">
                {message}
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#007BFF] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-[#007BFF] hover:bg-blue-700 text-white font-bold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Log in'
              )}
            </Button>
            <div className="text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="text-[#4CAF50] font-semibold hover:underline"
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}