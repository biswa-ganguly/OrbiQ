import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient(process.env.NEXT_PUBLIC_SUPERBASE_URL,process.env.NEXT_PUBLIC_SUPERBASE_KEY )