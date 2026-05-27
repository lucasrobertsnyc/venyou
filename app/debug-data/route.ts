import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  // Use service role key to bypass all RLS/grant issues — debug only
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  )

  const [
    { data: sports, error: sportsError },
    { data: teams, error: teamsError },
    { data: venues, error: venuesError },
    { data: games, error: gamesError },
  ] = await Promise.all([
    supabase.from('sports').select('id'),
    supabase.from('teams').select('id, sport_id').limit(5),
    supabase.from('venues').select('id').limit(5),
    supabase.from('games').select('id, home_team_id').limit(5),
  ])

  return NextResponse.json({
    sports: { count: sports?.length ?? 0, error: sportsError?.message ?? null, sample: sports },
    teams: { count: teams?.length ?? 0, error: teamsError?.message ?? null, sample: teams },
    venues: { count: venues?.length ?? 0, error: venuesError?.message ?? null, sample: venues },
    games: { count: games?.length ?? 0, error: gamesError?.message ?? null, sample: games },
  })
}
