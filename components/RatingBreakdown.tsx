import type { ExperienceRating } from "@/types/venyou";
import { RATING_CATEGORIES } from "@/lib/sports";

interface Props {
  rating: ExperienceRating;
  compact?: boolean;
}

export default function RatingBreakdown({ rating, compact = false }: Props) {
  const categories = compact ? RATING_CATEGORIES.slice(0, 6) : RATING_CATEGORIES;

  return (
    <div className={`space-y-2 ${compact ? "" : "space-y-2.5"}`}>
      {categories.map(({ key, label }) => {
        const val = rating[key];
        const pct = (val / 5) * 100;
        return (
          <div key={key} className="flex items-center gap-3">
            <span className="text-xs text-zinc-400 w-36 shrink-0">{label}</span>
            <div className="flex-1 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-zinc-200 w-4 text-right">{val}</span>
          </div>
        );
      })}
    </div>
  );
}
