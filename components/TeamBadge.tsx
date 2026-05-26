import React from "react";
import type { Team } from "@/types/venyou";
import { SPORT_BG_COLORS } from "@/lib/sports";

interface Props {
  team: Team;
  size?: "sm" | "md" | "lg";
}

const TeamBadge = React.memo(function TeamBadge({ team, size = "md" }: Props) {
  const sportBg = SPORT_BG_COLORS[team.sport];
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold text-white ${sizeClasses[size]}`}
      style={{ backgroundColor: team.primaryColor }}
    >
      <span
        className={`inline-block rounded-full text-white text-xs font-bold ${sportBg}`}
        style={{ padding: "1px 5px", fontSize: "10px" }}
      >
        {team.sport}
      </span>
      {team.city} {team.name}
    </span>
  );
});

export default TeamBadge;
