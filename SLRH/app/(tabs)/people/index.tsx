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
import { Link } from "expo-router";
import SegmentedBar from "../../../components/SegmentedBar";
import {
  getPeopleData,
  type DriverItem,
  type TeamItem,
  type FameItem,
} from "../../data/people";

/* ---------------- Tabs & Types ---------------- */
const TABS = ["Drivers", "Teams", "Hall of Fame"] as const;
type TabKey = typeof TABS[number];

type ListItem =
  | { key: string; type: "driver"; item: DriverItem }
  | { key: string; type: "team"; item: TeamItem }
  | { key: string; type: "fame"; item: FameItem };

/* ---------------- Helpers ---------------- */
const normalize = (s?: string) => (s || "").toLowerCase().trim();
function extractWins(stats?: string): number {
  if (!stats) return 0;
  const m = stats.match(/wins?\s*[:\-]?\s*(\d+)/i);
  return m ? Number(m[1]) : 0;
}

/* ===================================================== */

export default function PeopleScreen() {
  const insets = useSafeAreaInsets();
  const { drivers, teams, fame } = getPeopleData();

  const [tab, setTab] = useState<TabKey>("Drivers");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"az" | "wins" | "recent">("az");

  const counts = {
    drivers: drivers.length,
    teams: teams.length,
    fame: fame.length,
  };

  const filtered = useMemo<ListItem[]>(() => {
    const q = normalize(query);

    if (tab === "Drivers") {
      let arr = drivers.filter(
        (d) =>
          !q ||
          normalize(d.name).includes(q) ||
          normalize(d.ride).includes(q) ||
          normalize(d.stats).includes(q)
      );
      if (sort === "wins") arr = arr.slice().sort((a, b) => extractWins(b.stats) - extractWins(a.stats));
      else if (sort === "az") arr = arr.slice().sort((a, b) => a.name.localeCompare(b.name));
      else arr = arr.slice().sort((a, b) => a.name.localeCompare(b.name));

      return arr.map((d) => ({ key: d.id, type: "driver" as const, item: d }));
    }

    if (tab === "Teams") {
      let arr = teams.filter(
        (t) =>
          !q ||
          normalize(t.name).includes(q) ||
          normalize(t.achievements).includes(q) ||
          t.members.some((m) => normalize(m).includes(q))
      );
      if (sort === "az") arr = arr.slice().sort((a, b) => a.name.localeCompare(b.name));
      else arr = arr.slice().sort((a, b) => a.name.localeCompare(b.name));

      return arr.map((t) => ({ key: t.id, type: "team" as const, item: t }));
    }

    // Hall of Fame
    let arr = fame.filter(
      (h) =>
        !q ||
        normalize(h.title).includes(q) ||
        normalize(h.person).includes(q) ||
        String(h.year).includes(q) ||
        normalize(h.blurb).includes(q)
    );
    if (sort === "recent") arr = arr.slice().sort((a, b) => b.year - a.year);
    else if (sort === "az") arr = arr.slice().sort((a, b) => a.person.localeCompare(b.person));
    else arr = arr.slice().sort((a, b) => b.year - a.year);

    return arr.map((h) => ({ key: h.id, type: "fame" as const, item: h }));
  }, [tab, query, sort, drivers, teams, fame]);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      {/* Title */}
      <View style={[styles.header, { paddingTop: Math.max(8, insets.top * 0.25) }]}>
        <Text style={styles.headerTitle}>People</Text>
      </View>

      {/* SegmentedBar */}
      <SegmentedBar tabs={TABS} value={tab} onChange={setTab} />

      {/* Tools: Search + Sort */}
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

        <View style={styles.sortWrap}>
          {(["az", "wins", "recent"] as const).map((k) => {
            const active = sort === k;
            return (
              <Pressable
                key={k}
                onPress={() => setSort(k)}
                style={[styles.sortChip, active && styles.sortChipActive]}
              >
                <Text style={[styles.sortText, active && styles.sortTextActive]}>
                  {k === "az" ? "A–Z" : k === "wins" ? "Wins" : "Recent"}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <StatCard label="Drivers" value={counts.drivers} />
        <StatCard label="Teams" value={counts.teams} />
        <StatCard label="Hall of Fame" value={counts.fame} />
      </View>

      {/* List */}
      <FlatList<ListItem>
        data={filtered}
        keyExtractor={(it) => it.key}
        contentContainerStyle={{ padding: 16, paddingBottom: 16 + insets.bottom }}
        renderItem={({ item }) => {
          if (item.type === "driver") return <DriverCard d={item.item} />;
          if (item.type === "team") return <TeamCard t={item.item} />;
          return <FameCard h={item.item} />;
        }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>No matches</Text>
            <Text style={styles.emptySubtitle}>Try a different search or sort</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

/* ---------------- Small Components ---------------- */

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ImageOrBox({ src, style }: { src?: any; style: any }) {
  if (src) return <Image source={src as any} style={style} />;
  return <View style={[style, styles.imagePh]} />;
}

/* ---------------- Cards (with typed links) ---------------- */

function DriverCard({ d }: { d: DriverItem }) {
  return (
    <View style={styles.card}>
      {/* Tap image/name opens profile */}
      <Link
        href={{ pathname: "/people/driver/[id]", params: { id: d.id } }}
        asChild
      >
        <Pressable style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
          <ImageOrBox src={d.avatar} style={styles.thumbLg} />
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={styles.cardTitle} numberOfLines={1}>{d.name}</Text>
            <Text style={styles.cardMeta} numberOfLines={1}>Ride: {d.ride}</Text>
            {d.stats ? <Text style={styles.cardMetaDim} numberOfLines={1}>{d.stats}</Text> : null}
          </View>
        </Pressable>
      </Link>

      {/* Button also opens profile */}
      <Link
        href={{ pathname: "/people/driver/[id]", params: { id: d.id } }}
        asChild
      >
        <Pressable style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>View</Text>
        </Pressable>
      </Link>
    </View>
  );
}

function TeamCard({ t }: { t: TeamItem }) {
  return (
    <View style={styles.card}>
      <Link
        href={{ pathname: "/people/team/[id]", params: { id: t.id } }}
        asChild
      >
        <Pressable style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
          <ImageOrBox src={t.logo} style={styles.thumbLg} />
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={styles.cardTitle} numberOfLines={1}>{t.name}</Text>
            <Text style={styles.cardMeta} numberOfLines={1}>Members: {t.members.join(", ")}</Text>
            {t.achievements ? <Text style={styles.cardMetaDim} numberOfLines={1}>{t.achievements}</Text> : null}
          </View>
        </Pressable>
      </Link>

      <Link
        href={{ pathname: "/people/team/[id]", params: { id: t.id } }}
        asChild
      >
        <Pressable style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>Open</Text>
        </Pressable>
      </Link>
    </View>
  );
}

function FameCard({ h }: { h: FameItem }) {
  return (
    <View style={styles.card}>
      <ImageOrBox src={h.avatar} style={styles.thumbLg} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={styles.cardTitle} numberOfLines={1}>{h.title}</Text>
        <Text style={styles.cardMeta} numberOfLines={1}>{h.person} • {h.year}</Text>
        {h.blurb ? <Text style={styles.cardMetaDim} numberOfLines={1}>{h.blurb}</Text> : null}
      </View>
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

  sortWrap: { flexDirection: "row", gap: 8 },
  sortChip: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#141414",
    borderWidth: 1,
    borderColor: "#232323",
  },
  sortChipActive: { backgroundColor: "#1e1e1e", borderColor: "#00E0C6" },
  sortText: { color: "#cfcfcf", fontWeight: "600" },
  sortTextActive: { color: "#00E0C6", fontWeight: "700" },

  statsRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#121212",
    borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#1f1f1f",
    alignItems: "center",
  },
  statValue: { color: "#fff", fontSize: 18, fontWeight: "800" },
  statLabel: { color: "#bdbdbd", fontSize: 12, marginTop: 2 },

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
  thumbLg: { width: 70, height: 70, borderRadius: 14, resizeMode: "cover" },
  imagePh: { backgroundColor: "#222", borderWidth: 1, borderColor: "#2f2f2f" },

  cardTitle: { color: "#fff", fontSize: 16, fontWeight: "800" },
  cardMeta: { color: "#cfcfcf" },
  cardMetaDim: { color: "#9b9b9b", fontSize: 12 },

  primaryBtn: {
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#00E0C6",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { color: "#0b0b0b", fontWeight: "800" },
});
