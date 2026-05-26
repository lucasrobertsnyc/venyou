import LogClient from "@/app/log/LogClient";
import { MOCK_TEAMS, MOCK_GAMES, MOCK_VENUES } from "@/data/events";

export default function LogPage() {
  return <LogClient teams={MOCK_TEAMS} games={MOCK_GAMES} venues={MOCK_VENUES} />;
}
