import type { Fame } from "./type";

export const FAMES: Fame[] = [
  {
    id: "hof-2019-kumudu",
    name: "Kumudu Rathnayaka",
    role: "Driver",
    year: 2019,
    portrait: require("../../assets/players/kumudu.jpg"),
    summary: "Dominated the 2019 season with multiple podiums.",
  },
  {
    id: "hof-2020-manel",
    name: "Manel Gunasekara",
    role: "Driver",
    year: 2020,
    portrait: require("../../assets/players/manel.jpg"),
    summary: "Back-to-back sprint victories and fan-favorite.",
  },

];

export const getFames = () => FAMES;
