import type { ImageSourcePropType } from "react-native";

/* ----------------------------- Driver Item ----------------------------- */
export type DriverItem = {
  id: string;
  name: string;
  ride: string;
  stats?: string;
  avatar?: { uri: string };
  profile?: {
    vehicleType?: string;
    club?: string;
    nationality?: string;
    age?: number;
    rating?: number;
    reviewsCount?: number;
    stats?: {
      races?: number;
      trophies?: number;
      firstPlaces?: number;
      prizeMoneyLKR?: number;
      winRate?: number;
      avgPrizePerRace?: number;
    };
    personal?: { dob?: string; contact?: string; address?: string };
    team?: string;
    sponsors?: string[];
    license?: { serial?: string; issueDate?: string; dueDate?: string };
    highlights?: string[];
    achievements?: string[];
  };
};

/* ----------------------------- Team Item ----------------------------- */
export type TeamItem = {
  id: string;
  name: string;
  logo?: string | ImageSourcePropType;
  city?: string;
  founded?: string;
  drivers?: string[];
  about?: string;
  members?: string[];
  achievements?: string;
};

/* ----------------------------- Fame Item ----------------------------- */
export type Fame = {
  id: string;
  name: string;
  role: "Driver" | "Team" | "Official";
  year?: number;
  summary?: string;
  portrait?: string | ImageSourcePropType;
};

/* ----------------------------- Event Item ----------------------------- */
export type EventItem = {
  _id: string;
  slug?: string;
  title?: string;
  name?: string;
  city?: string;
  location?: { city?: string };
  dateUtc?: string;
  scheduledDateTime?: string;
  date?: string;
  startTime?: string;
  heroImage?: string | ImageSourcePropType;
  banner?: string | ImageSourcePropType;
  image?: string | ImageSourcePropType;
};

/* ----------------------------- News Item ----------------------------- */
export type NewsItem = {
  _id: string;
  slug?: string;
  title: string;
  category?: string;
  image?: string | ImageSourcePropType;
  banner?: string | ImageSourcePropType;
  publishedAt?: string;
  createdAt?: string;
  excerpt?: string;
  body?: string;
};

/* ----------------------------- Result Item ----------------------------- */
export type ResultItem = {
  _id: string;
  slug: string;
  title: string;
  city?: string;
  occurredAt: string;
  banner?: string | ImageSourcePropType;
  topFinishers?: Array<{
    place: 1 | 2 | 3;
    name: string;
    avatar?: string | ImageSourcePropType;
  }>;
};

/* ----------------------------- Media ----------------------------- */
export type MediaVideo = {
  _id: string;
  title: string;
  youtubeId?: string;
  caption?: string;
  thumbnail?: string | ImageSourcePropType;
  duration?: string;
  publishedAt?: string;
};

export type MediaImage = {
  _id: string;
  caption?: string;
  src?: string | ImageSourcePropType;
};

export type Album = {
  _id: string;
  title: string;
  cover?: string | ImageSourcePropType;
};

/* ----------------------------- Compatibility Aliases ----------------------------- */
export type FameItem = Fame;
export type PlayerItem = DriverItem;
export type RaceEvent = EventItem;
export type LiveItem = MediaVideo;
export type ResultRow = ResultItem;
export type StandingRow = ResultItem;
