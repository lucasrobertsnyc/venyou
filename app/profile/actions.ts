'use server'

import { createClient } from '@/lib/supabase/server'

export async function addWishlistItemAction(data: {
  teamId?: string
  venueId?: string
  note: string
}): Promise<{ error: string | null; id?: string }> {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return { error: 'Not authenticated' }

  const { data: item, error } = await supabase
    .from('want_to_attend')
    .insert({
      user_id: session.user.id,
      team_id: data.teamId ?? null,
      venue_id: data.venueId ?? null,
      note: data.note,
    })
    .select()
    .single()

  if (error) return { error: error.message }
  return { error: null, id: item.id }
}

export async function removeWishlistItemAction(itemId: string): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { error } = await supabase.from('want_to_attend').delete().eq('id', itemId)
  return { error: error?.message ?? null }
}
