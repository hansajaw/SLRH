// app/fanzone/ratings.tsx
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  TextInput,
  Dimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import SegmentedBar from "../../components/SegmentedBar";
import { useTheme } from "../../context/ThemeContext";

// ✅ Correct imports from your data folder
import { getPeopleData } from "../data/people";
import { teams as TEAM_DATA } from "../data/team";
import { getAllEvents } from "../data/events";

/* ------------------- Helpers ------------------- */
const W = Dimensions.get("window").width;
const PAD = 14;
const CARD_W = Math.max(300, W - PAD * 2);
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const asSrc = (s?: string | any) =>
  typeof s === "string" ? { uri: s } : s || {};

/* ------------------- Types ------------------- */
type Driver = {
  id: string;
  name: string;
  team?: string;
  category?: string;
  avatar?: any;
  races?: number;
  wins?: number;
  rating?: number;
};
type Team = {
  id: string;
  name: string;
  logo?: any;
  members?: number;
  rating?: number;
};
type RaceEvent = {
  id: string;
  title: string;
  dateISO: string;
  city?: string;
  circuit?: string;
  banner?: any;
  rating?: number;
};
type Item = Driver | Team | RaceEvent;

/* ------------------- Data Hook ------------------- */
function useConnectedData() {
  const { drivers } = getPeopleData();
  const events = getAllEvents();

  const normDrivers: Driver[] = useMemo(
    () =>
      (drivers || []).map((d: any, i: number) => ({
        id: String(d.id ?? `drv-${i}`),
        name: d.name ?? "Driver",
        team: d.team ?? d.teamName ?? undefined,
        category: d.category ?? d.vehicleType ?? "Racing",
        avatar: asSrc(d.avatar),
        races: d.stats?.races ?? d.races ?? 0,
        wins: d.stats?.wins ?? d.wins ?? 0,
        rating: d.rating ?? 0,
      })),
    [drivers]
  );

  const normTeams: Team[] = useMemo(
    () =>
      (TEAM_DATA || []).map((t: any, i: number) => ({
        id: String(t.id ?? `team-${i}`),
        name: t.name ?? "Team",
        logo: asSrc(t.logo),
        members:
          t.members ??
          (Array.isArray(t.drivers) ? t.drivers.length : undefined) ??
          0,
        rating: t.rating ?? 0,
      })),
    []
  );

  const normEvents: RaceEvent[] = useMemo(
    () =>
      (events || []).map((e: any, i: number) => ({
        id: String(e.id ?? `evt-${i}`),
        title: e.title ?? "Race Event",
        dateISO: e.scheduledAt ?? e.dateISO ?? new Date().toISOString(),
        city: e.city ?? "",
        circuit: e.circuit ?? "",
        banner: asSrc(e.banner),
        rating: e.rating ?? 0,
      })),
    [events]
  );

  return { drivers: normDrivers, teams: normTeams, events: normEvents };
}

/* ------------------- Main Component ------------------- */
const TABS = ["Drivers & Riders", "Race Events", "Racing Teams"] as const;

export default function RatingsScreen() {
  const { palette } = useTheme();
  const { drivers: ALL_DRIVERS, teams: ALL_TEAMS, events: ALL_EVENTS } =
    useConnectedData();

  const [tab, setTab] = useState<(typeof TABS)[number]>("Drivers & Riders");
  const [query, setQuery] = useState("");

  const filteredDrivers = ALL_DRIVERS.filter((d) =>
    d.name.toLowerCase().includes(query.toLowerCase())
  );
  const filteredTeams = ALL_TEAMS.filter((t: Team) =>
    t.name.toLowerCase().includes(query.toLowerCase())
  );
  const filteredEvents = ALL_EVENTS.filter(
    (e) =>
      e.title.toLowerCase().includes(query.toLowerCase()) ||
      (e.city ?? "").toLowerCase().includes(query.toLowerCase())
  );

  const data: Item =
    (null as unknown as Item); // only for discriminated union inference below

  const listData =
    tab === "Drivers & Riders"
      ? (filteredDrivers as Item[])
      : tab === "Race Events"
      ? (filteredEvents as Item[])
      : (filteredTeams as Item[]);

  const renderItem = ({ item }: { item: Item }) => {
    if ("title" in item)
      return (
        <EventCard
          item={item as RaceEvent}
          palette={palette}
          width={CARD_W}
          onRate={() => Alert.alert("Rate event", (item as RaceEvent).title)}
        />
      );
    if ("logo" in item)
      return (
        <TeamCard
          item={item as Team}
          palette={palette}
          onRate={() => Alert.alert("Rate team", (item as Team).name)}
        />
      );
    return (
      <DriverCard
        item={item as Driver}
        palette={palette}
        onRate={() => Alert.alert("Rate driver", (item as Driver).name)}
      />
    );
  };

  return (
    <SafeAreaView style={[st.safe, { backgroundColor: palette.background }]}>
      <FlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={(it) => it.id}
        ListHeaderComponent={
          <>
            {/* HERO */}
            <LinearGradient
              colors={[palette.accent + "25", palette.background]}
              style={[st.hero, { borderColor: palette.border }]}
            >
              <Text style={[st.heroTitle, { color: palette.text }]}>
                Rate the Track • Cheer the Champions
              </Text>
              <Text style={[st.heroSub, { color: palette.textSecondary }]}>
                Your ratings shape the legacy of Sri Lankan motorsports.
              </Text>
            </LinearGradient>

            {/* TABS + SEARCH */}
            <View style={{ paddingHorizontal: PAD, paddingTop: 12 }}>
              <SegmentedBar tabs={TABS} value={tab} onChange={setTab as any} />
              <View
                style={[
                  st.searchBox,
                  { backgroundColor: palette.input, borderColor: palette.border },
                ]}
              >
                <Ionicons name="search" color={palette.textSecondary} size={16} />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search..."
                  placeholderTextColor={palette.textSecondary}
                  style={{ flex: 1, color: palette.text, paddingVertical: 8 }}
                />
              </View>
            </View>
          </>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
      />
    </SafeAreaView>
  );
}

/* ------------------- Cards ------------------- */
function DriverCard({
  item,
  palette,
  onRate,
}: {
  item: Driver;
  palette: any;
  onRate: () => void;
}) {
  return (
    <View
      style={[
        st.card,
        { backgroundColor: palette.card, borderColor: palette.border },
      ]}
    >
      <Image source={item.avatar} style={st.cardImg} />
      <View style={{ padding: 12 }}>
        <Text style={[st.cardTitle, { color: palette.text }]}>{item.name}</Text>
        <Text style={[st.cardSub, { color: palette.textSecondary }]}>
          {item.category ?? "Racing"}
        </Text>
        <View style={{ flexDirection: "row", gap: 10, marginTop: 6 }}>
          <Text style={[st.meta, { color: palette.textSecondary }]}>
            🏁 {item.races ?? 0} Races
          </Text>
          <Text style={[st.meta, { color: palette.textSecondary }]}>
            🥇 {item.wins ?? 0} Wins
          </Text>
        </View>
        <View style={st.cardBtns}>
          <Pressable
            style={[st.pillBtn, { backgroundColor: palette.accent }]}
            onPress={onRate}
          >
            <Ionicons name="star" size={16} color={palette.background} />
            <Text style={[st.pillText, { color: palette.background }]}>Rate</Text>
          </Pressable>
          <Link
            href={{ pathname: "/people/driver/[id]", params: { id: item.id } }}
            asChild
          >
            <Pressable
              style={[
                st.pillBtn,
                { backgroundColor: palette.input, borderColor: palette.border },
              ]}
            >
              <Ionicons name="person" size={16} color={palette.text} />
              <Text style={[st.pillText, { color: palette.text }]}>Profile</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
}

function TeamCard({
  item,
  palette,
  onRate,
}: {
  item: Team;
  palette: any;
  onRate: () => void;
}) {
  return (
    <View
      style={[
        st.teamCard,
        { backgroundColor: palette.card, borderColor: palette.border },
      ]}
    >
      <Image source={item.logo} style={st.teamLogo} />
      <View style={{ flex: 1 }}>
        <Text style={[st.cardTitle, { color: palette.text }]}>{item.name}</Text>
        <Text style={[st.cardSub, { color: palette.textSecondary }]}>
          {item.members ?? 0} Members
        </Text>
      </View>
      <Pressable
        style={[st.rateChip, { backgroundColor: palette.accent }]}
        onPress={onRate}
      >
        <Ionicons name="star" size={14} color={palette.background} />
        <Text style={[st.rateChipTxt, { color: palette.background }]}>Rate</Text>
      </Pressable>
    </View>
  );
}

function EventCard({
  item,
  palette,
  width,
  onRate,
}: {
  item: RaceEvent;
  palette: any;
  width: number;
  onRate: () => void;
}) {
  return (
    <View
      style={[
        st.eventCard,
        { backgroundColor: palette.card, borderColor: palette.border, width },
      ]}
    >
      <Image source={item.banner} style={st.eventImg} />
      <View style={{ padding: 12 }}>
        <Text style={[st.cardTitle, { color: palette.text }]}>{item.title}</Text>
        <Text style={[st.cardSub, { color: palette.textSecondary }]}>
          📅 {fmtDate(item.dateISO)}
        </Text>
        {item.city ? (
          <Text style={[st.cardSub, { color: palette.textSecondary }]}>
            📍 {item.city}
          </Text>
        ) : null}
        <Pressable
          style={[st.rateChip, { backgroundColor: palette.accent, marginTop: 8 }]}
          onPress={onRate}
        >
          <Ionicons name="star" size={14} color={palette.background} />
          <Text style={[st.rateChipTxt, { color: palette.background }]}>Rate</Text>
        </Pressable>
      </View>
    </View>
  );
}

/* ------------------- Styles ------------------- */
const st = StyleSheet.create({
  safe: { paddingTop:-60},
  hero: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderRadius: 0,
  },
  heroTitle: { fontSize: 20, fontWeight: "900", textAlign: "center" },
  heroSub: {
    textAlign: "center",
    marginTop: 6,
    fontWeight: "600",
    fontSize: 13,
  },
  searchBox: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  card: {
    marginHorizontal: PAD,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardImg: { width: "100%", height: 180 },
  cardTitle: { fontWeight: "900", fontSize: 16 },
  cardSub: { fontWeight: "700", marginTop: 2 },
  meta: { fontSize: 12, fontWeight: "600" },
  cardBtns: { flexDirection: "row", gap: 8, marginTop: 10 },
  pillBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  pillText: { fontWeight: "800", fontSize: 13 },
  teamCard: {
    marginHorizontal: PAD,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    gap: 12,
  },
  teamLogo: { width: 56, height: 56, borderRadius: 12 },
  rateChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  rateChipTxt: { fontWeight: "900" },
  eventCard: {
    marginHorizontal: PAD,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  eventImg: { width: "100%", height: 160 },
});
