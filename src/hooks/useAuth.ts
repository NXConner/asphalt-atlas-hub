import { useState, useEffect } from 'react'
import { User, AuthError } from '@supabase/supabase-js'
import { supabase, Profile } from '@/lib/supabase'

export interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
  error: AuthError | null
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        setState(prev => ({ ...prev, error, loading: false }))
        return
      }

      if (session?.user) {
        fetchProfile(session.user.id)
        setState(prev => ({ 
          ...prev, 
          user: session.user, 
          loading: false 
        }))
      } else {
        setState(prev => ({ ...prev, loading: false }))
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          fetchProfile(session.user.id)
          setState(prev => ({ 
            ...prev, 
            user: session.user, 
            loading: false 
          }))
        } else {
          setState(prev => ({ 
            ...prev, 
            user: null, 
            profile: null, 
            loading: false 
          }))
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error)
        return
      }

      setState(prev => ({ ...prev, profile: data }))
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })

    setState(prev => ({ ...prev, loading: false, error }))
    return { data, error }
  }

  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    setState(prev => ({ ...prev, loading: false, error }))
    return { data, error }
  }

  const signOut = async () => {
    setState(prev => ({ ...prev, loading: true }))
    
    const { error } = await supabase.auth.signOut()
    
    setState(prev => ({ 
      ...prev, 
      user: null, 
      profile: null, 
      loading: false, 
      error 
    }))
    
    return { error }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!state.user) return { error: new Error('Not authenticated') }

    setState(prev => ({ ...prev, loading: true }))

    const { data, error } = await supabase
      .from('profiles')
      .upsert({ 
        id: state.user.id, 
        email: state.user.email!,
        ...updates,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (!error && data) {
      setState(prev => ({ ...prev, profile: data }))
    }

    setState(prev => ({ ...prev, loading: false }))
    return { data, error }
  }

  return {
    ...state,
    signUp,
    signIn,
    signOut,
    updateProfile,
    isAuthenticated: !!state.user
  }
}