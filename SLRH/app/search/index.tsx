import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import Header from "../../components/Header";
import SegmentedBar from "../../components/SegmentedBar";
import { getHomeData } from "../data/home";
import { DriverItem, NewsItem, MediaVideo, MediaImage } from "../data/type";

/* -------------------- Constants -------------------- */
const PAD = 14;
const TABS = ["All", "People", "Media", "News"] as const;
type TabKey = (typeof TABS)[number];

const asSrc = (s?: any) => (typeof s === "string" ? { uri: s } : s);

/* Placeholder getMediaData */
async function getMediaData() {
  return { videos: [], images: [] };
}

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);
  const [tab, setTab] = useState<TabKey>("All");
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");

  const [drivers, setDrivers] = useState<DriverItem[]>([]);
  const [newsSeed, setNewsSeed] = useState<NewsItem[]>([]);
  const [videos, setVideos] = useState<MediaVideo[]>([]);
  const [images, setImages] = useState<MediaImage[]>([]);

  /* ---------- Debounce search input ---------- */
  useEffect(() => {
    const id = setTimeout(() => setDebounced(q.trim()), 250);
    return () => clearTimeout(id);
  }, [q]);

  /* ---------- Autofocus ---------- */
  useEffect(() => {
    const id = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(id);
  }, []);

  /* ---------- Load data ---------- */
  useEffect(() => {
    (async () => {
      const h = await getHomeData();
      setDrivers(h.players ?? []); // assuming "players" holds driver data
      setNewsSeed(h.news ?? []);

      const m = await getMediaData();
      setVideos(m.videos ?? []);
      setImages(m.images ?? []);
    })();
  }, []);

  /* ---------- Filters ---------- */
  const people = useMemo(() => {
    if (!debounced) return drivers;
    const s = debounced.toLowerCase();
    return drivers.filter((d: DriverItem) =>
      (d.name || "").toLowerCase().includes(s)
    );
  }, [drivers, debounced]);

  const mediaVids = useMemo(() => {
    if (!debounced) return videos;
    const s = debounced.toLowerCase();
    return videos.filter((v: MediaVideo) =>
      (v.title || "").toLowerCase().includes(s)
    );
  }, [videos, debounced]);

  const mediaImgs = useMemo(() => {
    if (!debounced) return images;
    const s = debounced.toLowerCase();
    return images.filter((i: MediaImage) =>
      (i.caption || "").toLowerCase().includes(s)
    );
  }, [images, debounced]);

  const news = useMemo(() => {
    if (!debounced) return newsSeed;
    const s = debounced.toLowerCase();
    return newsSeed.filter(
      (n: NewsItem) =>
        (n.title || "").toLowerCase().includes(s) ||
        (n.excerpt || "").toLowerCase().includes(s)
    );
  }, [newsSeed, debounced]);

  /* ---------- Combine all results ---------- */
  const all = useMemo(() => {
    const items: Array<
      | { kind: "person"; item: DriverItem }
      | { kind: "video"; item: MediaVideo }
      | { kind: "image"; item: MediaImage }
      | { kind: "news"; item: NewsItem }
    > = [];
    people.slice(0, 4).forEach((p: DriverItem) =>
      items.push({ kind: "person", item: p })
    );
    mediaVids.slice(0, 4).forEach((v: MediaVideo) =>
      items.push({ kind: "video", item: v })
    );
    mediaImgs.slice(0, 4).forEach((i: MediaImage) =>
      items.push({ kind: "image", item: i })
    );
    news.slice(0, 4).forEach((n: NewsItem) =>
      items.push({ kind: "news", item: n })
    );
    return items;
  }, [people, mediaVids, mediaImgs, news]);

  /* -------------------- UI -------------------- */
  return (
    <SafeAreaView style={s.safe}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <Header title="Search" />

          <View style={s.searchBox}>
            <Ionicons name="search" size={20} color="#999" />
            <TextInput
              ref={inputRef}
              placeholder="Search..."
              placeholderTextColor="#999"
              style={s.input}
              value={q}
              onChangeText={setQ}
            />
            {q ? (
              <Pressable onPress={() => setQ("")}>
                <Ionicons name="close" size={20} color="#999" />
              </Pressable>
            ) : null}
          </View>

          <SegmentedBar
            tabs={TABS}
            value={tab}
            onChange={setTab}
            style={{
              paddingHorizontal: PAD,
              paddingTop: 8,
              paddingBottom: 4,
            }}
          />

          {tab === "All" && (
            <FlatList
              data={all}
              keyExtractor={(_, i) => `all-${i}`}
              contentContainerStyle={{
                padding: PAD,
                paddingBottom: 18 + insets.bottom,
                gap: 10,
              }}
              renderItem={({ item }) => {
                if (item.kind === "person") return <PersonRow p={item.item} />;
                if (item.kind === "video") return <VideoRow v={item.item} />;
                if (item.kind === "image") return <ImageRow img={item.item} />;
                return <NewsRow n={item.item} />;
              }}
              ListEmptyComponent={<Empty q={debounced} />}
            />
          )}

          {tab === "People" && (
            <FlatList
              data={people}
              keyExtractor={(it, i) => it.id || it.name || String(i)}
              contentContainerStyle={{
                padding: PAD,
                paddingBottom: 18 + insets.bottom,
                gap: 10,
              }}
              renderItem={({ item }) => <PersonRow p={item} />}
              ListEmptyComponent={<Empty q={debounced} />}
            />
          )}

          {tab === "Media" && (
            <FlatList
              data={[
                ...mediaVids.map((m: MediaVideo) => ({
                  kind: "v" as const,
                  m,
                })),
                ...mediaImgs.map((m: MediaImage) => ({
                  kind: "i" as const,
                  m,
                })),
              ]}
              keyExtractor={(_, i) => `m-${i}`}
              contentContainerStyle={{
                padding: PAD,
                paddingBottom: 18 + insets.bottom,
                gap: 10,
              }}
              renderItem={({ item }) =>
                item.kind === "v" ? (
                  <VideoRow v={item.m} />
                ) : (
                  <ImageRow img={item.m} />
                )
              }
              ListEmptyComponent={<Empty q={debounced} />}
            />
          )}

          {tab === "News" && (
            <FlatList
              data={news}
              keyExtractor={(it) => it._id || it.title}
              contentContainerStyle={{
                padding: PAD,
                paddingBottom: 18 + insets.bottom,
                gap: 10,
              }}
              renderItem={({ item }) => <NewsRow n={item} />}
              ListEmptyComponent={<Empty q={debounced} />}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

/* -------------------- Row Components -------------------- */

function PersonRow({ p }: { p: DriverItem }) {
  const name = p.name || "Driver";
  const id = p.id || name.replace(/\s+/g, "-").toLowerCase();
  return (
    <Link href={{ pathname: "/people/driver/[id]", params: { id } }} asChild>
      <Pressable style={s.rowCard}>
        <Image source={asSrc(p.avatar)} style={s.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={s.rowTitle}>{name}</Text>
          {p.profile?.club && <Text style={s.rowSub}>{p.profile.club}</Text>}
        </View>
        <Ionicons name="chevron-forward" size={18} color="#9AA0A6" />
      </Pressable>
    </Link>
  );
}

function VideoRow({ v }: { v: MediaVideo }) {
  return (
    <Pressable style={s.rowCard}>
      <Image source={asSrc(v.thumbnail)} style={s.thumb} />
      <View style={{ flex: 1 }}>
        <Text style={s.rowTitle}>{v.title}</Text>
        <Text style={s.rowSub}>{v.duration ?? ""}</Text>
      </View>
      <View style={s.playPill}>
        <Text style={s.playTxt}>▶</Text>
      </View>
    </Pressable>
  );
}

function ImageRow({ img }: { img: MediaImage }) {
  return (
    <Pressable style={s.rowCard}>
      <Image source={asSrc(img.src)} style={s.thumb} />
      <View style={{ flex: 1 }}>
        <Text style={s.rowTitle}>{img.caption ?? "Image"}</Text>
        <Text style={s.rowSub}>Gallery</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#9AA0A6" />
    </Pressable>
  );
}

function NewsRow({ n }: { n: NewsItem }) {
  return (
    <Pressable style={s.rowCard}>
      <Image source={asSrc(n.banner)} style={s.thumb} />
      <View style={{ flex: 1 }}>
        <Text style={s.rowTitle}>{n.title}</Text>
        <Text style={s.rowSub}>
          {n.publishedAt
            ? new Date(n.publishedAt).toLocaleDateString()
            : ""}{" "}
          {n.category ? `• ${n.category}` : ""}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#9AA0A6" />
    </Pressable>
  );
}

function Empty({ q }: { q: string }) {
  return (
    <View style={s.emptyBox}>
      <Text style={s.emptyTitle}>
        {q ? "No results" : "Start typing to search"}
      </Text>
      <Text style={s.emptySub}>
        {q ? "Try a different keyword" : "Find drivers, media and news"}
      </Text>
    </View>
  );
}

/* -------------------- Styles -------------------- */
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0b0b0b" },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: PAD,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    marginLeft: 8,
  },
  rowCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 14,
  },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#1c1c1c" },
  thumb: { width: 80, height: 60, borderRadius: 10, backgroundColor: "#1c1c1c" },
  rowTitle: { color: "#fff", fontWeight: "800" },
  rowSub: { color: "#aeb4ba", marginTop: 2 },
  playPill: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#7e5bef",
    alignItems: "center",
    justifyContent: "center",
  },
  playTxt: { color: "#fff", fontWeight: "900" },
  emptyBox: { alignItems: "center", paddingVertical: 36 },
  emptyTitle: { color: "#fff", fontWeight: "900", fontSize: 16 },
  emptySub: { color: "#aab0b8", marginTop: 6 },
});
