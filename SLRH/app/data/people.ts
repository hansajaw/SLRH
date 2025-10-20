// app/data/people.ts
import type { ImageSourcePropType } from "react-native";

/* ---------- Types ---------- */
export type DriverItem = {
  id: string;
  name: string;
  ride: string;
  stats?: string;
  avatar?: string | ImageSourcePropType;
};

export type TeamItem = {
  id: string;
  name: string;
  members: string[];               // names for now (can switch to ids later)
  achievements?: string;
  logo?: string | ImageSourcePropType;
};

export type FameItem = {
  id: string;
  title: string;                   // e.g., "Lifetime Achievement"
  person: string;                  // name
  year: number;
  blurb?: string;
  avatar?: string | ImageSourcePropType;
};

/* ---------- Seed data (sample) ---------- */
export const DRIVERS: DriverItem[] = [
{
    id: "kumudu-rathnayaka",
    name: "Kumudu Rathnayaka",
    ride: "Honda CBR250R",
    stats: "Wins: 5",
    avatar: require("../../assets/players/kumudu.jpg"),
  },
  {
    id: "manel-gunasekara",
    name: "Manel Gunasekara",
    ride: "Honda CBR250R",
    stats: "Wins: 5",
    avatar: require("../../assets/players/manel.jpg"),
  },
  {
    id: "d1",
    name: "I. Perera",
    ride: "Yamaha R15",
    stats: "Top Speed: 146 km/h",
    avatar: require("../../assets/people/drivers/perera.jpg"),
  },
  {
    id: "d2",
    name: "K. Fernando",
    ride: "Honda CBR250R",
    stats: "Wins: 5",
    avatar: require("../../assets/people/drivers/fernando.jpg"),
  },
  {
    id: "d3",
    name: "S. Jayasinghe",
    ride: "Suzuki Gixxer SF",
    stats: "Best Lap: 1:12.32",
    avatar: require("../../assets/people/drivers/jayasinghe.jpg"),
  },
];

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

/* ---------- Accessor ---------- */
export function getPeopleData() {
  return {
    drivers: DRIVERS,
    teams: TEAMS,
    fame: FAME,
  };
}

export function getDriverById(id: string) {
  const { drivers } = getPeopleData();
  return drivers.find(d => d.id === id);
}
export function getTeamById(id: string) {
  const { teams } = getPeopleData();
  return teams.find(t => t.id === id);
}
