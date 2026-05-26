export type Sport = "NFL" | "MLB" | "NBA" | "NHL" | "MLS";
export type RatingValue = 1 | 2 | 3 | 4 | 5;

export interface ExperienceRating {
  overall: RatingValue;
  atmosphere: RatingValue;
  crowdEnergy: RatingValue;
  seatViewQuality: RatingValue;
  foodDrinks: RatingValue;
  entrySecurity: RatingValue;
  bathroomsLines: RatingValue;
  parkingTransit: RatingValue;
  valueForMoney: RatingValue;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  homeCity: string;
  favoriteTeams: Partial<Record<Sport, string>>;
  joinedAt: string;
}

export interface Team {
  id: string;
  sport: Sport;
  name: string;
  city: string;
  abbreviation: string;
  primaryColor: string;
  slug: string;
}

export interface Venue {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  sport: Sport;
  capacity: number;
}

export interface Game {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  venueId: string;
  date: string;
  homeScore: number | null;
  awayScore: number | null;
}

export interface EventLog {
  id: string;
  userId: string;
  gameId: string;
  attendedDate: string;
  rating: ExperienceRating;
  gameRating: RatingValue;
  review: string;
  section: string;
  createdAt: string;
}

export interface RankingItem {
  rank: number;
  refId: string;
  refType: "game" | "venue" | "team";
  note: string;
}

export interface Ranking {
  id: string;
  userId: string;
  title: string;
  description: string;
  items: RankingItem[];
  createdAt: string;
}

export interface WantToAttend {
  id: string;
  userId: string;
  teamId?: string;
  venueId?: string;
  note: string;
}
