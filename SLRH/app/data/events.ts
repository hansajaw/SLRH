import { ImageSourcePropType } from "react-native";

// ---------- Types ----------
export type Event = {
  id: string;
  title: string;
  city?: string;
  circuit?: string;
  scheduledAt: string; // ISO date for race start
  banner?: ImageSourcePropType | string;

  result?: {
    occurredAt: string;
    podium: Array<{ place: 1 | 2 | 3; name: string; avatar?: ImageSourcePropType | string }>;
    recapUrl?: string;
  };

  live?: {
    status: "LIVE" | "UPCOMING" | "ENDED";
    thumbnail?: ImageSourcePropType | string;
    startedAt?: string;
    watchUrl?: string;
  };
};

// ---------- Sample Data ----------
export const events: Event[] = [
  {
    id: "e1",
    title: "Colombo GP 2025 – Round 1",
    city: "Colombo",
    circuit: "City Circuit",
    scheduledAt: "2025-12-05T10:00:00Z",
    banner: require("../../assets/races/colombo.jpg"),
    live: { status: "UPCOMING", thumbnail: require("../../assets/races/colombo.jpg") },
  },
  {
    id: "e2",
    title: "Kandy Street Sprint",
    city: "Kandy",
    circuit: "Lake Round",
    scheduledAt: "2025-08-20T08:30:00Z",
    banner: require("../../assets/races/nuwara.jpg"),
    result: {
      occurredAt: "2025-08-20T12:30:00Z",
      podium: [
        { place: 1, name: "Jay Gunasekara" },
        { place: 2, name: "Imesh Perera" },
        { place: 3, name: "Ravi de Alwis" },
      ],
      recapUrl: "app://results/e2",
    },
    live: { status: "ENDED", startedAt: "2025-08-20T08:30:00Z" },
  },
  {
    id: "e3",
    title: "Galle Fort Rally",
    city: "Galle",
    circuit: "Coastal Loop",
    scheduledAt: "2025-11-10T07:00:00Z",
    banner: require("../../assets/races/matara.jpg"),
    live: { status: "UPCOMING" },
  },
];

// ---------- Utilities ----------
const toDate = (iso: string) => new Date(iso);

export function getAllEvents() {
  return events.slice();
}

export function getUpcomingEvents(limit?: number) {
  const now = Date.now();
  const list = events
    .filter((e) => toDate(e.scheduledAt).getTime() >= now)
    .sort((a, b) => +toDate(a.scheduledAt) - +toDate(b.scheduledAt));
  return typeof limit === "number" ? list.slice(0, limit) : list;
}

export function getSchedule() {
  return events
    .slice()
    .sort((a, b) => +toDate(a.scheduledAt) - +toDate(b.scheduledAt))
    .map((e) => ({
      id: e.id,
      title: e.title,
      city: e.city,
      circuit: e.circuit,
      scheduledAt: e.scheduledAt,
      banner: e.banner,
    }));
}

export function getResults() {
  return events
    .filter((e) => !!e.result)
    .map((e) => ({
      id: e.id,
      title: e.title,
      scheduledAt: e.scheduledAt, // ✅ Added
      occurredAt: e.result!.occurredAt,
      podium: e.result!.podium,
      banner: e.banner,
      recapUrl: e.result!.recapUrl,
    }))
    .sort((a, b) => +toDate(b.occurredAt) - +toDate(a.occurredAt));
}

export function getLive() {
  return events
    .filter((e) => !!e.live)
    .map((e) => ({
      id: e.id,
      title: e.title,
      status: e.live!.status,
      thumbnail: e.live!.thumbnail ?? e.banner,
      startedAt: e.live!.startedAt ?? e.scheduledAt,
      watchUrl: e.live!.watchUrl,
    }))
    .sort((a, b) => {
      const p = (s?: string) => (s === "LIVE" ? 0 : s === "UPCOMING" ? 1 : 2);
      return p(a.status) - p(b.status);
    });
}
