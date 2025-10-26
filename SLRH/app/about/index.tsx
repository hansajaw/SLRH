import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, StyleSheet, View, Image } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export default function AboutScreen() {
  const { palette } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: palette.background }]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <Image
            source={require("../../assets/images/about-banner.jpg")} 
            style={styles.heroImg}
            resizeMode="cover"
          />
          <Text style={[styles.heroTitle, { color: palette.text }]}>About SLRH</Text>
          <Text style={[styles.heroSubtitle, { color: palette.textSecondary }]}>
            The pulse of Sri Lankan motorsport — by racers, for fans.
          </Text>
        </View>

        {/* Mission Section */}
        <View style={[styles.section, { borderColor: palette.border }]}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>🏁 Our Mission</Text>
          <Text style={[styles.text, { color: palette.textSecondary }]}>
            Sri Lanka Racing Hub (SLRH) unites drivers, teams, and enthusiasts into a single digital
            community — celebrating performance, passion, and precision. We aim to empower local
            talent, highlight achievements, and bring motorsport culture closer to everyone.
          </Text>
        </View>

        {/* Features Section */}
        <View style={[styles.section, { borderColor: palette.border }]}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>🔥 What We Offer</Text>
          <View style={styles.list}>
            <Text style={[styles.bullet, { color: palette.textSecondary }]}>
              • Live race updates, team stats, and driver profiles
            </Text>
            <Text style={[styles.bullet, { color: palette.textSecondary }]}>
              • Interactive polls, quizzes, and fan leaderboards
            </Text>
            <Text style={[styles.bullet, { color: palette.textSecondary }]}>
              • In-depth event coverage and exclusive media highlights
            </Text>
            <Text style={[styles.bullet, { color: palette.textSecondary }]}>
              • Dedicated space for clubs, sponsors, and official teams
            </Text>
          </View>
        </View>

        {/* Community Section */}
        <View style={[styles.section, { borderColor: palette.border }]}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>🌍 Our Community</Text>
          <Text style={[styles.text, { color: palette.textSecondary }]}>
            Whether you’re a driver fine-tuning your next race, a fan cheering from the stands,
            or a sponsor supporting the future of Sri Lankan racing — SLRH welcomes you.
          </Text>
          <Text style={[styles.text, { color: palette.textSecondary, marginTop: 10 }]}>
            Together, we’re building the ultimate hub for motorsport excellence.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: palette.textSecondary }]}>
            © {new Date().getFullYear()} Sri Lanka Racing Hub • All rights reserved
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* -------------------- Styles -------------------- */
const styles = StyleSheet.create({
  safe: { paddingTop:-50 },
  container: { padding: 20, paddingBottom: 60 },
  hero: { alignItems: "center", marginBottom: 24 },
  heroImg: {
    width: "100%",
    height: 260,
    borderRadius: 14,
    marginBottom: 16,
  },
  heroTitle: { fontSize: 24, fontWeight: "900" },
  heroSubtitle: { fontSize: 14, fontWeight: "600", textAlign: "center" },
  section: {
    marginBottom: 28,
    borderTopWidth: 1,
    paddingTop: 18,
  },
  sectionTitle: { fontSize: 18, fontWeight: "900", marginBottom: 10 },
  text: { fontSize: 15, lineHeight: 22, fontWeight: "600" },
  list: { marginTop: 4 },
  bullet: { fontSize: 15, lineHeight: 22, fontWeight: "600" },
  footer: { marginTop: 30, alignItems: "center" },
  footerText: { fontSize: 13, fontWeight: "600", textAlign: "center" },
});
