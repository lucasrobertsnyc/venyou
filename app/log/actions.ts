'use server'

import { randomUUID } from 'crypto'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ExperienceRating, RatingValue, Sport } from '@/types/venyou'

export async function logGameAction(data: {
  userId: string
  sport: Sport
  awayTeamName: string
  homeTeamName: string
  date: string
  awayScore: number | null
  homeScore: number | null
  rating: ExperienceRating
  gameRating: RatingValue | 0
  review: string
  section: string
}) {
  const supabase = await createClient()
  const nullIfZero = (v: number) => (v > 0 ? v : null)

  // 1. Insert the game record
  const gameId = `manual-${randomUUID()}`
  const { error: gameError } = await supabase.from('games').insert({
    id: gameId,
    away_team_name: data.awayTeamName.trim(),
    home_team_name: data.homeTeamName.trim(),
    game_date: data.date,
    away_score: data.awayScore,
    home_score: data.homeScore,
    sport: data.sport,
  })

  if (gameError) return { error: gameError }

  // 2. Insert the event log
  const { error: logError } = await supabase.from('event_logs').insert({
    user_id: data.userId,
    game_id: gameId,
    attended_date: data.date,
    overall: nullIfZero(data.rating.overall),
    atmosphere: nullIfZero(data.rating.atmosphere),
    crowd_energy: nullIfZero(data.rating.crowdEnergy),
    seat_view_quality: nullIfZero(data.rating.seatViewQuality),
    food_drinks: nullIfZero(data.rating.foodDrinks),
    entry_security: nullIfZero(data.rating.entrySecurity),
    bathrooms_lines: nullIfZero(data.rating.bathroomsLines),
    parking_transit: nullIfZero(data.rating.parkingTransit),
    value_for_money: nullIfZero(data.rating.valueForMoney),
    game_rating: nullIfZero(data.gameRating),
    review: data.review,
    section: data.section,
  })

  if (logError) return { error: logError }

  revalidatePath('/dashboard')
  revalidatePath('/stats')
  revalidatePath('/log')
  return { error: null }
}
