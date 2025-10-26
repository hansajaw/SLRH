// app/search/index.tsx
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
  ImageSourcePropType,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

import SegmentedBar from "../../components/SegmentedBar";
import { useTheme } from "../../context/ThemeContext";
import { getHomeData, type PlayerItem, type NewsItem } from "../data/home";
import { getMediaData, type MediaVideo, type MediaImage } from "../data/media";

const PAD = 14;
const TABS = ["All", "People", "Media", "News"] as const;
type TabKey = (typeof TABS)[number];

// safely handle images
const asSrc = (s?: any): ImageSourcePropType => {
  if (typeof s === "number") return s;
  if (typeof s === "string") return { uri: s };
  if (s && typeof s === "object") return s;
  return {
    uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2NgYGBgAAAABQABDQottQAAAABJRU5ErkJggg==",
  };
};

export default function SearchScreen() {
  const { palette } = useTheme();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);
  const [tab, setTab] = useState<TabKey>("All");
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");

  const { players, news: newsSeed } = useMemo(() => {
    const h = getHomeData();
    return { players: h.players ?? [], news: h.news ?? [] };
  }, []);
  const { videos, images } = useMemo(() => getMediaData(), []);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(q.trim()), 220);
    return () => clearTimeout(id);
  }, [q]);

  useEffect(() => {
    const id = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(id);
  }, []);

  // filters
  const people = useMemo(() => {
    if (!debounced) return players;
    const s = debounced.toLowerCase();
    return players.filter((p) => (p.playerName || "").toLowerCase().includes(s));
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

  // "All" combined
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

  const Separator = () => <View style={{ height: 10 }} />;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: palette.background }]} edges={["top"]}>
      {/* Search bar */}
      <View
        style={[
          styles.head,
          { paddingTop: Math.max(6, insets.top * 0.2), backgroundColor: palette.background },
        ]}
      >
        <View
          style={[
            styles.searchBox,
            { backgroundColor: palette.card, borderColor: palette.border },
          ]}
        >
          <Ionicons name="search" size={18} color={palette.textSecondary} style={{ marginHorizontal: 10 }} />
          <TextInput
            ref={inputRef}
            value={q}
            onChangeText={setQ}
            placeholder="Search drivers, videos, news…"
            placeholderTextColor={palette.textSecondary}
            style={[styles.input, { color: palette.text }]}
            returnKeyType="search"
            onSubmitEditing={() => Keyboard.dismiss()}
          />
          {!!q && (
            <Pressable onPress={() => setQ("")} hitSlop={10} style={{ paddingHorizontal: 8 }}>
              <Ionicons name="close-circle" size={18} color={palette.textSecondary} />
            </Pressable>
          )}
        </View>
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
          contentContainerStyle={{ paddingHorizontal: PAD, paddingBottom: 20 + insets.bottom }}
          ItemSeparatorComponent={Separator}
          renderItem={({ item }) => {
            switch (item.kind) {
              case "person":
                return <UnifiedRow type="person" item={item.item} palette={palette} />;
              case "video":
                return <UnifiedRow type="video" item={item.item} palette={palette} />;
              case "image":
                return <UnifiedRow type="image" item={item.item} palette={palette} />;
              case "news":
                return <UnifiedRow type="news" item={item.item} palette={palette} />;
            }
          }}
          ListEmptyComponent={<Empty q={debounced} palette={palette} />}
          showsVerticalScrollIndicator={false}
        />
      )}

      {tab === "People" && (
        <FlatList
          data={people}
          keyExtractor={(it, i) => String(it._id ?? it.playerName ?? i)}
          contentContainerStyle={{ paddingHorizontal: PAD, paddingBottom: 20 + insets.bottom }}
          ItemSeparatorComponent={Separator}
          renderItem={({ item }) => <UnifiedRow type="person" item={item} palette={palette} />}
          ListEmptyComponent={<Empty q={debounced} palette={palette} />}
          showsVerticalScrollIndicator={false}
        />
      )}

      {tab === "Media" && (
        <FlatList
          data={[...mediaVids.map((m) => ({ kind: "video" as const, item: m })), ...mediaImgs.map((m) => ({ kind: "image" as const, item: m }))]}
          keyExtractor={(_, i) => `m-${i}`}
          contentContainerStyle={{ paddingHorizontal: PAD, paddingBottom: 20 + insets.bottom }}
          ItemSeparatorComponent={Separator}
          renderItem={({ item }) => <UnifiedRow type={item.kind} item={item.item} palette={palette} />}
          ListEmptyComponent={<Empty q={debounced} palette={palette} />}
          showsVerticalScrollIndicator={false}
        />
      )}

      {tab === "News" && (
        <FlatList
          data={news}
          keyExtractor={(it, i) => String(it._id ?? i)}
          contentContainerStyle={{ paddingHorizontal: PAD, paddingBottom: 20 + insets.bottom }}
          ItemSeparatorComponent={Separator}
          renderItem={({ item }) => <UnifiedRow type="news" item={item} palette={palette} />}
          ListEmptyComponent={<Empty q={debounced} palette={palette} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

/* -------------------- Unified Row -------------------- */
function UnifiedRow({
  type,
  item,
  palette,
}: {
  type: "person" | "video" | "image" | "news";
  item: any;
  palette: any;
}) {
  const title =
    type === "person"
      ? item.playerName
      : type === "video"
      ? item.title
      : type === "image"
      ? item.caption ?? "Gallery"
      : item.title;

  const subtitle =
    type === "person"
      ? item.playerDoc?.bestAchievement
      : type === "video"
      ? ""
      : type === "image"
      ? "Gallery"
      : item.category
      ? `${new Date(item.publishedAt).toLocaleDateString()} • ${item.category}`
      : new Date(item.publishedAt).toLocaleDateString();

  const thumbnail =
    type === "person" ? item.profilePicture : type === "news" ? item.banner : type === "video" ? item.thumbnail : item.src;

  const rightIcon = type === "video" ? (
    <View style={[styles.playPill, { backgroundColor: palette.accent }]}>
      <Ionicons name="play" size={16} color={palette.background} />
    </View>
  ) : (
    <Ionicons name="chevron-forward" size={18} color={palette.textSecondary} />
  );

  return (
    <Pressable
      style={[styles.unifiedCard, { backgroundColor: palette.card, borderColor: palette.border }]}
    >
      <Image source={asSrc(thumbnail)} style={styles.unifiedThumb} resizeMode="cover" />

      <View style={styles.unifiedInfo}>
        <Text style={[styles.unifiedTitle, { color: palette.text }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.unifiedSubtitle, { color: palette.textSecondary }]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {rightIcon}
    </Pressable>
  );
}

function Empty({ q, palette }: { q: string; palette: any }) {
  return (
    <View style={styles.emptyBox}>
      <Text style={[styles.emptyTitle, { color: palette.text }]}>
        {q ? "No results" : "Start typing to search"}
      </Text>
      <Text style={[styles.emptySub, { color: palette.textSecondary }]}>
        {q ? "Try a different keyword" : "Find drivers, images, videos and news"}
      </Text>
    </View>
  );
}

/* -------------------- Styles -------------------- */
const styles = StyleSheet.create({
  safe: { paddingTop:-50 },
  head: {
    paddingHorizontal: PAD,
    paddingBottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBox: {
    width: "100%",
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  input: { flex: 1, paddingVertical: 8, fontWeight: "700" },

  unifiedCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  unifiedThumb: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: "#1c1c1c",
  },
  unifiedInfo: { flex: 1 },
  unifiedTitle: { fontSize: 15, fontWeight: "900", marginBottom: 3 },
  unifiedSubtitle: { fontSize: 13, fontWeight: "600" },

  playPill: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyBox: { alignItems: "center", paddingVertical: 36 },
  emptyTitle: { fontWeight: "900", fontSize: 16 },
  emptySub: { marginTop: 6 },
});
