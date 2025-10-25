// app/data/media.ts
import type { ImageSourcePropType } from "react-native";

import api from "../../utils/api";

/* ---------- Accessor Functions ---------- */
export async function getVideos() {
  try {
    const { data } = await api.get("/media", { params: { type: "video" } });
    return data.items.map((item: any) => ({
      _id: item._id,
      title: item.title,
      youtubeId: item.description, // Assuming youtubeId is stored in description for now
      caption: item.description,
      thumbnail: { uri: item.thumbnailUrl || item.url },
      duration: "", // Backend doesn't provide duration yet
    }));
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
}

export async function getAlbums() {
  try {
    const { data } = await api.get("/media", { params: { type: "image", category: "albums" } });
    // Assuming backend returns distinct albums or a way to group images into albums
    // For now, let's create dummy albums based on categories if not explicitly provided
    const albumsMap = new Map();
    data.items.forEach((item: any) => {
      if (item.category && !albumsMap.has(item.category)) {
        albumsMap.set(item.category, {
          _id: item.category,
          title: item.category.charAt(0).toUpperCase() + item.category.slice(1),
          cover: { uri: item.url },
        });
      }
    });
    return Array.from(albumsMap.values());
  } catch (error) {
    console.error("Error fetching albums:", error);
    return [];
  }
}

export async function getAlbumImages(albumId?: string) {
  try {
    const params: { type: string; category?: string } = { type: "image" };
    if (albumId && albumId !== "all") {
      params.category = albumId;
    }
    const { data } = await api.get("/media", { params });
    return data.items.map((item: any) => ({
      _id: item._id,
      albumId: item.category,
      src: { uri: item.url },
      caption: item.title,
    }));
  } catch (error) {
    console.error("Error fetching album images:", error);
    return [];
  }
}

export async function getNews() {
  try {
    const { data } = await api.get("/media", { params: { category: "news" } });
    return data.items.map((item: any) => ({
      _id: item._id,
      title: item.title,
      excerpt: item.description,
      body: item.description,
      banner: { uri: item.url },
      image: { uri: item.url },
      date: item.uploadedAt, // Assuming uploadedAt can be used as date
    }));
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

/* ---------- Combined Accessor for Search ---------- */
export async function getMediaData() {
  const videos = await getVideos();
  const albums = await getAlbums();
  // For images, we might need a separate call or a way to get all images not tied to a specific album
  // For simplicity, let's assume getAlbumImages can fetch all images if albumId is null or a special value
  const images = await getAlbumImages("all"); // Assuming "all" can fetch all images
  return {
    videos,
    images,
    albums,
  };
}