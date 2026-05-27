"use client";

import { useState, useCallback } from "react";
import type { Sport, RatingValue, ExperienceRating } from "@/types/venyou";
import { SPORTS, RATING_CATEGORIES, SPORT_BG_COLORS } from "@/lib/sports";
import RatingInput from "@/components/RatingInput";

export interface LogSubmission {
  userId: string;
  sport: Sport;
  awayTeamName: string;
  homeTeamName: string;
  date: string;
  awayScore: number | null;
  homeScore: number | null;
  rating: ExperienceRating;
  gameRating: RatingValue | 0;
  review: string;
  section: string;
}

interface Props {
  userId: string;
  onSubmit: (data: LogSubmission) => void;
}

const DEFAULT_RATING: ExperienceRating = {
  overall: 0 as RatingValue,
  atmosphere: 0 as RatingValue,
  crowdEnergy: 0 as RatingValue,
  seatViewQuality: 0 as RatingValue,
  foodDrinks: 0 as RatingValue,
  entrySecurity: 0 as RatingValue,
  bathroomsLines: 0 as RatingValue,
  parkingTransit: 0 as RatingValue,
  valueForMoney: 0 as RatingValue,
};

const today = new Date().toISOString().split("T")[0];

export default function LogForm({ userId, onSubmit }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [sport, setSport] = useState<Sport | null>(null);

  // Step 2 — game details
  const [awayTeamName, setAwayTeamName] = useState("");
  const [homeTeamName, setHomeTeamName] = useState("");
  const [gameDate, setGameDate] = useState(today);
  const [awayScore, setAwayScore] = useState("");
  const [homeScore, setHomeScore] = useState("");

  // Step 3 — ratings
  const [rating, setRating] = useState<ExperienceRating>(DEFAULT_RATING);
  const [gameRating, setGameRating] = useState<RatingValue | 0>(0);
  const [review, setReview] = useState("");
  const [section, setSection] = useState("");

  const handleRatingChange = useCallback(
    (key: keyof ExperienceRating) => (val: RatingValue) =>
      setRating((prev) => ({ ...prev, [key]: val })),
    []
  );

  const handleSubmit = useCallback(() => {
    if (!sport || !awayTeamName.trim() || !homeTeamName.trim() || !gameDate) return;
    onSubmit({
      userId,
      sport,
      awayTeamName: awayTeamName.trim(),
      homeTeamName: homeTeamName.trim(),
      date: gameDate,
      awayScore: awayScore !== "" ? parseInt(awayScore, 10) : null,
      homeScore: homeScore !== "" ? parseInt(homeScore, 10) : null,
      rating,
      gameRating,
      review,
      section,
    });
  }, [sport, awayTeamName, homeTeamName, gameDate, awayScore, homeScore, rating, gameRating, review, section, userId, onSubmit]);

  const canGoToStep3 = awayTeamName.trim() !== "" && homeTeamName.trim() !== "" && gameDate !== "";

  // ── Step 1: sport ─────────────────────────────────────────────────────────
  if (step === 1) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-zinc-100">Step 1: Pick a sport</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SPORTS.map((s) => {
            const bg = SPORT_BG_COLORS[s];
            const isSelected = sport === s;
            return (
              <button
                key={s}
                onClick={() => setSport(s)}
                className={`py-6 rounded-xl font-bold text-lg transition-all border-2 ${
                  isSelected
                    ? `border-transparent text-white ${bg}`
                    : "border-zinc-700 text-zinc-400 bg-zinc-800 hover:border-zinc-500 hover:text-zinc-100"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setStep(2)}
          disabled={!sport}
          className="w-full mt-4 py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-emerald-500 hover:bg-emerald-400 text-white"
        >
          Next: Enter Game Details →
        </button>
      </div>
    );
  }

  // ── Step 2: game details (manual) ─────────────────────────────────────────
  if (step === 2) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => setStep(1)} className="text-zinc-400 hover:text-zinc-100 text-sm">← Back</button>
          <h2 className="text-lg font-bold text-zinc-100">Step 2: The game</h2>
        </div>

        {/* Teams */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Away Team
            </label>
            <input
              type="text"
              value={awayTeamName}
              onChange={(e) => setAwayTeamName(e.target.value)}
              placeholder="e.g. Chiefs"
              autoFocus
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Home Team
            </label>
            <input
              type="text"
              value={homeTeamName}
              onChange={(e) => setHomeTeamName(e.target.value)}
              placeholder="e.g. Bills"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Preview */}
        {(awayTeamName || homeTeamName) && (
          <p className="text-sm text-zinc-400 text-center -mt-1">
            <span className="font-semibold text-zinc-100">{awayTeamName || "—"}</span>
            <span className="text-zinc-600 mx-2">@</span>
            <span className="font-semibold text-zinc-100">{homeTeamName || "—"}</span>
          </p>
        )}

        {/* Date */}
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
            Date
          </label>
          <input
            type="date"
            value={gameDate}
            onChange={(e) => setGameDate(e.target.value)}
            max={today}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 [color-scheme:dark]"
          />
        </div>

        {/* Score */}
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
            Final Score <span className="normal-case font-normal text-zinc-600">(optional)</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={0}
              value={awayScore}
              onChange={(e) => setAwayScore(e.target.value)}
              placeholder={awayTeamName || "Away"}
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500"
            />
            <span className="text-zinc-500 font-bold text-lg shrink-0">–</span>
            <input
              type="number"
              min={0}
              value={homeScore}
              onChange={(e) => setHomeScore(e.target.value)}
              placeholder={homeTeamName || "Home"}
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <button
          onClick={() => setStep(3)}
          disabled={!canGoToStep3}
          className="w-full py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-emerald-500 hover:bg-emerald-400 text-white"
        >
          Next: Rate the Experience →
        </button>
      </div>
    );
  }

  // ── Step 3: ratings ───────────────────────────────────────────────────────
  const experienceCategories = RATING_CATEGORIES.filter((c) => c.key !== "overall");

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => setStep(2)} className="text-zinc-400 hover:text-zinc-100 text-sm">← Back</button>
        <h2 className="text-lg font-bold text-zinc-100">Step 3: Rate the experience</h2>
      </div>

      {/* Game recap */}
      <div className="bg-zinc-700/50 rounded-xl p-3">
        <p className="text-sm font-semibold text-zinc-100">
          {awayTeamName} <span className="text-zinc-400 font-normal">@</span> {homeTeamName}
        </p>
        <p className="text-xs text-zinc-400">
          {sport} · {gameDate}
          {awayScore !== "" && homeScore !== "" && ` · ${awayScore}–${homeScore}`}
        </p>
      </div>

      <div>
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
          Overall Experience <span className="normal-case font-normal text-zinc-600">(optional)</span>
        </p>
        <RatingInput label={RATING_CATEGORIES[0].label} value={rating.overall} onChange={handleRatingChange("overall")} />
      </div>

      <div>
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
          The Experience <span className="normal-case font-normal text-zinc-600">(optional)</span>
        </p>
        <div className="space-y-3">
          {experienceCategories.map(({ key, label }) => (
            <RatingInput key={key} label={label} value={rating[key]} onChange={handleRatingChange(key)} />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
          The Game <span className="normal-case font-normal text-zinc-600">(optional)</span>
        </p>
        <RatingInput label="How good was the game itself?" value={gameRating} onChange={setGameRating} />
      </div>

      <div>
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Section (optional)</label>
        <input
          type="text"
          value={section}
          onChange={(e) => setSection(e.target.value)}
          placeholder="e.g. Section 108, Bleachers..."
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Review (optional)</label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="How was the atmosphere? The food? What made it memorable?"
          rows={3}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 resize-none"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-3 rounded-xl font-semibold text-sm transition-colors bg-emerald-500 hover:bg-emerald-400 text-white"
      >
        Log This Game
      </button>
    </div>
  );
}
