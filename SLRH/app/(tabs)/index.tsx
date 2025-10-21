import { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  FlatList,
  Dimensions,
  ImageSourcePropType,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import SafeScreen from "../../components/SafeScreen";
import TopBar from "../../components/TopBar";
import { getUpcomingEvents, getResults, type Event } from "../data/events";
import { getPeopleData } from "../data/people";
import { getNews, type NewsItem } from "../data/media"; // ✅ now fetching from media.ts

const SP = 14;
const BG = "#0b0b0b";
const SCREEN_W = Dimensions.get("window").width;

const asImageSource = (src?: string | ImageSourcePropType) => {
  if (!src) return require("../../assets/races/colombo.jpg");
  return typeof src === "string" ? { uri: src } : (src as ImageSourcePropType);
};

/* -------------------- Hero Section -------------------- */
function HeroSlide({ event }: { event: Event }) {
  const id = event.id;
  const when = new Date(event.scheduledAt);
  return (
    <Link href={{ pathname: "/racing/[id]", params: { id } }} asChild>
      <Pressable style={styles.heroCard}>
        <Image source={asImageSource(event.banner)} style={styles.heroImage} />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.9)"]}
          style={styles.heroOverlay}
        />
        <View style={styles.heroTextWrap}>
          <View style={styles.liveBadge}>
            <Text style={styles.liveBadgeText}>UPCOMING</Text>
          </View>
          <Text style={styles.heroTitle}>{event.title}</Text>
          <Text style={styles.heroMeta}>
            📍 {event.city} • 📅 {when.toLocaleDateString()}
          </Text>
          <View style={styles.heroCTABtn}>
            <Text style={styles.heroCTA}>View Event →</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

/* -------------------- News Card -------------------- */
function NewsCard({ item }: { item: NewsItem }) {
  const when = new Date(); 
  return (
    <Link href={{ pathname: "/media", params: { tab: "News", id: item._id } }} asChild>
      <Pressable style={styles.newsCard}>
        <View style={styles.newsImgWrap}>
          <Image source={asImageSource(item.banner)} style={styles.newsImg} />
          <View style={styles.newsOverlay} />
        </View>
        <View style={styles.newsContent}>
          <Text style={styles.newsTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.newsMeta}>📅 {when?.toLocaleDateString()}</Text>
        </View>
      </Pressable>
    </Link>
  );
}

/* -------------------- Home Screen -------------------- */
export default function HomeScreen() {
  const router = useRouter();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);

  const heroEvents = useMemo(() => getUpcomingEvents(5), []);
  const latestResults = useMemo(() => getResults().slice(0, 6), []);
  const { drivers, teams } = getPeopleData();

  // 🏆 top drivers and featured teams
  const topDrivers = useMemo(() => {
    return drivers
      .map((d) => ({
        ...d,
        winCount: parseInt(d.stats?.match(/\d+/)?.[0] || "0", 10),
      }))
      .sort((a, b) => b.winCount - a.winCount)
      .slice(0, 5);
  }, [drivers]);

  const featuredTeams = useMemo(() => {
    return teams
      .map((t) => ({
        ...t,
        memberCount: t.members?.length || 0,
      }))
      .sort((a, b) => b.memberCount - a.memberCount)
      .slice(0, 4);
  }, [teams]);

  // ✅ fetch latest news from media.ts
  const loadNews = async () => {
    try {
      setLoading(true);
      const fetched = await getNews();
      setNews(fetched);
    } catch (err) {
      console.warn("Failed to load news:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  return (
    <SafeScreen bg={BG}>
      <TopBar title="Home" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: SP, paddingBottom: 88 }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadNews}
            tintColor="#00E0C6"
          />
        }
      >
        {/* Hero Slide */}
        <View style={{ marginBottom: 32 }}>
          <FlatList
            data={heroEvents}
            keyExtractor={(it) => String(it.id)}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={SCREEN_W * 0.8 + 12}
            decelerationRate="fast"
            contentContainerStyle={{ columnGap: 12 }}
            renderItem={({ item }) => <HeroSlide event={item} />}
          />
        </View>

        {/* 🏁 Featured Teams */}
        <Section
          title="Featured Teams"
          onPress={() =>
            router.push({ pathname: "/people", params: { tab: "Teams" } })
          }
        >
          <FlatList
            data={featuredTeams}
            keyExtractor={(t) => String(t.id)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ columnGap: 12 }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/people/team/[id]",
                    params: { id: item.id },
                  })
                }
                style={styles.teamCard}
              >
                <View style={styles.teamImgWrap}>
                  <Image
                    source={asImageSource(item.logo)}
                    style={styles.teamImg}
                  />
                </View>
                <Text style={styles.teamName}>{item.name}</Text>
                <View style={styles.memberBadge}>
                  <Text style={styles.memberBadgeText}>
                    {item.members.length} Members
                  </Text>
                </View>
              </Pressable>
            )}
          />
        </Section>

        {/* 🏎️ Top Players */}
        <Section
          title="Top Players"
          onPress={() =>
            router.push({ pathname: "/people", params: { tab: "Drivers" } })
          }
        >
          <FlatList
            data={topDrivers}
            keyExtractor={(d) => String(d.id)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ columnGap: 12 }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/people/driver/[id]",
                    params: { id: item.id },
                  })
                }
                style={styles.playerCard}
              >
                <View style={styles.playerImgWrap}>
                  <Image
                    source={asImageSource(item.avatar)}
                    style={styles.playerImg}
                  />
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankText}>🏆</Text>
                  </View>
                </View>
                <Text style={styles.playerName}>{item.name}</Text>
                <Text style={styles.playerStats}>{item.stats}</Text>
              </Pressable>
            )}
          />
        </Section>

        {/* 🏁 Latest Race Results */}
        <Section
          title="Latest Results"
          onPress={() =>
            router.push({ pathname: "/racing", params: { tab: "results" } })
          }
        >
          <FlatList
            data={latestResults}
            keyExtractor={(it) => String(it.id)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ columnGap: 12 }}
            renderItem={({ item }) => {
              const top3 = item.podium?.slice(0, 3) || [];
              const date = new Date(item.occurredAt);
              return (
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/racing/result/[id]",
                      params: { id: String(item.id) },
                    })
                  }
                  style={({ pressed }) => [
                    styles.resultCard,
                    pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
                  ]}
                >
                  <Image
                    source={asImageSource(item.banner)}
                    style={styles.resultImg}
                  />
                  <View style={styles.resultTextWrap}>
                    <Text style={styles.resultTitle}>{item.title}</Text>
                    <Text style={styles.resultMeta}>
                      📅 {date.toLocaleDateString()}
                    </Text>
                    {top3.length > 0 && (
                      <View style={styles.podiumWrap}>
                        {top3.map((p, i) => (
                          <View key={i} style={styles.podiumItem}>
                            <Text style={styles.podiumIcon}>
                              {p.place === 1
                                ? "🥇"
                                : p.place === 2
                                ? "🥈"
                                : "🥉"}
                            </Text>
                            <Text style={styles.podiumText}>{p.name}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                </Pressable>
              );
            }}
          />
        </Section>

        {/* 📰 Latest News */}
        <Section
          title="Latest News"
          onPress={() =>
            router.push({ pathname: "/media", params: { tab: "News" } })
          }
        >
          <FlatList
            data={news.slice(0, 5)}
            keyExtractor={(n) => String(n._id)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ columnGap: 12 }}
            renderItem={({ item }) => <NewsCard item={item} />}
          />
        </Section>
      </ScrollView>
    </SafeScreen>
  );
}

/* ---------- Small helper section wrapper ---------- */
function Section({
  title,
  onPress,
  children,
}: {
  title: string;
  onPress: () => void;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.sectionBox}>
      <View style={styles.sectionHead}>
        <View>
          <Text style={styles.sectionTitle}>{title}</Text>
          <View style={styles.sectionUnderline} />
        </View>
        <Pressable onPress={onPress} style={styles.viewAllBtn}>
          <Text style={styles.viewAll}>View All →</Text>
        </Pressable>
      </View>
      {children}
    </View>
  );
}

/* -------------------- Styles -------------------- */
const styles = StyleSheet.create({
  heroCard: {
    width: SCREEN_W * 0.85,
    height: 220,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    elevation: 8,
    shadowColor: "#00E0C6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  heroImage: { width: "100%", height: "100%", resizeMode: "cover" },
  heroOverlay: { ...StyleSheet.absoluteFillObject },
  heroTextWrap: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 16 },
  liveBadge: {
    backgroundColor: "#00E0C6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  liveBadgeText: { color: "#000", fontSize: 10, fontWeight: "900", letterSpacing: 1 },
  heroTitle: { color: "#fff", fontSize: 22, fontWeight: "900", marginBottom: 4 },
  heroMeta: { color: "#ddd", fontSize: 13, marginBottom: 8 },
  heroCTABtn: {
    backgroundColor: "rgba(0, 224, 198, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#00E0C6",
    alignSelf: "flex-start",
  },
  heroCTA: { color: "#00E0C6", fontWeight: "800", fontSize: 14 },

  sectionBox: { marginBottom: 32 },
  sectionHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: { color: "#fff", fontSize: 22, fontWeight: "900", letterSpacing: -0.5 },
  sectionUnderline: {
    width: 40,
    height: 3,
    backgroundColor: "#00E0C6",
    borderRadius: 2,
    marginTop: 4,
  },
  viewAllBtn: {
    backgroundColor: "rgba(0, 224, 198, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  viewAll: { color: "#00E0C6", fontWeight: "700", fontSize: 13 },

  teamCard: {
    alignItems: "center",
    width: 130,
    backgroundColor: "#1a1a1a",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#222",
  },
  teamImgWrap: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#333",
  },
  teamImg: { width: 70, height: 70, borderRadius: 8 },
  teamName: { color: "#fff", fontWeight: "700", fontSize: 14, textAlign: "center" },
  memberBadge: {
    backgroundColor: "#00E0C6",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 6,
  },
  memberBadgeText: { color: "#000", fontSize: 11, fontWeight: "700" },

  playerCard: {
    alignItems: "center",
    width: 110,
    backgroundColor: "#1a1a1a",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#222",
  },
  playerImgWrap: { position: "relative", marginBottom: 8 },
  playerImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#00E0C6",
  },
  rankBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#00E0C6",
  },
  rankText: { fontSize: 12 },
  playerName: { color: "#fff", fontWeight: "700", fontSize: 13, textAlign: "center" },
  playerStats: { color: "#00E0C6", fontSize: 11, marginTop: 4, fontWeight: "600" },

  resultCard: {
    width: 260,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#222",
  },
  resultImg: { width: "100%", height: 130, resizeMode: "cover" },
  resultTextWrap: { padding: 12 },
  resultTitle: { color: "#fff", fontWeight: "800", fontSize: 16 },
  resultMeta: { color: "#999", fontSize: 12, marginTop: 4 },
  podiumWrap: { marginTop: 10, gap: 6 },
  podiumItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  podiumIcon: { fontSize: 16 },
  podiumText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },

  newsCard: {
    width: 260,
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#222",
  },
  newsImgWrap: { position: "relative" },
  newsImg: { width: "100%", height: 140, resizeMode: "cover" },
  newsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  newsContent: { padding: 12 },
  newsTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 6,
  },
  newsMeta: { color: "#999", fontSize: 12, fontWeight: "500" },
});