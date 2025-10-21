// app/data/people.ts
import type { ImageSourcePropType } from "react-native";

/* ---------- Types ---------- */
export type DriverItem = {
  id: string;
  name: string;
  ride: string;
  stats?: string;
  avatar?: string | ImageSourcePropType;
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

export type TeamItem = {
  id: string;
  name: string;
  members: string[];
  achievements?: string;
  logo?: string | ImageSourcePropType;
};

export type FameItem = {
  id: string;
  title: string;
  person: string;
  year: number;
  blurb?: string;
  avatar?: string | ImageSourcePropType;
};

/* ---------- Seed Data ---------- */
export const DRIVERS: DriverItem[] = [
  {
    id: "kumudu-rathnayaka",
    name: "Kumudu Rathnayaka",
    ride: "Honda CBR250R",
    stats: "Wins: 5",
    avatar: require("../../assets/players/kumudu.jpg"),
    profile: {
      vehicleType: "Motorcycle",
      club: "Colombo Riders Club",
      nationality: "Sri Lankan",
      age: 29,
      rating: 4.8,
      reviewsCount: 42,
      stats: {
        races: 58,
        trophies: 15,
        firstPlaces: 5,
        prizeMoneyLKR: 1250000,
        winRate: 0.26,
        avgPrizePerRace: 21500,
      },
      personal: {
        dob: "1996-04-15",
        contact: "+94 77 123 4567",
        address: "Kandy, Sri Lanka",
      },
      team: "Thunder Riders",
      sponsors: ["Motul Oil", "Yamaha Lanka", "Red Bull"],
      license: {
        serial: "SLR-R-2023-105",
        issueDate: "2023-03-10",
        dueDate: "2025-03-10",
      },
      highlights: [
        "Fastest lap at Colombo Street Race 2024",
        "Represented Sri Lanka Motorsport Federation 2023",
      ],
      achievements: [
        "🏆 1st place – Kandy Circuit Race 2023",
        "🥈 2nd place – Negombo Speed Fest 2022",
        "🏁 Completed 50 official races",
      ],
    },
  },
  {
    id: "manel-gunasekara",
    name: "Manel Gunasekara",
    ride: "Honda CBR250R",
    stats: "Wins: 5",
    avatar: require("../../assets/players/manel.jpg"),
    profile: {
      vehicleType: "Motorcycle",
      club: "Southern Racing League",
      nationality: "Sri Lankan",
      age: 27,
      rating: 4.6,
      reviewsCount: 28,
      stats: {
        races: 45,
        trophies: 10,
        firstPlaces: 4,
        prizeMoneyLKR: 940000,
        winRate: 0.22,
        avgPrizePerRace: 20900,
      },
      personal: {
        dob: "1998-11-02",
        contact: "+94 71 456 7890",
        address: "Galle, Sri Lanka",
      },
      team: "Southern Speedsters",
      sponsors: ["Shell Lanka", "Honda", "SLT Mobitel"],
      license: {
        serial: "SLR-R-2023-210",
        issueDate: "2023-04-02",
        dueDate: "2025-04-02",
      },
      highlights: [
        "Dominated the Southern GP 2024",
        "Best Female Racer Nominee – 2023 Awards",
      ],
      achievements: [
        "🥇 1st place – Galle Speedway 2024",
        "🏁 2nd place – Southern Circuit 2023",
      ],
    },
  },
  {
    id: "d1",
    name: "I. Perera",
    ride: "Yamaha R15",
    stats: "Top Speed: 146 km/h",
    avatar: require("../../assets/people/drivers/perera.jpg"),
    profile: {
      vehicleType: "Motorcycle",
      club: "Thunder Riders",
      nationality: "Sri Lankan",
      age: 31,
      rating: 4.9,
      reviewsCount: 51,
      stats: {
        races: 73,
        trophies: 22,
        firstPlaces: 9,
        prizeMoneyLKR: 1780000,
        winRate: 0.31,
        avgPrizePerRace: 24380,
      },
      personal: {
        dob: "1994-09-05",
        contact: "+94 76 555 9911",
        address: "Colombo, Sri Lanka",
      },
      team: "Thunder Riders",
      sponsors: ["Red Bull", "Yamaha Lanka", "Dialog"],
      license: {
        serial: "SLR-R-2022-001",
        issueDate: "2022-05-01",
        dueDate: "2024-05-01",
      },
      highlights: [
        "Podium finish at Colombo GP 2023",
        "Fastest acceleration record at Negombo Street Race",
      ],
      achievements: [
        "🏆 1st place – Colombo GP 2023",
        "🥉 3rd place – Nuwara Circuit 2022",
      ],
    },
  },
  {
    id: "d2",
    name: "K. Fernando",
    ride: "Honda CBR250R",
    stats: "Wins: 5",
    avatar: require("../../assets/people/drivers/fernando.jpg"),
    profile: {
      vehicleType: "Motorcycle",
      club: "Colombo Speedsters",
      nationality: "Sri Lankan",
      age: 30,
      rating: 4.5,
      reviewsCount: 38,
      stats: {
        races: 60,
        trophies: 14,
        firstPlaces: 6,
        prizeMoneyLKR: 1150000,
        winRate: 0.25,
        avgPrizePerRace: 19100,
      },
      personal: {
        dob: "1995-06-18",
        contact: "+94 70 888 2233",
        address: "Negombo, Sri Lanka",
      },
      team: "Colombo Speedsters",
      sponsors: ["Honda Lanka", "PickMe", "Eicher Oil"],
      license: {
        serial: "SLR-R-2023-087",
        issueDate: "2023-02-22",
        dueDate: "2025-02-22",
      },
      highlights: [
        "Runner-up – Colombo GP 2023",
        "Fastest cornering lap – 2022 Nuwara Circuit",
      ],
      achievements: [
        "🥇 1st place – Negombo Speedway 2023",
        "🥈 2nd place – Kandy Mountain Rally 2024",
      ],
    },
  },
  {
    id: "d3",
    name: "S. Jayasinghe",
    ride: "Suzuki Gixxer SF",
    stats: "Best Lap: 1:12.32",
    avatar: require("../../assets/people/drivers/jayasinghe.jpg"),
    profile: {
      vehicleType: "Motorcycle",
      club: "Thunder Riders",
      nationality: "Sri Lankan",
      age: 25,
      rating: 4.3,
      reviewsCount: 19,
      stats: {
        races: 32,
        trophies: 7,
        firstPlaces: 2,
        prizeMoneyLKR: 670000,
        winRate: 0.18,
        avgPrizePerRace: 20900,
      },
      personal: {
        dob: "2000-08-10",
        contact: "+94 72 444 1188",
        address: "Matara, Sri Lanka",
      },
      team: "Thunder Riders",
      sponsors: ["Suzuki Motors", "SLR Helmets"],
      license: {
        serial: "SLR-R-2024-099",
        issueDate: "2024-03-01",
        dueDate: "2026-03-01",
      },
      highlights: [
        "Youngest podium finisher in 2024 season",
        "Consistent top 5 in hill climb events",
      ],
      achievements: [
        "🥇 1st place – Kandy Hill Climb 2024",
        "🏁 3rd place – Colombo Circuit 2023",
      ],
    },
  },
];

/* ---------- Teams ---------- */
export const TEAMS: TeamItem[] = [
  {
    id: "t1",
    name: "Thunder Riders",
    members: ["I. Perera", "S. Jayasinghe"],
    achievements: "2024 Team Champions",
    logo: require("../../assets/people/teams/thunder-riders.png"),
  },
  {
    id: "t2",
    name: "Colombo Speedsters",
    members: ["K. Fernando"],
    achievements: "Best Pit Crew 2023",
    logo: require("../../assets/people/teams/colombo-speedsters.png"),
  },
];

/* ---------- Fame ---------- */
export const FAME: FameItem[] = [
  {
    id: "h1",
    title: "Lifetime Achievement",
    person: "D. Silva",
    year: 2022,
    blurb: "Pioneer of local road racing.",
    avatar: require("../../assets/people/fame/dsilva.jpg"),
  },
  {
    id: "h2",
    title: "Rookie of the Year",
    person: "R. Madushanka",
    year: 2024,
    avatar: require("../../assets/people/fame/madushanka.jpg"),
  },
];

/* ---------- Accessor Functions ---------- */
export function getPeopleData() {
  return {
    drivers: DRIVERS,
    teams: TEAMS,
    fame: FAME,
  };
}

export function getDriverById(id: string) {
  const { drivers } = getPeopleData();
  return drivers.find((d) => d.id === id);
}

export function getTeamById(id: string) {
  const { teams } = getPeopleData();
  return teams.find((t) => t.id === id);
}
