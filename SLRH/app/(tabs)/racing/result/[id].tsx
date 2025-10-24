import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getResults } from "../../../data/events";

const asImageSource = (src?: any) =>
  typeof src === "string" ? { uri: src } : src || require("../../../../assets/races/colombo.jpg");

export default function ResultDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const result = getResults().find((r) => r.id === id);

  if (!result) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFound}>Result not found</Text>
      </View>
    );
  }

  const { title, occurredAt, banner, podium, recapUrl } = result;
  const date = new Date(occurredAt).toLocaleDateString();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Image source={asImageSource(banner)} style={styles.banner} />
      <View style={styles.details}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{date}</Text>

        <View style={styles.podiumSection}>
          <Text style={styles.sectionTitle}>🏆 Top 3 Finishers</Text>

          {podium?.map((p, i) => (
            <View key={i} style={styles.podiumItem}>
              <Text style={styles.podiumPlace}>
                {p.place === 1
                  ? "🥇"
                  : p.place === 2
                  ? "🥈"
                  : "🥉"}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {p.avatar && (
                  <Image
                    source={asImageSource(p.avatar)}
                    style={styles.podiumAvatar}
                  />
                )}
                <Text style={styles.podiumName}>{p.name}</Text>
              </View>
            </View>
          ))}
        </View>

        {recapUrl && (
          <Text style={styles.link}>🔗 Recap: {recapUrl}</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b0b0b" },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0b0b0b",
  },
  notFound: { color: "#fff", fontSize: 18, fontWeight: "700" },
  banner: { width: "100%", height: 220, resizeMode: "cover" },
  details: { padding: 16 },
  title: { color: "#fff", fontSize: 22, fontWeight: "800" },
  date: { color: "#bbb", marginTop: 4 },
  sectionTitle: { color: "#00E0C6", fontWeight: "700", fontSize: 18, marginTop: 20, marginBottom: 8 },
  podiumSection: { marginTop: 10 },
  podiumItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 4,
  },
  podiumPlace: { fontSize: 22, width: 30 },
  podiumAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  podiumName: { color: "#fff", fontSize: 16, fontWeight: "600" },
  link: { color: "#00E0C6", marginTop: 16 },
});
