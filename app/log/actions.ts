'use server'

import { insertEventLog } from '@/lib/api'
import { revalidatePath } from 'next/cache'
import type { ExperienceRating, RatingValue } from '@/types/venyou'

export async function logGameAction(data: {
  userId: string
  gameId: string
  attendedDate: string
  rating: ExperienceRating
  gameRating: RatingValue | 0
  review: string
  section: string
}) {
  const result = await insertEventLog({
    userId: data.userId,
    gameId: data.gameId,
    attendedDate: data.attendedDate,
    overall: data.rating.overall,
    atmosphere: data.rating.atmosphere,
    crowdEnergy: data.rating.crowdEnergy,
    seatViewQuality: data.rating.seatViewQuality,
    foodDrinks: data.rating.foodDrinks,
    entrySecurity: data.rating.entrySecurity,
    bathroomsLines: data.rating.bathroomsLines,
    parkingTransit: data.rating.parkingTransit,
    valueForMoney: data.rating.valueForMoney,
    gameRating: data.gameRating,
    review: data.review,
    section: data.section,
  })

  if (!result.error) {
    revalidatePath('/dashboard')
    revalidatePath('/stats')
    revalidatePath('/log')
  }

  return result
}
