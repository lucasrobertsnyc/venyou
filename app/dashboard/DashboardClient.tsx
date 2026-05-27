"use client";

import { useMemo, useState, useCallback, useTransition } from "react";
import Link from "next/link";
import type { EventLog, User, Game, Team, Venue } from "@/types/venyou";
import { formatScore } from "@/lib/sports";
import EventLogCard from "@/components/EventLogCard";
import ActivityFeed from "@/components/ActivityFeed";
import LogoutButton from "@/components/LogoutButton";
import { addFriendAction, removeFriendAction } from "@/app/dashboard/actions";

interface Props {
  logs: EventLog[];
  user: User;
  friends: User[];
  friendActivity: EventLog[];
  games: Game[];
  teams: Team[];
  venues: Venue[];
}

export default function DashboardClient({ logs, user, friends: initialFriends, friendActivity: initialFriendActivity, games, teams, venues }: Props) {
  const [friends, setFriends] = useState<User[]>(initialFriends);
  const [friendActivity] = useState<EventLog[]>(initialFriendActivity);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendUsername, setFriendUsername] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const myLogs = useMemo(() => logs.filter((l) => l.userId === user.id), [logs, user.id]);

  const stats = useMemo(() => {
    const sports = new Set(
      myLogs.map((l) => teams.find((t) => t.id === games.find((g) => g.id === l.gameId)?.homeTeamId)?.sport).filter(Boolean)
    );
    const venueIds = new Set(
      myLogs.map((l) => games.find((g) => g.id === l.gameId)?.venueId).filter(Boolean)
    );
    const scores = myLogs.map((l) => parseFloat(formatScore(l.rating)));
    const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : "—";
    return { total: myLogs.length, sports: sports.size, venues: venueIds.size, avg: avgScore };
  }, [myLogs, games, teams]);

  const recentLogs = useMemo(() => myLogs.slice(0, 5), [myLogs]);

  const handleAddFriend = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);
    setAddSuccess(null);
    startTransition(async () => {
      const result = await addFriendAction(user.id, friendUsername);
      if (result.error) {
        setAddError(result.error);
      } else {
        setAddSuccess(`@${friendUsername.replace(/^@/, '')} added!`);
        setFriendUsername("");
        setShowAddFriend(false);
        // Reload to get updated friend list
        window.location.reload();
      }
    });
  }, [user.id, friendUsername]);

  const handleRemoveFriend = useCallback(async (friendId: string, displayName: string) => {
    if (!confirm(`Remove ${displayName}?`)) return;
    startTransition(async () => {
      await removeFriendAction(user.id, friendId);
      setFriends((prev) => prev.filter((f) => f.id !== friendId));
    });
  }, [user.id]);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Nav */}
      <nav className="border-b border-zinc-800/60 px-6 py-4 sticky top-0 z-10 bg-zinc-950/90 backdrop-blur">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-emerald-400 font-black text-lg tracking-tight">Stubs</Link>
          <div className="flex items-center gap-6">
            <Link href="/stats" className="text-xs uppercase tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors">Stats</Link>
            <Link href={`/profile/${user.username}`} className="text-xs uppercase tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors">Profile</Link>
            <Link href="/log" className="text-sm bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
              + Log Game
            </Link>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header with inline stats */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 pb-10 border-b border-zinc-800/60">
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-600 mb-2">{user.homeCity}</p>
            <h1 className="text-3xl font-black text-zinc-100 leading-tight">{user.displayName}&apos;s<br />Sports Passport</h1>
          </div>
          <div className="flex gap-8">
            {[
              { val: stats.total, label: "Games" },
              { val: stats.venues, label: "Venues" },
              { val: stats.sports, label: "Sports" },
              { val: stats.avg, label: "Avg score" },
            ].map(({ val, label }) => (
              <div key={label} className="text-center sm:text-right">
                <p className="text-2xl font-black text-zinc-100 tabular-nums leading-none">{val}</p>
                <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Recent logs */}
          <div className="lg:col-span-2">
            <div className="flex items-baseline justify-between mb-5">
              <h2 className="text-sm font-bold text-zinc-100">Recent games</h2>
              <Link href={`/profile/${user.username}`} className="text-xs text-zinc-500 hover:text-emerald-400 transition-colors">
                All logs →
              </Link>
            </div>
            <div className="space-y-2.5">
              {recentLogs.length === 0 ? (
                <p className="text-sm text-zinc-600 py-6 text-center">No games logged yet. <Link href="/log" className="text-emerald-400 hover:text-emerald-300">Log your first →</Link></p>
              ) : recentLogs.map((log) => {
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
          <div className="space-y-8">
            {/* Nav links */}
            <div>
              <p className="text-xs uppercase tracking-widest text-zinc-600 mb-3">Jump to</p>
              <div className="space-y-px">
                {[
                  { href: "/stats", label: "Stats" },
                  { href: `/rankings/${user.username}`, label: "Rankings" },
                  { href: `/profile/${user.username}`, label: "Full profile" },
                  { href: "/log", label: "Log a game" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between py-2.5 text-sm text-zinc-400 hover:text-zinc-100 border-b border-zinc-800/50 transition-colors group"
                  >
                    {item.label}
                    <span className="text-zinc-700 group-hover:text-zinc-400 transition-colors">→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Friends */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-widest text-zinc-600">Friends</p>
                <button
                  onClick={() => { setShowAddFriend((v) => !v); setAddError(null); setAddSuccess(null); }}
                  className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-semibold"
                >
                  {showAddFriend ? "Cancel" : "+ Add"}
                </button>
              </div>

              {/* Add friend form */}
              {showAddFriend && (
                <form onSubmit={handleAddFriend} className="mb-3 space-y-2">
                  <div className="flex gap-2">
                    <input
                      value={friendUsername}
                      onChange={(e) => setFriendUsername(e.target.value)}
                      placeholder="@username"
                      autoFocus
                      className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={isPending || !friendUsername.trim()}
                      className="text-xs bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg font-semibold transition-colors"
                    >
                      {isPending ? "…" : "Add"}
                    </button>
                  </div>
                  {addError && <p className="text-xs text-red-400">{addError}</p>}
                  {addSuccess && <p className="text-xs text-emerald-400">{addSuccess}</p>}
                </form>
              )}

              {/* Friend list */}
              {friends.length === 0 ? (
                <p className="text-xs text-zinc-600 leading-relaxed">
                  No friends yet. Add someone by their username to see their game logs here.
                </p>
              ) : (
                <div className="space-y-1 mb-4">
                  {friends.map((friend) => (
                    <div key={friend.id} className="flex items-center gap-2.5 py-1.5 group">
                      <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-100 shrink-0">
                        {friend.displayName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-zinc-200 truncate">{friend.displayName}</p>
                        <p className="text-xs text-zinc-600">@{friend.username}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveFriend(friend.id, friend.displayName)}
                        className="text-zinc-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-sm leading-none"
                        title="Remove friend"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Friend activity feed */}
              {friendActivity.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs uppercase tracking-widest text-zinc-600 mb-2">Recent activity</p>
                  <ActivityFeed logs={friendActivity} users={friends} games={games} teams={teams} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
