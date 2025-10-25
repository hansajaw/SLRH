import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, Link } from "expo-router";
import Header from "../../../components/Header";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { getTeamById } from "../../data/people";
import { TeamItem, DriverItem } from "../../data/type";

const fallbackLogo = { uri: "https://via.placeholder.com/150x150?text=Team" };

export default function TeamProfile() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [team, setTeam] = useState<TeamItem | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const data = await getTeamById(id);
        setTeam(data);
      } catch (err) {
        console.error("Failed to load team:", err);
      }
    };
    load();
  }, [id]);

  if (!team) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={{ padding: 16 }}>
          <Text style={s.miss}>Team not found.</Text>
          <Link href="/(tabs)/people" style={s.link}>
            ← Back to People
          </Link>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <Header title="Team Profile" />
        <View style={s.hero}>
          <LinearGradient colors={["#1a1a1a", "#0b0b0b"]} style={s.heroGrad} />

          <View style={s.heroContent}>
            <View style={s.avatarWrap}>
              <Image source={(team.logo as any) || fallbackLogo} style={s.avatar} />
            </View>

            <Text style={s.name}>{team.name}</Text>
            {team.city ? <Text style={s.sub}>{team.city}</Text> : null}

            {team.founded && (
              <Text style={s.founded}>Founded: {team.founded}</Text>
            )}
          </View>
        </View>

        {/* ===== Overview Section ===== */}
        <View style={s.card}>
          <Text style={s.cardTitle}>About</Text>
          <Text style={s.about}>{team.about || "No information available."}</Text>
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>Members</Text>
          {team.members?.length ? (
            <View style={s.tagWrap}>
              {team.members.map((m: string) => (
                <View key={m} style={s.tag}>
                  <Text style={s.tagTxt}>{m}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={s.dim}>No members listed</Text>
          )}
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>Achievements</Text>
          <Text style={s.about}>
            {team.achievements || "No achievements recorded yet."}
          </Text>
        </View>

        {team.drivers?.length ? (
          <View style={s.card}>
            <Text style={s.cardTitle}>Drivers</Text>
            {team.drivers.map((driverId: string) => (
              <Link
                key={driverId}
                href={{
                  pathname: "/people/driver/[id]",
                  params: { id: driverId },
                }}
                asChild
              >
                <Pressable style={s.driverRow}>
                  <Ionicons name="person" size={18} color="#00E0C6" />
                  <Text style={s.driverName}>{driverId}</Text>
                </Pressable>
              </Link>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- Styles ---------------- */
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0b0b0b" },
  link: { color: "#00E0C6", fontWeight: "700" },
  miss: { color: "#fff", fontWeight: "700" },

  hero: { height: 260, position: "relative" },
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
  sub: { color: "#ccc", fontSize: 14, fontWeight: "600", marginTop: 4 },
  founded: { color: "#888", fontSize: 13, marginTop: 4 },

  card: {
    backgroundColor: "#1a1a1a",
    padding: 16,
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#222",
  },
  cardTitle: { color: "#fff", fontSize: 16, fontWeight: "900", marginBottom: 10 },
  about: { color: "#ddd", fontSize: 14, lineHeight: 20, fontWeight: "500" },
  dim: { color: "#666", fontSize: 13, fontWeight: "600" },

  tagWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: {
    backgroundColor: "#00E0C6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagTxt: { color: "#000", fontSize: 12, fontWeight: "700" },

  driverRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
  },
  driverName: { color: "#fff", fontSize: 14, fontWeight: "700" },
});
