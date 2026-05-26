import StatsClient from "@/app/stats/StatsClient";
import { getUserLogs, getVenues } from "@/lib/api";
import { MOCK_GAMES, MOCK_TEAMS } from "@/data/events";

export default async function StatsPage() {
  const [logs, venues] = await Promise.all([getUserLogs("demo1"), getVenues()]);
  return (
    <StatsClient
      logs={logs}
      venues={venues}
      games={MOCK_GAMES}
      teams={MOCK_TEAMS}
    />
  );
}
