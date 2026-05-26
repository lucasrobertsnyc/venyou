"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import type { EventLog, Game, Team, Venue } from "@/types/venyou";
import { formatScore } from "@/lib/sports";
import LogForm from "@/components/LogForm";

interface Props {
  teams: Team[];
  games: Game[];
  venues: Venue[];
}

type Submitted = Omit<EventLog, "id" | "createdAt">;

export default function LogClient({ teams, games, venues }: Props) {
  const [submitted, setSubmitted] = useState<Submitted | null>(null);

  const handleSubmit = useCallback((log: Submitted) => {
    setSubmitted(log);
  }, []);

  const handleReset = useCallback(() => {
    setSubmitted(null);
  }, []);

  if (submitted) {
    const game = games.find((g) => g.id === submitted.gameId);
    const home = teams.find((t) => t.id === game?.homeTeamId);
    const away = teams.find((t) => t.id === game?.awayTeamId);
    const venue = venues.find((v) => v.id === game?.venueId);
    const score = formatScore(submitted.rating);

    return (
      <div className="min-h-screen bg-zinc-950">
        <nav className="border-b border-zinc-800 px-6 py-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-emerald-400 font-black text-lg tracking-tight">Stubs</Link>
            <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-zinc-100">Dashboard</Link>
          </div>
        </nav>
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-zinc-100 mb-2">Game logged!</h1>
          <p className="text-zinc-400 mb-8">Added to your sports passport.</p>

          <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 mb-8 text-left">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-zinc-100">
                  {away?.abbreviation} @ {home?.abbreviation}
                </h2>
                <p className="text-sm text-zinc-400">{venue?.name} · {submitted.attendedDate}</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-emerald-400">{score}</span>
                <span className="text-sm text-zinc-500 ml-1">/10</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: "Overall", val: submitted.rating.overall },
                { label: "Atmosphere", val: submitted.rating.atmosphere },
                { label: "Game", val: `${submitted.gameRating}/5` },
              ].map((s) => (
                <div key={s.label} className="bg-zinc-900 rounded-xl p-3">
                  <p className="text-lg font-bold text-zinc-100">{s.val}</p>
                  <p className="text-xs text-zinc-500">{s.label}</p>
                </div>
              ))}
            </div>
            {submitted.review && (
              <p className="mt-4 text-sm text-zinc-400 italic">&quot;{submitted.review}&quot;</p>
            )}
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={handleReset}
              className="border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              Log Another Game
            </button>
            <Link
              href="/dashboard"
              className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <nav className="border-b border-zinc-800 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-emerald-400 font-black text-lg tracking-tight">Stubs</Link>
          <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-zinc-100">Dashboard</Link>
        </div>
      </nav>
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-zinc-100">Log a Game</h1>
          <p className="text-sm text-zinc-400 mt-1">Add a game to your sports passport.</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <LogForm teams={teams} games={games} venues={venues} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
