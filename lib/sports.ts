import type { Sport, ExperienceRating, RatingValue } from "@/types/venyou";

export const SPORT_COLORS: Record<Sport, string> = {
  NFL: "blue-500",
  MLB: "red-500",
  NBA: "orange-500",
  NHL: "sky-400",
  MLS: "green-500",
};

export const SPORT_BG_COLORS: Record<Sport, string> = {
  NFL: "bg-blue-500",
  MLB: "bg-red-500",
  NBA: "bg-orange-500",
  NHL: "bg-sky-400",
  MLS: "bg-green-500",
};

export const SPORT_TEXT_COLORS: Record<Sport, string> = {
  NFL: "text-blue-400",
  MLB: "text-red-400",
  NBA: "text-orange-400",
  NHL: "text-sky-400",
  MLS: "text-green-400",
};

export const SPORT_BORDER_COLORS: Record<Sport, string> = {
  NFL: "border-blue-500",
  MLB: "border-red-500",
  NBA: "border-orange-500",
  NHL: "border-sky-400",
  MLS: "border-green-500",
};

export const AVG_TICKET_PRICE: Record<Sport, number> = {
  NFL: 151,
  MLB: 35,
  NBA: 94,
  NHL: 72,
  MLS: 38,
};

export const SPORTS: Sport[] = ["NFL", "MLB", "NBA", "NHL", "MLS"];

export const RATING_CATEGORIES: { key: keyof ExperienceRating; label: string }[] = [
  { key: "overall", label: "Overall Experience" },
  { key: "atmosphere", label: "Atmosphere" },
  { key: "crowdEnergy", label: "Crowd Energy" },
  { key: "seatViewQuality", label: "Seat & View Quality" },
  { key: "foodDrinks", label: "Food & Drinks" },
  { key: "entrySecurity", label: "Entry & Security" },
  { key: "bathroomsLines", label: "Bathrooms & Lines" },
  { key: "parkingTransit", label: "Parking & Transit" },
  { key: "valueForMoney", label: "Value for Money" },
];

export function ratingToScore(rating: ExperienceRating): number {
  const vals = Object.values(rating) as RatingValue[];
  const sum = vals.reduce((a, b) => a + b, 0);
  return Math.round((sum / vals.length) * 2 * 10) / 10;
}

export function avgRating(ratings: ExperienceRating[]): ExperienceRating {
  if (ratings.length === 0) {
    return { overall: 1, atmosphere: 1, crowdEnergy: 1, seatViewQuality: 1, foodDrinks: 1, entrySecurity: 1, bathroomsLines: 1, parkingTransit: 1, valueForMoney: 1 };
  }
  const keys = Object.keys(ratings[0]) as (keyof ExperienceRating)[];
  const result = {} as ExperienceRating;
  for (const key of keys) {
    const avg = ratings.reduce((sum, r) => sum + r[key], 0) / ratings.length;
    result[key] = Math.round(avg) as RatingValue;
  }
  return result;
}

export function formatScore(rating: ExperienceRating): string {
  return ratingToScore(rating).toFixed(1);
}
