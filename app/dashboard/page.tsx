import { redirect } from "next/navigation";
import DashboardClient from "@/app/dashboard/DashboardClient";
import { getCurrentUser, getUserLogs, getRecentActivity, getUsers, getGames, getTeams, getVenues } from "@/lib/api";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [logs, activity, users, games, teams, venues] = await Promise.all([
    getUserLogs(user.id),
    getRecentActivity(),
    getUsers(),
    getGames(),
    getTeams(),
    getVenues(),
  ]);

  return (
    <DashboardClient
      logs={logs}
      user={user}
      activity={activity}
      users={users}
      games={games}
      teams={teams}
      venues={venues}
    />
  );
}
