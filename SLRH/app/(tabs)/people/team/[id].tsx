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
import Header from "../../../../components/Header";
import { getTeamById } from "../../../data/people";
import { TeamItem, DriverItem } from "../../../data/type"; // ✅ only once

export default function TeamProfile() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [team, setTeam] = useState<TeamItem | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = await getTeamById(id);
      setTeam(data);
    };
    load();
  }, [id]);

  if (!team)
    return (
      <SafeAreaView style={s.safe}>
        <Text style={s.miss}>Team not found.</Text>
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={s.safe} edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <Header title="Team Profile" />
        <View style={s.card}>
          <Text style={s.cardTitle}>Members</Text>
          <Text>{team.members?.join(", ") || "—"}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0b0b0b" },
  card: { margin: 16, backgroundColor: "#111", borderRadius: 10, padding: 12 },
  cardTitle: { color: "#fff", fontWeight: "bold", marginBottom: 8 },
  miss: { color: "#fff", padding: 16 },
});
