"use client";

import { useMemo, useState, useCallback, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { EventLog, User, Game, Team, Venue, FriendComment, Ranking, WantToAttend } from "@/types/venyou";
import type { Sport } from "@/types/venyou";
import { ratingToScore, SPORT_BG_COLORS } from "@/lib/sports";
import { TEAM_HOME_VENUE } from "@/lib/venues";
import EventLogCard from "@/components/EventLogCard";
import LogoutButton from "@/components/LogoutButton";
import TeamBadge from "@/components/TeamBadge";
import SportFilter from "@/components/SportFilter";
import RankingCard from "@/components/RankingCard";
import WishlistSection from "@/components/WishlistSection";
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
  rankings: Ranking[];
  wishlist: WantToAttend[];
  games: Game[];
  teams: Team[];
  venues: Venue[];
}

export default function DashboardClient({
  logs,
  user,
  friends: initialFriends,
  pendingRequests: initialPending,
  friendActivity: initialFriendActivity,
  friendComments,
  rankings,
  wishlist,
  games,
  teams,
  venues,
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
  const [sportFilter, setSportFilter] = useState<Sport | "all">("all");

  useEffect(() => { setFriends(initialFriends); }, [initialFriends]);
  useEffect(() => { setPendingRequests(initialPending); }, [initialPending]);

  // Scroll to a specific log when navigated via a hash link
  useEffect(() => {
    let id: ReturnType<typeof setTimeout>;
    const attempt = (remaining: number) => {
      const hash = window.location.hash;
      if (hash.startsWith("#log-")) {
        const el = document.getElementById(hash.slice(1));
        if (el) { el.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
      }
      if (remaining > 0) id = setTimeout(() => attempt(remaining - 1), 100);
    };
    id = setTimeout(() => attempt(20), 50);
    return () => clearTimeout(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleSportChange = useCallback((s: Sport | "all") => {
    startTransition(() => setSportFilter(s));
  }, []);

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
    setPendingRequests((prev) => prev.filter((r) => r.id !== requester.id));
    setFriends((prev) => [...prev, requester]);
    startTransition(async () => {
      const result = await acceptFriendAction(requester.id, user.id);
      if (result.error) {
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

  const logWithMeta = useMemo(
    () =>
      [...localLogs]
        .sort((a, b) => {
          const da = new Date(a.attendedDate ?? a.createdAt).getTime();
          const db = new Date(b.attendedDate ?? b.createdAt).getTime();
          return db - da;
        })
        .map((l) => {
          const game = games.find((g) => g.id === l.gameId);
          const home = teams.find((t) => t.id === game?.homeTeamId);
          return { ...l, sport: home?.sport ?? game?.sport, venueId: game?.venueId };
        }),
    [localLogs, games, teams]
  );

  const filtered = useMemo(
    () => sportFilter === "all" ? logWithMeta : logWithMeta.filter((l) => l.sport === sportFilter),
    [logWithMeta, sportFilter]
  );

  const groupedLogs = useMemo(() => {
    const groups: { label: string; items: typeof filtered }[] = [];
    const seen = new Map<string, number>();
    for (const log of filtered) {
      const dateStr = log.attendedDate ?? log.createdAt;
      const date = new Date(dateStr + (log.attendedDate ? "T12:00:00" : ""));
      const label = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      if (!seen.has(label)) { seen.set(label, groups.length); groups.push({ label, items: [] }); }
      groups[seen.get(label)!].items.push(log);
    }
    return groups;
  }, [filtered]);

  const stats = useMemo(() => {
    const sports = new Set(logWithMeta.map((l) => l.sport).filter(Boolean));
    const venueIds = new Set(logWithMeta.map((l) => l.venueId).filter(Boolean));
    const scores = logWithMeta.map((l) => ratingToScore(l.rating)).filter((s) => s > 0);
    const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : "—";
    return { total: logWithMeta.length, sports: sports.size, venues: venueIds.size, avg: avgScore };
  }, [logWithMeta]);

  const favoriteTeams = useMemo(
    () => Object.values(user.favoriteTeams).map((id) => teams.find((t) => t.id === id)).filter(Boolean) as Team[],
    [user.favoriteTeams, teams]
  );

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Nav */}
      <nav className="border-b border-zinc-800/60 px-6 py-4 sticky top-0 z-10 bg-zinc-950/90 backdrop-blur">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-emerald-400 font-black text-lg tracking-tight">Stubs</Link>
          <div className="flex items-center gap-6">
            <Link href="/stats" className="text-xs uppercase tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors">Stats</Link>
            <Link href="/log" className="text-sm bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
              + Log Game
            </Link>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">

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
            <a
              href="#rankings"
              className="text-sm border border-zinc-700 hover:border-emerald-500 text-zinc-300 hover:text-emerald-400 px-4 py-2 rounded-xl transition-colors shrink-0"
            >
              Rankings {rankings.length > 0 && `(${rankings.length})`}
            </a>
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
              {favoriteTeams.map((t) => <TeamBadge key={t.id} team={t} size="sm" />)}
            </div>
          )}
          <p className="text-xs text-zinc-600 mt-3">Member since {new Date(user.joinedAt).getFullYear()}</p>
        </div>

        {/* Sport filter */}
        <div className="mb-6">
          <SportFilter selected={sportFilter} onChange={handleSportChange} />
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-10">

            {/* Games — grouped by month */}
            <div id="games">
              {groupedLogs.length === 0 ? (
                <p className="text-sm text-zinc-600 py-8 text-center">
                  {sportFilter === "all" ? (
                    <>No games logged yet. <Link href="/log" className="text-emerald-400 hover:text-emerald-300">Log your first →</Link></>
                  ) : (
                    "No games logged for this sport yet."
                  )}
                </p>
              ) : (
                groupedLogs.map((group) => (
                  <div key={group.label} className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">{group.label}</span>
                      <div className="flex-1 h-px bg-zinc-800" />
                      <span className="text-xs text-zinc-600">{group.items.length}</span>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {group.items.map((log) => {
                        const game = games.find((g) => g.id === log.gameId);
                        const home = teams.find((t) => t.id === game?.homeTeamId);
                        const away = teams.find((t) => t.id === game?.awayTeamId);
                        const venue =
                          venues.find((v) => v.id === game?.venueId) ??
                          (home ? venues.find((v) => v.id === TEAM_HOME_VENUE[home.id]) : undefined);
                        return (
                          <div key={log.id} id={`log-${log.id}`} className="scroll-mt-24">
                            <EventLogCard log={log} game={game} homeTeam={home} awayTeam={away} venue={venue} currentUserId={user.id} onDelete={handleDeleteLog} onEdit={handleEditLog} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Rankings */}
            <div id="rankings">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-widest text-zinc-600">Rankings</p>
                <Link
                  href={`/rankings/${user.username}`}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                >
                  Manage →
                </Link>
              </div>
              {rankings.length > 0 ? (
                <div className="space-y-3">
                  {rankings.map((r) => (
                    <RankingCard key={r.id} ranking={r} teams={teams} venues={venues} games={games} />
                  ))}
                </div>
              ) : (
                <p className="text-zinc-500 text-xs text-center py-4">
                  No rankings yet.{" "}
                  <Link href={`/rankings/${user.username}`} className="text-emerald-400 hover:text-emerald-300">
                    Create one →
                  </Link>
                </p>
              )}
            </div>

            {/* Wishlist */}
            <div id="wishlist">
              <WishlistSection initialWishlist={wishlist} teams={teams} venues={venues} isOwner={true} />
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
                            <Link key={`log-${log.id}`} href={href} scroll={false} className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 flex items-center gap-3 hover:border-zinc-500 transition-colors block">
                              <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-100 shrink-0">
                                {friend?.displayName.charAt(0) ?? "?"}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-zinc-100 truncate">
                                  <span className="font-semibold">{friend?.displayName}</span>
                                  <span className="text-zinc-400"> logged </span>
                                  <span className="font-medium">{away?.abbreviation ?? "?"} @ {home?.abbreviation ?? "?"}</span>
                                </p>
                                <p className="text-xs text-zinc-500 mt-0.5">{timeAgo(log.createdAt)}</p>
                              </div>
                              <span className={`text-xs font-bold px-1.5 py-0.5 rounded text-white shrink-0 ${SPORT_BG_COLORS[sport]}`}>{sport}</span>
                            </Link>
                          );
                        }

                        const { comment: c } = item;
                        const home = teams.find((t) => t.id === c.homeTeamId);
                        const away = teams.find((t) => t.id === c.awayTeamId);
                        const sport = home?.sport ?? "NFL";
                        const gameLabel = home && away ? `${away.abbreviation} @ ${home.abbreviation}` : "a game";
                        const href = c.logOwnerUsername ? `/profile/${c.logOwnerUsername}#log-${c.logId}` : "#";
                        return (
                          <Link key={`comment-${c.id}`} href={href} scroll={false} className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 flex items-start gap-3 hover:border-zinc-500 transition-colors block">
                            <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-100 shrink-0 mt-0.5">
                              {c.authorName.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-zinc-100 truncate">
                                <span className="font-semibold">{c.authorName}</span>
                                <span className="text-zinc-400"> commented on </span>
                                <span className="font-medium">{gameLabel}</span>
                              </p>
                              <p className="text-xs text-zinc-500 mt-0.5">{timeAgo(c.createdAt)}</p>
                              <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2 italic">&ldquo;{c.content}&rdquo;</p>
                            </div>
                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded text-white shrink-0 mt-0.5 ${SPORT_BG_COLORS[sport]}`}>{sport}</span>
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
