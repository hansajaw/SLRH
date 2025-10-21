// app/data/media.ts
import type { ImageSourcePropType } from "react-native";

/* ---------- Types ---------- */
export type MediaVideo = {
  _id: string;
  title: string;
  youtubeId: string;
  caption?: string;
  thumbnail?: string | ImageSourcePropType;
};

export type Album = {
  _id: string;
  title: string;
  cover?: string | ImageSourcePropType;
};

export type MediaImage = {
  _id: string;
  albumId: string;
  src: string | ImageSourcePropType;
  caption?: string;
};

export type NewsItem = {
  _id: string;
  title: string;
  excerpt?: string;
  body?: string;
  banner?: string | ImageSourcePropType;
  date?: string;
};

/* ---------- Sample Data ---------- */
const VIDEOS: MediaVideo[] = [
  {
    _id: "v1",
    title: "Thunder Riders Win Colombo GP 2024",
    youtubeId: "dQw4w9WgXcQ", // placeholder
    caption: "Full race highlights from Colombo Grand Prix 2024.",
    thumbnail: require("../../assets/media/img1.jpg"),
  },
  {
    _id: "v2",
    title: "Southern GP Highlights",
    youtubeId: "9bZkp7q19f0",
    caption: "Intense Southern GP action with the top riders.",
    thumbnail: require("../../assets/media//img2.jpg"),
  },
  {
    _id: "v3",
    title: "Behind the Scenes: Colombo Speedsters",
    youtubeId: "3JZ_D3ELwOQ",
    caption: "See how Colombo Speedsters prepare before each race.",
    thumbnail: require("../../assets/media/img3.jpg"),
  },
];

const ALBUMS: Album[] = [
  {
    _id: "a1",
    title: "Kandy Hill Climb 2024",
    cover: require("../../assets/media/img4.jpg"),
  },
  {
    _id: "a2",
    title: "Southern GP 2024",
    cover: require("../../assets/media/img5.jpg"),
  },
];

const IMAGES: MediaImage[] = [
  {
    _id: "i1",
    albumId: "a1",
    src: require("../../assets/media/img6.jpg"),
    caption: "Kumudu Rathnayaka leading on turn 3.",
  },
  {
    _id: "i2",
    albumId: "a1",
    src: require("../../assets/media/vid1.jpg"),
    caption: "Podium ceremony after the race.",
  },
  {
    _id: "i3",
    albumId: "a2",
    src: require("../../assets/media/vid2.jpg"),
    caption: "Starting grid lineup at Southern GP 2024.",
  },
];

const NEWS: NewsItem[] = [
  {
    _id: "n1",
    title: "Thunder Riders Secure Back-to-Back Wins",
    excerpt:
      "Thunder Riders continue their dominance with a thrilling victory in Colombo Grand Prix 2024.",
    body:
      "In an electrifying race at Colombo GP 2024, Thunder Riders demonstrated exceptional skill and coordination. Lead rider I. Perera held the front position for most of the race, finishing 4.2 seconds ahead of his closest competitor.",
    banner: require("../../assets/media/vid3.jpg"),
    date: "2024-09-22",
  },
  {
    _id: "n2",
    title: "Rookie Manel Gunasekara Impresses at Southern GP",
    excerpt:
      "Manel Gunasekara secured a podium finish in her debut Southern GP race.",
    body:
      "The Southern GP 2024 saw a remarkable performance from Manel Gunasekara. Competing against seasoned riders, she managed to finish 3rd overall — a huge milestone for Sri Lanka’s female racing scene.",
    banner: require("../../assets/media/img1.jpg"),
    date: "2024-08-10",
  },
  {
    _id: "n3",
    title: "Inside Look at Colombo Speedsters Garage",
    excerpt:
      "A sneak peek at the meticulous preparation that goes into every race weekend.",
    body:
      "From tire management to data analysis, Colombo Speedsters' pit crew plays a crucial role in ensuring their success on the track.",
    banner: require("../../assets/media/img2.jpg"),
    date: "2024-06-15",
  },
];

/* ---------- Accessor Functions ---------- */
export async function getVideos() {
  return VIDEOS;
}

export async function getAlbums() {
  return ALBUMS;
}

export async function getAlbumImages(albumId: string) {
  return IMAGES.filter((img) => img.albumId === albumId);
}

export async function getNews() {
  return NEWS;
}
