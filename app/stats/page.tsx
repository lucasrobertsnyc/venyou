import { redirect } from "next/navigation";
import StatsClient from "@/app/stats/StatsClient";
import { getCurrentUser, getUserLogs, getVenues, getGames, getTeams } from "@/lib/api";

export default async function StatsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [logs, venues, games, teams] = await Promise.all([
    getUserLogs(user.id),
    getVenues(),
    getGames(),
    getTeams(),
  ]);

  return (
    <StatsClient
      logs={logs}
      venues={venues}
      games={games}
      teams={teams}
      username={user.username}
    />
  );
}
