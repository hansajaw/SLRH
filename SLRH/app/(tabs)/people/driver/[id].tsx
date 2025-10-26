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
import { Link, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import SegmentedBar from "../../../../components/SegmentedBar";
import { getDriverById } from "../../../data/people";
import { useTheme } from "../../../../context/ThemeContext";

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

const { width: W } = Dimensions.get("window");

const money = (n?: number) =>
  typeof n === "number" ? `LKR ${n.toLocaleString("en-LK")}` : "—";
const dateFmt = (s?: string) =>
  s
    ? new Date(s).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

export default function DriverProfile() {
  const { palette } = useTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const driver = id ? (getDriverById(id) as DriverFull) : null;
  const [tab, setTab] = useState<
    "Overview" | "Achievements" | "Highlights" | "Ratings"
  >("Overview");

  if (!driver) {
    return (
      <SafeAreaView
        style={[s.safe, { backgroundColor: palette.background }]}
        edges={["top", "bottom"]}
      >
        <View style={{ padding: 16 }}>
          <Text style={[s.miss, { color: palette.text }]}>Driver not found.</Text>
          <Link href="/(tabs)/people" style={[s.link, { color: palette.accent }]}>
            ← Back to People
          </Link>
        </View>
      </SafeAreaView>
    );
  }

  const p = driver.profile || {};
  const st = p.stats || {};

  return (
    <SafeAreaView
      style={[s.safe, { backgroundColor: palette.background }]}
      edges={["top", "bottom"]}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section (spacing tightened since global header handles back) */}
        <View style={s.hero}>
          <LinearGradient colors={[palette.card, palette.background]} style={s.heroGrad} />

          <View style={s.heroContentTight}>
            <View
              style={[
                s.avatarWrap,
                { backgroundColor: palette.accent, shadowColor: palette.accent },
              ]}
            >
              {driver.avatar ? (
                <Image source={driver.avatar as any} style={s.avatar} />
              ) : (
                <View style={[s.avatar, { backgroundColor: palette.border }]} />
              )}
            </View>

            <Text style={[s.name, { color: palette.text }]}>{driver.name}</Text>

            <View style={s.chips}>
              {p.vehicleType && <Chip text={p.vehicleType} palette={palette} />}
              {p.club && <Chip text={p.club} palette={palette} />}
              {p.nationality && <Chip text={p.nationality} palette={palette} />}
              {typeof p.age === "number" && <Chip text={`Age ${p.age}`} palette={palette} />}
            </View>

            <View style={s.rating}>
              <Text style={[s.ratingTxt, { color: palette.text }]}>⭐ {p.rating ?? 0}</Text>
              <Text style={[s.ratingSub, { color: palette.textSecondary }]}>
                ({p.reviewsCount ?? 0} reviews)
              </Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={s.statsGrid}>
          <Stat icon="🎯" label="Races" value={String(st.races ?? 0)} palette={palette} />
          <Stat icon="🏆" label="Trophies" value={String(st.trophies ?? 0)} palette={palette} />
          <Stat icon="🥇" label="Wins" value={String(st.firstPlaces ?? 0)} palette={palette} />
          <Stat icon="💰" label="Prize" value={money(st.prizeMoneyLKR)} palette={palette} />
        </View>

        {/* Tabs */}
        <SegmentedBar
          tabs={["Overview", "Achievements", "Highlights", "Ratings"] as const}
          value={tab}
          onChange={setTab}
          wrapToTwoLines
          style={{ paddingVertical: 8 }} // slightly tighter
        />

        <View style={{ padding: 16, gap: 12 }}>
          {/* Overview */}
          {tab === "Overview" && (
            <>
              <Card title="Personal Info" palette={palette}>
                <Row label="Date of Birth" value={dateFmt(p.personal?.dob)} palette={palette} />
                <Row label="Nationality" value={p.nationality || "—"} palette={palette} />
                <Row label="Contact" value={p.personal?.contact || "—"} palette={palette} />
                <Row label="Address" value={p.personal?.address || "—"} palette={palette} />
              </Card>

              <Card title="Team & Sponsors" palette={palette}>
                <Row label="Team" value={p.team || "—"} palette={palette} />
                <Text style={[s.subHead, { color: palette.accent }]}>Sponsors</Text>
                {p.sponsors?.length ? (
                  <View style={s.tags}>
                    {p.sponsors.map((sp) => (
                      <View key={sp} style={[s.tag, { backgroundColor: palette.accent }]}>
                        <Text style={[s.tagTxt, { color: "#000" }]}>{sp}</Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={[s.dim, { color: palette.textSecondary }]}>No sponsors</Text>
                )}
              </Card>

              <Card title="License" palette={palette}>
                <Row label="Serial" value={p.license?.serial || "—"} palette={palette} />
                <Row label="Issue Date" value={dateFmt(p.license?.issueDate)} palette={palette} />
                <Row label="Due Date" value={dateFmt(p.license?.dueDate)} palette={palette} />
              </Card>

              <Card title="Performance" palette={palette}>
                <Row
                  label="Win Rate"
                  value={`${Math.round((st.winRate ?? 0) * 100)}%`}
                  palette={palette}
                />
                <Row label="Avg Prize/Race" value={money(st.avgPrizePerRace)} palette={palette} />
              </Card>
            </>
          )}

          {/* Achievements */}
          {tab === "Achievements" && (
            <Card title="Achievements" palette={palette}>
              {p.achievements?.length ? (
                p.achievements.map((a, i) => (
                  <View key={i} style={s.bullet}>
                    <Text style={[s.bulletDot, { color: palette.accent }]}>•</Text>
                    <Text style={[s.bulletTxt, { color: palette.text }]}>{a}</Text>
                  </View>
                ))
              ) : (
                <Text style={[s.dim, { color: palette.textSecondary }]}>No achievements yet</Text>
              )}
            </Card>
          )}

          {/* Highlights */}
          {tab === "Highlights" && (
            <Card title="Highlights" palette={palette}>
              {p.highlights?.length ? (
                p.highlights.map((h, i) => (
                  <View key={i} style={s.bullet}>
                    <Text style={[s.bulletDot, { color: palette.accent }]}>•</Text>
                    <Text style={[s.bulletTxt, { color: palette.text }]}>{h}</Text>
                  </View>
                ))
              ) : (
                <Text style={[s.dim, { color: palette.textSecondary }]}>No highlights yet</Text>
              )}
            </Card>
          )}

          {/* Ratings */}
          {tab === "Ratings" && (
            <Card title="Ratings & Reviews" palette={palette}>
              <View style={s.ratingBox}>
                <View style={s.ratingLarge}>
                  <Text style={[s.ratingNum, { color: palette.accent }]}>{p.rating ?? 0}</Text>
                  <Text style={[s.ratingStars, { color: palette.text }]}>⭐⭐⭐⭐⭐</Text>
                  <Text style={[s.ratingCount, { color: palette.textSecondary }]}>
                    Based on {p.reviewsCount ?? 0} reviews
                  </Text>
                </View>
              </View>
              <Pressable style={[s.btn, { backgroundColor: palette.accent }]}>
                <Text style={[s.btnTxt, { color: "#000" }]}>Rate this Driver</Text>
              </Pressable>
            </Card>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- Components ---------- */
function Chip({ text, palette }: { text: string; palette: any }) {
  return (
    <View style={[s.chip, { backgroundColor: palette.card, borderColor: palette.border }]}>
      <Text style={[s.chipTxt, { color: palette.accent }]}>{text}</Text>
    </View>
  );
}

function Stat({
  icon,
  label,
  value,
  palette,
}: {
  icon: string;
  label: string;
  value: string;
  palette: any;
}) {
  return (
    <View style={[s.stat, { backgroundColor: palette.card, borderColor: palette.border }]}>
      <Text style={s.statIcon}>{icon}</Text>
      <Text style={[s.statVal, { color: palette.text }]}>{value}</Text>
      <Text style={[s.statLbl, { color: palette.textSecondary }]}>{label}</Text>
    </View>
  );
}

function Card({
  title,
  children,
  palette,
}: {
  title: string;
  children: React.ReactNode;
  palette: any;
}) {
  return (
    <View style={[s.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
      <Text style={[s.cardTitle, { color: palette.text }]}>{title}</Text>
      <View style={{ height: 12 }} />
      {children}
    </View>
  );
}

function Row({
  label,
  value,
  palette,
}: {
  label: string;
  value: string;
  palette: any;
}) {
  return (
    <View style={s.row}>
      <Text style={[s.lbl, { color: palette.textSecondary }]}>{label}</Text>
      <Text style={[s.val, { color: palette.text }]}>{value}</Text>
    </View>
  );
}

/* ---------- Styles ---------- */
const s = StyleSheet.create({
  safe: { flex: 1 },

  // hero spacing tightened since global header renders above
  hero: { height: 260, position: "relative" },
  heroGrad: { ...StyleSheet.absoluteFillObject },
  heroContentTight: { alignItems: "center", paddingTop: 24 },

  avatarWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    padding: 4,
  },
  avatar: { width: 112, height: 112, borderRadius: 56 },

  name: { fontSize: 24, fontWeight: "900", marginTop: 12 },

  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  chipTxt: { fontSize: 12, fontWeight: "700" },

  rating: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 10 },
  ratingTxt: { fontSize: 16, fontWeight: "900" },
  ratingSub: { fontSize: 13, fontWeight: "600" },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    gap: 12,
    marginTop: 14,
  },
  stat: {
    width: (W - 44) / 2,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
  },
  statIcon: { fontSize: 28, marginBottom: 8 },
  statVal: { fontSize: 20, fontWeight: "900" },
  statLbl: { fontSize: 12, marginTop: 4, fontWeight: "600" },

  card: { padding: 16, borderRadius: 16, borderWidth: 1 },
  cardTitle: { fontSize: 16, fontWeight: "900" },
  subHead: { fontSize: 14, fontWeight: "700", marginTop: 8, marginBottom: 8 },

  row: { marginBottom: 12 },
  lbl: { fontSize: 13, fontWeight: "600", marginBottom: 4 },
  val: { fontSize: 14, fontWeight: "700" },

  dim: { fontSize: 14, fontWeight: "600" },

  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  tagTxt: { fontSize: 12, fontWeight: "700" },

  bullet: { flexDirection: "row", gap: 8, marginBottom: 8 },
  bulletDot: { fontSize: 16, marginTop: 2 },
  bulletTxt: { flex: 1, fontSize: 14, fontWeight: "600", lineHeight: 20 },

  btn: { padding: 14, borderRadius: 12, alignItems: "center", marginTop: 12 },
  btnTxt: { fontWeight: "900", fontSize: 14 },

  ratingBox: { alignItems: "center", paddingVertical: 20 },
  ratingLarge: { alignItems: "center" },
  ratingNum: { fontSize: 56, fontWeight: "900", lineHeight: 60 },
  ratingStars: { fontSize: 20, marginVertical: 4 },
  ratingCount: { fontSize: 13, fontWeight: "600" },

  link: { fontWeight: "700" },
  miss: { fontWeight: "700" },
});
