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
import { useTheme } from "../../../context/ThemeContext"; // 👈 add theme

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
  const { palette } = useTheme(); // 🎨 Theme colors
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
      if (sort === "wins")
        arr = arr.slice().sort((a, b) => extractWins(b.stats) - extractWins(a.stats));
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
      arr = arr.slice().sort((a, b) => a.name.localeCompare(b.name));
      return arr.map((t) => ({ key: t.id, type: "team" as const, item: t }));
    }

    let arr = fame.filter(
      (h) =>
        !q ||
        normalize(h.title).includes(q) ||
        normalize(h.person).includes(q) ||
        String(h.year).includes(q) ||
        normalize(h.blurb).includes(q)
    );
    if (sort === "recent") arr = arr.slice().sort((a, b) => b.year - a.year);
    else arr = arr.slice().sort((a, b) => a.person.localeCompare(b.person));
    return arr.map((h) => ({ key: h.id, type: "fame" as const, item: h }));
  }, [tab, query, sort, drivers, teams, fame]);

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: palette.background }]} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={[s.header, { backgroundColor: palette.background, paddingTop: Math.max(8, insets.top * 0.25) }]}>
        <Text style={[s.headerTitle, { color: palette.text }]}>People</Text>
      </View>

      {/* Segmented Bar */}
      <SegmentedBar tabs={TABS} value={tab} onChange={setTab} />

      {/* Search & Sort */}
      <View style={s.toolsRow}>
        <View
          style={[
            s.searchBox,
            { backgroundColor: palette.card, borderColor: palette.border },
          ]}
        >
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={`Search ${tab.toLowerCase()}…`}
            placeholderTextColor={palette.textSecondary + "99"}
            style={[s.searchInput, { color: palette.text }]}
          />
        </View>

        <View style={s.sortWrap}>
          {(["az", "wins", "recent"] as const).map((k) => {
            const active = sort === k;
            return (
              <Pressable
                key={k}
                onPress={() => setSort(k)}
                style={[
                  s.sortChip,
                  {
                    backgroundColor: active
                      ? palette.accent + "22"
                      : palette.card,
                    borderColor: active ? palette.accent : palette.border,
                  },
                ]}
              >
                <Text
                  style={[
                    s.sortText,
                    { color: active ? palette.accent : palette.textSecondary },
                  ]}
                >
                  {k === "az" ? "A–Z" : k === "wins" ? "Wins" : "Recent"}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Stats */}
      <View style={s.statsRow}>
        <StatCard label="Drivers" value={counts.drivers} palette={palette} />
        <StatCard label="Teams" value={counts.teams} palette={palette} />
        <StatCard label="Hall of Fame" value={counts.fame} palette={palette} />
      </View>

      {/* List */}
      <FlatList<ListItem>
        data={filtered}
        keyExtractor={(it) => it.key}
        contentContainerStyle={{ padding: 16, paddingBottom: 16 + insets.bottom }}
        renderItem={({ item }) => {
          if (item.type === "driver")
            return <DriverCard d={item.item} palette={palette} />;
          if (item.type === "team")
            return <TeamCard t={item.item} palette={palette} />;
          return <FameCard h={item.item} palette={palette} />;
        }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <View
            style={[
              s.emptyBox,
              { backgroundColor: palette.card, borderColor: palette.border },
            ]}
          >
            <Text style={[s.emptyTitle, { color: palette.text }]}>No matches</Text>
            <Text
              style={[s.emptySubtitle, { color: palette.textSecondary }]}
            >
              Try a different search or sort
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

/* ---------------- Small Components ---------------- */

function StatCard({
  label,
  value,
  palette,
}: {
  label: string;
  value: number;
  palette: any;
}) {
  return (
    <View
      style={[
        s.statCard,
        { backgroundColor: palette.card, borderColor: palette.border },
      ]}
    >
      <Text style={[s.statValue, { color: palette.text }]}>{value}</Text>
      <Text style={[s.statLabel, { color: palette.textSecondary }]}>
        {label}
      </Text>
    </View>
  );
}

function ImageOrBox({ src, style }: { src?: any; style: any }) {
  if (src) return <Image source={src as any} style={style} />;
  return <View style={[style, s.imagePh]} />;
}

/* ---------------- Cards ---------------- */

function DriverCard({ d, palette }: { d: DriverItem; palette: any }) {
  return (
    <View
      style={[
        s.card,
        { backgroundColor: palette.card, borderColor: palette.border },
      ]}
    >
      <Link href={{ pathname: "/people/driver/[id]", params: { id: d.id } }} asChild>
        <Pressable style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
          <ImageOrBox src={d.avatar} style={s.thumbLg} />
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={[s.cardTitle, { color: palette.text }]} numberOfLines={1}>
              {d.name}
            </Text>
            <Text style={[s.cardMeta, { color: palette.textSecondary }]}>
              Ride: {d.ride}
            </Text>
            {d.stats ? (
              <Text style={[s.cardMetaDim, { color: palette.textSecondary }]} numberOfLines={1}>
                {d.stats}
              </Text>
            ) : null}
          </View>
        </Pressable>
      </Link>

      <Link href={{ pathname: "/people/driver/[id]", params: { id: d.id } }} asChild>
        <Pressable
          style={[s.primaryBtn, { backgroundColor: palette.accent }]}
        >
          <Text style={[s.primaryBtnText, { color: palette.textSecondary }]}>View</Text>
        </Pressable>
      </Link>
    </View>
  );
}

function TeamCard({ t, palette }: { t: TeamItem; palette: any }) {
  return (
    <View
      style={[
        s.card,
        { backgroundColor: palette.card, borderColor: palette.border },
      ]}
    >
      <Link href={{ pathname: "/people/team/[id]", params: { id: t.id } }} asChild>
        <Pressable style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
          <ImageOrBox src={t.logo} style={s.thumbLg} />
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={[s.cardTitle, { color: palette.text }]}>{t.name}</Text>
            <Text style={[s.cardMeta, { color: palette.textSecondary }]}>
              Members: {t.members.join(", ")}
            </Text>
            {t.achievements ? (
              <Text style={[s.cardMetaDim, { color: palette.textSecondary }]} numberOfLines={1}>
                {t.achievements}
              </Text>
            ) : null}
          </View>
        </Pressable>
      </Link>

      <Link href={{ pathname: "/people/team/[id]", params: { id: t.id } }} asChild>
        <Pressable style={[s.primaryBtn, { backgroundColor: palette.accent }]}>
          <Text style={[s.primaryBtnText, { color: "#000" }]}>Open</Text>
        </Pressable>
      </Link>
    </View>
  );
}

function FameCard({ h, palette }: { h: FameItem; palette: any }) {
  return (
    <View
      style={[
        s.card,
        { backgroundColor: palette.card, borderColor: palette.border },
      ]}
    >
      <ImageOrBox src={h.avatar} style={s.thumbLg} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[s.cardTitle, { color: palette.text }]} numberOfLines={1}>
          {h.title}
        </Text>
        <Text style={[s.cardMeta, { color: palette.textSecondary }]}>
          {h.person} • {h.year}
        </Text>
        {h.blurb ? (
          <Text style={[s.cardMetaDim, { color: palette.textSecondary }]} numberOfLines={1}>
            {h.blurb}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

/* ---------------- Styles ---------------- */

const s = StyleSheet.create({
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

  sortWrap: { flexDirection: "row", gap: 8 },
  sortChip: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  sortText: { fontWeight: "600" },

  statsRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 1,
    alignItems: "center",
  },
  statValue: { fontSize: 18, fontWeight: "800" },
  statLabel: { fontSize: 12, marginTop: 2 },

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
  thumbLg: { width: 70, height: 70, borderRadius: 14, resizeMode: "cover" },
  imagePh: { backgroundColor: "#222", borderWidth: 1, borderColor: "#2f2f2f" },

  cardTitle: { fontSize: 16, fontWeight: "800" },
  cardMeta: {},
  cardMetaDim: { fontSize: 12 },

  primaryBtn: {
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { fontWeight: "800" , marginRight:10},
});
