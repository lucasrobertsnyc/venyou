import DashboardClient from "@/app/dashboard/DashboardClient";
import { getUserLogs, getUser, getRecentActivity } from "@/lib/api";
import { MOCK_USERS, MOCK_GAMES, MOCK_TEAMS, MOCK_VENUES } from "@/data/events";

export default async function DashboardPage() {
  const [logs, user, activity] = await Promise.all([
    getUserLogs("demo1"),
    getUser("demo1"),
    getRecentActivity(),
  ]);

  return (
    <DashboardClient
      logs={logs}
      user={user!}
      activity={activity}
      users={MOCK_USERS}
      games={MOCK_GAMES}
      teams={MOCK_TEAMS}
      venues={MOCK_VENUES}
    />
  );
}
