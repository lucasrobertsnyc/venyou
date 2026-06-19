import { notFound } from "next/navigation";
import StatsClient from "@/app/stats/StatsClient";
import { getUser, getUserLogs, getVenues, getGames, getTeams } from "@/lib/api";

interface Props {
  params: { username: string };
}

export default async function UserStatsPage({ params }: Props) {
  const user = await getUser(params.username);
  if (!user) notFound();

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
