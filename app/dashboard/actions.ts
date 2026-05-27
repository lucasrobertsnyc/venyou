'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Comment } from '@/types/venyou'

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

export async function updateLogAction(logId: string, data: {
  overall: number; atmosphere: number; crowdEnergy: number; seatViewQuality: number;
  foodDrinks: number; entrySecurity: number; bathroomsLines: number;
  parkingTransit: number; valueForMoney: number; gameRating: number;
  review: string; section: string;
}) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return { error: 'Not authenticated' }

  const nullIfZero = (v: number) => (v > 0 ? v : null)

  const { error } = await supabase
    .from('event_logs')
    .update({
      overall: nullIfZero(data.overall),
      atmosphere: nullIfZero(data.atmosphere),
      crowd_energy: nullIfZero(data.crowdEnergy),
      seat_view_quality: nullIfZero(data.seatViewQuality),
      food_drinks: nullIfZero(data.foodDrinks),
      entry_security: nullIfZero(data.entrySecurity),
      bathrooms_lines: nullIfZero(data.bathroomsLines),
      parking_transit: nullIfZero(data.parkingTransit),
      value_for_money: nullIfZero(data.valueForMoney),
      game_rating: nullIfZero(data.gameRating),
      review: data.review,
      section: data.section,
    })
    .eq('id', logId)
    .eq('user_id', session.user.id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  revalidatePath('/profile/[username]', 'page')
  return { error: null }
}

// ─── Comments ────────────────────────────────────────────────────────────────

export async function fetchCommentsAction(logId: string): Promise<{ comments: Comment[] }> {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return { comments: [] }

  const { data: rows } = await supabase
    .from('comments')
    .select('*')
    .eq('log_id', logId)
    .order('created_at', { ascending: true })

  if (!rows || rows.length === 0) return { comments: [] }

  const userIds = Array.from(new Set(rows.map((r) => r.user_id)))
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, display_name, username')
    .in('id', userIds)

  const profileMap = Object.fromEntries(
    (profiles ?? []).map((p) => [p.id, p])
  )

  return {
    comments: rows.map((r) => ({
      id: r.id,
      userId: r.user_id,
      logId: r.log_id,
      content: r.content,
      createdAt: r.created_at,
      authorName: profileMap[r.user_id]?.display_name ?? 'Unknown',
      authorUsername: profileMap[r.user_id]?.username ?? '',
    })),
  }
}

export async function addCommentAction(
  logId: string,
  content: string
): Promise<{ error: string | null; comment?: Comment }> {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return { error: 'Not authenticated' }

  const trimmed = content.trim()
  if (!trimmed) return { error: 'Comment cannot be empty' }
  if (trimmed.length > 500) return { error: 'Comment too long (max 500 chars)' }

  const { data, error } = await supabase
    .from('comments')
    .insert({ user_id: session.user.id, log_id: logId, content: trimmed })
    .select()
    .single()

  if (error) return { error: error.message }

  // Fetch author name for optimistic display
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, username')
    .eq('id', session.user.id)
    .single()

  return {
    error: null,
    comment: {
      id: data.id,
      userId: data.user_id,
      logId: data.log_id,
      content: data.content,
      createdAt: data.created_at,
      authorName: profile?.display_name ?? 'Unknown',
      authorUsername: profile?.username ?? '',
    },
  }
}

export async function deleteCommentAction(
  commentId: string
): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)

  if (error) return { error: error.message }
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
