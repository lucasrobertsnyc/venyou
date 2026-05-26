import VenueClient from "@/app/venue/[slug]/VenueClient";
import { getVenue, getVenueLogs } from "@/lib/api";
import { MOCK_GAMES, MOCK_TEAMS } from "@/data/events";
import { notFound } from "next/navigation";

interface Props {
  params: { slug: string };
}

export default async function VenuePage({ params }: Props) {
  const venue = await getVenue(params.slug);
  if (!venue) notFound();

  const logs = await getVenueLogs(venue.id);

  return (
    <VenueClient
      venue={venue}
      logs={logs}
      games={MOCK_GAMES}
      teams={MOCK_TEAMS}
    />
  );
}
