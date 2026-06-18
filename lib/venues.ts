/**
 * Maps team IDs to their home venue IDs.
 * Used as a fallback when a game's venueId is null (e.g. manually-logged games
 * where the city-based auto-fill didn't find a match).
 */
export const TEAM_HOME_VENUE: Record<string, string> = {
  // NFL
  "nfl-kc":  "v-arrowhead",
  "nfl-lac": "v-sofi",   "nfl-lar": "v-sofi",
  "nfl-dal": "v-att",
  "nfl-nyg": "v-metlife", "nfl-nyj": "v-metlife",
  "nfl-gb":  "v-lambeau",
  "nfl-sf":  "v-levis",
  "nfl-lv":  "v-allegiant",
  "nfl-phi": "v-linc",
  "nfl-chi": "v-soldier",
  "nfl-ne":  "v-gillette",
  "nfl-bal": "v-mt-bank",
  "nfl-pit": "v-acrisure",
  // MLB
  "mlb-bos": "v-fenway",
  "mlb-chc": "v-wrigley",
  "mlb-nyy": "v-yankee",
  "mlb-lad": "v-dodger",
  "mlb-nym": "v-citi",
  "mlb-atl": "v-truist",
  "mlb-sf":  "v-oracle",
  "mlb-bal": "v-camden",
  "mlb-tex": "v-globe-life",
  "mlb-stl": "v-busch",
  "mlb-pit": "v-pnc",
  // NBA
  "nba-nyk": "v-msg",
  "nba-bos": "v-td-garden",
  "nba-lal": "v-crypto",
  "nba-chi": "v-united-center",
  "nba-gsw": "v-chase",
  "nba-mia": "v-kaseya",
  "nba-den": "v-ball-arena",
  "nba-mil": "v-fiserv",
  "nba-atl": "v-state-farm-arena",
  "nba-dal": "v-aac",
  // NHL
  "nhl-pit": "v-ppg-paints",
  "nhl-nyr": "v-msg",
  "nhl-bos": "v-td-garden",
  "nhl-mtl": "v-bell-centre",
  "nhl-tor": "v-scotiabank",
  "nhl-phi": "v-wells-fargo",
  "nhl-wsh": "v-capital-one",
  "nhl-vgk": "v-t-mobile",
  "nhl-stl": "v-enterprise",
  // MLS
  "mls-atl": "v-mb-stadium",
  "mls-min": "v-allianz",
  "mls-por": "v-providence",
  "mls-sea": "v-lumen",
  "mls-nsh": "v-geodis",
  "mls-atx": "v-q2",
};
