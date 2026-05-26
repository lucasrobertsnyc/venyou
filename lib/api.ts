import type { EventLog, User, Venue, Game, Team, Ranking, WantToAttend } from "@/types/venyou";
import type { Sport } from "@/types/venyou";
import {
  MOCK_LOGS,
  MOCK_USERS,
  MOCK_VENUES,
  MOCK_GAMES,
  MOCK_TEAMS,
  MOCK_RANKINGS,
  MOCK_WANT_TO_ATTEND,
} from "@/data/events";

export async function getUserLogs(userId: string): Promise<EventLog[]> {
  return MOCK_LOGS.filter((l) => l.userId === userId);
}

export async function getUser(username: string): Promise<User | null> {
  return MOCK_USERS.find((u) => u.username === username) ?? null;
}

export async function getVenue(slug: string): Promise<Venue | null> {
  return MOCK_VENUES.find((v) => v.slug === slug) ?? null;
}

export async function getVenueLogs(venueId: string): Promise<EventLog[]> {
  const games = MOCK_GAMES.filter((g) => g.venueId === venueId).map((g) => g.id);
  return MOCK_LOGS.filter((l) => games.includes(l.gameId));
}

export async function getTeams(sport?: Sport): Promise<Team[]> {
  return sport ? MOCK_TEAMS.filter((t) => t.sport === sport) : MOCK_TEAMS;
}

export async function getVenues(): Promise<Venue[]> {
  return MOCK_VENUES;
}

export async function getGames(teamId?: string): Promise<Game[]> {
  if (!teamId) return MOCK_GAMES;
  return MOCK_GAMES.filter((g) => g.homeTeamId === teamId || g.awayTeamId === teamId);
}

export async function getRecentActivity(): Promise<EventLog[]> {
  return [...MOCK_LOGS].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 10);
}

export async function getWishlist(userId: string): Promise<WantToAttend[]> {
  return MOCK_WANT_TO_ATTEND.filter((w) => w.userId === userId);
}

export async function getRankings(userId: string): Promise<Ranking[]> {
  return MOCK_RANKINGS.filter((r) => r.userId === userId);
}

export function getGameById(gameId: string): Game | undefined {
  return MOCK_GAMES.find((g) => g.id === gameId);
}

export function getTeamById(teamId: string): Team | undefined {
  return MOCK_TEAMS.find((t) => t.id === teamId);
}

export function getVenueById(venueId: string): Venue | undefined {
  return MOCK_VENUES.find((v) => v.id === venueId);
}
