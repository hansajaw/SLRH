import { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import SegmentedBar from "../../../components/SegmentedBar";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "../../../context/ThemeContext"; // 👈 import theme hook

import { getSchedule, getLive, getResults } from "../../data/events";

const TABS = ["Racing Schedule", "Live Coverage", "Results"] as const;
type TabKey = typeof TABS[number];

const fmt = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function RacingScreen() {
  const insets = useSafeAreaInsets();
  const { palette } = useTheme(); // 👈 dynamic theme
  const { tab: tabParam } = useLocalSearchParams<{ tab?: string }>();

  const initialTab: TabKey =
    (tabParam ?? "").toLowerCase().includes("result")
      ? "Results"
      : (tabParam ?? "").toLowerCase().includes("live")
      ? "Live Coverage"
      : "Racing Schedule";

  const [tab, setTab] = useState<TabKey>(initialTab);
  const [query, setQuery] = useState("");

  const schedule = useMemo(() => getSchedule(), []);
  const live = useMemo(() => getLive(), []);
  const results = useMemo(() => getResults(), []);

  type ListItem =
    | { key: string; type: "schedule"; item: ReturnType<typeof getSchedule>[number] }
    | { key: string; type: "live"; item: ReturnType<typeof getLive>[number] }
    | { key: string; type: "result"; item: ReturnType<typeof getResults>[number] };

  const filtered = useMemo<ListItem[]>(() => {
    const q = query.trim().toLowerCase();

    if (tab === "Racing Schedule") {
      const arr = schedule.filter(
        (e) =>
          !q ||
          e.title.toLowerCase().includes(q) ||
          (e.city || "").toLowerCase().includes(q) ||
          (e.circuit || "").toLowerCase().includes(q)
      );
      return arr.map((e) => ({ key: e.id, type: "schedule" as const, item: e }));
    }

    if (tab === "Live Coverage") {
      const arr = live.filter((l) => !q || l.title.toLowerCase().includes(q));
      return arr.map((l) => ({ key: l.id, type: "live" as const, item: l }));
    }

    const arr = results.filter((r) => !q || r.title.toLowerCase().includes(q));
    return arr.map((r) => ({ key: r.id, type: "result" as const, item: r }));
  }, [tab, query, schedule, live, results]);

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: palette.background }]}
      edges={["top", "bottom"]}
    >
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(8, insets.top * 0.25),
            backgroundColor: palette.background,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: palette.text }]}>Racing</Text>
      </View>

      <SegmentedBar tabs={TABS} value={tab} onChange={setTab} wrapToTwoLines />

      <View style={styles.toolsRow}>
        <View
          style={[
            styles.searchBox,
            {
              backgroundColor: palette.card,
              borderColor: palette.border,
            },
          ]}
        >
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={`Search ${tab.toLowerCase()}…`}
            placeholderTextColor={palette.textSecondary + "99"}
            style={[styles.searchInput, { color: palette.text }]}
          />
        </View>
      </View>

      <FlatList<ListItem>
        data={filtered}
        keyExtractor={(it) => it.key}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 16 + insets.bottom,
        }}
        renderItem={({ item }) => {
          switch (item.type) {
            case "schedule":
              return <ScheduleCard e={item.item} palette={palette} />;
            case "live":
              return <LiveCard l={item.item} palette={palette} />;
            case "result":
              return <ResultCard r={item.item} palette={palette} />;
          }
        }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <View
            style={[
              styles.emptyBox,
              { backgroundColor: palette.card, borderColor: palette.border },
            ]}
          >
            <Text style={[styles.emptyTitle, { color: palette.text }]}>
              Nothing here
            </Text>
            <Text style={[styles.emptySubtitle, { color: palette.textSecondary }]}>
              Try a different search
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

/* ---------------- SCHEDULE CARD ---------------- */
function ScheduleCard({
  e,
  palette,
}: {
  e: ReturnType<typeof getSchedule>[number];
  palette: any;
}) {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: palette.card, borderColor: palette.border },
      ]}
    >
      {e.banner ? (
        <Image
          source={typeof e.banner === "string" ? { uri: e.banner } : (e.banner as any)}
          style={styles.thumbWide}
        />
      ) : (
        <View
          style={[styles.thumbWide, styles.imagePh, { borderColor: palette.border }]}
        />
      )}
      <View style={{ flex: 1 }}>
        <Text style={[styles.cardTitle, { color: palette.text }]} numberOfLines={2}>
          {e.title}
        </Text>
        <Text style={[styles.cardMeta, { color: palette.textSecondary }]}>
          {e.city}
          {e.circuit ? ` • ${e.circuit}` : ""}
        </Text>
        <Text style={[styles.cardMetaDim, { color: palette.textSecondary }]}>
          {fmt(e.scheduledAt)}
        </Text>
      </View>
      <Pressable
        style={[styles.primaryBtn, { backgroundColor: palette.accent }]}
        onPress={() => router.push({ pathname: "/racing/[id]", params: { id: e.id } })}
      >
        <Text style={[styles.primaryBtnText, { color: "#000" }]}>Details</Text>
      </Pressable>
    </View>
  );
}

/* ---------------- LIVE CARD ---------------- */
function LiveCard({
  l,
  palette,
}: {
  l: ReturnType<typeof getLive>[number];
  palette: any;
}) {
  const pill =
    l.status === "LIVE"
      ? [styles.pill, { backgroundColor: "#EF444422", color: "#EF4444" }]
      : l.status === "UPCOMING"
      ? [styles.pill, { backgroundColor: palette.accent + "22", color: palette.accent }]
      : [styles.pill, { backgroundColor: "#9CA3AF22", color: palette.textSecondary }];

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: palette.card, borderColor: palette.border },
      ]}
    >
      {l.thumbnail ? (
        <Image
          source={
            typeof l.thumbnail === "string" ? { uri: l.thumbnail } : (l.thumbnail as any)
          }
          style={styles.thumbWide}
        />
      ) : (
        <View
          style={[styles.thumbWide, styles.imagePh, { borderColor: palette.border }]}
        />
      )}
      <View style={{ flex: 1 }}>
        <Text style={[styles.cardTitle, { color: palette.text }]} numberOfLines={2}>
          {l.title}
        </Text>
        <Text style={pill as any}>{l.status}</Text>
        <Text style={[styles.cardMetaDim, { color: palette.textSecondary }]}>
          {fmt(l.startedAt)}
        </Text>
      </View>
      <Pressable style={[styles.primaryBtn, { backgroundColor: palette.accent }]}>
        <Text style={[styles.primaryBtnText, { color: "#000" }]}>Watch</Text>
      </Pressable>
    </View>
  );
}

/* ---------------- RESULT CARD ---------------- */
function ResultCard({
  r,
  palette,
}: {
  r: ReturnType<typeof getResults>[number];
  palette: any;
}) {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: palette.card, borderColor: palette.border },
      ]}
    >
      {r.banner ? (
        <Image
          source={typeof r.banner === "string" ? { uri: r.banner } : (r.banner as any)}
          style={styles.thumbWide}
        />
      ) : (
        <View
          style={[styles.thumbWide, styles.imagePh, { borderColor: palette.border }]}
        />
      )}
      <View style={{ flex: 1 }}>
        <Text style={[styles.cardTitle, { color: palette.text }]} numberOfLines={2}>
          {r.title}
        </Text>
        <Text style={[styles.cardMeta, { color: palette.textSecondary }]} numberOfLines={1}>
          1st {r.podium.find((p) => p.place === 1)?.name ?? "-"} • 2nd{" "}
          {r.podium.find((p) => p.place === 2)?.name ?? "-"} • 3rd{" "}
          {r.podium.find((p) => p.place === 3)?.name ?? "-"}
        </Text>
        <Text style={[styles.cardMetaDim, { color: palette.textSecondary }]}>
          {fmt(r.occurredAt)}
        </Text>
      </View>
      <Pressable
        style={[styles.primaryBtn, { backgroundColor: palette.accent }]}
        onPress={() =>
          router.push({ pathname: "/racing/result/[id]", params: { id: r.id } })
        }
      >
        <Text style={[styles.primaryBtnText, { color: "#000" }]}>View</Text>
      </Pressable>
    </View>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 8 },
  headerTitle: { fontSize: 22, fontWeight: "800" },

  toolsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  searchBox: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  searchInput: { height: 40 },

  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 24,
    paddingHorizontal: 12,
    marginTop: 12,
  },
  emptyTitle: { fontSize: 16, fontWeight: "800" },
  emptySubtitle: { marginTop: 4, fontSize: 12 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
  },
  thumbWide: { width: 84, height: 60, borderRadius: 14, resizeMode: "cover" },
  imagePh: { backgroundColor: "#222", borderWidth: 1 },
  cardTitle: { fontSize: 16, fontWeight: "800" },
  cardMeta: { marginTop: 2 },
  cardMetaDim: { fontSize: 12, marginTop: 2 },

  primaryBtn: {
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { fontWeight: "800" },

  pill: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
    fontWeight: "800",
    overflow: "hidden",
  },
});
