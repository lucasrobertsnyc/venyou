import HomepageClient from "@/app/HomepageClient";
import { getCurrentUser } from "@/lib/api";

export default async function HomePage() {
  const user = await getCurrentUser();
  return <HomepageClient isLoggedIn={!!user} />;
}
