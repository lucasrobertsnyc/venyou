import React from "react";
import type { EventLog, Game, Team, Venue } from "@/types/venyou";
import { formatScore } from "@/lib/sports";
import { SPORT_TEXT_COLORS, SPORT_BG_COLORS } from "@/lib/sports";

interface Props {
  log: EventLog;
  game: Game | undefined;
  homeTeam: Team | undefined;
  awayTeam: Team | undefined;
  venue: Venue | undefined;
  compact?: boolean;
}

const EventLogCard = React.memo(function EventLogCard({
  log, game, homeTeam, awayTeam, venue, compact = false,
}: Props) {
  const sport = homeTeam?.sport ?? "NFL";
  const sportText = SPORT_TEXT_COLORS[sport];
  const sportBg = SPORT_BG_COLORS[sport];
  const score = formatScore(log.rating);
  const dateStr = log.attendedDate
    ? new Date(log.attendedDate + "T12:00:00").toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      })
    : "";

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 hover:border-zinc-600 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${sportBg}`}>
              {sport}
            </span>
            <span className="text-xs text-zinc-500">{dateStr}</span>
          </div>
          <h3 className="text-sm font-semibold text-zinc-100 truncate">
            {awayTeam?.abbreviation ?? "?"} @ {homeTeam?.abbreviation ?? "?"}{" "}
            {game?.homeScore != null && (
              <span className="text-zinc-400 font-normal">
                — {game.homeScore}–{game.awayScore}
              </span>
            )}
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5 truncate">{venue?.name}</p>
          {!compact && log.review && (
            <p className="text-xs text-zinc-400 mt-2 line-clamp-2 italic">"{log.review}"</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="text-right">
            <span className={`text-2xl font-bold ${sportText}`}>{score}</span>
            <span className="text-xs text-zinc-500 ml-1">/10</span>
          </div>
          <span className="text-xs text-zinc-500">Game: {log.gameRating}/5</span>
        </div>
      </div>
      {log.section && (
        <div className="mt-2 pt-2 border-t border-zinc-700">
          <span className="text-xs text-zinc-500">Section: {log.section}</span>
        </div>
      )}
    </div>
  );
});

export default EventLogCard;
