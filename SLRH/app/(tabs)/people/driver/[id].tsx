import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  Dimensions,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import SegmentedBar from "../../../../components/SegmentedBar";   
import { getDriverById } from "../../../data/people";      
import { Ionicons } from "@expo/vector-icons";    

type DriverFull = ReturnType<typeof getDriverById> & {
  profile?: {
    vehicleType?: string;
    club?: string;
    nationality?: string;
    age?: number;
    rating?: number;
    reviewsCount?: number;
    stats?: {
      races?: number;
      trophies?: number;
      firstPlaces?: number;
      prizeMoneyLKR?: number;
      winRate?: number;
      avgPrizePerRace?: number;
    };
    personal?: { dob?: string; contact?: string; address?: string };
    team?: string;
    sponsors?: string[];
    license?: { serial?: string; issueDate?: string; dueDate?: string };
    highlights?: string[];
    achievements?: string[];
  };
} | null | undefined;

const money = (n?: number) => typeof n === "number" ? `LKR ${n.toLocaleString("en-LK")}` : "—";
const dateFmt = (s?: string) => s ? new Date(s).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "—";

const { width: W } = Dimensions.get("window");

export default function DriverProfile() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const driver = (id ? (getDriverById(id) as DriverFull) : null) as DriverFull;
  const [tab, setTab] = useState<"Overview" | "Achievements" | "Highlights" | "Ratings">("Overview");

  if (!driver) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={{ padding: 16 }}>
          <Text style={s.miss}>Driver not found.</Text>
          <Link href="/(tabs)/people" style={s.link}>← Back to People</Link>
        </View>
      </SafeAreaView>
    );
  }

  const p = driver.profile || {};
  const st = p.stats || {};

  return (
    <SafeAreaView style={s.safe} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 + insets.bottom }} showsVerticalScrollIndicator={false}>
                <View style={s.header}>
                  <Pressable onPress={() => router.back()} style={s.backBtn}>
                    <Ionicons name="chevron-back" size={22} color="#fff" />
                  </Pressable>
                  <Text style={s.headerTitle}>Player Profile</Text>
                </View>
        <View style={s.hero}>
          <LinearGradient colors={['#1a1a1a', '#0b0b0b']} style={s.heroGrad} />
          
          <View style={s.heroContent}>
            <View style={s.avatarWrap}>
              {driver.avatar ? (
                <Image source={driver.avatar as any} style={s.avatar} />
              ) : (
                <View style={[s.avatar, { backgroundColor: "#333" }]} />
              )}
            </View>

            <Text style={s.name}>{driver.name}</Text>

            <View style={s.chips}>
              {p.vehicleType && <Chip text={p.vehicleType} />}
              {p.club && <Chip text={p.club} />}
              {p.nationality && <Chip text={p.nationality} />}
              {typeof p.age === "number" && <Chip text={`Age ${p.age}`} />}
            </View>

            <View style={s.rating}>
              <Text style={s.ratingTxt}>⭐ {p.rating ?? 0}</Text>
              <Text style={s.ratingSub}>({p.reviewsCount ?? 0} reviews)</Text>
            </View>
          </View>
        </View>

        <View style={s.statsGrid}>
          <Stat icon="🎯" label="Races" value={String(st.races ?? 0)} />
          <Stat icon="🏆" label="Trophies" value={String(st.trophies ?? 0)} />
          <Stat icon="🥇" label="Wins" value={String(st.firstPlaces ?? 0)} />
          <Stat icon="💰" label="Prize" value={money(st.prizeMoneyLKR)} />
        </View>

        <SegmentedBar
          tabs={["Overview", "Achievements", "Highlights", "Ratings"] as const}
          value={tab}
          onChange={setTab}
          wrapToTwoLines
          style={{ paddingVertical: 12 }}
        />

        <View style={{ padding: 16, gap: 12 }}>
          {tab === "Overview" && (
            <>
              <Card title="Personal Info">
                <Row label="Date of Birth" value={dateFmt(p.personal?.dob)} />
                <Row label="Nationality" value={p.nationality || "—"} />
                <Row label="Contact" value={p.personal?.contact || "—"} />
                <Row label="Address" value={p.personal?.address || "—"} />
              </Card>

              <Card title="Team & Sponsors">
                <Row label="Team" value={p.team || "—"} />
                <Text style={s.subHead}>Sponsors</Text>
                {p.sponsors?.length ? (
                  <View style={s.tags}>
                    {p.sponsors.map((sp) => (
                      <View key={sp} style={s.tag}>
                        <Text style={s.tagTxt}>{sp}</Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={s.dim}>No sponsors</Text>
                )}
              </Card>

              <Card title="License">
                <Row label="Serial" value={p.license?.serial || "—"} />
                <Row label="Issue Date" value={dateFmt(p.license?.issueDate)} />
                <Row label="Due Date" value={dateFmt(p.license?.dueDate)} />
              </Card>

              <Card title="Performance">
                <Row label="Win Rate" value={`${Math.round((st.winRate ?? 0) * 100)}%`} />
                <Row label="Avg Prize/Race" value={money(st.avgPrizePerRace)} />
              </Card>
            </>
          )}

          {tab === "Achievements" && (
            <Card title="Achievements">
              {p.achievements?.length ? (
                p.achievements.map((a, i) => (
                  <View key={i} style={s.bullet}>
                    <Text style={s.bulletDot}>•</Text>
                    <Text style={s.bulletTxt}>{a}</Text>
                  </View>
                ))
              ) : (
                <Text style={s.dim}>No achievements yet</Text>
              )}
            </Card>
          )}

          {tab === "Highlights" && (
            <Card title="Highlights">
              {p.highlights?.length ? (
                p.highlights.map((h, i) => (
                  <View key={i} style={s.bullet}>
                    <Text style={s.bulletDot}>•</Text>
                    <Text style={s.bulletTxt}>{h}</Text>
                  </View>
                ))
              ) : (
                <Text style={s.dim}>No highlights yet</Text>
              )}
            </Card>
          )}

          {tab === "Ratings" && (
            <Card title="Ratings & Reviews">
              <View style={s.ratingBox}>
                <View style={s.ratingLarge}>
                  <Text style={s.ratingNum}>{p.rating ?? 0}</Text>
                  <Text style={s.ratingStars}>⭐⭐⭐⭐⭐</Text>
                  <Text style={s.ratingCount}>Based on {p.reviewsCount ?? 0} reviews</Text>
                </View>
              </View>
              <Pressable style={s.btn}>
                <Text style={s.btnTxt}>Rate this Driver</Text>
              </Pressable>
            </Card>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* Components */
function Chip({ text }: { text: string }) {
  return (
    <View style={s.chip}>
      <Text style={s.chipTxt}>{text}</Text>
    </View>
  );
}

function Stat({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={s.stat}>
      <Text style={s.statIcon}>{icon}</Text>
      <Text style={s.statVal} numberOfLines={1}>{value}</Text>
      <Text style={s.statLbl}>{label}</Text>
    </View>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={s.card}>
      <Text style={s.cardTitle}>{title}</Text>
      <View style={{ height: 12 }} />
      {children}
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.row}>
      <Text style={s.lbl}>{label}</Text>
      <Text style={s.val}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({

  header: { flexDirection: "row", alignItems: "center", padding: 16, paddingTop: 12 },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "800" },
  safe: { flex: 1, backgroundColor: "#0b0b0b" },
  link: { color: "#00E0C6", fontWeight: "700" },
  miss: { color: "#fff", fontWeight: "700" },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#0b0b0b",
  },

  hero: { height: 280, position: "relative" },
  heroGrad: { ...StyleSheet.absoluteFillObject },
  heroContent: { alignItems: "center", paddingTop: 60 },
  avatarWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    padding: 4,
    backgroundColor: "#00E0C6",
  },
  avatar: { width: 112, height: 112, borderRadius: 56 },
  name: { color: "#fff", fontSize: 24, fontWeight: "900", marginTop: 16 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12, paddingHorizontal: 16 },
  chip: { backgroundColor: "#1a1a1a", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: "#333" },
  chipTxt: { color: "#00E0C6", fontSize: 12, fontWeight: "700" },
  rating: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12 },
  ratingTxt: { color: "#fff", fontSize: 16, fontWeight: "900" },
  ratingSub: { color: "#999", fontSize: 13, fontWeight: "600" },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    gap: 12,
    marginTop:20
  },
  stat: {
    width: (W - 44) / 2,
    backgroundColor: "#1a1a1a",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#222",
    alignItems: "center",
  },
  statIcon: { fontSize: 28, marginBottom: 8 },
  statVal: { color: "#fff", fontSize: 20, fontWeight: "900" },
  statLbl: { color: "#999", fontSize: 12, marginTop: 4, fontWeight: "600" },

  card: {
    backgroundColor: "#1a1a1a",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#222",
  },
  cardTitle: { color: "#fff", fontSize: 16, fontWeight: "900" },
  subHead: { color: "#00E0C6", fontSize: 14, fontWeight: "700", marginTop: 8, marginBottom: 8 },

  row: { marginBottom: 12 },
  lbl: { color: "#999", fontSize: 13, fontWeight: "600", marginBottom: 4 },
  val: { color: "#fff", fontSize: 14, fontWeight: "700" },
  dim: { color: "#666", fontSize: 14, fontWeight: "600" },

  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: { backgroundColor: "#00E0C6", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  tagTxt: { color: "#000", fontSize: 12, fontWeight: "700" },

  bullet: { flexDirection: "row", gap: 8, marginBottom: 8 },
  bulletDot: { color: "#00E0C6", fontSize: 16, marginTop: 2 },
  bulletTxt: { color: "#fff", flex: 1, fontSize: 14, fontWeight: "600", lineHeight: 20 },

  btn: {
    backgroundColor: "#00E0C6",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  btnTxt: { color: "#000", fontWeight: "900", fontSize: 14 },

  ratingBox: {
    alignItems: "center",
    paddingVertical: 20,
  },
  ratingLarge: { alignItems: "center" },
  ratingNum: { color: "#00E0C6", fontSize: 56, fontWeight: "900", lineHeight: 60 },
  ratingStars: { fontSize: 20, marginTop: 4, marginBottom: 4 },
  ratingCount: { color: "#999", fontSize: 13, fontWeight: "600" },
});