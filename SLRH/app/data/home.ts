import { EventItem, NewsItem, PlayerItem } from "./type";

/* -------------------- Events -------------------- */
export const eventsData: EventItem[] = [
  {
    _id: "e1",
    title: "Colombo City GP",
    city: "Colombo",
    date: "2025-03-15",
    heroImage: "https://i.ibb.co/jz123/event1.png",
  },
  {
    _id: "e2",
    title: "Kandy Race Fest",
    city: "Kandy",
    date: "2025-05-10",
    heroImage: "https://i.ibb.co/jz456/event2.png",
  },
];

/* -------------------- Players -------------------- */
export const playersData: PlayerItem[] = [
  {
    id: "1",
    name: "John Perera",
    ride: "Yamaha R6",
    avatar: { uri: "https://i.ibb.co/fXyQb2Q/rider1.png" },
  },
  {
    id: "2",
    name: "Kavindu Silva",
    ride: "Suzuki GSX-R750",
    avatar: { uri: "https://i.ibb.co/5x4YqCf/rider2.png" },
  },
];

/* -------------------- News -------------------- */
export const newsData: NewsItem[] = [
  {
    _id: "n1",
    title: "New Race Track Opens in Colombo",
    category: "News",
    image: "https://i.ibb.co/news1.png",
    publishedAt: "2025-02-10",
  },
  {
    _id: "n2",
    title: "Riders Gear Up for the 2025 Season",
    category: "Feature",
    image: "https://i.ibb.co/news2.png",
    publishedAt: "2025-03-01",
  },
];

/* -------------------- Combined Export -------------------- */
export async function getHomeData() {
  return {
    events: eventsData,
    players: playersData,
    news: newsData,
  };
}
