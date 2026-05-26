import ProfileClient from "@/app/profile/[username]/ProfileClient";
import { getUserLogs, getUser, getWishlist } from "@/lib/api";
import { MOCK_GAMES, MOCK_TEAMS, MOCK_VENUES } from "@/data/events";

interface Props {
  params: { username: string };
}

export default async function ProfilePage({ params }: Props) {
  const username = params.username;
  const userId = username === "demo2" ? "demo2" : "demo1";

  const [logs, user, wishlist] = await Promise.all([
    getUserLogs(userId),
    getUser(username),
    getWishlist(userId),
  ]);

  return (
    <ProfileClient
      logs={logs}
      user={user ?? { id: userId, username, displayName: username, bio: "", homeCity: "", favoriteTeams: {}, joinedAt: "" }}
      wishlist={wishlist}
      games={MOCK_GAMES}
      teams={MOCK_TEAMS}
      venues={MOCK_VENUES}
    />
  );
}
