'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function resolveEmailAction(
  identifier: string
): Promise<{ email: string | null; error: string | null }> {
  const trimmed = identifier.trim()

  // Looks like an email — use as-is
  if (trimmed.includes('@')) {
    return { email: trimmed, error: null }
  }

  // Treat as username — find the matching profile
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', trimmed.toLowerCase())
    .single()

  if (!profile) {
    return { email: null, error: 'No account found with that username.' }
  }

  // Use admin client to fetch the email from auth.users
  const admin = createAdminClient()
  const { data: { user }, error } = await admin.auth.admin.getUserById(profile.id)

  if (error || !user?.email) {
    return { email: null, error: 'Could not resolve account.' }
  }

  return { email: user.email, error: null }
}
