import type { EventLog, Game, Team, User } from "@/types/venyou";
import { formatScore, SPORT_BG_COLORS } from "@/lib/sports";

interface Props {
  logs: EventLog[];
  users: User[];
  games: Game[];
  teams: Team[];
}

export default function ActivityFeed({ logs, users, games, teams }: Props) {
  return (
    <div className="space-y-3">
      {logs.map((log) => {
        const user = users.find((u) => u.id === log.userId);
        const game = games.find((g) => g.id === log.gameId);
        const home = teams.find((t) => t.id === game?.homeTeamId);
        const away = teams.find((t) => t.id === game?.awayTeamId);
        const sport = home?.sport ?? "NFL";
        const sportBg = SPORT_BG_COLORS[sport];
        const score = formatScore(log.rating);
        const dateStr = new Date(log.createdAt).toLocaleDateString("en-US", {
          month: "short", day: "numeric",
        });

        return (
          <div
            key={log.id}
            className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-bold text-zinc-100 shrink-0">
              {user?.displayName.charAt(0) ?? "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-zinc-100">
                <span className="font-semibold">{user?.displayName}</span>{" "}
                <span className="text-zinc-400">logged</span>{" "}
                <span className="font-medium">{away?.abbreviation} @ {home?.abbreviation}</span>
              </p>
              <p className="text-xs text-zinc-500">{dateStr}</p>
            </div>
            <div className="shrink-0 flex flex-col items-end">
              <span className="text-sm font-bold text-emerald-400">{score}</span>
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded text-white ${sportBg}`}>
                {sport}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
