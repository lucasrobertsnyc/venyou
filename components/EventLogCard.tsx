import React from "react";
import type { EventLog, Game, Team, Venue } from "@/types/venyou";
import { formatScore } from "@/lib/sports";

interface Props {
  log: EventLog;
  game: Game | undefined;
  homeTeam: Team | undefined;
  awayTeam: Team | undefined;
  venue: Venue | undefined;
  compact?: boolean;
}

const SPORT_ACCENT: Record<string, string> = {
  NFL: "#3b82f6",
  MLB: "#ef4444",
  NBA: "#f97316",
  NHL: "#38bdf8",
  MLS: "#22c55e",
};

const EventLogCard = React.memo(function EventLogCard({
  log, game, homeTeam, awayTeam, venue, compact = false,
}: Props) {
  const sport = homeTeam?.sport ?? "NFL";
  const accentColor = SPORT_ACCENT[sport] ?? "#34d399";
  const score = formatScore(log.rating);
  const scoreNum = parseFloat(score);
  const dateStr = log.attendedDate
    ? new Date(log.attendedDate + "T12:00:00").toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      })
    : "";

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors flex">
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
              {awayTeam?.abbreviation ?? "?"}{" "}
              <span className="text-zinc-500 font-normal">@</span>{" "}
              {homeTeam?.abbreviation ?? "?"}
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

          {/* Right: score */}
          <div className="shrink-0 text-right">
            <p className="text-3xl font-black leading-none tabular-nums" style={{ color: scoreNum >= 8 ? accentColor : scoreNum >= 6 ? "#a1a1aa" : "#71717a" }}>
              {score}
            </p>
            <p className="text-xs text-zinc-600 mt-0.5">/10 overall</p>
            <p className="text-xs text-zinc-600 mt-1">Game {log.gameRating}/5</p>
          </div>

        </div>

        {log.section && !compact && (
          <p className="text-xs text-zinc-600 mt-3 pt-3 border-t border-zinc-800">
            {log.section}
          </p>
        )}
      </div>
    </div>
  );
});

export default EventLogCard;
