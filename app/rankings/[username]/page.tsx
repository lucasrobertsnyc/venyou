import { redirect } from "next/navigation";
import RankingsClient from "@/app/rankings/[username]/RankingsClient";
import { getCurrentUser, getRankings, getUser, getTeams, getVenues, getGames } from "@/lib/api";

interface Props {
  params: { username: string };
}

export default async function RankingsPage({ params }: Props) {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  const profileUser = await getUser(params.username);
  const targetUser = profileUser ?? currentUser;

  const [rankings, teams, venues, games] = await Promise.all([
    getRankings(targetUser.id),
    getTeams(),
    getVenues(),
    getGames(),
  ]);

  return (
    <RankingsClient
      rankings={rankings}
      user={targetUser}
      teams={teams}
      venues={venues}
      games={games}
      isOwner={currentUser.id === targetUser.id}
    />
  );
}
