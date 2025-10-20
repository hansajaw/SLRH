// SLRH/data/media.ts
import type { ImageSourcePropType } from "react-native";

export interface MediaVideo {
  _id: string;
  title: string;
  thumbnail?: ImageSourcePropType;
  source: string;
  duration?: string;
}

export interface Album {
  _id: string;
  title: string;
  cover?: ImageSourcePropType;
}

export interface MediaImage {
  _id: string;
  src: ImageSourcePropType;
  caption?: string;
}

export interface NewsItem {
  _id: string;
  title: string;
  banner?: ImageSourcePropType;
  excerpt?: string;
  category?: string;
  publishedAt?: string;
}

export const videos: MediaVideo[] = [
  {
    _id: "v1",
    title: "Colombo GP 2024 Highlights",
    thumbnail: require("../../assets/media/vid1.jpg"),
    source: "https://example.com/videos/colombo_gp.mp4",
    duration: "4:25",
  },
  {
    _id: "v2",
    title: "Kandy Rally 2023 Recap",
    thumbnail: require("../../assets/media/vid2.jpg"),
    source: "https://example.com/videos/kandy_rally.mp4",
    duration: "3:42",
  },
];

export const albums: Album[] = [
  {
    _id: "a1",
    title: "Colombo GP Gallery",
    cover: require("../../assets/media/img1.jpg"),
  },
  {
    _id: "a2",
    title: "Negombo Street Highlights",
    cover: require("../../assets/media/img2.jpg"),
  },
];

export const albumImages: MediaImage[] = [
  { _id: "i1", src: require("../../assets/media/img4.jpg"), caption: "Podium finish" },
  { _id: "i2", src: require("../../assets/media/img5.jpg"), caption: "Starting grid" },
  { _id: "i3", src: require("../../assets/media/img6.jpg"), caption: "Crowd cheering" },
];

export const news: NewsItem[] = [
  {
    _id: "mn1",
    title: "Behind the Scenes at Colombo GP",
    banner: require("../../assets/news/drag1.jpg"),
    excerpt:
      "Take a look behind the paddocks as teams prepare for one of the biggest races of the year.",
    category: "Racing",
    publishedAt: "2025-09-14T10:00:00Z",
  },
  {
    _id: "mn2",
    title: "How Drivers Prepare for the Rally Season",
    banner: require("../../assets/news/drag2.jpg"),
    excerpt:
      "Rally drivers share their pre-season workout and training secrets ahead of the new racing calendar.",
    category: "Lifestyle",
    publishedAt: "2025-09-09T14:00:00Z",
  },
];

export async function getVideos(): Promise<MediaVideo[]> {
  return videos;
}

export async function getAlbums(): Promise<Album[]> {
  return albums;
}

export async function getAlbumImages(_albumId?: string): Promise<MediaImage[]> {
  return albumImages;
}

export async function getNews(): Promise<NewsItem[]> {
  return news;
}

export function getMediaData() {
  return { videos, images: albumImages, news };
}