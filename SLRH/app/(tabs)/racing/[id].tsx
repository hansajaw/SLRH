import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Image, Pressable, ScrollView, StyleSheet } from "react-native";
import SafeScreen from "../../../components/SafeScreen";
import { Ionicons } from "@expo/vector-icons";
import { getRacingData } from "../../data/racing";

export default function EventDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { schedule } = getRacingData();
  
  const event = schedule.find((e) => String(e.id) === String(id));

  if (!event) {
    return (
      <SafeScreen bg="#0b0b0b">
        <View style={styles.center}>
          <Text style={styles.notFound}>Event not found.</Text>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen bg="#0b0b0b">
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>Event Details</Text>
        </View>

        {event.banner ? (
          <Image source={event.banner as any} style={styles.banner} />
        ) : (
          <View style={[styles.banner, { backgroundColor: "#222" }]} />
        )}

        <View style={{ padding: 16 }}>
          <Text style={styles.title}>{event.title}</Text>

          <View style={styles.infoRow}>
            <Ionicons name="location" size={16} color="#00E0C6" />
            <Text style={styles.infoText}>
              {event.city || "Unknown"} • {event.circuit || "Unknown Track"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={16} color="#00E0C6" />
            <Text style={styles.infoText}>
              {new Date(event.scheduledAt).toLocaleString()}
            </Text>
          </View>

          <View style={styles.separator} />

          <Text style={styles.sectionTitle}>About this event</Text>
          <Text style={styles.desc}>
            {event.description ??
              "Get ready for an adrenaline-filled racing experience! Witness top drivers compete for glory at this iconic track. Feel the roar of engines, the speed, and the passion that defines racing culture."}
          </Text>

          <Pressable style={styles.btn}>
            <Text style={styles.btnText}>Get Tickets</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", padding: 16, paddingTop: 12 },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "800" },
  banner: { width: "100%", height: 220, resizeMode: "cover" },
  title: { color: "#fff", fontSize: 22, fontWeight: "900", marginTop: 8 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 },
  infoText: { color: "#bdbdbd", fontSize: 14 },
  separator: { height: 1, backgroundColor: "#222", marginVertical: 16 },
  sectionTitle: { color: "#00E0C6", fontWeight: "800", marginBottom: 8 },
  desc: { color: "#ddd", lineHeight: 20, marginBottom: 20 },
  btn: {
    backgroundColor: "#00E0C6",
    borderRadius: 999,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  btnText: { color: "#001018", fontWeight: "900", fontSize: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  notFound: { color: "#aaa", fontSize: 16 },
});
