// app/fanzone/ratings.tsx  (or app/fanzone/ratings/index.tsx)
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
  ListRenderItem,
  ImageSourcePropType,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import TopBar from "../../components/TopBar";
import SegmentedBar from "../../components/SegmentedBar";

/* ---------- UI types ---------- */
type Driver = {
  id: string;
  name: string;
  team?: string;
  category?: "Car" | "Bike" | "Kart" | "Trail" | string;
  avatar?: ImageSourcePropType;
  races?: number;
  wins?: number;
  rating?: number;
};
type Team = {
  id: string;
  name: string;
  logo?: ImageSourcePropType;
  members?: number;
  rating?: number;
};
type RaceEvent = {
  id: string;
  title: string;
  dateISO: string;
  city?: string;
  circuit?: string;
  banner?: ImageSourcePropType;
  rating?: number;
};
type Item = Driver | Team | RaceEvent;

import * as PeopleDataFile from "../data/people";
import * as RacingDataFile from "../data/racing";

const asSrc = (s?: string | ImageSourcePropType) =>
  typeof s === "string" ? { uri: s } : (s as ImageSourcePropType);

function normalizeDrivers(raw: any[]): Driver[] {
  return (raw || []).map((d: any, i: number): Driver => ({
    id: String(d._id ?? d.id ?? `drv-${i}`),
    name: d.name ?? d.fullName ?? d.playerName ?? d.driverName ?? "Driver",
    team: d.team?.name ?? d.teamName ?? d.team ?? undefined,
    category: d.category ?? d.type ?? d.vehicleType ?? undefined,
    avatar: asSrc(d.avatar ?? d.profilePicture ?? d.photo ?? d.image ?? d.img),
    races: d.races ?? d.stats?.races ?? d.totalRaces ?? undefined,
    wins: d.wins ?? d.stats?.wins ?? d.firstPlaces ?? undefined,
    rating: d.rating ?? d.averageRating ?? d.avgRating ?? undefined,
  }));
}

function normalizeTeams(raw: any[]): Team[] {
  return (raw || []).map((t: any, i: number): Team => ({
    id: String(t._id ?? t.id ?? `team-${i}`),
    name: t.name ?? t.teamName ?? "Team",
    logo: asSrc(t.logo ?? t.badge ?? t.image ?? t.img),
    members: t.members ?? t.memberCount ?? (Array.isArray(t.drivers) ? t.drivers.length : undefined),
    rating: t.rating ?? t.averageRating ?? t.avgRating ?? undefined,
  }));
}

function normalizeEventsFromSchedule(schedule: any[]): RaceEvent[] {
  return (schedule || []).map((e: any, i: number): RaceEvent => ({
    id: String(e.id ?? e._id ?? e.slug ?? `evt-${i}`),
    title: e.title ?? e.name ?? "Race Event",
    dateISO: e.scheduledAt ?? e.dateISO ?? e.dateUtc ?? new Date().toISOString(),
    city: e.city ?? e.location?.city ?? undefined,
    circuit: e.circuit ?? undefined,
    banner: asSrc(e.banner ?? e.heroImage ?? e.image ?? e.img),
    rating: e.rating ?? e.averageRating ?? e.avgRating ?? undefined,
  }));
}

function useConnectedData() {
  let rawDrivers: any[] = [];
  let rawTeams: any[] = [];
  if (typeof (PeopleDataFile as any).getPeopleData === "function") {
    const g = (PeopleDataFile as any).getPeopleData() || {};
    rawDrivers = g.drivers || [];
    rawTeams = g.teams || [];
  } else {
    rawDrivers = (PeopleDataFile as any).drivers ?? (PeopleDataFile as any).DRIVERS ?? [];
    rawTeams = (PeopleDataFile as any).teams ?? (PeopleDataFile as any).TEAMS ?? [];
  }

  let schedule: any[] = [];
  if (typeof (RacingDataFile as any).getRacingData === "function") {
    const g = (RacingDataFile as any).getRacingData() || {};
    schedule = g.schedule || [];
  } else {
    schedule = (RacingDataFile as any).SCHEDULE ?? [];
  }

  return {
    drivers: normalizeDrivers(rawDrivers),
    teams: normalizeTeams(rawTeams),
    events: normalizeEventsFromSchedule(schedule),
  };
}

type TabKey = "Drivers & Riders" | "Race Events" | "Racing Teams";
const TABS = ["Drivers & Riders", "Race Events", "Racing Teams"] as const;

const W = Dimensions.get("window").width;
const PAD = 14;
const CARD_W = Math.max(300, W - PAD * 2);
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

export default function RatingsScreen() {
  const { drivers: ALL_DRIVERS, teams: ALL_TEAMS, events: ALL_EVENTS } = useConnectedData();

  const [tab, setTab] = useState<TabKey>("Drivers & Riders");
  const [teamIdx, setTeamIdx] = useState(0);
  const [catIdx, setCatIdx] = useState(0);
  const [query, setQuery] = useState("");

  const teamOptions = useMemo(() => ["All Teams", ...ALL_TEAMS.map((t) => t.name)], [ALL_TEAMS]);
  const catOptions = useMemo(() => ["All Categories", "Car", "Bike", "Kart", "Trail"], []);

  const filteredDrivers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_DRIVERS.filter((d) => {
      const teamOk = teamIdx === 0 || d.team === teamOptions[teamIdx];
      const catOk = catIdx === 0 || (d.category ?? "").toLowerCase() === catOptions[catIdx].toLowerCase();
      const qOk = !q || d.name.toLowerCase().includes(q);
      return teamOk && catOk && qOk;
    });
  }, [ALL_DRIVERS, teamIdx, catIdx, teamOptions, catOptions, query]);

  const filteredTeams = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_TEAMS.filter((t) => !q || t.name.toLowerCase().includes(q));
  }, [ALL_TEAMS, query]);

  const filteredEvents = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_EVENTS.filter(
      (e) => !q || e.title.toLowerCase().includes(q) || (e.city ?? "").toLowerCase().includes(q)
    );
  }, [ALL_EVENTS, query]);

  const totalRatings = (ALL_DRIVERS.length + ALL_TEAMS.length + ALL_EVENTS.length) * 3; 

  const ListHeader = (
    <View>
      <LinearGradient colors={["#042A2A", "#081A1A"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={st.hero}>
        <Text style={st.heroTitle}>RATE THE TRACK, CHEER THE CHAMPIONS!</Text>
        <Text style={st.heroSub}>Your voice shapes the racing legacy of Sri Lankan motorsports</Text>
        <View style={st.statsRow}>
          <StatBox label="Total Ratings" value={totalRatings} />
          <StatBox label="Racers" value={ALL_DRIVERS.length} />
          <StatBox label="Teams" value={ALL_TEAMS.length} />
          <StatBox label="Races" value={ALL_EVENTS.length} />
        </View>
      </LinearGradient>

      <View style={{ paddingHorizontal: PAD, paddingTop: 12 }}>
        <SegmentedBar tabs={TABS} value={tab} onChange={setTab as any} />
      </View>

      {tab === "Drivers & Riders" && (
        <View style={st.filtersWrap}>
          <FakeDropdown
            label="Team"
            value={teamOptions[teamIdx]}
            onPress={() => setTeamIdx((i) => (i + 1) % teamOptions.length)}
          />
          <FakeDropdown
            label="Category"
            value={catOptions[catIdx]}
            onPress={() => setCatIdx((i) => (i + 1) % catOptions.length)}
          />
          <SearchBox value={query} onChangeText={setQuery} />
          <Pressable
            onPress={() => {
              setTeamIdx(0);
              setCatIdx(0);
              setQuery("");
            }}
            style={st.resetBtn}
          >
            <Text style={st.resetTxt}>Reset</Text>
          </Pressable>
        </View>
      )}
    </View>
  );

  const data: Item[] =
    tab === "Drivers & Riders" ? filteredDrivers : tab === "Race Events" ? filteredEvents : filteredTeams;

  const renderItem: ListRenderItem<Item> = ({ item }) => {
    if ("title" in item && "dateISO" in item) {
      return (
        <EventCard
          item={item}
          width={CARD_W}
          onRate={() => Alert.alert("Rate", `Open event rating flow for ${item.id}`)}
        />
      );
    }
    if ("logo" in item) {
      return <TeamCard item={item} onRate={() => Alert.alert("Rate", `Open team rating flow for ${item.id}`)} />;
    }
    return <DriverCard item={item} onRate={() => Alert.alert("Rate", `Open driver rating flow for ${item.id}`)} />;
  };

  return (
    <SafeAreaView style={st.safe}>
      <TopBar title="Fan Ratings" showBack showMenu={false} showSearch={false} showProfile={false} />
      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 88 }}
        data={data}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={<Text style={{ color: "#8fa", textAlign: "center", padding: 24 }}>Nothing to show yet.</Text>}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <View style={st.statBox}>
      <Text style={st.statVal}>{value}</Text>
      <Text style={st.statLbl}>{label}</Text>
    </View>
  );
}

function FakeDropdown({ label, value, onPress }: { label: string; value: string; onPress: () => void }) {
  return (
    <Pressable style={st.ddBox} onPress={onPress}>
      <Text style={st.ddLabel}>{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Text style={st.ddValue} numberOfLines={1}>{value}</Text>
        <Ionicons name="chevron-down" color="#bcd" size={16} />
      </View>
    </Pressable>
  );
}

function SearchBox({ value, onChangeText }: { value: string; onChangeText: (s: string) => void }) {
  return (
    <View style={st.searchBox}>
      <Ionicons name="search" color="#9db" size={16} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search…"
        placeholderTextColor="#7f90a0"
        style={{ flex: 1, color: "#fff", paddingVertical: 8 }}
      />
    </View>
  );
}

function DriverCard({ item, onRate }: { item: Driver; onRate: () => void }) {
  return (
    <View style={st.card}>
      <View style={{ position: "relative" }}>
        <Image source={item.avatar ?? {}} style={st.cardImg} />
        {!!item.team && <View style={st.teamTag}><Text style={st.teamTagTxt}>{item.team}</Text></View>}
        {!!item.rating && (
          <View style={st.starTag}>
            <Ionicons name="star" size={12} color="#ffd54a" />
            <Text style={st.starTagTxt}>{item.rating.toFixed(1)}</Text>
          </View>
        )}
      </View>

      <View style={{ padding: 12, gap: 4 }}>
        <Text style={st.cardTitle} numberOfLines={1}>{item.name}</Text>
        <Text style={st.cardSub} numberOfLines={1}>{item.category ?? "Racing"}</Text>

        <View style={{ flexDirection: "row", gap: 14, marginTop: 6 }}>
          <Text style={st.metaDot}>🏁 {item.races ?? 0} Races</Text>
          <Text style={st.metaDot}>🥇 {item.wins ?? 0} Wins</Text>
        </View>

        <View style={st.cardBtns}>
          <Pressable style={[st.pillBtn, { backgroundColor: "rgba(255,255,255,0.06)" }]}>
            <Ionicons name="heart-outline" size={16} color="#e5e7eb" />
            <Text style={[st.pillText, { color: "#e5e7eb" }]}>Like</Text>
          </Pressable>
          <Pressable style={[st.pillBtn, { backgroundColor: "#00E0C6" }]} onPress={onRate}>
            <Ionicons name="star" size={16} color="#001212" />
            <Text style={[st.pillText, { color: "#001212" }]}>Rate</Text>
          </Pressable>
          <Link href={{ pathname: "/people/driver/[id]", params: { id: item.id } }} asChild>
            <Pressable style={[st.pillBtn, { backgroundColor: "rgba(255,255,255,0.06)" }]}>
              <Ionicons name="person" size={16} color="#e5e7eb" />
              <Text style={[st.pillText, { color: "#e5e7eb" }]}>Profile</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
}

function TeamCard({ item, onRate }: { item: Team; onRate: () => void }) {
  return (
    <View style={st.teamCard}>
      <Image source={item.logo ?? {}} style={st.teamLogo} />
      <View style={{ flex: 1 }}>
        <Text style={st.cardTitle} numberOfLines={1}>{item.name}</Text>
        <Text style={st.cardSub}>{item.members ?? 0} Members</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 }}>
          <Ionicons name="star" size={14} color="#ffd54a" />
          <Text style={{ color: "#fff", fontWeight: "800" }}>{item.rating?.toFixed(1) ?? "—"}</Text>
        </View>
      </View>
      <Pressable style={st.rateChip} onPress={onRate}>
        <Ionicons name="star" size={14} color="#001212" />
        <Text style={st.rateChipTxt}>Rate</Text>
      </Pressable>
    </View>
  );
}

function EventCard({ item, width, onRate }: { item: RaceEvent; width: number; onRate: () => void }) {
  return (
    <View style={[st.eventCard, { width }]}>
      <Image source={item.banner ?? {}} style={st.eventImg} />
      <View style={st.eventShade} />
      <View style={st.eventInner}>
        <Text style={st.eventTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={st.eventMeta}>
          {item.city ? `📍 ${item.city}   ` : ""}📅 {fmtDate(item.dateISO)}
        </Text>
        {!!item.circuit && <Text style={[st.eventMeta, { marginTop: 2 }]}>🛣️ {item.circuit}</Text>}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 }}>
          <Ionicons name="star" size={14} color="#ffd54a" />
          <Text style={{ color: "#fff", fontWeight: "800" }}>{item.rating?.toFixed(1) ?? "—"}</Text>
          <Pressable style={[st.pillBtn, { backgroundColor: "#00E0C6", marginLeft: "auto" }]} onPress={onRate}>
            <Ionicons name="star" size={16} color="#001212" />
            <Text style={[st.pillText, { color: "#001212" }]}>Rate</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0b0b0b" },

  hero: { paddingTop: 18, paddingBottom: 16, paddingHorizontal: 16, borderBottomWidth: 1, borderColor: "#0f2c2c" },
  heroTitle: { color: "#C6FFF4", fontSize: 22, fontWeight: "900", textAlign: "center" },
  heroSub: { color: "#cfeeed", textAlign: "center", marginTop: 6, marginBottom: 12, fontWeight: "600" },

  statsRow: { flexDirection: "row", gap: 10, justifyContent: "space-between" },
  statBox: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  statVal: { color: "#C6FFF4", fontSize: 18, fontWeight: "900", textAlign: "center" },
  statLbl: { color: "#cfeeed", fontWeight: "700", marginTop: 2, fontSize: 12, textAlign: "center" },

  filtersWrap: { paddingHorizontal: PAD, paddingTop: 12, flexDirection: "row", flexWrap: "wrap", gap: 10 },
  ddBox: {
    flexGrow: 1, minWidth: 150, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)"
  },
  ddLabel: { color: "#a9c8c6", fontSize: 12, marginBottom: 2, fontWeight: "700" },
  ddValue: { color: "#fff", fontWeight: "800" },

  searchBox: {
    flexGrow: 1, minWidth: 180, flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12,
    borderRadius: 12, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)"
  },
  resetBtn: {
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, backgroundColor: "#10201f",
    borderWidth: 1, borderColor: "#193533"
  },
  resetTxt: { color: "#C6FFF4", fontWeight: "900" },

  card: {
    marginHorizontal: PAD, backgroundColor: "#111827", borderRadius: 16,
    borderWidth: 1, borderColor: "#1f2937", overflow: "hidden"
  },
  cardImg: { width: "100%", height: 180, backgroundColor: "#0f0f0f" },
  teamTag: { position: "absolute", top: 8, left: 8, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, backgroundColor: "#00e0c6" },
  teamTagTxt: { color: "#001212", fontWeight: "900", fontSize: 12 },
  starTag: {
    position: "absolute", top: 8, right: 8, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.55)", flexDirection: "row", alignItems: "center", gap: 4
  },
  starTagTxt: { color: "#ffd54a", fontWeight: "900", fontSize: 12 },

  cardTitle: { color: "#fff", fontSize: 16, fontWeight: "900" },
  cardSub: { color: "#cfeeed", fontWeight: "700" },
  metaDot: { color: "#9cbdbb", fontWeight: "700" },
  cardBtns: { flexDirection: "row", gap: 8, marginTop: 10 },
  pillBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 },
  pillText: { fontWeight: "900" },

  teamCard: {
    marginHorizontal: PAD, flexDirection: "row", gap: 12, alignItems: "center",
    backgroundColor: "#111827", borderRadius: 16, borderWidth: 1, borderColor: "#1f2937", padding: 12
  },
  teamLogo: { width: 56, height: 56, borderRadius: 12, backgroundColor: "#0f0f0f" },
  rateChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: "#00E0C6", flexDirection: "row", alignItems: "center", gap: 6 },
  rateChipTxt: { color: "#001212", fontWeight: "900" },

  eventCard: { marginHorizontal: PAD, borderRadius: 16, overflow: "hidden", backgroundColor: "#141414" },
  eventImg: { width: "100%", height: 170, backgroundColor: "#0f0f0f" },
  eventShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.25)" },
  eventInner: { position: "absolute", left: 12, right: 12, bottom: 10 },
  eventTitle: { color: "#fff", fontWeight: "900", fontSize: 18 },
  eventMeta: { color: "#eaeaea", marginTop: 4 },
});
