"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

type SupabaseContextType = {
  user: User | null
  session: Session | null
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  loading: boolean
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function getSession() {
      setLoading(true)
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error getting session:', error.message)
        toast({
          variant: 'destructive',
          title: 'Authentication Error',
          description: error.message,
        })
      }
      
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [toast])

  async function signUp(email: string, password: string) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Sign Up Error',
        description: error.message,
      })
      return { error }
    }
    
    toast({
      title: 'Sign Up Successful',
      description: 'Please check your email to verify your account.',
    })
    
    return { error: null }
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Sign In Error',
        description: error.message,
      })
      return { error }
    }
    
    router.push('/dashboard')
    router.refresh()
    
    return { error: null }
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Sign Out Error',
        description: error.message,
      })
      return
    }
    
    router.push('/')
    router.refresh()
  }

  const value = {
    user,
    session,
    signUp,
    signIn,
    signOut,
    loading,
  }

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}