import { View, Text, Image, StyleSheet, ScrollView, Pressable, Share } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getResults } from "../../../data/events";
import { useTheme } from "../../../../context/ThemeContext";

const asImageSource = (src?: any) =>
  typeof src === "string" ? { uri: src } : src || require("../../../../assets/races/colombo.jpg");

export default function ResultDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { palette } = useTheme();

  const result = getResults().find((r) => r.id === id);

  if (!result) {
    return (
      <View style={[styles.centered, { backgroundColor: palette.background }]}>
        <Text style={[styles.notFound, { color: palette.textSecondary }]}>
          Result not found
        </Text>
      </View>
    );
  }

  const { title, occurredAt, banner, podium, recapUrl } = result;
  const date = new Date(occurredAt).toLocaleDateString();

  // 👇 Share function
  const handleShare = async () => {
    try {
      const message =
        `🏁 ${title}\n📅 ${date}\n\n` +
        (recapUrl ? `Watch the recap: ${recapUrl}\n` : "") +
        "Shared via Sri Lanka Racing Hub (SLRH)";
      await Share.share({
        title: `Race Result - ${title}`,
        message,
      });
    } catch (err) {
      console.warn("Share failed:", err);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: palette.background }]}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      <Image source={asImageSource(banner)} style={styles.banner} />
      <View style={styles.details}>
        <Text style={[styles.title, { color: palette.text }]}>{title}</Text>
        <Text style={[styles.date, { color: palette.textSecondary }]}>{date}</Text>

        <View style={styles.podiumSection}>
          <Text style={[styles.sectionTitle, { color: palette.accent }]}>
            🏆 Top 3 Finishers
          </Text>

          {podium?.map((p, i) => (
            <View key={i} style={styles.podiumItem}>
              <Text style={styles.podiumPlace}>
                {p.place === 1 ? "🥇" : p.place === 2 ? "🥈" : "🥉"}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {p.avatar && (
                  <Image source={asImageSource(p.avatar)} style={styles.podiumAvatar} />
                )}
                <Text style={[styles.podiumName, { color: palette.text }]}>
                  {p.name}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {recapUrl && (
          <Text style={[styles.link, { color: palette.accent }]}>
            🔗 Recap: {recapUrl}
          </Text>
        )}

        {/* 🏎️ Share Button */}
        <Pressable
          onPress={handleShare}
          style={[styles.shareBtn, { backgroundColor: palette.accent }]}
        >
          <Text style={[styles.shareText, { color: "#000" }]}>Share Result</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

/* ---------------------- Styles ---------------------- */
const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  notFound: { fontSize: 18, fontWeight: "700" },

  banner: { width: "100%", height: 220, resizeMode: "cover" },
  details: { padding: 16 },

  title: { fontSize: 22, fontWeight: "800" },
  date: { marginTop: 4 },

  sectionTitle: { fontWeight: "700", fontSize: 18, marginTop: 20, marginBottom: 8 },
  podiumSection: { marginTop: 10 },
  podiumItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 4,
  },
  podiumPlace: { fontSize: 22, width: 30 },
  podiumAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  podiumName: { fontSize: 16, fontWeight: "600" },
  link: { marginTop: 16 },

  /* Share Button */
  shareBtn: {
    marginTop: 24,
    borderRadius: 999,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  shareText: { fontSize: 16, fontWeight: "900" },
});
