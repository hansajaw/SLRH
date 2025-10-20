import React, { useMemo, useState } from "react";
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
import {
  getRacingData,
  type RaceEvent,
  type LiveItem,
  type ResultRow,
  type StandingRow,
} from "../../data/racing";
import { router, useLocalSearchParams } from "expo-router";

/* ---------------- Constants ---------------- */
const TABS = ["Racing Schedule", "Live Coverage", "Results", "Standings"] as const;
type TabKey = (typeof TABS)[number];

type ListItem =
  | { key: string; type: "schedule"; item: RaceEvent }
  | { key: string; type: "live"; item: LiveItem }
  | { key: string; type: "result"; item: ResultRow }
  | { key: string; type: "standing"; item: StandingRow };

const fmt = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

/* ---------------- Component ---------------- */
export default function RacingScreen() {
  const insets = useSafeAreaInsets();
  const { tab: tabParam } = useLocalSearchParams<{ tab?: string }>();
  const { schedule, live, results, standings } = getRacingData();

  // Initialize tab based on navigation param (ex: ?tab=Results)
  const initialTab = useMemo<TabKey>(() => {
    const t = (tabParam ?? "").toLowerCase();
    if (t.includes("result")) return "Results";
    if (t.includes("live")) return "Live Coverage";
    if (t.includes("stand")) return "Standings";
    return "Racing Schedule";
  }, [tabParam]);

  const [tab, setTab] = useState<TabKey>(initialTab);
  const [query, setQuery] = useState("");

  // Filter data based on tab + search
  const filtered = useMemo<ListItem[]>(() => {
    const q = query.trim().toLowerCase();

    if (tab === "Racing Schedule") {
      return schedule
        .filter(
          (e) =>
            !q ||
            e.title.toLowerCase().includes(q) ||
            (e.city || "").toLowerCase().includes(q) ||
            (e.circuit || "").toLowerCase().includes(q)
        )
        .sort((a, b) => +new Date(a.scheduledAt) - +new Date(b.scheduledAt))
        .map((e) => ({ key: e.id, type: "schedule", item: e }));
    }

    if (tab === "Live Coverage") {
      return live
        .filter((l) => !q || l.title.toLowerCase().includes(q))
        .sort((a, b) =>
          a.status === "LIVE" ? -1 : b.status === "LIVE" ? 1 : 0
        )
        .map((l) => ({ key: l.id, type: "live", item: l }));
    }

    if (tab === "Results") {
      return results
        .filter(
          (r) =>
            !q ||
            r.title.toLowerCase().includes(q) ||
            r.podium.some((p) => p.name.toLowerCase().includes(q))
        )
        .sort((a, b) => +new Date(b.occurredAt) - +new Date(a.occurredAt))
        .map((r) => ({ key: r.id, type: "result", item: r }));
    }

    return standings
      .filter(
        (s) =>
          !q ||
          s.driver.toLowerCase().includes(q) ||
          (s.team || "").toLowerCase().includes(q)
      )
      .sort((a, b) => a.rank - b.rank)
      .map((s) => ({ key: String(s.rank), type: "standing", item: s }));
  }, [tab, query, schedule, live, results, standings]);

  /* ---------------- UI ---------------- */
  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={[styles.header, { paddingTop: Math.max(8, insets.top * 0.25) }]}>
        <Text style={styles.headerTitle}>Racing</Text>
      </View>

      <SegmentedBar tabs={TABS} value={tab} onChange={setTab} wrapToTwoLines />

      {/* Search box */}
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

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(it) => it.key}
        contentContainerStyle={{ padding: 16, paddingBottom: 16 + insets.bottom }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => {
          switch (item.type) {
            case "schedule":
              return <ScheduleCard e={item.item} />;
            case "live":
              return <LiveCard l={item.item} />;
            case "result":
              return <ResultCard r={item.item} />;
            case "standing":
              return <StandingRowCard s={item.item} />;
          }
        }}
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

/* ---------------- Cards ---------------- */

function ScheduleCard({ e }: { e: RaceEvent }) {
  return (
    <View style={styles.card}>
      {e.banner ? (
        <Image source={e.banner as any} style={styles.thumbWide} />
      ) : (
        <View style={[styles.thumbWide, styles.imagePh]} />
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {e.title}
        </Text>
        <Text style={styles.cardMeta} numberOfLines={1}>
          {e.city}
          {e.circuit ? ` • ${e.circuit}` : ""}
        </Text>
        <Text style={styles.cardMetaDim}>{fmt(e.scheduledAt)}</Text>
      </View>
      <Pressable
        style={styles.primaryBtn}
        onPress={() =>
          router.push({ pathname: "/racing/[id]", params: { id: e.id } })
        }
      >
        <Text style={styles.primaryBtnText}>Details</Text>
      </Pressable>
    </View>
  );
}

function LiveCard({ l }: { l: LiveItem }) {
  const pillStyle =
    l.status === "LIVE"
      ? styles.pillLive
      : l.status === "UPCOMING"
      ? styles.pillUpcoming
      : styles.pillEnded;

  return (
    <View style={styles.card}>
      {l.thumbnail ? (
        <Image source={l.thumbnail as any} style={styles.thumbWide} />
      ) : (
        <View style={[styles.thumbWide, styles.imagePh]} />
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {l.title}
        </Text>
        <Text style={[styles.statusPill, pillStyle]}>{l.status}</Text>
        <Text style={styles.cardMetaDim}>{fmt(l.startedAt)}</Text>
      </View>
      <Pressable style={styles.primaryBtn}>
        <Text style={styles.primaryBtnText}>Watch</Text>
      </Pressable>
    </View>
  );
}

function ResultCard({ r }: { r: ResultRow }) {
  return (
    <View style={styles.card}>
      {r.banner ? (
        <Image source={r.banner as any} style={styles.thumbWide} />
      ) : (
        <View style={[styles.thumbWide, styles.imagePh]} />
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {r.title}
        </Text>
        <Text style={styles.cardMeta} numberOfLines={1}>
          1st {r.podium.find((p) => p.place === 1)?.name ?? "-"} • 2nd{" "}
          {r.podium.find((p) => p.place === 2)?.name ?? "-"} • 3rd{" "}
          {r.podium.find((p) => p.place === 3)?.name ?? "-"}
        </Text>
        <Text style={styles.cardMetaDim}>{fmt(r.occurredAt)}</Text>
      </View>
      <Pressable style={styles.primaryBtn}>
        <Text style={styles.primaryBtnText}>Recap</Text>
      </Pressable>
    </View>
  );
}

function StandingRowCard({ s }: { s: StandingRow }) {
  return (
    <View style={styles.cardSmall}>
      <Text style={styles.rank}>{s.rank}</Text>
      {s.avatar ? (
        <Image source={s.avatar as any} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.imagePh]} />
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {s.driver}
        </Text>
        <Text style={styles.cardMetaDim} numberOfLines={1}>
          {s.team ?? "—"}
        </Text>
      </View>
      <Text style={styles.points}>{s.points}</Text>
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
  cardSmall: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#141414",
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: "#222",
  },
  rank: {
    width: 26,
    textAlign: "center",
    color: "#00E0C6",
    fontWeight: "900",
    fontSize: 16,
  },
  avatar: { width: 42, height: 42, borderRadius: 21, resizeMode: "cover" },
  points: { color: "#fff", fontWeight: "900", fontSize: 16, marginLeft: 8 },
  statusPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
    fontWeight: "800",
    overflow: "hidden",
  },
  pillLive: { backgroundColor: "#F43F5E22", color: "#FF5876" },
  pillUpcoming: { backgroundColor: "#2DD4BF22", color: "#00E0C6" },
  pillEnded: { backgroundColor: "#9CA3AF22", color: "#cfcfcf" },
});
