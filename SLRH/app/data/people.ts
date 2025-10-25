import { DriverItem, TeamItem, FameItem } from "./type";

/* -------------------- Dummy People Data -------------------- */

const driversData: DriverItem[] = [
  {
    id: "1",
    name: "John Perera",
    ride: "Yamaha R6",
    stats: "Wins: 15, Podiums: 25",
    avatar: { uri: "https://i.ibb.co/fXyQb2Q/rider1.png" },
  },
  {
    id: "2",
    name: "Kavindu Silva",
    ride: "Suzuki GSX-R750",
    stats: "Wins: 10, Podiums: 20",
    avatar: { uri: "https://i.ibb.co/5x4YqCf/rider2.png" },
  },
];

const teamsData: TeamItem[] = [
  {
    id: "t1",
    name: "Team Apex Racers",
    logo: "https://i.ibb.co/xyz123/apex.png",
    city: "Colombo",
    founded: "2018",
    drivers: ["1", "2"],
    members: ["John Perera", "Kavindu Silva"],
    achievements: "National Champions 2022",
    about:
      "Team Apex Racers represents Sri Lanka’s top performance racing crew.",
  },
];

const fameData: FameItem[] = [
  {
    id: "f1",
    name: "Dilshan Fernando",
    role: "Driver",
    year: 2019,
    summary: "Champion rider and mentor for upcoming racers.",
    portrait: "https://i.ibb.co/abc123/fame1.png",
  },
];

/* -------------------- Exported Functions -------------------- */

export async function getPeopleData() {
  return { drivers: driversData, teams: teamsData, fame: fameData };
}

export async function getTeamById(id: string) {
  return teamsData.find((t) => t.id === id) || null;
}

export async function getDriverById(id: string) {
  return driversData.find((d) => d.id === id) || null;
}
