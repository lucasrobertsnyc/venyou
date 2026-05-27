import { redirect } from "next/navigation";
import DashboardClient from "@/app/dashboard/DashboardClient";
import { getCurrentUser, getUserLogs, getFriends, getFriendActivity, getGames, getTeams, getVenues } from "@/lib/api";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [logs, friends, friendActivity, games, teams, venues] = await Promise.all([
    getUserLogs(user.id),
    getFriends(user.id),
    getFriendActivity(user.id),
    getGames(),
    getTeams(),
    getVenues(),
  ]);

  return (
    <DashboardClient
      logs={logs}
      user={user}
      friends={friends}
      friendActivity={friendActivity}
      games={games}
      teams={teams}
      venues={venues}
    />
  );
}
