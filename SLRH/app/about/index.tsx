import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, StyleSheet } from "react-native";
import TopBar from "../../components/TopBar";

export default function AboutScreen() {
  return (
    <SafeAreaView style={s.safe}>
      <TopBar title="About Us" showBack={true} showMenu={false} showSearch={false} showProfile={false} />
      <ScrollView contentContainerStyle={s.container}>
        <Text style={s.title}>ℹ️ About SLRH</Text>
        <Text style={s.text}>
          SLRH is a racing community platform bringing fans, teams, and racers together
          to celebrate speed, performance, and the thrill of competition.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0b0b0b" },
  container: { padding: 20 },
  title: { color: "#C6FFF4", fontWeight: "900", fontSize: 22, marginBottom: 10 },
  text: { color: "#fff", fontSize: 16, lineHeight: 24 },
});
