import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Image, Pressable, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SafeScreen from "../../../components/SafeScreen";
import { getAllEvents, type Event } from "../../data/events";
import { useTheme } from "../../../context/ThemeContext";

/* ---------------------- Timer Logic ---------------------- */
function computeRemaining(target: Date) {
  const diff = +target - +new Date();
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { d, h, m, s };
}

function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [t, setT] = useState(() => computeRemaining(targetDate));
  useEffect(() => {
    const id = setInterval(() => setT(computeRemaining(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const Block = ({ v, label }: { v: number; label: string }) => (
    <View style={styles.countBlock}>
      <Text style={styles.countValue}>{String(v).padStart(2, "0")}</Text>
      <Text style={styles.countLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.countRow}>
      <Block v={t.d} label="Days" />
      <Block v={t.h} label="Hours" />
      <Block v={t.m} label="Minutes" />
      <Block v={t.s} label="Seconds" />
    </View>
  );
}

/* ---------------------- Screen ---------------------- */
export default function EventDetails() {
  const { palette } = useTheme();
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const allEvents = getAllEvents();
  const event = allEvents.find((e) => String(e.id) === String(id));

  if (!event) {
    return (
      <SafeScreen bg={palette.background}>
        <View style={styles.center}>
          <Text style={[styles.notFound, { color: palette.textSecondary }]}>
            Event not found.
          </Text>
        </View>
      </SafeScreen>
    );
  }

  const when = new Date(event.scheduledAt);

  return (
    <SafeScreen bg={palette.background}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: palette.background }]}>
          <Pressable
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: palette.card }]}
          >
            <Ionicons name="chevron-back" size={22} color={palette.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: palette.text }]}>
            Event Details
          </Text>
        </View>

        {/* Banner */}
        {event.banner ? (
          <Image source={event.banner as any} style={styles.banner} />
        ) : (
          <View
            style={[
              styles.banner,
              { backgroundColor: palette.border + "33" },
            ]}
          />
        )}

        {/* Content */}
        <View style={{ padding: 16 }}>
          <Text style={[styles.title, { color: palette.text }]}>{event.title}</Text>

          <View style={styles.infoRow}>
            <Ionicons name="location" size={16} color={palette.accent} />
            <Text style={[styles.infoText, { color: palette.textSecondary }]}>
              {event.city || "Unknown"} • {event.circuit || "Unknown Track"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={16} color={palette.accent} />
            <Text style={[styles.infoText, { color: palette.textSecondary }]}>
              {when.toLocaleString()}
            </Text>
          </View>

          {/* Countdown for upcoming */}
          {event.live?.status === "UPCOMING" && (
            <View style={{ marginTop: 16 }}>
              <CountdownTimer targetDate={when} />
            </View>
          )}

          <View
            style={[
              styles.separator,
              { backgroundColor: palette.border + "66" },
            ]}
          />

          <Text style={[styles.sectionTitle, { color: palette.accent }]}>
            About this Event
          </Text>
          <Text style={[styles.desc, { color: palette.textSecondary }]}>
            {(event as any).description ??
              "Get ready for an adrenaline-filled racing experience! Witness top drivers compete for glory at this iconic track. Feel the roar of engines, the speed, and the passion that defines racing culture."}
          </Text>

          {/* CTA */}
          {event.live?.status === "UPCOMING" && (
            <Pressable
              style={[styles.btn, { backgroundColor: palette.accent }]}
            >
              <Text style={[styles.btnText, { color: "#000" }]}>
                Get Tickets
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

/* ---------------------- Styles ---------------------- */
const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", padding: 16, paddingTop: 12 },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  headerTitle: { fontSize: 18, fontWeight: "800" },
  banner: { width: "100%", height: 220, resizeMode: "cover" },
  title: { fontSize: 22, fontWeight: "900", marginTop: 8 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 },
  infoText: { fontSize: 14 },
  separator: { height: 1, marginVertical: 16 },
  sectionTitle: { fontWeight: "800", marginBottom: 8 },
  desc: { lineHeight: 20, marginBottom: 20 },

  /* Countdown */
  countRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
    marginTop: 10,
  },
  countBlock: {
    alignItems: "center",
    width: 62,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
  },
  countValue: { fontSize: 20, fontWeight: "800", color: "#fff" },
  countLabel: { fontSize: 10, marginTop: 2, color: "#c9c9c9" },

  /* CTA */
  btn: {
    borderRadius: 999,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  btnText: { fontWeight: "900", fontSize: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  notFound: { fontSize: 16 },
});
