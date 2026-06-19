import { redirect } from "next/navigation";
import ProfileClient from "@/app/profile/[username]/ProfileClient";
import { getCurrentUser, getUserLogs, getUser, getWishlist, getRankings, getGames, getTeams, getVenues } from "@/lib/api";

interface Props {
  params: { username: string };
}

export default async function ProfilePage({ params }: Props) {
  const username = params.username;
  const [user, currentUser] = await Promise.all([getUser(username), getCurrentUser()]);

  if (user && currentUser?.id === user.id) redirect("/dashboard");

  if (!user) {
    const [games, teams, venues] = await Promise.all([getGames(), getTeams(), getVenues()]);
    return (
      <ProfileClient
        logs={[]}
        user={{ id: "", username, displayName: username, bio: "", homeCity: "", favoriteTeams: {}, joinedAt: "" }}
        wishlist={[]}
        rankings={[]}
        games={games}
        teams={teams}
        venues={venues}
        isOwner={false}
        currentUserId={currentUser?.id}
      />
    );
  }

  const [logs, wishlist, rankings, games, teams, venues] = await Promise.all([
    getUserLogs(user.id),
    getWishlist(user.id),
    getRankings(user.id),
    getGames(),
    getTeams(),
    getVenues(),
  ]);

  return (
    <ProfileClient
      logs={logs}
      user={user}
      wishlist={wishlist}
      rankings={rankings}
      games={games}
      teams={teams}
      venues={venues}
      isOwner={currentUser?.id === user.id}
      currentUserId={currentUser?.id}
    />
  );
}
