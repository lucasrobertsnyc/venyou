'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

interface ItemInput {
  refId: string
  refType: 'team' | 'venue' | 'game'
  note: string
}

export async function createRankingAction(data: {
  title: string
  description: string
  items: ItemInput[]
}): Promise<{ error: string | null; id?: string }> {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return { error: 'Not authenticated' }

  const { data: ranking, error: rankingError } = await supabase
    .from('rankings')
    .insert({ user_id: session.user.id, title: data.title.trim(), description: data.description.trim() })
    .select()
    .single()

  if (rankingError) return { error: rankingError.message }

  if (data.items.length > 0) {
    const { error: itemsError } = await supabase.from('ranking_items').insert(
      data.items.map((item, i) => ({
        ranking_id: ranking.id,
        rank: i + 1,
        ref_id: item.refId,
        ref_type: item.refType,
        note: item.note,
      }))
    )
    if (itemsError) return { error: itemsError.message }
  }

  revalidatePath('/rankings/[username]', 'page')
  return { error: null, id: ranking.id }
}

export async function updateRankingAction(
  rankingId: string,
  data: { title: string; description: string; items: ItemInput[] }
): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return { error: 'Not authenticated' }

  const { error: rankingError } = await supabase
    .from('rankings')
    .update({ title: data.title.trim(), description: data.description.trim() })
    .eq('id', rankingId)
    .eq('user_id', session.user.id)

  if (rankingError) return { error: rankingError.message }

  // Replace all items
  await supabase.from('ranking_items').delete().eq('ranking_id', rankingId)

  if (data.items.length > 0) {
    const { error: itemsError } = await supabase.from('ranking_items').insert(
      data.items.map((item, i) => ({
        ranking_id: rankingId,
        rank: i + 1,
        ref_id: item.refId,
        ref_type: item.refType,
        note: item.note,
      }))
    )
    if (itemsError) return { error: itemsError.message }
  }

  revalidatePath('/rankings/[username]', 'page')
  return { error: null }
}

export async function deleteRankingAction(rankingId: string): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('rankings')
    .delete()
    .eq('id', rankingId)
    .eq('user_id', session.user.id)

  if (error) return { error: error.message }
  revalidatePath('/rankings/[username]', 'page')
  return { error: null }
}
