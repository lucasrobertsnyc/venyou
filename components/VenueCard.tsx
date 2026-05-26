import React from "react";
import Link from "next/link";
import type { Venue, EventLog } from "@/types/venyou";
import { formatScore, SPORT_BG_COLORS } from "@/lib/sports";

interface Props {
  venue: Venue;
  logs?: EventLog[];
}

const VenueCard = React.memo(function VenueCard({ venue, logs = [] }: Props) {
  const sportBg = SPORT_BG_COLORS[venue.sport];
  const avgScore =
    logs.length > 0
      ? (logs.reduce((sum, l) => sum + parseFloat(formatScore(l.rating)), 0) / logs.length).toFixed(1)
      : null;

  return (
    <Link href={`/venue/${venue.slug}`} className="block">
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 hover:border-emerald-500 transition-colors group">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${sportBg}`}>
                {venue.sport}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors truncate">
              {venue.name}
            </h3>
            <p className="text-xs text-zinc-400">
              {venue.city}, {venue.state}
            </p>
            <p className="text-xs text-zinc-500">
              Cap. {venue.capacity.toLocaleString()}
            </p>
          </div>
          {avgScore && (
            <div className="text-right shrink-0">
              <span className="text-xl font-bold text-emerald-400">{avgScore}</span>
              <span className="text-xs text-zinc-500 ml-1">/10</span>
              <p className="text-xs text-zinc-500">{logs.length} visit{logs.length !== 1 ? "s" : ""}</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
});

export default VenueCard;
