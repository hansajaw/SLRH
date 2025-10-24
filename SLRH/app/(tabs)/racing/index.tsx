import { useMemo, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, Image, TextInput } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import SegmentedBar from "../../../components/SegmentedBar";
import { router, useLocalSearchParams } from "expo-router";

import { getSchedule, getLive, getResults } from "../../data/events"; // ← NEW

const TABS = ["Racing Schedule", "Live Coverage", "Results"] as const;
type TabKey = typeof TABS[number];

const fmt = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });

export default function RacingScreen() {
  const insets = useSafeAreaInsets();
  const { tab: tabParam } = useLocalSearchParams<{ tab?: string }>();
  const initialTab: TabKey =
    (tabParam ?? "").toLowerCase().includes("result") ? "Results" :
    (tabParam ?? "").toLowerCase().includes("live") ? "Live Coverage" :
    "Racing Schedule";

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
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={[styles.header, { paddingTop: Math.max(8, insets.top * 0.25) }]}>
        <Text style={styles.headerTitle}>Racing</Text>
      </View>

      <SegmentedBar tabs={TABS} value={tab} onChange={setTab} wrapToTwoLines />

      <View style={styles.toolsRow}>
        <View style={styles.searchBox}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={`Search ${tab.toLowerCase()}…`}
            placeholderTextColor="#8f8f8f"
            style={styles.searchInput}
          />
        </View>
      </View>

      <FlatList<ListItem>
        data={filtered}
        keyExtractor={(it) => it.key}
        contentContainerStyle={{ padding: 16, paddingBottom: 16 + insets.bottom }}
        renderItem={({ item }) => {
          switch (item.type) {
            case "schedule":
              return <ScheduleCard e={item.item} />;
            case "live":
              return <LiveCard l={item.item} />;
            case "result":
              return <ResultCard r={item.item} />;
          }
        }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>Nothing here</Text>
            <Text style={styles.emptySubtitle}>Try a different search</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}


function ScheduleCard({ e }: { e: ReturnType<typeof getSchedule>[number] }) {
  return (
    <View style={styles.card}>
      {e.banner ? (
        <Image source={typeof e.banner === "string" ? { uri: e.banner } : (e.banner as any)} style={styles.thumbWide} />
      ) : (
        <View style={[styles.thumbWide, styles.imagePh]} />
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle} numberOfLines={2}>{e.title}</Text>
        <Text style={styles.cardMeta} numberOfLines={1}>
          {e.city}{e.circuit ? ` • ${e.circuit}` : ""}
        </Text>
        <Text style={styles.cardMetaDim}>{fmt(e.scheduledAt)}</Text>
      </View>
      <Pressable
        style={styles.primaryBtn}
        onPress={() => router.push({ pathname: "/racing/[id]", params: { id: e.id } })}
      >
        <Text style={styles.primaryBtnText}>Details</Text>
      </Pressable>
    </View>
  );
}

function LiveCard({ l }: { l: ReturnType<typeof getLive>[number] }) {
  const pill =
    l.status === "LIVE" ? styles.pillLive : l.status === "UPCOMING" ? styles.pillUpcoming : styles.pillEnded;

  return (
    <View style={styles.card}>
      {l.thumbnail ? (
        <Image source={typeof l.thumbnail === "string" ? { uri: l.thumbnail } : (l.thumbnail as any)} style={styles.thumbWide} />
      ) : (
        <View style={[styles.thumbWide, styles.imagePh]} />
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle} numberOfLines={2}>{l.title}</Text>
        <Text style={[styles.statusPill, pill]}>{l.status}</Text>
        <Text style={styles.cardMetaDim}>{fmt(l.startedAt)}</Text>
      </View>
      <Pressable style={styles.primaryBtn}><Text style={styles.primaryBtnText}>Watch</Text></Pressable>
    </View>
  );
}

function ResultCard({ r }: { r: ReturnType<typeof getResults>[number] }) {
  return (
    <View style={styles.card}>
      {r.banner ? (
        <Image source={typeof r.banner === "string" ? { uri: r.banner } : (r.banner as any)} style={styles.thumbWide} />
      ) : (
        <View style={[styles.thumbWide, styles.imagePh]} />
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle} numberOfLines={2}>{r.title}</Text>
        <Text style={styles.cardMeta} numberOfLines={1}>
          1st {r.podium.find((p) => p.place === 1)?.name ?? "-"}  •  2nd {r.podium.find((p) => p.place === 2)?.name ?? "-"}  •  3rd {r.podium.find((p) => p.place === 3)?.name ?? "-"}
        </Text>
        <Text style={styles.cardMetaDim}>{fmt(r.occurredAt)}</Text>
      </View>
      <Pressable
        style={styles.primaryBtn}
        onPress={() => router.push({ pathname: "/racing/result/[id]", params: { id: r.id } })}
      >
        <Text style={styles.primaryBtnText}>View</Text>
      </Pressable>

    </View>
  );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0b0b0b" },

  header: { paddingHorizontal: 16, paddingBottom: 8, backgroundColor: "#0b0b0b" },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "800" },

  toolsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  searchBox: {
    flex: 1,
    backgroundColor: "#141414",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#232323",
    paddingHorizontal: 12,
  },
  searchInput: { height: 40, color: "#fff" },

  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111111",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#222",
    paddingVertical: 24,
    paddingHorizontal: 12,
    marginTop: 12,
  },
  emptyTitle: { color: "#ffffff", fontSize: 16, fontWeight: "800" },
  emptySubtitle: { color: "#bdbdbd", marginTop: 4, fontSize: 12 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#141414",
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: "#222",
  },
  thumbWide: { width: 84, height: 60, borderRadius: 14, resizeMode: "cover" },
  imagePh: { backgroundColor: "#222", borderWidth: 1, borderColor: "#2f2f2f" },
  cardTitle: { color: "#fff", fontSize: 16, fontWeight: "800" },
  cardMeta: { color: "#cfcfcf", marginTop: 2 },
  cardMetaDim: { color: "#9b9b9b", fontSize: 12, marginTop: 2 },

  primaryBtn: {
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#00E0C6",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { color: "#0b0b0b", fontWeight: "800" },

  /* status pills */
  statusPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
    fontWeight: "800",
    overflow: "hidden",
  } as any,
  pillLive: { backgroundColor: "#F43F5E22", color: "#FF5876" },
  pillUpcoming: { backgroundColor: "#2DD4BF22", color: "#00E0C6" },
  pillEnded: { backgroundColor: "#9CA3AF22", color: "#cfcfcf" },
});
