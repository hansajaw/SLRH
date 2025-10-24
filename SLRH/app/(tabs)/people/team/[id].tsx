import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { getTeamById, getPeopleData } from "../../../data/people";
import { Ionicons } from "@expo/vector-icons";

export default function TeamProfile() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const team = id ? getTeamById(id) : undefined;
  const { drivers } = getPeopleData();

  // Handle team not found
  if (!team) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centerBox}>
          <Text style={styles.miss}>Team not found</Text>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.back}>← Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const members = team.members.map((name) => {
    const d = drivers.find((x) => x.name === name);
    return { name, driverId: d?.id, avatar: d?.avatar };
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color="#00E0C6" />
          <Text style={styles.backTxt}>Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Team Profile</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.teamCard}>
          {team.logo ? (
            <Image source={team.logo as any} style={styles.teamLogo} />
          ) : (
            <View style={[styles.teamLogo, styles.ph]} />
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.teamName}>{team.name}</Text>
            {team.achievements ? (
              <Text style={styles.achievements}>{team.achievements}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.membersBlock}>
          <Text style={styles.blockTitle}>Team Members</Text>
          <View style={styles.membersList}>
            {members.map((m) => {
              const content = (
                <View style={styles.memberCard}>
                  {m.avatar ? (
                    <Image source={m.avatar as any} style={styles.memberAvatar} />
                  ) : (
                    <View style={[styles.memberAvatar, styles.ph]} />
                  )}
                  <Text style={styles.memberName}>{m.name}</Text>
                </View>
              );

              return m.driverId ? (
                <Link
                  key={m.name}
                  href={{
                    pathname: "/people/driver/[id]",
                    params: { id: m.driverId },
                  }}
                  asChild
                >
                  <Pressable>{content}</Pressable>
                </Link>
              ) : (
                <View key={m.name}>{content}</View>
              );
            })}
          </View>
        </View>

        <Pressable onPress={() => router.back()} style={styles.bottomBack}>
          <Text style={styles.bottomBackTxt}>← Back to Home</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0b0b0b" },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#1e1e1e",
    backgroundColor: "#0b0b0b",
  },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  backTxt: { color: "#00E0C6", fontWeight: "700" },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "900" },

  scrollContent: { padding: 16, paddingBottom: 60 },

  teamCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    backgroundColor: "#141414",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#222",
    marginBottom: 16,
  },
  teamLogo: { width: 90, height: 90, borderRadius: 12, resizeMode: "contain" },
  ph: { backgroundColor: "#222", borderWidth: 1, borderColor: "#2f2f2f" },
  teamName: { color: "#fff", fontSize: 22, fontWeight: "900" },
  achievements: { color: "#cfcfcf", marginTop: 4, fontSize: 14 },

  membersBlock: {
    backgroundColor: "#141414",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#222",
    padding: 14,
  },
  blockTitle: {
    color: "#00E0C6",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
  },
  membersList: { gap: 12 },
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#191919",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#262626",
  },
  memberAvatar: { width: 48, height: 48, borderRadius: 24, resizeMode: "cover" },
  memberName: { color: "#fff", fontSize: 16, fontWeight: "700" },

  bottomBack: {
    marginTop: 24,
    alignSelf: "center",
    backgroundColor: "rgba(0,224,198,0.08)",
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  bottomBackTxt: { color: "#00E0C6", fontWeight: "700" },

  centerBox: { flex: 1, justifyContent: "center", alignItems: "center" },
  miss: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 10 },
  back: { color: "#00E0C6", fontWeight: "700" },
});
