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

  // Check both directions for an existing row
  const [{ data: outgoing }, { data: incoming }] = await Promise.all([
    supabase.from('friendships').select('status')
      .eq('user_id', currentUserId).eq('friend_id', profile.id).maybeSingle(),
    supabase.from('friendships').select('status')
      .eq('user_id', profile.id).eq('friend_id', currentUserId).maybeSingle(),
  ])

  if (outgoing) {
    if (outgoing.status === 'accepted') return { error: 'Already friends' }
    return { error: 'Request already sent' }
  }
  if (incoming) {
    if (incoming.status === 'accepted') return { error: 'Already friends' }
    // They already sent us a request — auto-accept it
    await supabase.from('friendships')
      .update({ status: 'accepted' })
      .eq('user_id', profile.id)
      .eq('friend_id', currentUserId)
    revalidatePath('/dashboard')
    return { error: null, wasAccepted: true }
  }

  // No existing row — send a fresh request
  const { error } = await supabase
    .from('friendships')
    .insert({ user_id: currentUserId, friend_id: profile.id, status: 'pending' })

  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  return { error: null, wasAccepted: false }
}

export async function acceptFriendAction(requesterId: string, currentUserId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('friendships')
    .update({ status: 'accepted' })
    .eq('user_id', requesterId)
    .eq('friend_id', currentUserId)
  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  return { error: null }
}

export async function declineFriendAction(requesterId: string, currentUserId: string) {
  const supabase = await createClient()
  await supabase.from('friendships').delete()
    .eq('user_id', requesterId)
    .eq('friend_id', currentUserId)
  revalidatePath('/dashboard')
  return { error: null }
}

export async function removeFriendAction(currentUserId: string, friendId: string) {
  const supabase = await createClient()
  // Delete both directions so neither user sees the other
  await Promise.all([
    supabase.from('friendships').delete()
      .eq('user_id', currentUserId).eq('friend_id', friendId),
    supabase.from('friendships').delete()
      .eq('user_id', friendId).eq('friend_id', currentUserId),
  ])
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
    .eq('user_id', session.user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/profile/[username]', 'page')
  return { error: null }
}
