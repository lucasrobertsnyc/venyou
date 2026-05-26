"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { EventLog, User, Game, Team, Venue } from "@/types/venyou";
import { formatScore } from "@/lib/sports";
import EventLogCard from "@/components/EventLogCard";
import ActivityFeed from "@/components/ActivityFeed";
import StatCard from "@/components/StatCard";

interface Props {
  logs: EventLog[];
  user: User;
  activity: EventLog[];
  users: User[];
  games: Game[];
  teams: Team[];
  venues: Venue[];
}

export default function DashboardClient({ logs, user, activity, users, games, teams, venues }: Props) {
  const myLogs = useMemo(() => logs.filter((l) => l.userId === "demo1"), [logs]);

  const stats = useMemo(() => {
    const sports = new Set(
      myLogs.map((l) => teams.find((t) => t.id === games.find((g) => g.id === l.gameId)?.homeTeamId)?.sport).filter(Boolean)
    );
    const venueIds = new Set(
      myLogs.map((l) => games.find((g) => g.id === l.gameId)?.venueId).filter(Boolean)
    );
    const scores = myLogs.map((l) => parseFloat(formatScore(l.rating)));
    const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : "—";

    return {
      total: myLogs.length,
      sports: sports.size,
      venues: venueIds.size,
      avg: avgScore,
    };
  }, [myLogs, games, teams]);

  const recentLogs = useMemo(() => myLogs.slice(0, 5), [myLogs]);
  const friendActivity = useMemo(
    () => activity.filter((l) => l.userId !== "demo1").slice(0, 5),
    [activity]
  );

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Nav */}
      <nav className="border-b border-zinc-800 px-6 py-4 sticky top-0 z-10 bg-zinc-950/90 backdrop-blur">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-emerald-400 font-black text-lg tracking-tight">VenYou</Link>
          <div className="flex items-center gap-4">
            <Link href="/stats" className="text-sm text-zinc-400 hover:text-zinc-100">Stats</Link>
            <Link href={`/profile/${user.username}`} className="text-sm text-zinc-400 hover:text-zinc-100">Profile</Link>
            <Link href="/log" className="text-sm bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-full font-semibold transition-colors">
              + Log Game
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-zinc-400">Welcome back,</p>
          <h1 className="text-2xl font-black text-zinc-100">{user.displayName}</h1>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <StatCard label="Games Logged" value={stats.total} accent />
          <StatCard label="Sports" value={stats.sports} />
          <StatCard label="Venues Visited" value={stats.venues} />
          <StatCard label="Avg Score" value={stats.avg} sub="out of 10" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent logs */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">Recent Games</h2>
              <Link href={`/profile/${user.username}`} className="text-xs text-emerald-400 hover:text-emerald-300">
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {recentLogs.map((log) => {
                const game = games.find((g) => g.id === log.gameId);
                const home = teams.find((t) => t.id === game?.homeTeamId);
                const away = teams.find((t) => t.id === game?.awayTeamId);
                const venue = venues.find((v) => v.id === game?.venueId);
                return (
                  <EventLogCard key={log.id} log={log} game={game} homeTeam={home} awayTeam={away} venue={venue} />
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick links */}
            <div>
              <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wider mb-4">Quick Links</h2>
              <div className="space-y-2">
                {[
                  { href: "/stats", label: "View your stats" },
                  { href: `/rankings/${user.username}`, label: "Your rankings" },
                  { href: `/profile/${user.username}`, label: "Your profile" },
                  { href: "/log", label: "Log a game" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-300 hover:border-emerald-500 hover:text-zinc-100 transition-colors"
                  >
                    {item.label}
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>

            {/* Friend activity */}
            {friendActivity.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wider mb-4">Friend Activity</h2>
                <ActivityFeed logs={friendActivity} users={users} games={games} teams={teams} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
