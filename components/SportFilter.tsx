"use client";

import type { Sport } from "@/types/venyou";
import { SPORTS } from "@/lib/sports";

interface Props {
  selected: Sport | "all";
  onChange: (sport: Sport | "all") => void;
}

const SPORT_ACTIVE: Record<Sport | "all", string> = {
  all: "bg-emerald-500 text-white",
  NFL: "bg-blue-500 text-white",
  MLB: "bg-red-500 text-white",
  NBA: "bg-orange-500 text-white",
  NHL: "bg-sky-400 text-white",
  MLS: "bg-green-500 text-white",
};

export default function SportFilter({ selected, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {(["all", ...SPORTS] as (Sport | "all")[]).map((sport) => (
        <button
          key={sport}
          onClick={() => onChange(sport)}
          className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
            selected === sport
              ? SPORT_ACTIVE[sport]
              : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-100"
          }`}
        >
          {sport === "all" ? "All Sports" : sport}
        </button>
      ))}
    </div>
  );
}
