"use client";

import { useState } from "react";
import React from "react";
import type { EventLog, Game, Team, Venue } from "@/types/venyou";
import { formatScore, RATING_CATEGORIES } from "@/lib/sports";

interface Props {
  log: EventLog;
  game: Game | undefined;
  homeTeam: Team | undefined;
  awayTeam: Team | undefined;
  venue: Venue | undefined;
  compact?: boolean;
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

const EventLogCard = React.memo(function EventLogCard({
  log, game, homeTeam, awayTeam, venue, compact = false, onDelete, onEdit,
}: Props) {
  const [expanded, setExpanded] = useState(false);

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

        {/* Expand toggle */}
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
      </div>
    </div>
  );
});

export default EventLogCard;
