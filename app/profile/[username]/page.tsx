import ProfileClient from "@/app/profile/[username]/ProfileClient";
import { getUserLogs, getUser, getWishlist, getGames, getTeams, getVenues } from "@/lib/api";

interface Props {
  params: { username: string };
}

export default async function ProfilePage({ params }: Props) {
  const username = params.username;
  const user = await getUser(username);

  if (!user) {
    const [games, teams, venues] = await Promise.all([getGames(), getTeams(), getVenues()]);
    return (
      <ProfileClient
        logs={[]}
        user={{ id: "", username, displayName: username, bio: "", homeCity: "", favoriteTeams: {}, joinedAt: "" }}
        wishlist={[]}
        games={games}
        teams={teams}
        venues={venues}
      />
    );
  }

  const [logs, wishlist, games, teams, venues] = await Promise.all([
    getUserLogs(user.id),
    getWishlist(user.id),
    getGames(),
    getTeams(),
    getVenues(),
  ]);

  return (
    <ProfileClient
      logs={logs}
      user={user}
      wishlist={wishlist}
      games={games}
      teams={teams}
      venues={venues}
    />
  );
}
