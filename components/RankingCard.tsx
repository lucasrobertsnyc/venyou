import React from "react";
import type { Ranking, RankingItem, Team, Venue, Game } from "@/types/venyou";

interface Props {
  ranking: Ranking;
  teams: Team[];
  venues: Venue[];
  games: Game[];
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

const RankingCard = React.memo(function RankingCard({ ranking, teams, venues, games }: Props) {
  const refTypeBadge: Record<RankingItem["refType"], string> = {
    team: "bg-blue-500/20 text-blue-400",
    venue: "bg-emerald-500/20 text-emerald-400",
    game: "bg-purple-500/20 text-purple-400",
  };

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-5">
      <h3 className="text-base font-bold text-zinc-100 mb-1">{ranking.title}</h3>
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
