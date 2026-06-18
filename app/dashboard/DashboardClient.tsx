"use client";

import { useMemo, useState, useCallback, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { EventLog, User, Game, Team, Venue, FriendComment } from "@/types/venyou";
import { ratingToScore, SPORT_BG_COLORS } from "@/lib/sports";
import EventLogCard from "@/components/EventLogCard";
import LogoutButton from "@/components/LogoutButton";
import {
  addFriendAction,
  acceptFriendAction,
  declineFriendAction,
  removeFriendAction,
  deleteLogAction,
  updateLogAction,
} from "@/app/dashboard/actions";
import EditLogModal from "@/components/EditLogModal";

interface Props {
  logs: EventLog[];
  user: User;
  friends: User[];
  pendingRequests: User[];
  friendActivity: EventLog[];
  friendComments: FriendComment[];
  games: Game[];
  teams: Team[];
  venues: Venue[];
}

export default function DashboardClient({
  logs, user,
  friends: initialFriends,
  pendingRequests: initialPending,
  friendActivity: initialFriendActivity,
  friendComments,
  games, teams, venues,
}: Props) {
  const router = useRouter();
  const [editingLog, setEditingLog] = useState<EventLog | null>(null);
  const [friends, setFriends] = useState<User[]>(initialFriends);
  const [pendingRequests, setPendingRequests] = useState<User[]>(initialPending);
  const [localLogs, setLocalLogs] = useState<EventLog[]>(logs);
  const [friendActivity] = useState<EventLog[]>(initialFriendActivity);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendUsername, setFriendUsername] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Sync state when server re-fetches (after router.refresh())
  useEffect(() => { setFriends(initialFriends); }, [initialFriends]);
  useEffect(() => { setPendingRequests(initialPending); }, [initialPending]);

  const handleEditLog = useCallback((log: EventLog) => setEditingLog(log), []);

  const handleSaveEdit = useCallback(async (logId: string, updates: Parameters<typeof updateLogAction>[1]) => {
    const result = await updateLogAction(logId, updates);
    if (!result.error) {
      setLocalLogs((prev) =>
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

  const handleDeleteLog = useCallback(async (logId: string) => {
    if (!confirm("Delete this game log?")) return;
    setLocalLogs((prev) => prev.filter((l) => l.id !== logId));
    await deleteLogAction(logId);
  }, []);

  const myLogs = useMemo(() => localLogs.filter((l) => l.userId === user.id), [localLogs, user.id]);

  const stats = useMemo(() => {
    const sports = new Set(
      myLogs.map((l) => {
        const game = games.find((g) => g.id === l.gameId);
        return teams.find((t) => t.id === game?.homeTeamId)?.sport ?? game?.sport;
      }).filter(Boolean)
    );
    const venueIds = new Set(
      myLogs.map((l) => games.find((g) => g.id === l.gameId)?.venueId).filter(Boolean)
    );
    const scores = myLogs.map((l) => ratingToScore(l.rating)).filter((s) => s > 0);
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
        const clean = friendUsername.replace(/^@/, "").toLowerCase().trim();
        if (result.wasAccepted) {
          setAddSuccess(`You and @${clean} are now friends!`);
          window.location.reload();
        } else {
          setAddSuccess(`Request sent to @${clean}!`);
          setFriendUsername("");
          setShowAddFriend(false);
        }
      }
    });
  }, [user.id, friendUsername]);

  const handleAcceptRequest = useCallback(async (requester: User) => {
    // Optimistic update
    setPendingRequests((prev) => prev.filter((r) => r.id !== requester.id));
    setFriends((prev) => [...prev, requester]);
    startTransition(async () => {
      const result = await acceptFriendAction(requester.id, user.id);
      if (result.error) {
        // Revert on failure and show error
        setPendingRequests((prev) => [...prev, requester]);
        setFriends((prev) => prev.filter((f) => f.id !== requester.id));
        setAddError(result.error);
      }
      router.refresh();
    });
  }, [user.id, router]);

  const handleDeclineRequest = useCallback(async (requesterId: string) => {
    setPendingRequests((prev) => prev.filter((r) => r.id !== requesterId));
    startTransition(async () => {
      await declineFriendAction(requesterId, user.id);
      router.refresh();
    });
  }, [user.id, router]);

  const handleRemoveFriend = useCallback(async (friendId: string, displayName: string) => {
    if (!confirm(`Remove ${displayName}?`)) return;
    setFriends((prev) => prev.filter((f) => f.id !== friendId));
    startTransition(async () => {
      await removeFriendAction(user.id, friendId);
      router.refresh();
    });
  }, [user.id, router]);

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
                <p className="text-sm text-zinc-600 py-6 text-center">
                  No games logged yet.{" "}
                  <Link href="/log" className="text-emerald-400 hover:text-emerald-300">Log your first →</Link>
                </p>
              ) : recentLogs.map((log) => {
                const game = games.find((g) => g.id === log.gameId);
                const home = teams.find((t) => t.id === game?.homeTeamId);
                const away = teams.find((t) => t.id === game?.awayTeamId);
                const venue = venues.find((v) => v.id === game?.venueId);
                return (
                  <EventLogCard key={log.id} log={log} game={game} homeTeam={home} awayTeam={away} venue={venue} currentUserId={user.id} onDelete={handleDeleteLog} onEdit={handleEditLog} />
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
                  { href: `/profile/${user.username}#wishlist`, label: "Wishlist" },
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
                <div className="flex items-center gap-2">
                  <p className="text-xs uppercase tracking-widest text-zinc-600">Friends</p>
                  {pendingRequests.length > 0 && (
                    <span className="text-xs font-bold text-white bg-emerald-500 rounded-full w-4 h-4 flex items-center justify-center leading-none">
                      {pendingRequests.length}
                    </span>
                  )}
                </div>
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
                      {isPending ? "…" : "Send"}
                    </button>
                  </div>
                  {addError && <p className="text-xs text-red-400">{addError}</p>}
                  {addSuccess && <p className="text-xs text-emerald-400">{addSuccess}</p>}
                </form>
              )}

              {/* Pending incoming requests */}
              {pendingRequests.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-zinc-500 mb-1.5">Requests</p>
                  <div className="space-y-1">
                    {pendingRequests.map((requester) => (
                      <div
                        key={requester.id}
                        className="flex items-center gap-2 py-1.5 px-2.5 bg-zinc-800 border border-zinc-700/60 rounded-lg"
                      >
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-400 shrink-0">
                          {requester.displayName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-zinc-200 truncate">{requester.displayName}</p>
                          <p className="text-xs text-zinc-600">@{requester.username}</p>
                        </div>
                        <button
                          onClick={() => handleAcceptRequest(requester)}
                          disabled={isPending}
                          className="text-emerald-400 hover:text-emerald-300 transition-colors disabled:opacity-50 text-sm font-bold"
                          title="Accept"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => handleDeclineRequest(requester.id)}
                          disabled={isPending}
                          className="text-zinc-600 hover:text-red-400 transition-colors disabled:opacity-50 text-base leading-none"
                          title="Decline"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Friend list */}
              {friends.length === 0 && pendingRequests.length === 0 ? (
                <p className="text-xs text-zinc-600 leading-relaxed">
                  No friends yet. Add someone by their username to see their game logs here.
                </p>
              ) : friends.length > 0 ? (
                <div className="space-y-1 mb-4">
                  {friends.map((friend) => (
                    <div key={friend.id} className="flex items-center gap-2.5 py-1.5 group">
                      <Link href={`/profile/${friend.username}`} className="flex items-center gap-2.5 flex-1 min-w-0 hover:opacity-80 transition-opacity">
                        <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-100 shrink-0">
                          {friend.displayName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-zinc-200 truncate">{friend.displayName}</p>
                          <p className="text-xs text-zinc-600">@{friend.username}</p>
                        </div>
                      </Link>
                      <button
                        onClick={() => handleRemoveFriend(friend.id, friend.displayName)}
                        className="text-zinc-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-sm leading-none shrink-0"
                        title="Remove friend"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Unified friend activity feed */}
              {(friendActivity.length > 0 || friendComments.length > 0) && (() => {
                const timeAgo = (iso: string) => {
                  const diff = Date.now() - new Date(iso).getTime();
                  const m = Math.floor(diff / 60000);
                  if (m < 60) return `${m}m ago`;
                  const h = Math.floor(m / 60);
                  if (h < 24) return `${h}h ago`;
                  return `${Math.floor(h / 24)}d ago`;
                };

                type FeedItem =
                  | { kind: "log"; createdAt: string; log: typeof friendActivity[0] }
                  | { kind: "comment"; createdAt: string; comment: typeof friendComments[0] };

                const items: FeedItem[] = [
                  ...friendActivity.map((log) => ({ kind: "log" as const, createdAt: log.createdAt, log })),
                  ...friendComments.map((comment) => ({ kind: "comment" as const, createdAt: comment.createdAt, comment })),
                ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 15);

                return (
                  <div className="mt-2">
                    <p className="text-xs uppercase tracking-widest text-zinc-600 mb-2">Friends&apos; recent activity</p>
                    <div className="space-y-2">
                      {items.map((item) => {
                        if (item.kind === "log") {
                          const { log } = item;
                          const friend = friends.find((u) => u.id === log.userId);
                          const game = games.find((g) => g.id === log.gameId);
                          const home = teams.find((t) => t.id === game?.homeTeamId);
                          const away = teams.find((t) => t.id === game?.awayTeamId);
                          const sport = home?.sport ?? "NFL";
                          const href = friend ? `/profile/${friend.username}#log-${log.id}` : "#";
                          return (
                            <Link key={`log-${log.id}`} href={href} className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 flex items-center gap-3 hover:border-zinc-500 transition-colors block">
                              <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-100 shrink-0">
                                {friend?.displayName.charAt(0) ?? "?"}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-zinc-100">
                                  <span className="font-semibold">{friend?.displayName}</span>
                                  <span className="text-zinc-400"> logged </span>
                                  <span className="font-medium">{away?.abbreviation ?? "?"} @ {home?.abbreviation ?? "?"}</span>
                                </p>
                                <p className="text-xs text-zinc-500">{timeAgo(log.createdAt)}</p>
                              </div>
                              <span className={`text-xs font-bold px-1.5 py-0.5 rounded text-white shrink-0 ${SPORT_BG_COLORS[sport]}`}>{sport}</span>
                            </Link>
                          );
                        }

                        const { comment: c } = item;
                        const home = teams.find((t) => t.id === c.homeTeamId);
                        const away = teams.find((t) => t.id === c.awayTeamId);
                        const gameLabel = home && away ? `${away.abbreviation} @ ${home.abbreviation}` : "a game";
                        const href = c.logOwnerUsername ? `/profile/${c.logOwnerUsername}#log-${c.logId}` : "#";
                        return (
                          <Link key={`comment-${c.id}`} href={href} className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 hover:border-zinc-500 transition-colors block">
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-100 shrink-0">
                                  {c.authorName.charAt(0)}
                                </div>
                                <p className="text-xs text-zinc-100 truncate">
                                  <span className="font-semibold">{c.authorName}</span>
                                  <span className="text-zinc-400"> commented on </span>
                                  <span className="font-medium">{gameLabel}</span>
                                </p>
                              </div>
                              <span className="text-xs text-zinc-600 shrink-0">{timeAgo(c.createdAt)}</span>
                            </div>
                            <p className="text-xs text-zinc-400 pl-9 line-clamp-2 italic">&ldquo;{c.content}&rdquo;</p>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
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
