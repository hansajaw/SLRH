// app/data/type.ts
import type { ImageSourcePropType } from "react-native";

/* ========== Core domain types ========== */
export type Driver = {
  id: string;                         // slug (e.g., "kumudu-rathnayaka")
  name: string;
  avatar?: string | ImageSourcePropType;
  teamId?: string | null;
  bestAchievement?: string;
  bio?: string;
};

export type Team = {
  id: string;                         // slug (e.g., "thunder-riders")
  name: string;
  logo?: string | ImageSourcePropType;
  city?: string;
  founded?: string;
  drivers?: string[];                 // driver ids
  about?: string;
};

export type Fame = {
  id: string;                         // slug
  name: string;                       // person/team
  role: "Driver" | "Team" | "Official";
  year?: number;
  summary?: string;
  portrait?: string | ImageSourcePropType;
};

/* ========== Home / Racing / Media shared ========== */
export type EventItem = {
  _id: string;
  slug?: string;
  title?: string;
  name?: string;
  city?: string;
  location?: { city?: string };
  dateUtc?: string;
  scheduledDateTime?: string;         // ISO (preferred)
  date?: string;                      // legacy yyyy-mm-dd
  startTime?: string;                 // legacy hh:mm
  heroImage?: string | ImageSourcePropType;
  banner?: string | ImageSourcePropType;
  image?: string | ImageSourcePropType;
};

export type NewsItem = {
  _id: string;
  slug?: string;
  title: string;
  category?: string;
  image?: string | ImageSourcePropType;
  banner?: string | ImageSourcePropType;
  publishedAt?: string;               // ISO
  createdAt?: string;
  excerpt?: string;
};

export type ResultItem = {
  _id: string;
  slug: string;
  title: string;
  city?: string;
  occurredAt: string;                 // ISO date of the race
  banner?: string | ImageSourcePropType;
  topFinishers?: Array<{
    place: 1 | 2 | 3;
    name: string;
    avatar?: string | ImageSourcePropType;
  }>;
};

export type MediaVideo = {
  _id: string;
  title: string;
  thumbnail?: string | ImageSourcePropType;
  duration?: string;                  // "4:21"
  publishedAt?: string;               // ISO
};

export type MediaImage = {
  _id: string;
  caption?: string;
  src?: string | ImageSourcePropType;
};
