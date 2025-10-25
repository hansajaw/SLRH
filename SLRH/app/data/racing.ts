import { RaceEvent, LiveItem, ResultRow, StandingRow } from "./type";

/* -------------------------------------------------------------------------- */
/*                                RACE EVENTS                                 */
/* -------------------------------------------------------------------------- */
const raceEvents: RaceEvent[] = [
  {
    _id: "re1",
    title: "Colombo Grand Prix 2025",
    city: "Colombo",
    date: "2025-02-20",
    heroImage: "https://i.ibb.co/jz123/event1.png",
  },
  {
    _id: "re2",
    title: "Kandy Hill Challenge 2025",
    city: "Kandy",
    date: "2025-03-15",
    heroImage: "https://i.ibb.co/jz456/event2.png",
  },
];

/* -------------------------------------------------------------------------- */
/*                                 LIVE ITEMS                                 */
/* -------------------------------------------------------------------------- */
const liveStreams: LiveItem[] = [
  {
    _id: "lv1",
    title: "Live: Colombo GP Qualifiers",
    youtubeId: "xYz12345",
    thumbnail: "https://i.ibb.co/live1.png",
    duration: "2h 14m",
    publishedAt: "2025-02-19",
  },
  {
    _id: "lv2",
    title: "Live: Kandy Hill Highlights",
    youtubeId: "yAb56789",
    thumbnail: "https://i.ibb.co/live2.png",
    duration: "1h 40m",
    publishedAt: "2025-03-14",
  },
];

/* -------------------------------------------------------------------------- */
/*                                RACE RESULTS                                */
/* -------------------------------------------------------------------------- */
const raceResults: ResultRow[] = [
  {
    _id: "rs1",
    slug: "colombo-gp-results",
    title: "Colombo GP 2025 Official Results",
    occurredAt: "2025-02-20",
    banner: "https://i.ibb.co/results1.png",
    topFinishers: [
      { place: 1, name: "John Perera" },
      { place: 2, name: "Kavindu Silva" },
      { place: 3, name: "Amal Fernando" },
    ],
  },
  {
    _id: "rs2",
    slug: "kandy-hill-results",
    title: "Kandy Hill Challenge 2025 Results",
    occurredAt: "2025-03-15",
    banner: "https://i.ibb.co/results2.png",
    topFinishers: [
      { place: 1, name: "Saman Jayasuriya" },
      { place: 2, name: "Ruwan De Silva" },
      { place: 3, name: "Nuwan Jayawardena" },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*                                STANDINGS                                  */
/* -------------------------------------------------------------------------- */
const standings: StandingRow[] = [
  {
    _id: "st1",
    slug: "season-2025-standings",
    title: "Season 2025 Driver Standings",
    occurredAt: "2025-05-01",
    banner: "https://i.ibb.co/standing1.png",
  },
];

/* -------------------------------------------------------------------------- */
/*                             EXPORTED FUNCTION                              */
/* -------------------------------------------------------------------------- */
export async function getRacingData() {
  return {
    events: raceEvents,
    live: liveStreams,
    results: raceResults,
    standings,
  };
}

export { raceEvents, liveStreams, raceResults, standings };
