"use client";

import { useState, useCallback, useMemo } from "react";
import type { Sport, RatingValue, ExperienceRating, Game, Team, Venue, EventLog } from "@/types/venyou";
import { SPORTS, RATING_CATEGORIES, SPORT_BG_COLORS } from "@/lib/sports";
import RatingInput from "@/components/RatingInput";
import SearchBar from "@/components/SearchBar";

interface Props {
  teams: Team[];
  games: Game[];
  venues: Venue[];
  onSubmit: (log: Omit<EventLog, "id" | "createdAt">) => void;
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

export default function LogForm({ teams, games, venues, onSubmit }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [sport, setSport] = useState<Sport | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [search, setSearch] = useState("");
  const [rating, setRating] = useState<ExperienceRating>(DEFAULT_RATING);
  const [gameRating, setGameRating] = useState<RatingValue | 0>(0);
  const [review, setReview] = useState("");
  const [section, setSection] = useState("");

  const sportGames = useMemo(() => {
    if (!sport) return [];
    const teamIds = teams.filter((t) => t.sport === sport).map((t) => t.id);
    return games
      .filter((g) => teamIds.includes(g.homeTeamId) || teamIds.includes(g.awayTeamId))
      .filter((g) => {
        if (!search) return true;
        const home = teams.find((t) => t.id === g.homeTeamId);
        const away = teams.find((t) => t.id === g.awayTeamId);
        const q = search.toLowerCase();
        return (
          home?.name.toLowerCase().includes(q) ||
          home?.city.toLowerCase().includes(q) ||
          away?.name.toLowerCase().includes(q) ||
          away?.city.toLowerCase().includes(q) ||
          home?.abbreviation.toLowerCase().includes(q) ||
          away?.abbreviation.toLowerCase().includes(q)
        );
      });
  }, [sport, games, teams, search]);

  const handleRatingChange = useCallback(
    (key: keyof ExperienceRating) => (val: RatingValue) => {
      setRating((prev) => ({ ...prev, [key]: val }));
    },
    []
  );

  const handleSubmit = useCallback(() => {
    if (!selectedGame || !gameRating) return;
    onSubmit({
      userId: "demo1",
      gameId: selectedGame.id,
      attendedDate: selectedGame.date,
      rating,
      gameRating,
      review,
      section,
    });
  }, [selectedGame, rating, gameRating, review, section, onSubmit]);

  const canProceedStep2 = selectedGame !== null;
  const canSubmit =
    gameRating > 0 &&
    Object.values(rating).every((v) => v > 0);

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
                onClick={() => { setSport(s); setSelectedGame(null); }}
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
          Next: Pick a Game →
        </button>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setStep(1)} className="text-zinc-400 hover:text-zinc-100 text-sm">← Back</button>
          <h2 className="text-lg font-bold text-zinc-100">Step 2: Pick a game</h2>
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search teams..." />
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {sportGames.length === 0 && (
            <p className="text-zinc-500 text-sm text-center py-8">No games found.</p>
          )}
          {sportGames.map((g) => {
            const home = teams.find((t) => t.id === g.homeTeamId);
            const away = teams.find((t) => t.id === g.awayTeamId);
            const venue = venues.find((v) => v.id === g.venueId);
            const isSelected = selectedGame?.id === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setSelectedGame(g)}
                className={`w-full text-left p-3 rounded-xl border transition-colors ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-zinc-100">
                      {away?.abbreviation} @ {home?.abbreviation}
                    </p>
                    <p className="text-xs text-zinc-400">{venue?.name} · {g.date}</p>
                  </div>
                  {g.homeScore != null && (
                    <span className="text-sm font-bold text-zinc-300">
                      {g.homeScore}–{g.awayScore}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setStep(3)}
          disabled={!canProceedStep2}
          className="w-full py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-emerald-500 hover:bg-emerald-400 text-white"
        >
          Next: Rate the Experience →
        </button>
      </div>
    );
  }

  const experienceCategories = RATING_CATEGORIES.filter((c) => c.key !== "overall");

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => setStep(2)} className="text-zinc-400 hover:text-zinc-100 text-sm">← Back</button>
        <h2 className="text-lg font-bold text-zinc-100">Step 3: Rate the experience</h2>
      </div>

      {selectedGame && (
        <div className="bg-zinc-700/50 rounded-xl p-3">
          <p className="text-sm font-semibold text-zinc-100">
            {teams.find((t) => t.id === selectedGame.awayTeamId)?.abbreviation} @{" "}
            {teams.find((t) => t.id === selectedGame.homeTeamId)?.abbreviation}
          </p>
          <p className="text-xs text-zinc-400">{selectedGame.date}</p>
        </div>
      )}

      <div>
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
          Overall Experience
        </p>
        <RatingInput
          label={RATING_CATEGORIES[0].label}
          value={rating.overall as RatingValue | 0}
          onChange={handleRatingChange("overall")}
        />
      </div>

      <div>
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
          The Experience
        </p>
        <div className="space-y-3">
          {experienceCategories.map(({ key, label }) => (
            <RatingInput
              key={key}
              label={label}
              value={rating[key] as RatingValue | 0}
              onChange={handleRatingChange(key)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">The Game</p>
        <RatingInput
          label="How good was the game itself?"
          value={gameRating}
          onChange={setGameRating}
        />
      </div>

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

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-emerald-500 hover:bg-emerald-400 text-white"
      >
        Log This Game
      </button>
    </div>
  );
}
