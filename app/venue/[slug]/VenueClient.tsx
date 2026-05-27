"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { Venue, EventLog, Game, Team } from "@/types/venyou";
import { ratingToScore, RATING_CATEGORIES, SPORT_BG_COLORS } from "@/lib/sports";
import EventLogCard from "@/components/EventLogCard";
import TeamBadge from "@/components/TeamBadge";

interface Props {
  venue: Venue;
  logs: EventLog[];
  games: Game[];
  teams: Team[];
}

export default function VenueClient({ venue, logs, games, teams }: Props) {
  const sportBg = SPORT_BG_COLORS[venue.sport];

  const homeTeam = useMemo(
    () => teams.find((t) => t.sport === venue.sport && t.city === venue.city),
    [teams, venue]
  );


  const avgScore = useMemo(() => {
    const scores = logs.map((l) => ratingToScore(l.rating)).filter((s) => s > 0);
    if (scores.length === 0) return null;
    return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
  }, [logs]);

  const categoryAvgs = useMemo(() => {
    if (logs.length === 0) return [];
    return RATING_CATEGORIES.map(({ key, label }) => {
      const vals = logs.map((l) => l.rating[key]).filter((v) => v > 0) as number[];
      if (vals.length === 0) return { label, avg: "—", pct: 0 };
      const avg = vals.reduce((sum, v) => sum + v, 0) / vals.length;
      return { label, avg: avg.toFixed(1), pct: (avg / 5) * 100 };
    });
  }, [logs]);

  return (
    <div className="min-h-screen bg-zinc-950">
      <nav className="border-b border-zinc-800 px-6 py-4 sticky top-0 z-10 bg-zinc-950/90 backdrop-blur">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-emerald-400 font-black text-lg tracking-tight">Stubs</Link>
          <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-zinc-100">Dashboard</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Venue header */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${sportBg}`}>
                  {venue.sport}
                </span>
              </div>
              <h1 className="text-2xl font-black text-zinc-100">{venue.name}</h1>
              <p className="text-sm text-zinc-400 mt-1">
                {venue.city}, {venue.state} · Capacity {venue.capacity.toLocaleString()}
              </p>
              {homeTeam && (
                <div className="mt-3">
                  <TeamBadge team={homeTeam} size="sm" />
                </div>
              )}
            </div>
            {avgScore && (
              <div className="text-right shrink-0">
                <p className="text-4xl font-black text-emerald-400">{avgScore}</p>
                <p className="text-xs text-zinc-500">avg score / 10</p>
                <p className="text-xs text-zinc-500 mt-0.5">{logs.length} log{logs.length !== 1 ? "s" : ""}</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Rating breakdown */}
          {categoryAvgs.length > 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wider mb-5">
                Experience Breakdown
              </h2>
              <div className="space-y-3">
                {categoryAvgs.map(({ label, avg, pct }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-xs text-zinc-400 w-36 shrink-0">{label}</span>
                    <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-zinc-200 w-8 text-right">{avg}/5</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent logs */}
          <div>
            <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wider mb-4">
              Recent Logs at This Venue
            </h2>
            {logs.length === 0 ? (
              <p className="text-zinc-500 text-sm py-8 text-center">No logs yet for this venue.</p>
            ) : (
              <div className="space-y-3">
                {logs.slice(0, 5).map((log) => {
                  const game = games.find((g) => g.id === log.gameId);
                  const home = teams.find((t) => t.id === game?.homeTeamId);
                  const away = teams.find((t) => t.id === game?.awayTeamId);
                  const v = { id: venue.id, name: venue.name, slug: venue.slug, city: venue.city, state: venue.state, sport: venue.sport, capacity: venue.capacity };
                  return (
                    <EventLogCard key={log.id} log={log} game={game} homeTeam={home} awayTeam={away} venue={v} />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
