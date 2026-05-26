"use client";

import Link from "next/link";
import type { Ranking, User, Team, Venue, Game } from "@/types/venyou";
import RankingCard from "@/components/RankingCard";

interface Props {
  rankings: Ranking[];
  user: User;
  teams: Team[];
  venues: Venue[];
  games: Game[];
}

export default function RankingsClient({ rankings, user, teams, venues, games }: Props) {
  return (
    <div className="min-h-screen bg-zinc-950">
      <nav className="border-b border-zinc-800 px-6 py-4 sticky top-0 z-10 bg-zinc-950/90 backdrop-blur">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-emerald-400 font-black text-lg tracking-tight">VenYou</Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-zinc-100">Dashboard</Link>
            <Link href={`/profile/${user.username}`} className="text-sm text-zinc-400 hover:text-zinc-100">Profile</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-zinc-100">{user.displayName}&apos;s Rankings</h1>
            <p className="text-sm text-zinc-400 mt-1">
              @{user.username} · {rankings.length} ranking{rankings.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button className="border border-zinc-700 hover:border-emerald-500 text-zinc-300 hover:text-emerald-400 font-semibold text-sm px-4 py-2 rounded-xl transition-colors">
            + Create a Ranking
          </button>
        </div>

        {rankings.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500">No rankings yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {rankings.map((r) => (
              <RankingCard key={r.id} ranking={r} teams={teams} venues={venues} games={games} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
