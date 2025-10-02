// app/data/home.ts
import type { ImageSourcePropType } from "react-native";

/* ---------- Shared types ---------- */
export type EventItem = {
  _id: string;
  slug?: string;
  title?: string;
  name?: string;
  city?: string;
  location?: { city?: string };
  dateUtc?: string;
  scheduledDateTime?: string;     // ISO (recommended)
  date?: string;                  // legacy yyyy-mm-dd
  startTime?: string;             // legacy hh:mm
  heroImage?: string | ImageSourcePropType;
  banner?: string | ImageSourcePropType;
  image?: string | ImageSourcePropType;
};

export type PlayerItem = {
  player?: string;
  playerName?: string;
  profilePicture?: string | ImageSourcePropType;
  playerDoc?: {
    _id?: string;
    name?: string;
    profilePicture?: string | ImageSourcePropType;
    bestAchievement?: string;     // plain text or JSON string
  };
};

export type NewsItem = {
  _id: string;
  slug?: string;
  title: string;
  category?: string;
  image?: string | ImageSourcePropType;
  banner?: string | ImageSourcePropType;
  publishedAt?: string;           // ISO
  createdAt?: string;
  excerpt?: string;
};

export type ResultItem = {
  _id: string;
  slug?: string;
  title: string;
  city?: string;
  occurredAt: string;             // ISO date of the race
  banner?: string | ImageSourcePropType;
  topFinishers?: Array<{
    place: 1 | 2 | 3;
    name: string;
    avatar?: string | ImageSourcePropType;
  }>;
};

/* ---------- Seed data ---------- */
export const EVENTS: EventItem[] = [
  {
    _id: "colombo-2025",
    slug: "colombo-grand-prefix-2025",
    title: "COLOMBO GRAND PREFIX 2025",
    city: "Colombo",
    scheduledDateTime: "2025-09-09T07:00:00Z",
    heroImage: require("../../assets/races/colombo.jpg"),
  },
  {
    _id: "nuwara-eliya-2025",
    slug: "nuwara-eliya-championship-2025",
    title: "NUWARA ELIYA CHAMPIONSHIP",
    city: "Nuwara Eliya",
    scheduledDateTime: "2025-09-08T14:45:00Z",
    heroImage: require("../../assets/races/nuwara.jpg"),
  },
  {
    _id: "matara-2025",
    slug: "matara-grand-prefix-2025",
    title: "MATARA GRAND PREFIX 2025",
    city: "Matara",
    scheduledDateTime: "2025-09-11T09:00:00Z",
    heroImage: require("../../assets/races/matara.jpg"),
  },
];

export const TOP_PLAYERS: PlayerItem[] = [
  {
    player: "p1",
    playerName: "Kumudu Rathnayaka",
    profilePicture: require("../../assets/players/kumudu.jpg"),
    playerDoc: { bestAchievement: "2019 Champion" },
  },
  {
    player: "p2",
    playerName: "Manel Gunasekara",
    profilePicture: require("../../assets/players/manel.jpg"),
    playerDoc: { bestAchievement: "2019 Champion" },
  },
];

export const NEWS: NewsItem[] = [
  {
    _id: "news-1",
    title: "DRAG RACING",
    category: "News",
    publishedAt: "2025-09-07T10:00:00Z",
    banner: require("../../assets/news/drag1.jpg"),
    excerpt: "Wow pattama gathiyak thiyee eke",
  },
  {
    _id: "news-2",
    title: "DRAG RACING",
    category: "News",
    publishedAt: "2025-09-07T13:00:00Z",
    banner: require("../../assets/news/drag2.jpg"),
    excerpt: "Supiriyak Thama",
  },
];

/* ---------- Race Results ---------- */
export const RESULTS: ResultItem[] = [
  {
    _id: "res-matara-2025",
    slug: "matara-grand-prefix-2025-results",
    title: "MATARA GRAND PREFIX 2025",
    city: "Matara",
    occurredAt: "2025-09-11T12:45:00Z",
    banner: require("../../assets/races/matara.jpg"),
    topFinishers: [
      { place: 1, name: "R. Silva" },
      { place: 2, name: "K. Fernando" },
      { place: 3, name: "P. Madushanka" },
    ],
  },
  {
    _id: "res-colombo-2025",
    slug: "colombo-grand-prefix-2025-results",
    title: "COLOMBO GRAND PREFIX 2025",
    city: "Colombo",
    occurredAt: "2025-09-09T10:30:00Z",
    banner: require("../../assets/races/colombo.jpg"),
    topFinishers: [
      { place: 1, name: "Kumudu Rathnayaka" },
      { place: 2, name: "Manel Gunasekara" },
      { place: 3, name: "A. Perera" },
    ],
  },
  {
    _id: "res-nuwara-2025",
    slug: "nuwara-eliya-championship-2025-results",
    title: "NUWARA ELIYA CHAMPIONSHIP",
    city: "Nuwara Eliya",
    occurredAt: "2025-09-08T16:10:00Z",
    banner: require("../../assets/races/nuwara.jpg"),
    topFinishers: [
      { place: 1, name: "Manel Gunasekara" },
      { place: 2, name: "Kumudu Rathnayaka" },
      { place: 3, name: "S. Jayasekara" },
    ],
  },
];

/* ---------- Accessor ---------- */
export function getHomeData() {
  return {
    events: EVENTS,
    players: TOP_PLAYERS,
    news: NEWS,
    results: RESULTS,
  };
}
