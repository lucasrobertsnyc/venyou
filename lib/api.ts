import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { EventLog, User, Venue, Game, Team, Ranking, WantToAttend, FriendComment } from '@/types/venyou'
import type { Sport } from '@/types/venyou'

// ─── Mappers (snake_case DB → camelCase TS) ──────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProfile(p: any): User {
  return {
    id: p.id,
    username: p.username,
    displayName: p.display_name,
    bio: p.bio ?? '',
    homeCity: p.home_city ?? '',
    favoriteTeams: p.favorite_teams ?? {},
    joinedAt: p.created_at,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTeam(t: any): Team {
  return {
    id: t.id,
    sport: t.sport_id as Sport,
    name: t.name,
    city: t.city,
    abbreviation: t.abbreviation,
    primaryColor: t.primary_color,
    slug: t.slug,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapVenue(v: any): Venue {
  return {
    id: v.id,
    name: v.name,
    slug: v.slug,
    city: v.city,
    state: v.state,
    sport: v.sport_id as Sport,
    capacity: v.capacity,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapGame(g: any): Game {
  return {
    id: g.id,
    homeTeamId: g.home_team_id ?? null,
    awayTeamId: g.away_team_id ?? null,
    homeTeamName: g.home_team_name ?? undefined,
    awayTeamName: g.away_team_name ?? undefined,
    sport: g.sport ?? undefined,
    venueId: g.venue_id ?? null,
    date: g.game_date,
    homeScore: g.home_score,
    awayScore: g.away_score,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapEventLog(l: any): EventLog {
  return {
    id: l.id,
    userId: l.user_id,
    gameId: l.game_id,
    attendedDate: l.attended_date,
    rating: {
      overall: l.overall ?? 0,
      atmosphere: l.atmosphere ?? 0,
      crowdEnergy: l.crowd_energy ?? 0,
      seatViewQuality: l.seat_view_quality ?? 0,
      foodDrinks: l.food_drinks ?? 0,
      entrySecurity: l.entry_security ?? 0,
      bathroomsLines: l.bathrooms_lines ?? 0,
      parkingTransit: l.parking_transit ?? 0,
      valueForMoney: l.value_for_money ?? 0,
    },
    gameRating: l.game_rating ?? 0,
    review: l.review ?? '',
    section: l.section ?? '',
    createdAt: l.created_at,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRanking(r: any): Ranking {
  return {
    id: r.id,
    userId: r.user_id,
    title: r.title,
    description: r.description ?? '',
    createdAt: r.created_at,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: (r.ranking_items ?? []).map((item: any) => ({
      rank: item.rank,
      refId: item.ref_id,
      refType: item.ref_type,
      note: item.note ?? '',
    })),
  }
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return null
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()
  return profile ? mapProfile(profile) : null
}

// ─── Users ───────────────────────────────────────────────────────────────────

export async function getUser(username: string): Promise<User | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()
  return data ? mapProfile(data) : null
}

export async function getUsers(): Promise<User[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('profiles').select('*').order('created_at')
  return (data ?? []).map(mapProfile)
}

// ─── Teams ───────────────────────────────────────────────────────────────────

export async function getTeams(sport?: Sport): Promise<Team[]> {
  const supabase = await createClient()
  let query = supabase.from('teams').select('*').order('name')
  if (sport) query = query.eq('sport_id', sport)
  const { data } = await query
  return (data ?? []).map(mapTeam)
}

// ─── Venues ──────────────────────────────────────────────────────────────────

export async function getVenues(): Promise<Venue[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('venues').select('*').order('name')
  return (data ?? []).map(mapVenue)
}

export async function getVenue(slug: string): Promise<Venue | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('venues').select('*').eq('slug', slug).single()
  return data ? mapVenue(data) : null
}

// ─── Games ───────────────────────────────────────────────────────────────────

export async function getGames(teamId?: string): Promise<Game[]> {
  const supabase = await createClient()
  let query = supabase.from('games').select('*').order('game_date', { ascending: false })
  if (teamId) query = query.or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
  const { data } = await query
  return (data ?? []).map(mapGame)
}

// ─── Event Logs ──────────────────────────────────────────────────────────────

export async function getUserLogs(userId: string): Promise<EventLog[]> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('event_logs')
    .select('*')
    .eq('user_id', userId)
    .order('attended_date', { ascending: false })
  return (data ?? []).map(mapEventLog)
}

export async function getVenueLogs(venueId: string): Promise<EventLog[]> {
  const supabase = createAdminClient()
  const { data: games } = await supabase
    .from('games')
    .select('id')
    .eq('venue_id', venueId)
  if (!games || games.length === 0) return []
  const gameIds = games.map((g) => g.id)
  const { data } = await supabase
    .from('event_logs')
    .select('*')
    .in('game_id', gameIds)
    .order('created_at', { ascending: false })
    .limit(20)
  return (data ?? []).map(mapEventLog)
}

export async function getRecentActivity(): Promise<EventLog[]> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('event_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)
  return (data ?? []).map(mapEventLog)
}

export async function insertEventLog(log: {
  userId: string
  gameId: string
  attendedDate: string
  overall: number
  atmosphere: number
  crowdEnergy: number
  seatViewQuality: number
  foodDrinks: number
  entrySecurity: number
  bathroomsLines: number
  parkingTransit: number
  valueForMoney: number
  gameRating: number
  review: string
  section: string
}) {
  const supabase = await createClient()
  const nullIfZero = (v: number) => (v > 0 ? v : null)
  const { data, error } = await supabase
    .from('event_logs')
    .insert({
      user_id: log.userId,
      game_id: log.gameId,
      attended_date: log.attendedDate,
      overall: nullIfZero(log.overall),
      atmosphere: nullIfZero(log.atmosphere),
      crowd_energy: nullIfZero(log.crowdEnergy),
      seat_view_quality: nullIfZero(log.seatViewQuality),
      food_drinks: nullIfZero(log.foodDrinks),
      entry_security: nullIfZero(log.entrySecurity),
      bathrooms_lines: nullIfZero(log.bathroomsLines),
      parking_transit: nullIfZero(log.parkingTransit),
      value_for_money: nullIfZero(log.valueForMoney),
      game_rating: nullIfZero(log.gameRating),
      review: log.review,
      section: log.section,
    })
    .select()
    .single()
  return { data, error }
}

// ─── Rankings ────────────────────────────────────────────────────────────────

export async function getRankings(userId: string): Promise<Ranking[]> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('rankings')
    .select('*, ranking_items(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return (data ?? []).map(mapRanking)
}

// ─── Wishlist ─────────────────────────────────────────────────────────────────

export async function getWishlist(userId: string): Promise<WantToAttend[]> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('want_to_attend')
    .select('*')
    .eq('user_id', userId)
  return (data ?? []).map((w) => ({
    id: w.id,
    userId: w.user_id,
    teamId: w.team_id ?? undefined,
    venueId: w.venue_id ?? undefined,
    note: w.note ?? '',
  }))
}

// ─── Friends ─────────────────────────────────────────────────────────────────

export async function getFriends(userId: string): Promise<User[]> {
  const supabase = await createClient()
  const [{ data: outgoing }, { data: incoming }] = await Promise.all([
    supabase.from('friendships').select('friend_id').eq('user_id', userId).eq('status', 'accepted'),
    supabase.from('friendships').select('user_id').eq('friend_id', userId).eq('status', 'accepted'),
  ])
  const friendIds = [
    ...(outgoing ?? []).map((f) => f.friend_id),
    ...(incoming ?? []).map((f) => f.user_id),
  ]
  if (friendIds.length === 0) return []
  const { data } = await supabase.from('profiles').select('*').in('id', friendIds)
  return (data ?? []).map(mapProfile)
}

export async function getFriendActivity(userId: string): Promise<EventLog[]> {
  const supabase = await createClient()
  const admin = createAdminClient()
  const [{ data: outgoing }, { data: incoming }] = await Promise.all([
    supabase.from('friendships').select('friend_id').eq('user_id', userId).eq('status', 'accepted'),
    supabase.from('friendships').select('user_id').eq('friend_id', userId).eq('status', 'accepted'),
  ])
  const friendIds = [
    ...(outgoing ?? []).map((f) => f.friend_id),
    ...(incoming ?? []).map((f) => f.user_id),
  ]
  if (friendIds.length === 0) return []
  const { data } = await admin
    .from('event_logs')
    .select('*')
    .in('user_id', friendIds)
    .order('created_at', { ascending: false })
    .limit(10)
  return (data ?? []).map(mapEventLog)
}

export async function getFriendComments(userId: string): Promise<FriendComment[]> {
  const supabase = await createClient()
  const admin = createAdminClient()

  const [{ data: outgoing }, { data: incoming }] = await Promise.all([
    supabase.from('friendships').select('friend_id').eq('user_id', userId).eq('status', 'accepted'),
    supabase.from('friendships').select('user_id').eq('friend_id', userId).eq('status', 'accepted'),
  ])
  const friendIds = [
    ...(outgoing ?? []).map((f) => f.friend_id),
    ...(incoming ?? []).map((f) => f.user_id),
  ]
  if (friendIds.length === 0) return []

  const { data: comments } = await admin
    .from('comments')
    .select('*')
    .in('user_id', friendIds)
    .order('created_at', { ascending: false })
    .limit(10)

  if (!comments || comments.length === 0) return []

  const authorIds = Array.from(new Set(comments.map((c) => c.user_id)))
  const logIds = Array.from(new Set(comments.map((c) => c.log_id)))

  const [{ data: profiles }, { data: logs }] = await Promise.all([
    admin.from('profiles').select('id, display_name, username').in('id', authorIds),
    admin.from('event_logs').select('id, user_id, game_id').in('id', logIds),
  ])

  const gameIds = Array.from(new Set((logs ?? []).map((l) => l.game_id).filter(Boolean)))
  const logOwnerIds = Array.from(new Set((logs ?? []).map((l) => l.user_id).filter(Boolean)))

  const [gamesResult, logOwnerProfiles] = await Promise.all([
    gameIds.length > 0
      ? admin.from('games').select('id, home_team_id, away_team_id').in('id', gameIds)
      : Promise.resolve({ data: [] }),
    logOwnerIds.length > 0
      ? admin.from('profiles').select('id, username').in('id', logOwnerIds)
      : Promise.resolve({ data: [] }),
  ])

  const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]))
  const logMap = Object.fromEntries((logs ?? []).map((l) => [l.id, l]))
  const gameMap = Object.fromEntries((gamesResult.data ?? []).map((g) => [g.id, g]))
  const logOwnerMap = Object.fromEntries((logOwnerProfiles.data ?? []).map((p) => [p.id, p]))

  return comments.map((c) => {
    const log = logMap[c.log_id]
    const game = log ? gameMap[log.game_id] : null
    const profile = profileMap[c.user_id]
    const logOwner = log ? logOwnerMap[log.user_id] : null
    return {
      id: c.id,
      userId: c.user_id,
      logId: c.log_id,
      logUserId: log?.user_id ?? '',
      logOwnerUsername: logOwner?.username ?? '',
      content: c.content,
      createdAt: c.created_at,
      authorName: profile?.display_name ?? 'Unknown',
      authorUsername: profile?.username ?? '',
      gameId: log?.game_id ?? '',
      homeTeamId: game?.home_team_id ?? undefined,
      awayTeamId: game?.away_team_id ?? undefined,
    }
  })
}

export async function getPendingRequests(userId: string): Promise<User[]> {
  const supabase = await createClient()
  const { data: requests } = await supabase
    .from('friendships')
    .select('user_id')
    .eq('friend_id', userId)
    .eq('status', 'pending')
  if (!requests || requests.length === 0) return []
  const requesterIds = requests.map((r) => r.user_id)
  const { data } = await supabase.from('profiles').select('*').in('id', requesterIds)
  return (data ?? []).map(mapProfile)
}

// ─── Legacy sync helpers (kept for call-site compatibility) ──────────────────

export function getGameById(gameId: string, games: Game[]): Game | undefined {
  return games.find((g) => g.id === gameId)
}

export function getTeamById(teamId: string, teams: Team[]): Team | undefined {
  return teams.find((t) => t.id === teamId)
}

export function getVenueById(venueId: string, venues: Venue[]): Venue | undefined {
  return venues.find((v) => v.id === venueId)
}
