import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, StyleSheet, Image, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export default function SponsorsScreen() {
  const { palette } = useTheme();

  const sponsors = [
    {
      name: "Mobil 1",
      logo: require("../../assets/sponsors/sponsor1.jpg"),
      description: "Official Lubricant Partner ensuring high performance on every track.",
    },
    {
      name: "Michelin",
      logo: require("../../assets/sponsors/sponsor2.jpg"),
      description: "Our trusted tire partner, delivering maximum grip and durability.",
    },
    {
      name: "Red Bull",
      logo: require("../../assets/sponsors/sponsor3.jpg"),
      description: "Fueling the energy and adrenaline of Sri Lanka Racing Hub events.",
    },
  ];

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: palette.background }]}>
      <ScrollView
        contentContainerStyle={s.container}
        showsVerticalScrollIndicator={false}
      >
        {/* === Hero Image Section (no overlay) === */}
        <View style={s.bannerContainer}>
          <Image
            source={require("../../assets/sponsors/sponsor-banner.jpg")}
            style={s.bannerImage}
            resizeMode="cover"
          />
        </View>

        {/* === Intro Section === */}
        <Text style={[s.intro, { color: palette.textSecondary }]}>
          Sri Lanka Racing Hub (SLRH) proudly collaborates with world-class brands who fuel
          our passion for speed, performance, and innovation. Together, we drive the spirit
          of motorsport excellence across Sri Lanka.
        </Text>

        {/* === Sponsors List === */}
        {sponsors.map((sponsor, i) => (
          <View
            key={i}
            style={[
              s.card,
              {
                backgroundColor: palette.card,
                borderColor: palette.border,
              },
            ]}
          >
            <Image source={sponsor.logo} style={s.logo} resizeMode="contain" />
            <View style={{ flex: 1 }}>
              <Text style={[s.sponsorName, { color: palette.text }]}>
                {sponsor.name}
              </Text>
              <Text style={[s.sponsorText, { color: palette.textSecondary }]}>
                {sponsor.description}
              </Text>
            </View>
          </View>
        ))}

        {/* === Footer === */}
        <View style={s.footer}>
          <Text style={[s.footerText, { color: palette.textSecondary }]}>
            Interested in partnering with us?
          </Text>
          <Text style={[s.footerTextHighlight, { color: palette.accent }]}>
            Contact partnerships@slrh.com
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { paddingTop:-50 },
  container: { padding: 20, paddingBottom: 60 },

  /* ---------- Banner ---------- */
  bannerContainer: {
    position: "relative",
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },

  /* ---------- Intro ---------- */
  intro: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },

  /* ---------- Sponsor Cards ---------- */
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    gap: 14,
  },
  logo: { width: 80, height: 60, borderRadius: 10 },
  sponsorName: { fontSize: 18, fontWeight: "900", marginBottom: 4 },
  sponsorText: { fontSize: 14, lineHeight: 20 },

  /* ---------- Footer ---------- */
  footer: { marginTop: 24, alignItems: "center" },
  footerText: { fontSize: 14, fontWeight: "600" },
  footerTextHighlight: { fontSize: 14, fontWeight: "800", marginTop: 4 },
});
