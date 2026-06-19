"use client";

import { useState, useMemo, useCallback, useTransition } from "react";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, CartesianGrid, Legend,
} from "recharts";
import type { EventLog, Venue, Game, Team } from "@/types/venyou";
import type { Sport } from "@/types/venyou";
import { SPORTS, AVG_TICKET_PRICE, RATING_CATEGORIES, formatScore, ratingToScore } from "@/lib/sports";
import StatCard from "@/components/StatCard";
import SportFilter from "@/components/SportFilter";
import LogoutButton from "@/components/LogoutButton";

interface Props {
  logs: EventLog[];
  venues: Venue[];
  games: Game[];
  teams: Team[];
  username?: string;
}

const SPORT_CHART_COLORS: Record<Sport, string> = {
  NFL: "#3b82f6",
  MLB: "#ef4444",
  NBA: "#f97316",
  NHL: "#38bdf8",
  MLS: "#22c55e",
};

const TOOLTIP_STYLE = {
  backgroundColor: "#27272a",
  border: "1px solid #3f3f46",
  borderRadius: "8px",
  color: "#f4f4f5",
  fontSize: "12px",
};

export default function StatsClient({ logs, venues, games, teams, username }: Props) {
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
        return { ...l, sport: home?.sport, venueId: game?.venueId, homeTeamId: game?.homeTeamId };
      }),
    [logs, games, teams]
  );

  const filtered = useMemo(
    () => (sportFilter === "all" ? logWithMeta : logWithMeta.filter((l) => l.sport === sportFilter)),
    [logWithMeta, sportFilter]
  );

  const summary = useMemo(() => {
    const sports = new Set(filtered.map((l) => l.sport).filter(Boolean));
    const venueIds = new Set(filtered.map((l) => l.venueId).filter(Boolean));
    const teamIds = new Set([
      ...filtered.map((l) => l.homeTeamId).filter(Boolean),
      ...filtered.flatMap((l) => {
        const g = games.find((g) => g.id === l.gameId);
        return g ? [g.awayTeamId] : [];
      }),
    ]);
    return {
      total: filtered.length,
      sports: sports.size,
      venues: venueIds.size,
      teams: teamIds.size,
    };
  }, [filtered, games]);

  const gamesBySport = useMemo(() => {
    const counts: Partial<Record<Sport, number>> = {};
    for (const l of logWithMeta) {
      if (l.sport) counts[l.sport] = (counts[l.sport] ?? 0) + 1;
    }
    return SPORTS.filter((s) => counts[s]).map((s) => ({
      name: s,
      count: counts[s] ?? 0,
      color: SPORT_CHART_COLORS[s],
    }));
  }, [logWithMeta]);

  const gamesOverTime = useMemo(() => {
    const months: Record<string, Partial<Record<Sport, number>>> = {};
    for (const l of logWithMeta) {
      const dateStr = l.attendedDate ?? l.createdAt;
      if (!dateStr) continue;
      const d = new Date(l.attendedDate ? dateStr + "T12:00:00" : dateStr);
      if (isNaN(d.getTime())) continue;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!months[key]) months[key] = {};
      if (l.sport) months[key][l.sport] = (months[key][l.sport] ?? 0) + 1;
    }
    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => {
        const [yr, mo] = k.split("-");
        return {
          month: `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][parseInt(mo) - 1]} ${yr.slice(2)}`,
          ...v,
        };
      });
  }, [logWithMeta]);

  const ratingAverages = useMemo(() => {
    if (filtered.length === 0) return [];
    return RATING_CATEGORIES.map(({ key, label }) => {
      const avg = filtered.reduce((sum, l) => sum + l.rating[key], 0) / filtered.length;
      return { category: label.replace("Overall Experience", "Overall"), avg: parseFloat(avg.toFixed(2)), pct: (avg / 5) * 100 };
    });
  }, [filtered]);

  const venueBreakdown = useMemo(() => {
    const map: Record<string, { count: number; scores: number[] }> = {};
    for (const l of filtered) {
      const vid = l.venueId;
      if (!vid) continue;
      if (!map[vid]) map[vid] = { count: 0, scores: [] };
      map[vid].count++;
      const s = ratingToScore(l.rating); if (s > 0) map[vid].scores.push(s);
    }
    return Object.entries(map)
      .map(([vid, { count, scores }]) => {
        const venue = venues.find((v) => v.id === vid);
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        return { venue, count, avg: avg.toFixed(1) };
      })
      .filter((v) => v.venue)
      .sort((a, b) => b.count - a.count);
  }, [filtered, venues]);

  const topCards = useMemo(() => {
    const byVenue: Record<string, number[]> = {};
    for (const l of logWithMeta) {
      if (!l.venueId) continue;
      if (!byVenue[l.venueId]) byVenue[l.venueId] = [];
      byVenue[l.venueId].push(ratingToScore(l.rating));
    }
    const favVenueId = Object.entries(byVenue).sort((a, b) => b[1].length - a[1].length)[0]?.[0];
    const favVenue = venues.find((v) => v.id === favVenueId);

    const byTeam: Record<string, number> = {};
    for (const l of logWithMeta) {
      if (!l.homeTeamId) continue;
      byTeam[l.homeTeamId] = (byTeam[l.homeTeamId] ?? 0) + 1;
    }
    const favTeamId = Object.entries(byTeam).sort((a, b) => b[1] - a[1])[0]?.[0];
    const favTeam = teams.find((t) => t.id === favTeamId);

    const highestLog = [...logWithMeta].sort(
      (a, b) => ratingToScore(b.rating) - ratingToScore(a.rating)
    )[0];
    const highestGame = games.find((g) => g.id === highestLog?.gameId);
    const highHome = teams.find((t) => t.id === highestGame?.homeTeamId);
    const highAway = teams.find((t) => t.id === highestGame?.awayTeamId);

    return { favVenue, favTeam, highestLog, highHome, highAway };
  }, [logWithMeta, venues, teams, games]);

  const funStats = useMemo(() => {
    let spend = 0;
    for (const l of logWithMeta) {
      if (l.sport) spend += AVG_TICKET_PRICE[l.sport];
    }
    const miles = logWithMeta.length * 85;
    return { spend, miles };
  }, [logWithMeta]);

  const activeSports = useMemo(
    () => SPORTS.filter((s) => logWithMeta.some((l) => l.sport === s)),
    [logWithMeta]
  );

  return (
    <div className="min-h-screen bg-zinc-950">
      <nav className="border-b border-zinc-800 px-6 py-4 sticky top-0 z-10 bg-zinc-950/90 backdrop-blur">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-emerald-400 font-black text-lg tracking-tight">Stubs</Link>
          <div className="flex items-center gap-4">
            {username ? (
              <Link href={`/profile/${username}`} className="text-sm text-zinc-400 hover:text-zinc-100">← {username}</Link>
            ) : (
              <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-zinc-100">Dashboard</Link>
            )}
            <Link href="/log" className="text-sm bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-full font-semibold transition-colors">
              + Log Game
            </Link>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-zinc-100">{username ? `@${username}` : "Your"} Stats</h1>
            <p className="text-sm text-zinc-400 mt-1">Sports passport breakdown</p>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <StatCard label="Total Games" value={summary.total} accent />
          <StatCard label="Sports" value={summary.sports} />
          <StatCard label="Unique Venues" value={summary.venues} />
          <StatCard label="Teams Seen" value={summary.teams} />
        </div>

        {/* Sport filter */}
        <div className="mb-8">
          <SportFilter selected={sportFilter} onChange={handleSportChange} />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Games by sport */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wider mb-5">
              Games by Sport
            </h2>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={gamesBySport} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
                <XAxis type="number" allowDecimals={false} tick={{ fill: "#71717a", fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: "#a1a1aa", fontSize: 12 }} tickLine={false} axisLine={false} width={36} />
                <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "#3f3f46" }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Games">
                  {gamesBySport.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Games over time */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wider mb-5">
              Games Over Time
            </h2>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={gamesOverTime} margin={{ left: 0, right: 8, top: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                <XAxis dataKey="month" tick={{ fill: "#71717a", fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: "#71717a", fontSize: 11 }} tickLine={false} axisLine={false} width={20} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                {activeSports.map((s) => (
                  <Line
                    key={s}
                    type="monotone"
                    dataKey={s}
                    stroke={SPORT_CHART_COLORS[s]}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 3 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rating breakdown — showpiece */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
          <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wider mb-1">
            Experience Rating Breakdown
          </h2>
          <p className="text-xs text-zinc-500 mb-6">Average scores across all 9 categories</p>
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-3">
            {ratingAverages.map(({ category, avg, pct }) => (
              <div key={category} className="flex items-center gap-3">
                <span className="text-xs text-zinc-400 w-36 shrink-0">{category}</span>
                <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
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

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Venue breakdown */}
          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wider mb-4">
              Venues Visited
            </h2>
            <div className="space-y-2">
              {venueBreakdown.slice(0, 8).map(({ venue, count, avg }) => (
                <Link
                  key={venue!.id}
                  href={`/venue/${venue!.slug}`}
                  className="flex items-center justify-between py-2 border-b border-zinc-800 hover:border-zinc-700 transition-colors group"
                >
                  <div>
                    <span className="text-sm font-medium text-zinc-200 group-hover:text-emerald-400 transition-colors">
                      {venue!.name}
                    </span>
                    <span className="text-xs text-zinc-500 ml-2">{venue!.city}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-zinc-500">{count} visit{count !== 1 ? "s" : ""}</span>
                    <span className="text-emerald-400 font-bold">{avg}/10</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Top cards + fun stats */}
          <div className="space-y-4">
            {topCards.favVenue && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Favorite Venue</p>
                <p className="text-sm font-bold text-zinc-100">{topCards.favVenue.name}</p>
                <p className="text-xs text-zinc-400">{topCards.favVenue.city}</p>
              </div>
            )}
            {topCards.favTeam && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Most Seen Team</p>
                <p className="text-sm font-bold" style={{ color: topCards.favTeam.primaryColor }}>
                  {topCards.favTeam.city} {topCards.favTeam.name}
                </p>
                <p className="text-xs text-zinc-400">{topCards.favTeam.sport}</p>
              </div>
            )}
            {topCards.highestLog && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Highest Rated Game</p>
                <p className="text-sm font-bold text-zinc-100">
                  {topCards.highAway?.abbreviation} @ {topCards.highHome?.abbreviation}
                </p>
                <p className="text-2xl font-black text-emerald-400">
                  {formatScore(topCards.highestLog.rating)}<span className="text-sm font-normal text-zinc-500">/10</span>
                </p>
              </div>
            )}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Fun Stats</p>
              <div>
                <p className="text-xs text-zinc-400">Est. miles traveled</p>
                <p className="text-lg font-bold text-zinc-100">{funStats.miles.toLocaleString()} mi</p>
              </div>
              <div>
                <p className="text-xs text-zinc-400">Est. total spend</p>
                <p className="text-lg font-bold text-zinc-100">${funStats.spend.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
