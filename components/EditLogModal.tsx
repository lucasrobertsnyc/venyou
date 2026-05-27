"use client";

import { useState, useCallback } from "react";
import type { EventLog, Game, Team, RatingValue, ExperienceRating } from "@/types/venyou";
import { RATING_CATEGORIES } from "@/lib/sports";
import RatingInput from "@/components/RatingInput";

interface Updates {
  overall: number; atmosphere: number; crowdEnergy: number; seatViewQuality: number;
  foodDrinks: number; entrySecurity: number; bathroomsLines: number;
  parkingTransit: number; valueForMoney: number; gameRating: number;
  review: string; section: string;
}

interface Props {
  log: EventLog;
  game: Game | undefined;
  homeTeam: Team | undefined;
  awayTeam: Team | undefined;
  onSave: (logId: string, updates: Updates) => Promise<void>;
  onClose: () => void;
}

export default function EditLogModal({ log, homeTeam, awayTeam, onSave, onClose }: Props) {
  const [rating, setRating] = useState<ExperienceRating>({ ...log.rating });
  const [gameRating, setGameRating] = useState<RatingValue | 0>(log.gameRating);
  const [review, setReview] = useState(log.review);
  const [section, setSection] = useState(log.section);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRatingChange = useCallback(
    (key: keyof ExperienceRating) => (val: RatingValue) =>
      setRating((prev) => ({ ...prev, [key]: val })),
    []
  );

  const handleSave = useCallback(async () => {
    setSaving(true);
    setError(null);
    await onSave(log.id, {
      overall: rating.overall, atmosphere: rating.atmosphere,
      crowdEnergy: rating.crowdEnergy, seatViewQuality: rating.seatViewQuality,
      foodDrinks: rating.foodDrinks, entrySecurity: rating.entrySecurity,
      bathroomsLines: rating.bathroomsLines, parkingTransit: rating.parkingTransit,
      valueForMoney: rating.valueForMoney, gameRating,
      review, section,
    });
    setSaving(false);
  }, [log.id, rating, gameRating, review, section, onSave]);

  const dateStr = log.attendedDate
    ? new Date(log.attendedDate + "T12:00:00").toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      })
    : "";

  const experienceCategories = RATING_CATEGORIES.filter((c) => c.key !== "overall");

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900/95 backdrop-blur border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-zinc-100">Edit Log</h2>
            <p className="text-xs text-zinc-500">
              {awayTeam?.abbreviation ?? "?"} @ {homeTeam?.abbreviation ?? "?"} · {dateStr}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 transition-colors text-lg leading-none"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Overall */}
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
              Overall Experience{" "}
              <span className="normal-case font-normal text-zinc-600">(optional)</span>
            </p>
            <RatingInput
              label={RATING_CATEGORIES[0].label}
              value={rating.overall}
              onChange={handleRatingChange("overall")}
            />
          </div>

          {/* Sub-categories */}
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
              The Experience{" "}
              <span className="normal-case font-normal text-zinc-600">(optional)</span>
            </p>
            <div className="space-y-3">
              {experienceCategories.map(({ key, label }) => (
                <RatingInput
                  key={key}
                  label={label}
                  value={rating[key]}
                  onChange={handleRatingChange(key)}
                />
              ))}
            </div>
          </div>

          {/* Game quality */}
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
              The Game{" "}
              <span className="normal-case font-normal text-zinc-600">(optional)</span>
            </p>
            <RatingInput
              label="How good was the game itself?"
              value={gameRating}
              onChange={setGameRating}
            />
          </div>

          {/* Section */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Section (optional)
            </label>
            <input
              type="text"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              placeholder="e.g. Section 108, Bleachers..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Review */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Review (optional)
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="How was the atmosphere? The food? What made it memorable?"
              rows={3}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pb-1">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-semibold text-sm border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-3 rounded-xl font-semibold text-sm bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white transition-colors"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
