'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function addFriendAction(currentUserId: string, username: string) {
  const supabase = await createClient()

  const clean = username.replace(/^@/, '').toLowerCase().trim()
  if (!clean) return { error: 'Enter a username' }

  const { data: profile, error: findError } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', clean)
    .single()

  if (findError || !profile) return { error: 'No user found with that username' }
  if (profile.id === currentUserId) return { error: "You can't add yourself" }

  const { error } = await supabase
    .from('friendships')
    .insert({ user_id: currentUserId, friend_id: profile.id })

  if (error) {
    if (error.code === '23505') return { error: 'Already following that user' }
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { error: null }
}

export async function removeFriendAction(currentUserId: string, friendId: string) {
  const supabase = await createClient()
  await supabase
    .from('friendships')
    .delete()
    .eq('user_id', currentUserId)
    .eq('friend_id', friendId)
  revalidatePath('/dashboard')
  return { error: null }
}

export async function deleteLogAction(logId: string) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('event_logs')
    .delete()
    .eq('id', logId)
    .eq('user_id', session.user.id) // RLS double-check: only own logs

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/profile/[username]', 'page')
  return { error: null }
}
