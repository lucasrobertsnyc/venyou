import { redirect } from "next/navigation";
import LogClient from "@/app/log/LogClient";
import { getCurrentUser, getTeams, getGames, getVenues } from "@/lib/api";

export default async function LogPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [teams, games, venues] = await Promise.all([
    getTeams(),
    getGames(),
    getVenues(),
  ]);

  return <LogClient teams={teams} games={games} venues={venues} userId={user.id} />;
}
