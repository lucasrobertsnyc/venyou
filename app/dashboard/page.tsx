import { redirect } from "next/navigation";
import DashboardClient from "@/app/dashboard/DashboardClient";
import { getCurrentUser, getUserLogs, getFriends, getFriendActivity, getFriendComments, getPendingRequests, getRankings, getWishlist, getGames, getTeams, getVenues } from "@/lib/api";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [logs, friends, pendingRequests, friendActivity, friendComments, rankings, wishlist, games, teams, venues] = await Promise.all([
    getUserLogs(user.id),
    getFriends(user.id),
    getPendingRequests(user.id),
    getFriendActivity(user.id),
    getFriendComments(user.id),
    getRankings(user.id),
    getWishlist(user.id),
    getGames(),
    getTeams(),
    getVenues(),
  ]);

  return (
    <DashboardClient
      logs={logs}
      user={user}
      friends={friends}
      pendingRequests={pendingRequests}
      friendActivity={friendActivity}
      friendComments={friendComments}
      rankings={rankings}
      wishlist={wishlist}
      games={games}
      teams={teams}
      venues={venues}
    />
  );
}
