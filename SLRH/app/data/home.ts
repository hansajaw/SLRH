// data/home.ts
import type { ImageSourcePropType } from "react-native";

/* -------- Types -------- */
export type EventItem = {
  _id: string;
  title: string;
  city?: string;
  dateUtc?: string;
  date?: string;
  startTime?: string;
  scheduledDateTime?: string;
  slug?: string;
  name?: string;
  location?: { city?: string };
  heroImage?: ImageSourcePropType;
  banner?: ImageSourcePropType;
  image?: ImageSourcePropType;
};

export type PlayerItem = {
  _id: string;
  player?: string;
  playerName: string;
  profilePicture: ImageSourcePropType;
  playerDoc?: {
    _id?: string;
    name?: string;
    bestAchievement?: string;
    profilePicture?: ImageSourcePropType;
  };
};

export type NewsItem = {
  _id: string;
  title: string;
  category?: string;
  excerpt?: string;
  banner?: ImageSourcePropType;
  publishedAt?: string;
  createdAt?: string;
};

/* -------- Data -------- */
export function getHomeData() {
  const events: EventItem[] = [
    {
      _id: "1",
      title: "Colombo Grand Prix",
      city: "Colombo",
      dateUtc: "2025-12-15T12:00:00Z",
      scheduledDateTime: "2025-12-15T12:00:00Z",
      date: "2025-12-15",
      startTime: "12:00",
      slug: "colombo-grand-prix",
      name: "Colombo GP",
      location: { city: "Colombo" },
      heroImage: require("../../assets/races/colombo.jpg"),
      banner: require("../../assets/races/colombo.jpg"),
      image: require("../../assets/races/colombo.jpg"),
    },
    {
      _id: "2",
      title: "Kandy Mountain Rally",
      city: "Kandy",
      dateUtc: "2025-11-20T09:00:00Z",
      scheduledDateTime: "2025-11-20T09:00:00Z",
      date: "2025-11-20",
      startTime: "09:00",
      slug: "kandy-mountain-rally",
      name: "Kandy Rally",
      location: { city: "Kandy" },
      heroImage: require("../../assets/races/nuwara.jpg"),
      banner: require("../../assets/races/nuwara.jpg"),
      image: require("../../assets/races/nuwara.jpg"),
    },
  ];

  const players: PlayerItem[] = [
    {
      _id: "p1",
      player: "1",
      playerName: "Ruwan Perera",
      profilePicture: require("../../assets/people/drivers/perera.jpg"),
      playerDoc: {
        _id: "p1",
        name: "Ruwan Perera",
        bestAchievement: "Champion - Colombo GP 2024",
        profilePicture: require("../../assets/people/drivers/perera.jpg"),
      },
    },
    {
      _id: "p2",
      player: "2",
      playerName: "Nimal Fernando",
      profilePicture: require("../../assets/people/drivers/fernando.jpg"),
      playerDoc: {
        _id: "p2",
        name: "Nimal Fernando",
        bestAchievement: "Winner - Kandy Rally 2023",
        profilePicture: require("../../assets/people/drivers/fernando.jpg"),
      },
    },
  ];

  const news: NewsItem[] = [
    {
      _id: "n1",
      title: "Sri Lanka Racing Hub Expands Nationwide",
      category: "Racing",
      excerpt: "The Sri Lanka Racing Hub brings new events across the island this year.",
      banner: require("../../assets/news/drag1.jpg"),
      publishedAt: "2025-09-10T00:00:00Z",
      createdAt: "2025-09-10T00:00:00Z",
    },
    {
      _id: "n2",
      title: "Kandy Rally Breaks Attendance Records",
      category: "Motorsport",
      excerpt: "Thousands of fans witnessed the thrilling rally through the central hills.",
      banner: require("../../assets/news/drag2.jpg"),
      publishedAt: "2025-10-01T00:00:00Z",
      createdAt: "2025-10-01T00:00:00Z",
    },
  ];

  return { events, players, news };
}
