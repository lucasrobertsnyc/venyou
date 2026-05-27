import { redirect } from "next/navigation";
import LogClient from "@/app/log/LogClient";
import { getCurrentUser } from "@/lib/api";

export default async function LogPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <LogClient userId={user.id} />;
}
