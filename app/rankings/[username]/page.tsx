import RankingsClient from "@/app/rankings/[username]/RankingsClient";
import { getRankings, getUser } from "@/lib/api";
import { MOCK_TEAMS, MOCK_VENUES, MOCK_GAMES } from "@/data/events";

interface Props {
  params: { username: string };
}

export default async function RankingsPage({ params }: Props) {
  const [rankings, user] = await Promise.all([
    getRankings(params.username === "demo1" || params.username === "demo2" ? params.username : "demo1"),
    getUser(params.username),
  ]);

  return (
    <RankingsClient
      rankings={rankings}
      user={user ?? { id: "demo1", username: params.username, displayName: params.username, bio: "", homeCity: "", favoriteTeams: {}, joinedAt: "" }}
      teams={MOCK_TEAMS}
      venues={MOCK_VENUES}
      games={MOCK_GAMES}
    />
  );
}
