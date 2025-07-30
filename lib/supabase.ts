import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = "https://uysytogjruvohyjrqpwu.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5c3l0b2dqcnV2b2h5anJxcHd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MzQzOTMsImV4cCI6MjA2OTIxMDM5M30.tMJquIAq06j3tCwjmFB_MSWvzuzZE2B4-Rt_31IW1C4"

// Create a singleton instance
let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null

export const createClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseInstance
}

// Export the singleton instance directly
export const supabase = createClient()
