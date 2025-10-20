import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  Platform,
  Dimensions,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import SegmentedBar from "../../../../components/SegmentedBar";   // <-- adjust if needed
import { getDriverById } from "../../../data/people";          // <-- adjust if needed

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

const money = (n?: number) =>
  typeof n === "number" ? `LKR ${n.toLocaleString("en-LK")}` : "—";
const dateFmt = (s?: string) =>
  s ? new Date(s).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "—";

const { width: W } = Dimensions.get("window");
const PAD = 16;

export default function DriverProfile() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const driver = (id ? (getDriverById(id) as DriverFull) : null) as DriverFull;

  const [tab, setTab] = useState<"Overview" | "Achievements" | "Highlights" | "Ratings">("Overview");

  if (!driver) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ padding: PAD }}>
          <Text style={styles.miss}>Driver not found.</Text>
          <Link href="/(tabs)/people" style={styles.link}>← Back to People</Link>
        </View>
      </SafeAreaView>
    );
  }

  const p = driver.profile || {};
  const s = p.stats || {};

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      {/* Floating Back */}
      <Pressable
        onPress={() => router.back()}
        style={[styles.backFab, { top: insets.top + 8 }]}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Text style={styles.backIcon}>←</Text>
      </Pressable>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 24 + insets.bottom,
          minHeight: "100%",
          backgroundColor: "#090b10",
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ====== HERO ====== */}
        <View style={styles.heroWrap}>
          {/* Gradient background using two layered views */}
          <View style={styles.heroGradient} />
          <View style={styles.heroGlow} />
          {/* angled accent */}
          <View style={styles.accent} />

          <View style={styles.heroContent}>
            <View style={styles.heroTopRow}>
              <View style={styles.avatarWrap}>
                {driver.avatar ? (
                  <Image source={driver.avatar as any} style={styles.avatarImg} />
                ) : (
                  <View style={[styles.avatarImg, { backgroundColor: "#222" }]} />
                )}
                <View style={styles.avatarRing} />
              </View>

              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.name} numberOfLines={2}>{driver.name}</Text>
                <View style={styles.chipsRow}>
                  {p.vehicleType ? <Chip text={`🏁 ${p.vehicleType}`} /> : null}
                  {p.club ? <Chip text={`👥 ${p.club}`} /> : null}
                  {p.nationality ? <Chip text={`🌐 ${p.nationality}`} /> : null}
                  {typeof p.age === "number" ? <Chip text={`🎂 Age ${p.age}`} /> : null}
                </View>
              </View>
            </View>

            {/* Glass meta bar */}
            <View style={styles.heroGlass}>
              <Text style={styles.ratingText}>
                ⭐ {p.rating ?? 0}
                <Text style={styles.ratingSub}> ({p.reviewsCount ?? 0} reviews)</Text>
              </Text>

              <View style={styles.heroActions}>
                <GhostBtn label="♡ Like" />
                <GhostBtn label="🔗 Share" />
                <PrimaryBtn label="Rate Driver" />
              </View>
            </View>
          </View>
        </View>

        {/* ====== 2×2 STAT SQUARES ====== */}
        <SectionHeader title="Stats" />
        <View style={styles.squareGrid}>
          <Square icon="🎯" label="Races" value={String(s.races ?? 0)} />
          <Square icon="🏆" label="Trophies" value={String(s.trophies ?? 0)} />
          <Square icon="🥇" label="First Places" value={String(s.firstPlaces ?? 0)} />
          <Square icon="🪙" label="Prize Money" value={money(s.prizeMoneyLKR)} />
        </View>

        {/* ====== SEGMENTED CONTENT ====== */}
        <SegmentedBar
          tabs={["Overview", "Achievements", "Highlights", "Ratings"] as const}
          value={tab}
          onChange={setTab}
          wrapToTwoLines
          style={{ paddingTop: 8, paddingBottom: 6 }}
        />

        {tab === "Overview" && (
          <View style={styles.cardGrid}>
            <Card title="PERSONAL INFORMATION" icon="👤">
              <KV k="Date of Birth" v={dateFmt(p.personal?.dob)} icon="📅" />
              <KV k="Nationality" v={p.nationality || "—"} icon="🏳️" />
              <KV k="Contact" v={p.personal?.contact || "—"} icon="📞" />
              <KV k="Address" v={p.personal?.address || "—"} icon="📍" multi />
            </Card>

            <Card title="TEAM & SPONSORS" icon="👥">
              <KV k="Team" v={p.team || "—"} />
              <View style={{ height: 10 }} />
              <Text style={styles.cardSub}>Sponsors</Text>
              {p.sponsors?.length ? (
                <View style={styles.sponsorWrap}>
                  {p.sponsors.map((sp) => (
                    <View key={sp} style={styles.sponsorPill}>
                      <Text style={styles.sponsorText}>{sp}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.dimText}>No sponsors listed</Text>
              )}
            </Card>

            <Card title="LICENSE & MEDICAL" icon="🪪">
              <KV k="Serial Number" v={p.license?.serial || "—"} />
              <KV k="Issue Date" v={dateFmt(p.license?.issueDate)} />
              <KV k="Due Date" v={dateFmt(p.license?.dueDate)} />
              <View style={{ height: 10 }} />
              <Text style={[styles.cardSub, { color: "#86efac" }]}>Medical Certificate</Text>
              <Text style={styles.valueText}>{p.license?.dueDate ? "Submitted" : "—"}</Text>
            </Card>

            <Card title="QUICK STATS" icon="📈">
              <BadgeStat label="Win Rate" value={`${Math.round((s.winRate ?? 0) * 100)}%`} />
              <View style={{ height: 8 }} />
              <BadgeStat label="Avg Prize / Race" value={money(s.avgPrizePerRace)} tone="purple" />
            </Card>
          </View>
        )}

        {tab === "Achievements" && (
          <Card title="ACHIEVEMENTS" icon="🏆" pad>
            {p.achievements?.length ? (
              <View style={{ gap: 8 }}>
                {p.achievements.map((a, i) => <Bullet key={i} text={a} />)}
              </View>
            ) : (
              <Text style={styles.dimText}>No achievements yet.</Text>
            )}
          </Card>
        )}

        {tab === "Highlights" && (
          <Card title="HIGHLIGHTS" icon="🎬" pad>
            {p.highlights?.length ? (
              <View style={{ gap: 8 }}>
                {p.highlights.map((h, i) => <Bullet key={i} text={h} />)}
              </View>
            ) : (
              <Text style={styles.dimText}>No highlights yet.</Text>
            )}
          </Card>
        )}

        {tab === "Ratings" && (
          <Card title="RATINGS" icon="⭐" pad>
            <Text style={styles.valueText}>Current rating: {p.rating ?? 0} ({p.reviewsCount ?? 0} reviews)</Text>
            <View style={{ height: 12 }} />
            <Pressable style={styles.primaryWide}>
              <Text style={styles.primaryWideText}>Rate this Driver</Text>
            </Pressable>
          </Card>
        )}

        <View style={{ paddingHorizontal: PAD, paddingTop: 14, paddingBottom: 8 }}>
          <Link href="/(tabs)/people" style={styles.link}>← Back to People</Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ============ Small Components ============ */

function Chip({ text }: { text: string }) {
  return (
    <View style={styles.chip}><Text style={styles.chipText}>{text}</Text></View>
  );
}

function GhostBtn({ label }: { label: string }) {
  return (
    <Pressable style={styles.ghostBtn} accessibilityRole="button" accessibilityLabel={label}>
      <Text style={styles.ghostText}>{label}</Text>
    </Pressable>
  );
}
function PrimaryBtn({ label }: { label: string }) {
  return (
    <Pressable style={styles.primaryBtn} accessibilityRole="button" accessibilityLabel={label}>
      <Text style={styles.primaryText}>{label}</Text>
    </Pressable>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionAccent} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function Square({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <View style={styles.square}>
      <View style={styles.squareIcon}><Text style={{ fontSize: 18 }}>{icon}</Text></View>
      <Text style={styles.squareValue} numberOfLines={1}>{value}</Text>
      <Text style={styles.squareLabel} numberOfLines={1}>{label}</Text>
    </View>
  );
}

function Card({ title, icon, pad, children }: { title: string; icon?: string; pad?: boolean; children: React.ReactNode }) {
  return (
    <View style={[styles.card, pad && { padding: 16 }]}>
      <Text style={styles.cardTitle}>{icon ? `${icon} ${title}` : title}</Text>
      <View style={{ height: 8 }} />
      {children}
    </View>
  );
}

function KV({ k, v, multi, icon }: { k: string; v: string; multi?: boolean; icon?: string }) {
  return (
    <View style={styles.kvRow}>
      <Text style={styles.kvKey}>{icon ? `${icon} ` : ""}{k}</Text>
      <Text style={[styles.valueText, multi && { lineHeight: 20 }]}>{v}</Text>
    </View>
  );
}

function BadgeStat({ label, value, tone }: { label: string; value: string; tone?: "purple" }) {
  const bg = tone === "purple" ? "#3b0764" : "#064e3b";
  const fg = tone === "purple" ? "#d8b4fe" : "#86efac";
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={styles.badgeLabel}>{label}</Text>
      <Text style={[styles.badgeValue, { color: fg }]}>{value}</Text>
    </View>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletDot}>•</Text>
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

/* ============ Styles ============ */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#090b10" },

  link: { color: "#00E0C6", fontWeight: "800" },
  miss: { color: "#fff", fontWeight: "800" },

  /* Back FAB */
  backFab: {
    position: "absolute",
    left: 12,
    zIndex: 30,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({ android: { elevation: 4 } }),
  },
  backIcon: { color: "#fff", fontSize: 18, fontWeight: "900" },

  /* HERO */
  heroWrap: { position: "relative", paddingBottom: 50 },
  heroGradient: {
    height: W * 0.48,
    backgroundColor: "#0c1b4d", // base
  },
  heroGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    shadowColor: "#15f2e1",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 40,
  },
  accent: {
    position: "absolute",
    right: -W * 0.2,
    top: -20,
    width: W * 0.7,
    height: W * 0.7,
    backgroundColor: "#122a7a",
    transform: [{ rotate: "35deg" }],
    borderRadius: 32,
    opacity: 0.45,
  },
  heroContent: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0, paddingTop: 24 },
  heroTopRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: PAD, gap: 12 },
  avatarWrap: { width: 96, height: 96, borderRadius: 48, alignItems: "center", justifyContent: "center" },
  avatarImg: {
    width: 96, height: 96, borderRadius: 48,
    borderWidth: 2, borderColor: "rgba(255,255,255,0.9)",
  },
  avatarRing: {
    position: "absolute",
    width: 114, height: 114, borderRadius: 57,
    borderWidth: 2, borderColor: "rgba(255,255,255,0.2)",
  },
  name: { color: "#ECFEFF", fontSize: 26, fontWeight: "900", letterSpacing: 0.2 },

  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  chip: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  chipText: { color: "#0a0a0a", fontWeight: "800" },

  heroGlass: {
    marginTop: 14,
    marginHorizontal: PAD,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    padding: 12,
    backdropFilter: "blur(6px)" as any, // iOS webview effect; harmless elsewhere
  },
  ratingText: { color: "#fff", fontSize: 16, fontWeight: "900" },
  ratingSub: { color: "#d1d5db", fontWeight: "700", fontSize: 13 },
  heroActions: { marginTop: 10, flexDirection: "row", gap: 10, flexWrap: "wrap" },

  ghostBtn: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  ghostText: { color: "#0a0a0a", fontWeight: "800" },
  primaryBtn: {
    backgroundColor: "#f59e0b",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  primaryText: { color: "#0a0a0a", fontWeight: "900" },

  /* Section header */
  sectionHeader: { flexDirection: "row", alignItems: "center", paddingHorizontal: PAD, marginTop: 14, marginBottom: 8, gap: 8 },
  sectionAccent: { width: 6, height: 18, borderRadius: 3, backgroundColor: "#00E0C6" },
  sectionTitle: { color: "#eaeaea", fontSize: 16, fontWeight: "900", letterSpacing: 0.3 },

  /* 2×2 Squares */
  squareGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
    paddingHorizontal: PAD,
    marginBottom: 6,
  },
  square: {
    width: "48%",
    aspectRatio: 1,
    backgroundColor: "#121318",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1b2030",
    padding: 14,
    justifyContent: "center",
    ...Platform.select({ android: { elevation: 2 } }),
  },
  squareIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: "#0b3b5b",
    alignItems: "center", justifyContent: "center",
    marginBottom: 10,
  },
  squareValue: { color: "#fff", fontSize: 22, fontWeight: "900" },
  squareLabel: { color: "#aeb4c1", marginTop: 2, fontWeight: "700" },

  /* Cards grid */
  cardGrid: { paddingHorizontal: PAD, paddingTop: 10, gap: 12 },
  card: {
    backgroundColor: "#0f1628",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#1a2542",
  },
  cardTitle: { color: "#fff", fontSize: 15, fontWeight: "900", letterSpacing: 0.3 },
  cardSub: { color: "#93c5fd", fontWeight: "900", marginTop: 2, marginBottom: 4 },

  kvRow: { marginBottom: 10 },
  kvKey: { color: "#cbd5e1", fontWeight: "700" },
  valueText: { color: "#fff", fontWeight: "800", marginTop: 2 },
  dimText: { color: "#9ca3af", fontWeight: "700" },

  sponsorWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  sponsorPill: { backgroundColor: "#1d4ed8", paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10 },
  sponsorText: { color: "#dbeafe", fontWeight: "900" },

  badge: { borderRadius: 12, paddingVertical: 12, paddingHorizontal: 12, backgroundColor: "#064e3b" },
  badgeLabel: { color: "#d1d5db", fontWeight: "800" },
  badgeValue: { fontWeight: "900", fontSize: 16, marginTop: 4 },

  bulletRow: { flexDirection: "row", gap: 8 },
  bulletDot: { color: "#e5e7eb", fontSize: 20, lineHeight: 20 },
  bulletText: { color: "#e5e7eb", flex: 1, fontWeight: "600" },

  primaryWide: {
  backgroundColor: "#f59e0b",
  borderRadius: 12,
  paddingVertical: 12,
  alignItems: "center",
  width: "100%",
  marginTop: 4,
},
primaryWideText: {
  color: "#0a0a0a",
  fontWeight: "900",
},

});
