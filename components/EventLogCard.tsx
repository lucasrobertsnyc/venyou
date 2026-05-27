"use client";

import { useState, useCallback, useRef } from "react";
import React from "react";
import type { EventLog, Game, Team, Venue, Comment } from "@/types/venyou";
import { formatScore, RATING_CATEGORIES } from "@/lib/sports";
import { fetchCommentsAction, addCommentAction, deleteCommentAction } from "@/app/dashboard/actions";

interface Props {
  log: EventLog;
  game: Game | undefined;
  homeTeam: Team | undefined;
  awayTeam: Team | undefined;
  venue: Venue | undefined;
  compact?: boolean;
  currentUserId?: string;
  onDelete?: (logId: string) => void;
  onEdit?: (log: EventLog) => void;
}

const SPORT_ACCENT: Record<string, string> = {
  NFL: "#3b82f6",
  MLB: "#ef4444",
  NBA: "#f97316",
  NHL: "#38bdf8",
  MLS: "#22c55e",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const EventLogCard = React.memo(function EventLogCard({
  log, game, homeTeam, awayTeam, venue, compact = false,
  currentUserId, onDelete, onEdit,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  // Comments state
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const sport = homeTeam?.sport ?? game?.sport ?? "NFL";
  const accentColor = SPORT_ACCENT[sport] ?? "#34d399";
  const score = formatScore(log.rating);
  const scoreNum = parseFloat(score);
  const dateStr = log.attendedDate
    ? new Date(log.attendedDate + "T12:00:00").toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      })
    : "";

  const hasAnyRating =
    Object.values(log.rating).some((v) => v > 0) || log.gameRating > 0;

  const loadComments = useCallback(async () => {
    if (commentsLoaded) return;
    setCommentsLoading(true);
    const { comments: loaded } = await fetchCommentsAction(log.id);
    setComments(loaded);
    setCommentsLoaded(true);
    setCommentsLoading(false);
  }, [log.id, commentsLoaded]);

  const handleToggleComments = useCallback(async () => {
    const opening = !commentsOpen;
    setCommentsOpen(opening);
    if (opening && !commentsLoaded) {
      await loadComments();
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commentsOpen, commentsLoaded, loadComments]);

  const handleAddComment = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || posting) return;
    setPosting(true);
    const { error, comment } = await addCommentAction(log.id, newComment);
    if (!error && comment) {
      setComments((prev) => [...prev, comment]);
      setNewComment("");
    }
    setPosting(false);
  }, [newComment, posting, log.id]);

  const handleDeleteComment = useCallback(async (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    await deleteCommentAction(commentId);
  }, []);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors flex group">
      {/* Sport color rail */}
      <div className="w-1 shrink-0" style={{ backgroundColor: accentColor }} />

      <div className="flex-1 p-4">
        <div className="flex items-start justify-between gap-3">

          {/* Left: game info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="text-xs font-black tracking-wider"
                style={{ color: accentColor }}
              >
                {sport}
              </span>
              <span className="text-zinc-700">·</span>
              <span className="text-xs text-zinc-500">{dateStr}</span>
            </div>
            <h3 className="text-sm font-bold text-zinc-100 truncate leading-snug">
              {awayTeam?.abbreviation ?? game?.awayTeamName ?? "?"}{" "}
              <span className="text-zinc-500 font-normal">@</span>{" "}
              {homeTeam?.abbreviation ?? game?.homeTeamName ?? "?"}
              {game?.homeScore != null && (
                <span className="text-zinc-500 font-normal ml-2">
                  {game.homeScore}–{game.awayScore}
                </span>
              )}
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5 truncate">{venue?.name}</p>
            {!compact && log.review && (
              <p className="text-xs text-zinc-500 mt-2.5 line-clamp-2 italic leading-relaxed">
                &quot;{log.review}&quot;
              </p>
            )}
          </div>

          {/* Right: score + actions */}
          <div className="shrink-0 text-right">
            {/* Hover-reveal action buttons */}
            {(onEdit || onDelete) && (
              <div className="flex gap-1 justify-end mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {onEdit && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onEdit(log); }}
                    className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-500 hover:text-emerald-400 hover:border-emerald-700 hover:bg-emerald-950/40 transition-colors flex items-center justify-center"
                    title="Edit log"
                  >
                    <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                    </svg>
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(log.id); }}
                    className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-500 hover:text-red-400 hover:border-red-800 hover:bg-red-950/40 transition-colors flex items-center justify-center text-sm leading-none"
                    title="Delete log"
                  >
                    ×
                  </button>
                )}
              </div>
            )}
            <p
              className="text-3xl font-black leading-none tabular-nums"
              style={{ color: !isNaN(scoreNum) && scoreNum >= 8 ? accentColor : !isNaN(scoreNum) && scoreNum >= 6 ? "#a1a1aa" : "#71717a" }}
            >
              {score}
            </p>
            {score !== "—" && <p className="text-xs text-zinc-600 mt-0.5">/10 overall</p>}
            {log.gameRating > 0 && (
              <p className="text-xs text-zinc-600 mt-1">Game {log.gameRating}/5</p>
            )}
          </div>

        </div>

        {log.section && !compact && (
          <p className="text-xs text-zinc-600 mt-3 pt-3 border-t border-zinc-800">
            {log.section}
          </p>
        )}

        {/* Expand toggle for ratings */}
        {!compact && hasAnyRating && (
          <button
            onClick={() => setExpanded((e) => !e)}
            className="mt-3 flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
            {expanded ? "Hide ratings" : "View ratings"}
          </button>
        )}

        {/* Expanded rating breakdown */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-zinc-800 space-y-2">
            {RATING_CATEGORIES.map(({ key, label }) => {
              const val = log.rating[key];
              return (
                <div key={key} className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500 w-28 shrink-0 truncate">{label}</span>
                  <div className="flex gap-0.5 flex-1">
                    {([1, 2, 3, 4, 5] as const).map((s) => (
                      <div
                        key={s}
                        className={`flex-1 h-1 rounded-full ${s <= val ? "bg-emerald-400" : "bg-zinc-700"}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-zinc-400 w-4 text-right tabular-nums shrink-0">
                    {val > 0 ? val : "—"}
                  </span>
                </div>
              );
            })}
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 w-28 shrink-0">Game quality</span>
              <div className="flex gap-0.5 flex-1">
                {([1, 2, 3, 4, 5] as const).map((s) => (
                  <div
                    key={s}
                    className={`flex-1 h-1 rounded-full ${s <= log.gameRating ? "bg-emerald-400" : "bg-zinc-700"}`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-zinc-400 w-4 text-right tabular-nums shrink-0">
                {log.gameRating > 0 ? log.gameRating : "—"}
              </span>
            </div>
          </div>
        )}

        {/* Comments toggle — only show when there's a logged-in user */}
        {!compact && currentUserId && (
          <div className={`${hasAnyRating ? "mt-1" : "mt-3"}`}>
            <button
              onClick={handleToggleComments}
              className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
              {commentsLoaded
                ? `${comments.length} comment${comments.length !== 1 ? "s" : ""}`
                : "Comments"}
            </button>

            {commentsOpen && (
              <div className="mt-3 pt-3 border-t border-zinc-800">
                {commentsLoading ? (
                  <p className="text-xs text-zinc-600 py-1">Loading…</p>
                ) : (
                  <>
                    {/* Comment list */}
                    {comments.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {comments.map((comment) => {
                          const canDelete =
                            comment.userId === currentUserId ||
                            log.userId === currentUserId;
                          return (
                            <div key={comment.id} className="flex items-start gap-2 group/comment">
                              <div className="flex-1 min-w-0">
                                <span className="text-xs font-semibold text-zinc-300">
                                  {comment.authorName}{" "}
                                </span>
                                <span className="text-xs text-zinc-400 break-words">
                                  {comment.content}
                                </span>
                                <span className="text-xs text-zinc-600 ml-1.5">
                                  {timeAgo(comment.createdAt)}
                                </span>
                              </div>
                              {canDelete && (
                                <button
                                  onClick={() => handleDeleteComment(comment.id)}
                                  className="text-zinc-700 hover:text-red-400 transition-colors opacity-0 group-hover/comment:opacity-100 text-base leading-none shrink-0 mt-0.5"
                                  title="Delete comment"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Add comment form */}
                    <form onSubmit={handleAddComment} className="flex gap-2">
                      <input
                        ref={inputRef}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment…"
                        maxLength={500}
                        className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                      <button
                        type="submit"
                        disabled={!newComment.trim() || posting}
                        className="text-xs bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0"
                      >
                        {posting ? "…" : "Post"}
                      </button>
                    </form>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

export default EventLogCard;
