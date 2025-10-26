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
import { useTheme } from "../../../../context/ThemeContext"; // 🎨 Theme support

export default function TeamProfile() {
  const { palette } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const team = id ? getTeamById(id) : undefined;
  const { drivers } = getPeopleData();

  // If team not found
  if (!team) {
    return (
      <SafeAreaView
        style={[s.safe, { backgroundColor: palette.background }]}
        edges={["top", "bottom"]}
      >
        <View style={s.centerBox}>
          <Text style={[s.miss, { color: palette.text }]}>Team not found</Text>
          <Pressable onPress={() => router.back()}>
            <Text style={[s.back, { color: palette.accent }]}>← Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // Resolve team members
  const members = team.members.map((name) => {
    const d = drivers.find((x) => x.name === name);
    return { name, driverId: d?.id, avatar: d?.avatar };
  });

  return (
    <SafeAreaView
      style={[s.safe, { backgroundColor: palette.background }]}
      edges={["top", "bottom"]}
    >
      {/* Header */}
      <View
        style={[
          s.header,
          { backgroundColor: palette.background, borderBottomColor: palette.border },
        ]}
      >
        <Pressable onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="chevron-back" size={22} color={palette.accent} />
          <Text style={[s.backTxt, { color: palette.accent }]}>Back</Text>
        </Pressable>
        <Text style={[s.headerTitle, { color: palette.text }]}>Team Profile</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Body */}
      <ScrollView contentContainerStyle={s.scrollContent}>
        {/* Team Card */}
        <View
          style={[
            s.teamCard,
            { backgroundColor: palette.card, borderColor: palette.border },
          ]}
        >
          {team.logo ? (
            <Image source={team.logo as any} style={s.teamLogo} />
          ) : (
            <View style={[s.teamLogo, s.ph]} />
          )}
          <View style={{ flex: 1 }}>
            <Text style={[s.teamName, { color: palette.text }]}>{team.name}</Text>
            {team.achievements ? (
              <Text
                style={[s.achievements, { color: palette.textSecondary }]}
              >
                {team.achievements}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Members */}
        <View
          style={[
            s.membersBlock,
            { backgroundColor: palette.card, borderColor: palette.border },
          ]}
        >
          <Text style={[s.blockTitle, { color: palette.accent }]}>
            Team Members
          </Text>

          <View style={s.membersList}>
            {members.map((m) => {
              const content = (
                <View
                  style={[
                    s.memberCard,
                    { backgroundColor: palette.card, borderColor: palette.border },
                  ]}
                >
                  {m.avatar ? (
                    <Image source={m.avatar as any} style={s.memberAvatar} />
                  ) : (
                    <View style={[s.memberAvatar, s.ph]} />
                  )}
                  <Text style={[s.memberName, { color: palette.text }]}>
                    {m.name}
                  </Text>
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
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- Styles ---------- */
const s = StyleSheet.create({
  safe: { flex: 1 },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  backTxt: { fontWeight: "700" },
  headerTitle: { fontSize: 18, fontWeight: "900" },

  scrollContent: { padding: 16, paddingBottom: 60 },

  // Team Card
  teamCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  teamLogo: { width: 90, height: 90, borderRadius: 12, resizeMode: "contain" },
  ph: { backgroundColor: "#222", borderWidth: 1, borderColor: "#2f2f2f" },
  teamName: { fontSize: 22, fontWeight: "900" },
  achievements: { marginTop: 4, fontSize: 14 },

  // Members
  membersBlock: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  blockTitle: { fontSize: 18, fontWeight: "800", marginBottom: 12 },
  membersList: { gap: 12 },
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  memberAvatar: { width: 48, height: 48, borderRadius: 24, resizeMode: "cover" },
  memberName: { fontSize: 16, fontWeight: "700" },

  centerBox: { flex: 1, justifyContent: "center", alignItems: "center" },
  miss: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  back: { fontWeight: "700" },
});
