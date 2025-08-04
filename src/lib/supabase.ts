import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Types for our application
export interface Profile {
  id: string
  email: string
  full_name?: string
  company_name?: string
  role: 'contractor' | 'supervisor' | 'admin'
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  name: string
  description?: string
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold'
  location: string
  start_date?: string
  end_date?: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface ProjectCalculation {
  id: string
  project_id: string
  calculation_type: 'sealcoat' | 'striping' | 'material' | 'cost'
  inputs: Record<string, any>
  results: Record<string, any>
  created_at: string
  updated_at: string
}