import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  Image,
  Dimensions,
  Keyboard,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";

import SegmentedBar from "../../components/SegmentedBar";
import { getHomeData, type PlayerItem, type NewsItem } from "../data/home";
import { getMediaData, type MediaVideo, type MediaImage } from "../data/media";

/* -------------------- Constants -------------------- */
const PAD = 14;
const TABS = ["All", "People", "Media", "News"] as const;
type TabKey = (typeof TABS)[number];

const asSrc = (s?: any) => (typeof s === "string" ? { uri: s } : s);

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);
  const [tab, setTab] = useState<TabKey>("All");
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");

  /* ---------- Load static data ---------- */
  const { players, news: newsSeed } = useMemo(() => {
    const h = getHomeData();
    return { players: h.players ?? [], news: h.news ?? [] };
  }, []);

  const { videos, images } = useMemo(() => getMediaData(), []);

  /* ---------- Debounce search input ---------- */
  useEffect(() => {
    const id = setTimeout(() => setDebounced(q.trim()), 220);
    return () => clearTimeout(id);
  }, [q]);

  /* ---------- Autofocus ---------- */
  useEffect(() => {
    const id = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(id);
  }, []);

  /* ---------- Filters ---------- */
  const people = useMemo(() => {
    if (!debounced) return players;
    const s = debounced.toLowerCase();
    return players.filter((p) =>
      (p.playerName || "").toLowerCase().includes(s)
    );
  }, [players, debounced]);

  const mediaVids = useMemo(() => {
    if (!debounced) return videos;
    const s = debounced.toLowerCase();
    return videos.filter((v) => (v.title || "").toLowerCase().includes(s));
  }, [videos, debounced]);

  const mediaImgs = useMemo(() => {
    if (!debounced) return images;
    const s = debounced.toLowerCase();
    return images.filter((i) => (i.caption || "").toLowerCase().includes(s));
  }, [images, debounced]);

  const news = useMemo(() => {
    if (!debounced) return newsSeed;
    const s = debounced.toLowerCase();
    return newsSeed.filter(
      (n) =>
        (n.title || "").toLowerCase().includes(s) ||
        (n.excerpt || "").toLowerCase().includes(s)
    );
  }, [newsSeed, debounced]);

  /* ---------- Combine all results ---------- */
  const all = useMemo(() => {
    const items: Array<
      | { kind: "person"; item: PlayerItem }
      | { kind: "video"; item: MediaVideo }
      | { kind: "image"; item: MediaImage }
      | { kind: "news"; item: NewsItem }
    > = [];
    people.slice(0, 4).forEach((p) => items.push({ kind: "person", item: p }));
    mediaVids.slice(0, 4).forEach((v) => items.push({ kind: "video", item: v }));
    mediaImgs.slice(0, 4).forEach((i) => items.push({ kind: "image", item: i }));
    news.slice(0, 4).forEach((n) => items.push({ kind: "news", item: n }));
    return items;
  }, [people, mediaVids, mediaImgs, news]);

  /* -------------------- UI -------------------- */
  return (
    <SafeAreaView style={s.safe}>
      <View style={[s.head, { paddingTop: Math.max(8, insets.top * 0.25) }]}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={s.iconBtn}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </Pressable>

        <View style={s.searchBox}>
          <Ionicons name="search" size={18} color="#9AA0A6" style={{ marginHorizontal: 8 }} />
          <TextInput
            ref={inputRef}
            value={q}
            onChangeText={setQ}
            placeholder="Search drivers, videos, news…"
            placeholderTextColor="#80878c"
            style={s.input}
            returnKeyType="search"
            onSubmitEditing={() => Keyboard.dismiss()}
          />
          {!!q && (
            <Pressable onPress={() => setQ("")} hitSlop={10} style={{ paddingHorizontal: 8 }}>
              <Ionicons name="close-circle" size={18} color="#9AA0A6" />
            </Pressable>
          )}
        </View>

        <View style={{ width: 36 }} />
      </View>

      <SegmentedBar
        tabs={TABS}
        value={tab}
        onChange={setTab}
        style={{ paddingHorizontal: PAD, paddingTop: 8, paddingBottom: 4 }}
      />

      {tab === "All" && (
        <FlatList
          data={all}
          keyExtractor={(_, i) => `all-${i}`}
          contentContainerStyle={{ padding: PAD, paddingBottom: 18 + insets.bottom, gap: 10 }}
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
          keyExtractor={(it, i) => it._id || it.playerName || String(i)}
          contentContainerStyle={{ padding: PAD, paddingBottom: 18 + insets.bottom, gap: 10 }}
          renderItem={({ item }) => <PersonRow p={item} />}
          ListEmptyComponent={<Empty q={debounced} />}
        />
      )}

      {tab === "Media" && (
        <FlatList
          data={[
            ...mediaVids.map((m) => ({ kind: "v" as const, m })),
            ...mediaImgs.map((m) => ({ kind: "i" as const, m })),
          ]}
          keyExtractor={(_, i) => `m-${i}`}
          contentContainerStyle={{ padding: PAD, paddingBottom: 18 + insets.bottom, gap: 10 }}
          renderItem={({ item }) =>
            item.kind === "v" ? <VideoRow v={item.m} /> : <ImageRow img={item.m} />
          }
          ListEmptyComponent={<Empty q={debounced} />}
        />
      )}

      {tab === "News" && (
        <FlatList
          data={news}
          keyExtractor={(it) => it._id}
          contentContainerStyle={{ padding: PAD, paddingBottom: 18 + insets.bottom, gap: 10 }}
          renderItem={({ item }) => <NewsRow n={item} />}
          ListEmptyComponent={<Empty q={debounced} />}
        />
      )}
    </SafeAreaView>
  );
}

/* -------------------- Row Components -------------------- */

function PersonRow({ p }: { p: PlayerItem }) {
  const name = p.playerName || "Driver";
  const id = p._id || name.replace(/\s+/g, "-").toLowerCase();
  return (
    <Link href={{ pathname: "/people/driver/[id]", params: { id } }} asChild>
      <Pressable style={s.rowCard}>
        <Image source={asSrc(p.profilePicture)} style={s.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={s.rowTitle}>{name}</Text>
          {!!p.playerDoc?.bestAchievement && (
            <Text style={s.rowSub}>{p.playerDoc.bestAchievement}</Text>
          )}
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
        <Text style={s.rowSub}>{v.duration ? `${v.duration}` : ""}</Text>
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
          {n.publishedAt ? new Date(n.publishedAt).toLocaleDateString() : ""}{" "}
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
      <Text style={s.emptyTitle}>{q ? "No results" : "Start typing to search"}</Text>
      <Text style={s.emptySub}>
        {q ? "Try a different keyword" : "Find drivers, images, videos and news"}
      </Text>
    </View>
  );
}

/* -------------------- Styles -------------------- */
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0b0b0b" },
  head: {
    paddingHorizontal: PAD,
    paddingBottom: 8,
    backgroundColor: "#0b0b0b",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  searchBox: {
    flex: 1,
    height: 40,
    backgroundColor: "#121519",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1b2230",
    flexDirection: "row",
    alignItems: "center",
  },
  input: { flex: 1, color: "#fff", paddingVertical: 8, fontWeight: "700" },
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
