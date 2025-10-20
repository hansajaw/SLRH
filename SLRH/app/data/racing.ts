// app/data/racing.ts
import type { ImageSourcePropType } from "react-native";

export type RaceEvent = {
  id: string;
  title: string;
  circuit?: string;
  city?: string;
  scheduledAt: string; // ISO time
  banner?: string | ImageSourcePropType;
  description?: string; // ✅ added
};

export type LiveItem = {
  id: string;
  title: string;
  startedAt: string; // ISO
  status: "LIVE" | "UPCOMING" | "ENDED";
  thumbnail?: string | ImageSourcePropType;
};

export type ResultRow = {
  id: string;
  title: string;
  occurredAt: string; // ISO
  podium: { place: 1 | 2 | 3; name: string }[];
  banner?: string | ImageSourcePropType;
};

export type StandingRow = {
  rank: number;
  driver: string;
  team?: string;
  points: number;
  avatar?: string | ImageSourcePropType;
};

/* --------- seed (replace with your API/DB) --------- */
export const SCHEDULE: RaceEvent[] = [
  {
    id: "race-colombo-2025",
    title: "Colombo Grand Prefix 2025",
    city: "Colombo",
    circuit: "Marine Drive",
    scheduledAt: "2025-09-09T07:00:00Z",
    banner: require("../../assets/races/colombo.jpg"),
  },
  {
    id: "race-nuwara-2025",
    title: "Nuwara Eliya Championship",
    city: "Nuwara Eliya",
    circuit: "Race Course",
    scheduledAt: "2025-09-08T14:45:00Z",
    banner: require("../../assets/races/nuwara.jpg"),
  },
];

export const LIVE: LiveItem[] = [
  {
    id: "live-1",
    title: "Practice Session – Colombo",
    startedAt: new Date().toISOString(),
    status: "LIVE",
    thumbnail: require("../../assets/races/colombo.jpg"),
  },
];

export const RESULTS: ResultRow[] = [
  {
    id: "res-colombo-2025",
    title: "Colombo Grand Prefix 2025 — Recap",
    occurredAt: "2025-09-09T10:30:00Z",
    banner: require("../../assets/races/colombo.jpg"),
    podium: [
      { place: 1, name: "Kumudu Rathnayaka" },
      { place: 2, name: "Manel Gunasekara" },
      { place: 3, name: "A. Perera" },
    ],
  },
];

export const STANDINGS: StandingRow[] = [
  { rank: 1, driver: "Kumudu Rathnayaka", team: "Thunder Riders", points: 86 },
  { rank: 2, driver: "Manel Gunasekara", team: "Colombo Speedsters", points: 79 },
  { rank: 3, driver: "A. Perera", team: "Thunder Riders", points: 63 },
];

export function getRacingData() {
  return { schedule: SCHEDULE, live: LIVE, results: RESULTS, standings: STANDINGS };
}
