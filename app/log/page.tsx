import { redirect } from "next/navigation";
import LogClient from "@/app/log/LogClient";
import { getCurrentUser, getTeams, getVenues } from "@/lib/api";

export default async function LogPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [teams, venues] = await Promise.all([getTeams(), getVenues()]);

  return <LogClient userId={user.id} teams={teams} venues={venues} />;
}
