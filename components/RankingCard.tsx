import React from "react";
import type { Ranking, RankingItem, Team, Venue, Game } from "@/types/venyou";

interface Props {
  ranking: Ranking;
  teams: Team[];
  venues: Venue[];
  games: Game[];
  onEdit?: (ranking: Ranking) => void;
  onDelete?: (rankingId: string) => void;
}

function RefLabel({
  item,
  teams,
  venues,
  games,
}: {
  item: RankingItem;
  teams: Team[];
  venues: Venue[];
  games: Game[];
}) {
  if (item.refType === "team") {
    const team = teams.find((t) => t.id === item.refId);
    return team ? (
      <span style={{ color: team.primaryColor }} className="font-semibold">
        {team.city} {team.name}
      </span>
    ) : null;
  }
  if (item.refType === "venue") {
    const venue = venues.find((v) => v.id === item.refId);
    return venue ? (
      <span className="font-semibold text-emerald-400">{venue.name}</span>
    ) : null;
  }
  if (item.refType === "game") {
    const game = games.find((g) => g.id === item.refId);
    const home = teams.find((t) => t.id === game?.homeTeamId);
    const away = teams.find((t) => t.id === game?.awayTeamId);
    return game ? (
      <span className="font-semibold text-zinc-100">
        {away?.abbreviation} @ {home?.abbreviation}
        {game.homeScore != null && ` (${game.homeScore}–${game.awayScore})`}
      </span>
    ) : null;
  }
  return null;
}

const RankingCard = React.memo(function RankingCard({ ranking, teams, venues, games, onEdit, onDelete }: Props) {
  const refTypeBadge: Record<RankingItem["refType"], string> = {
    team: "bg-blue-500/20 text-blue-400",
    venue: "bg-emerald-500/20 text-emerald-400",
    game: "bg-purple-500/20 text-purple-400",
  };

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-5 group">
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="text-base font-bold text-zinc-100">{ranking.title}</h3>
        {(onEdit || onDelete) && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            {onEdit && (
              <button
                onClick={() => onEdit(ranking)}
                className="w-6 h-6 rounded-full bg-zinc-700 border border-zinc-600 text-zinc-500 hover:text-emerald-400 hover:border-emerald-700 transition-colors flex items-center justify-center"
                title="Edit ranking"
              >
                <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(ranking.id)}
                className="w-6 h-6 rounded-full bg-zinc-700 border border-zinc-600 text-zinc-500 hover:text-red-400 hover:border-red-800 transition-colors flex items-center justify-center text-sm leading-none"
                title="Delete ranking"
              >
                ×
              </button>
            )}
          </div>
        )}
      </div>
      {ranking.description && (
        <p className="text-xs text-zinc-400 mb-4">{ranking.description}</p>
      )}
      <ol className="space-y-3">
        {ranking.items.map((item) => (
          <li key={item.rank} className="flex items-start gap-3">
            <span className="text-sm font-bold text-zinc-500 w-5 shrink-0 pt-0.5">
              {item.rank}.
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <RefLabel item={item} teams={teams} venues={venues} games={games} />
                <span
                  className={`text-xs font-semibold px-1.5 py-0.5 rounded ${refTypeBadge[item.refType]}`}
                >
                  {item.refType}
                </span>
              </div>
              {item.note && (
                <p className="text-xs text-zinc-500 mt-0.5 italic">&quot;{item.note}&quot;</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
});

export default RankingCard;
