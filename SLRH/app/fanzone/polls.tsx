import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, StyleSheet } from "react-native";
import Header from "../../components/Header";

export default function PollsScreen() {
  return (
    <SafeAreaView style={s.safe}>
      <Header title="Polls & Quizzes" />
      <ScrollView contentContainerStyle={s.container}>
        <Text style={s.title}>🎯 Polls & Quizzes</Text>
        <Text style={s.text}>
          Participate in polls and quizzes to test your racing knowledge and win rewards!
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
