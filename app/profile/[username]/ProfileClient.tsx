"use client";

import { useState, useMemo, useCallback, useTransition, useEffect } from "react";
import Link from "next/link";
import type { EventLog, User, Game, Team, Venue, WantToAttend } from "@/types/venyou";
import type { Sport } from "@/types/venyou";
import { ratingToScore } from "@/lib/sports";
import EventLogCard from "@/components/EventLogCard";
import SportFilter from "@/components/SportFilter";
import TeamBadge from "@/components/TeamBadge";
import { deleteLogAction, updateLogAction } from "@/app/dashboard/actions";
import EditLogModal from "@/components/EditLogModal";
import WishlistSection from "@/components/WishlistSection";

interface Props {
  logs: EventLog[];
  user: User;
  wishlist: WantToAttend[];
  games: Game[];
  teams: Team[];
  venues: Venue[];
  isOwner: boolean;
  currentUserId?: string;
}

export default function ProfileClient({ logs: initialLogs, user, wishlist, games, teams, venues, isOwner, currentUserId }: Props) {
  const [logs, setLogs] = useState<EventLog[]>(initialLogs);
  const [editingLog, setEditingLog] = useState<EventLog | null>(null);
  const [sportFilter, setSportFilter] = useState<Sport | "all">("all");
  const [, startTransition] = useTransition();

  const handleDeleteLog = useCallback(async (logId: string) => {
    if (!confirm('Delete this game log?')) return;
    setLogs((prev) => prev.filter((l) => l.id !== logId));
    await deleteLogAction(logId);
  }, []);

  const handleEditLog = useCallback((log: EventLog) => setEditingLog(log), []);

  const handleSaveEdit = useCallback(async (logId: string, updates: Parameters<typeof updateLogAction>[1]) => {
    const result = await updateLogAction(logId, updates);
    if (!result.error) {
      setLogs((prev) =>
        prev.map((l) =>
          l.id === logId
            ? {
                ...l,
                rating: {
                  overall: updates.overall, atmosphere: updates.atmosphere,
                  crowdEnergy: updates.crowdEnergy, seatViewQuality: updates.seatViewQuality,
                  foodDrinks: updates.foodDrinks, entrySecurity: updates.entrySecurity,
                  bathroomsLines: updates.bathroomsLines, parkingTransit: updates.parkingTransit,
                  valueForMoney: updates.valueForMoney,
                } as EventLog["rating"],
                gameRating: updates.gameRating as EventLog["gameRating"],
                review: updates.review,
                section: updates.section,
              }
            : l
        )
      );
      setEditingLog(null);
    }
  }, []);

  const handleSportChange = useCallback((s: Sport | "all") => {
    startTransition(() => setSportFilter(s));
  }, []);

  // Scroll to a specific log when navigated here via hash link (e.g. from the dashboard activity feed)
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.startsWith("#log-")) return;
    const logId = hash.slice("#log-".length);
    if (!logs.find((l) => l.id === logId)) return;
    // Reset sport filter so the target log is visible regardless of sport
    setSportFilter("all");
    const timer = setTimeout(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logWithMeta = useMemo(
    () =>
      logs.map((l) => {
        const game = games.find((g) => g.id === l.gameId);
        const home = teams.find((t) => t.id === game?.homeTeamId);
        return { ...l, sport: home?.sport ?? game?.sport, venueId: game?.venueId };
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
    const scores = logWithMeta.map((l) => ratingToScore(l.rating)).filter((s) => s > 0);
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
          <Link href="/" className="text-emerald-400 font-black text-lg tracking-tight">Stubs</Link>
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
              <div key={log.id} id={`log-${log.id}`} className="scroll-mt-24">
                <EventLogCard log={log} game={game} homeTeam={home} awayTeam={away} venue={venue} currentUserId={currentUserId} onDelete={isOwner ? handleDeleteLog : undefined} onEdit={isOwner ? handleEditLog : undefined} />
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-zinc-500 text-sm col-span-2 text-center py-12">No games logged for this sport yet.</p>
          )}
        </div>

        {/* Wishlist */}
        <WishlistSection
          initialWishlist={wishlist}
          teams={teams}
          venues={venues}
          isOwner={isOwner}
        />
      </div>

      {editingLog && (() => {
        const game = games.find((g) => g.id === editingLog.gameId);
        const home = teams.find((t) => t.id === game?.homeTeamId);
        const away = teams.find((t) => t.id === game?.awayTeamId);
        return (
          <EditLogModal
            log={editingLog}
            game={game}
            homeTeam={home}
            awayTeam={away}
            onSave={handleSaveEdit}
            onClose={() => setEditingLog(null)}
          />
        );
      })()}
    </div>
  );
}
