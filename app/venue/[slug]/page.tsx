import VenueClient from "@/app/venue/[slug]/VenueClient";
import { getVenue, getVenueLogs, getGames, getTeams } from "@/lib/api";
import { notFound } from "next/navigation";

interface Props {
  params: { slug: string };
}

export default async function VenuePage({ params }: Props) {
  const venue = await getVenue(params.slug);
  if (!venue) notFound();

  const [logs, games, teams] = await Promise.all([
    getVenueLogs(venue.id),
    getGames(),
    getTeams(),
  ]);

  return (
    <VenueClient
      venue={venue}
      logs={logs}
      games={games}
      teams={teams}
    />
  );
}
