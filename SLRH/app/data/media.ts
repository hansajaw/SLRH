// app/data/media.ts
import type { ImageSourcePropType } from "react-native";
import { NEWS } from "./home";

export type MediaVideo = {
  _id: string;
  title: string;
  thumbnail: string | ImageSourcePropType;
  duration?: string;
  publishedAt?: string; // ISO
  url?: string;         // optional
};

export type MediaImage = {
  _id: string;
  src: string | ImageSourcePropType;
  caption?: string;
  takenAt?: string;     // ISO
};

export const VIDEOS: MediaVideo[] = [
  {
    _id: "v1",
    title: "Nuwara Eliya Highlights",
    thumbnail: require("../../assets/media/vid1.jpg"),
    duration: "4:21",
    publishedAt: "2025-09-09T10:00:00Z",
  },
  {
    _id: "v2",
    title: "Colombo Grand Prefix 2025 – Recap",
    thumbnail: require("../../assets/media/vid2.jpg"),
    duration: "3:35",
    publishedAt: "2025-09-09T13:00:00Z",
  },
  {
    _id: "v3",
    title: "Matara Practice Laps",
    thumbnail: require("../../assets/media/vid3.jpg"),
    duration: "2:18",
    publishedAt: "2025-09-08T10:00:00Z",
  },
];

export const IMAGES: MediaImage[] = [
  { _id: "i1", src: require("../../assets/media/img1.jpg"), caption: "Start line energy" },
  { _id: "i2", src: require("../../assets/media/img2.jpg"), caption: "Late apex perfection" },
  { _id: "i3", src: require("../../assets/media/img3.jpg"), caption: "Pit stop hustle" },
  { _id: "i4", src: require("../../assets/media/img4.jpg"), caption: "Night session glow" },
  { _id: "i5", src: require("../../assets/media/img5.jpg"), caption: "Victory lap" },
  { _id: "i6", src: require("../../assets/media/img6.jpg"), caption: "Tarmac thunder" },
];

export function getMediaData() {
  return {
    videos: VIDEOS,
    images: IMAGES,
    news: NEWS, // reuses NEWS from app/data/home.ts
  };
}
