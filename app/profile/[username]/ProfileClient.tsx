"use client";

import { useState, useMemo, useCallback, useTransition } from "react";
import Link from "next/link";
import type { EventLog, User, Game, Team, Venue, WantToAttend } from "@/types/venyou";
import type { Sport } from "@/types/venyou";
import { formatScore } from "@/lib/sports";
import EventLogCard from "@/components/EventLogCard";
import SportFilter from "@/components/SportFilter";
import TeamBadge from "@/components/TeamBadge";

interface Props {
  logs: EventLog[];
  user: User;
  wishlist: WantToAttend[];
  games: Game[];
  teams: Team[];
  venues: Venue[];
}

export default function ProfileClient({ logs, user, wishlist, games, teams, venues }: Props) {
  const [sportFilter, setSportFilter] = useState<Sport | "all">("all");
  const [, startTransition] = useTransition();

  const handleSportChange = useCallback((s: Sport | "all") => {
    startTransition(() => setSportFilter(s));
  }, []);

  const logWithMeta = useMemo(
    () =>
      logs.map((l) => {
        const game = games.find((g) => g.id === l.gameId);
        const home = teams.find((t) => t.id === game?.homeTeamId);
        return { ...l, sport: home?.sport, venueId: game?.venueId };
      }),
    [logs, games, teams]
  );

  const filtered = useMemo(
    () =>
      sportFilter === "all"
        ? logWithMeta
        : logWithMeta.filter((l) => l.sport === sportFilter),
    [logWithMeta, sportFilter]
  );

  const stats = useMemo(() => {
    const sports = new Set(logWithMeta.map((l) => l.sport).filter(Boolean));
    const venueIds = new Set(logWithMeta.map((l) => l.venueId).filter(Boolean));
    const scores = logWithMeta.map((l) => parseFloat(formatScore(l.rating)));
    const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : "—";
    return { total: logWithMeta.length, sports: sports.size, venues: venueIds.size, avg: avgScore };
  }, [logWithMeta]);

  const favoriteTeams = useMemo(
    () =>
      Object.values(user.favoriteTeams).map((id) => teams.find((t) => t.id === id)).filter(Boolean) as Team[],
    [user.favoriteTeams, teams]
  );

  return (
    <div className="min-h-screen bg-zinc-950">
      <nav className="border-b border-zinc-800 px-6 py-4 sticky top-0 z-10 bg-zinc-950/90 backdrop-blur">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-emerald-400 font-black text-lg tracking-tight">VenYou</Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-zinc-100">Dashboard</Link>
            <Link href="/log" className="text-sm bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-full font-semibold transition-colors">
              + Log Game
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Profile header */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center text-2xl font-black text-emerald-400">
                {user.displayName.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl font-black text-zinc-100">{user.displayName}</h1>
                <p className="text-sm text-zinc-400">@{user.username}</p>
                {user.homeCity && <p className="text-xs text-zinc-500 mt-0.5">{user.homeCity}</p>}
                {user.bio && <p className="text-sm text-zinc-400 mt-1 max-w-sm">{user.bio}</p>}
              </div>
            </div>
            <Link
              href={`/rankings/${user.username}`}
              className="text-sm border border-zinc-700 hover:border-emerald-500 text-zinc-300 hover:text-emerald-400 px-4 py-2 rounded-xl transition-colors"
            >
              View Rankings
            </Link>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-zinc-800">
            {[
              { label: "Games", val: stats.total },
              { label: "Venues", val: stats.venues },
              { label: "Sports", val: stats.sports },
              { label: "Avg Score", val: `${stats.avg}/10` },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-xl font-black text-emerald-400">{s.val}</p>
                <p className="text-xs text-zinc-500">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Favorite teams */}
          {favoriteTeams.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {favoriteTeams.map((t) => (
                <TeamBadge key={t.id} team={t} size="sm" />
              ))}
            </div>
          )}
          <p className="text-xs text-zinc-600 mt-3">Member since {new Date(user.joinedAt).getFullYear()}</p>
        </div>

        {/* Sport filter */}
        <div className="mb-6">
          <SportFilter selected={sportFilter} onChange={handleSportChange} />
        </div>

        {/* Logs grid */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {filtered.map((log) => {
            const game = games.find((g) => g.id === log.gameId);
            const home = teams.find((t) => t.id === game?.homeTeamId);
            const away = teams.find((t) => t.id === game?.awayTeamId);
            const venue = venues.find((v) => v.id === game?.venueId);
            return (
              <EventLogCard key={log.id} log={log} game={game} homeTeam={home} awayTeam={away} venue={venue} />
            );
          })}
          {filtered.length === 0 && (
            <p className="text-zinc-500 text-sm col-span-2 text-center py-12">No games logged for this sport yet.</p>
          )}
        </div>

        {/* Wishlist */}
        {wishlist.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wider mb-4">Want to Attend</h2>
            <div className="space-y-2">
              {wishlist.map((w) => {
                const team = w.teamId ? teams.find((t) => t.id === w.teamId) : null;
                const venue = w.venueId ? venues.find((v) => v.id === w.venueId) : null;
                return (
                  <div key={w.id} className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-100">
                        {team ? `${team.city} ${team.name}` : venue?.name ?? "Unknown"}
                      </p>
                      {w.note && <p className="text-xs text-zinc-500 italic">{w.note}</p>}
                    </div>
                    {team && (
                      <span className="text-xs font-bold text-zinc-500">{team.sport}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
