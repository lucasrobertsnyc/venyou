import { redirect } from "next/navigation";
import HomepageClient from "@/app/HomepageClient";
import { getCurrentUser } from "@/lib/api";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");
  return <HomepageClient />;
}
