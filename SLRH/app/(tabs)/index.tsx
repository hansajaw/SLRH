import { useEffect, useMemo, useRef, useState } from "react";
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
  NativeScrollEvent,
  NativeSyntheticEvent,
  ImageSourcePropType,
} from "react-native";
import { Link, useRouter } from "expo-router";
import SafeScreen from "../../components/SafeScreen";
import TopBar from "../../components/TopBar";
import { getHomeData } from "../data/home";
import type { EventItem, PlayerItem, NewsItem } from "../data/home";

/* Types for results (seeded or derived) */
type ResultItem = {
  _id: string;
  slug?: string;
  title: string;
  city?: string;
  occurredAt: string;
  banner?: string | ImageSourcePropType;
  topFinishers?: Array<{ place: 1 | 2 | 3; name: string; avatar?: string | ImageSourcePropType }>;
};

/* -------------------- UI constants -------------------- */
const SP = 14;         // base spacing
const R = 16;          // radius
const BG = "#0b0b0b";
const CARD_BG = "#121212";
const BORDER = "rgba(255,255,255,0.06)";

/* -------------------- helpers -------------------- */
function toEventDate(e: EventItem): Date | undefined {
  if (e.scheduledDateTime) return new Date(e.scheduledDateTime);
  if (e.dateUtc) return new Date(e.dateUtc);
  if (e.date) {
    const d = e.date.split("T")[0];
    const t = e.startTime || "00:00";
    return new Date(`${d}T${t}:00Z`);
  }
  return undefined;
}
function fmtDateTime(d?: Date) {
  if (!d) return { date: "", time: "" };
  return {
    date: d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }),
    time: d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }),
  };
}
const asImageSource = (src?: string | ImageSourcePropType) =>
  typeof src === "string" ? { uri: src } : (src as ImageSourcePropType);

/* -------------------- countdown -------------------- */
function computeRemaining(target: Date) {
  const diff = +target - +new Date();
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { d, h, m, s };
}
function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [t, setT] = useState(() => computeRemaining(targetDate));
  useEffect(() => {
    const id = setInterval(() => setT(computeRemaining(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  const B = ({ v, label }: { v: number; label: string }) => (
    <View style={styles.countBlock}>
      <Text style={styles.countValue}>{String(v).padStart(2, "0")}</Text>
      <Text style={styles.countLabel}>{label}</Text>
    </View>
  );
  return (
    <View style={styles.countRow}>
      <B v={t.d} label="Days" />
      <B v={t.h} label="Hours" />
      <B v={t.m} label="Minutes" />
      <B v={t.s} label="Seconds" />
    </View>
  );
}

/* -------------------- hero carousel -------------------- */
const SCREEN_W = Dimensions.get("window").width;
const CARD_W = Math.max(300, SCREEN_W - SP * 2);
const HERO_W = Math.max(280, SCREEN_W - SP * 2);
const HERO_H = Math.min(260, Math.round((HERO_W * 9) / 16));
const AUTOPLAY_MS = 4000;

function HeroSlide({ event }: { event: EventItem }) {
  const id = String(event.slug ?? event._id);
  const when = toEventDate(event);
  const { date, time } = fmtDateTime(when);
  const title = event.title || event.name || "Race";
  const city = event.location?.city || event.city;
  const img = event.heroImage || event.banner || event.image;

  return (
    <View style={[styles.heroCard, { width: HERO_W, height: HERO_H }]}>
      <Image source={asImageSource(img)} style={styles.heroImage} />
      <View style={styles.heroOverlay} />
      <View style={styles.heroTextWrap}>
        <Text style={[styles.heroTitle]} numberOfLines={2}>{title}</Text>
        <Text style={styles.heroMeta}>
          {city ? `${city}  •  ` : ""}{date}{date && time ? "  ·  " : ""}{time}
        </Text>
        {when && <CountdownTimer targetDate={when} />}
        <Link href={{ pathname: "/racing/[id]", params: { id } }} asChild>
          <Pressable style={styles.heroCTA}><Text style={styles.heroCTAText}>View Event →</Text></Pressable>
        </Link>
      </View>
    </View>
  );
}

function HeroCarousel({ data }: { data: EventItem[] }) {
  const listRef = useRef<FlatList<EventItem>>(null);
  useEffect(() => {
    if (data.length <= 1) return;
    const id = setInterval(() => {
      listRef.current?.scrollToIndex({
        index: (Math.round(Date.now() / AUTOPLAY_MS) + 1) % data.length,
        animated: true,
      });
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [data.length]);

  return (
    <FlatList
      ref={listRef}
      data={data}
      keyExtractor={(it) => String(it._id)}
      renderItem={({ item }) => <HeroSlide event={item} />}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      getItemLayout={(_, i) => ({ length: HERO_W, offset: HERO_W * i, index: i })}
      style={{ height: HERO_H }}
      contentContainerStyle={{ columnGap: SP, paddingRight: SP }}
      scrollEventThrottle={16}
      nestedScrollEnabled
      decelerationRate="fast"
    />
  );
}

/* -------------------- mini event & players -------------------- */
function MiniEvent({ item }: { item: EventItem }) {
  const id = String(item.slug ?? item._id);
  const when = toEventDate(item);
  return (
    <Link href={{ pathname: "../race/[id]", params: { id } }} asChild>
      <Pressable style={styles.miniCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.miniTitle} numberOfLines={1}>{item.title || item.name}</Text>
          <Text style={styles.miniMeta} numberOfLines={1}>
            {(item.location?.city || item.city || "") + (when ? `  •  ${when.toLocaleDateString()}` : "")}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}
function PlayerCard({ player, index }: { player: PlayerItem; index: number }) {
  const profile = player.playerDoc?.profilePicture || player.profilePicture;
  const name = player.playerName || player.playerDoc?.name || "Player";
  let subtitle = "Top performer";
  if (player.playerDoc?.bestAchievement) {
    try { const j = JSON.parse(player.playerDoc.bestAchievement); subtitle = Array.isArray(j) ? j[0] : String(j); }
    catch { subtitle = player.playerDoc.bestAchievement!; }
  }
  const playerId = player.player || player.playerDoc?._id;
  return (
    <Link href={playerId ? ({ pathname: "../player/[id]", params: { id: String(playerId) } } as any) : "/"} asChild>
      <Pressable style={styles.playerCard}>
        <Image source={asImageSource(profile)} style={styles.playerImg} />
        <View style={{ marginTop: 8 }}>
          <Text style={styles.playerSubtitle} numberOfLines={1}>{subtitle}</Text>
          <Text style={styles.playerName} numberOfLines={1}>{name}</Text>
        </View>
        <View style={styles.badge}><Text style={styles.badgeText}>{index + 1}</Text></View>
      </Pressable>
    </Link>
  );
}

/* -------------------- results -------------------- */
function ResultCard({ item, cardWidth }: { item: ResultItem; cardWidth: number }) {
  const d = new Date(item.occurredAt);
  return (
    <View style={[styles.resultCard, { width: cardWidth }]}>
      <Image source={asImageSource(item.banner)} style={styles.resultImg} />
      <View style={styles.resultShade} />
      <View style={styles.resultInner}>
        <Text style={styles.resultTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.resultMeta} numberOfLines={1}>
          {item.city ? `📍 ${item.city}   ` : ""}📅 {d.toLocaleDateString()}
        </Text>
      </View>
      <Link asChild href={{ pathname: "../race/[id]", params: { id: String(item.slug ?? item._id) } }}>
        <Pressable style={StyleSheet.absoluteFill as any} />
      </Link>
    </View>
  );
}
function ResultBlock({ item, cardWidth }: { item: ResultItem; cardWidth: number }) {
  return (
    <View style={{ width: cardWidth }}>
      <ResultCard item={item} cardWidth={cardWidth} />
      {item.topFinishers?.length ? (
        <View style={{ gap: 8, marginTop: SP }}>
          {item.topFinishers.slice(0, 3).map((f) => (
            <View key={f.name + f.place} style={styles.finisherRow}>
              <Text style={{ width: 22, textAlign: "center" }}>
                {f.place === 1 ? "🥇" : f.place === 2 ? "🥈" : "🥉"}
              </Text>
              {f.avatar ? <Image source={asImageSource(f.avatar)} style={styles.finisherImg} /> :
                <View style={[styles.finisherImg, { backgroundColor: "#222" }]} />}
              <Text style={styles.finisherName} numberOfLines={1}>{f.name}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

/* -------------------- news -------------------- */
function NewsCard({ item, width }: { item: NewsItem; width: number }) {
  const d = item.publishedAt || item.createdAt;
  const when = d ? new Date(d) : undefined;
  const img = item.banner;
  return (
    <View style={[styles.newsCard, { width }]}>
      <View style={styles.newsImageWrap}>
        <Image source={asImageSource(img)} style={styles.newsImage} />
        <View style={styles.newsShade} />
        <View style={styles.newsHeader}>
          <Text style={styles.newsTitle} numberOfLines={1}>{item.title}</Text>
          <View style={styles.newsMetaRow}>
            <Text style={styles.newsMeta}>📅 {when ? when.toLocaleDateString() : ""}</Text>
            {!!item.category && <View style={styles.newsBadge}><Text style={styles.newsBadgeText}>{item.category}</Text></View>}
          </View>
        </View>
      </View>
      <View style={styles.newsFooter}>
        <Text style={styles.newsExcerpt} numberOfLines={2}>{item.excerpt || ""}</Text>
      </View>
    </View>
  );
}

/* -------------------- Section wrapper -------------------- */
function Section({ title, right, children }: { title: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <View style={styles.sectionBox}>
      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {right}
      </View>
      {children}
    </View>
  );
}

/* -------------------- Screen -------------------- */
export default function HomeTab() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [players, setPlayers] = useState<PlayerItem[]>([]);
  const [results, setResults] = useState<ResultItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const load = () => {
    setLoading(true);
    try {
      const data = getHomeData() as any;
      const evts: EventItem[] = data.events || [];
      setEvents(evts);
      setPlayers(data.players || []);
      setNews(data.news || []);

      const seeded: ResultItem[] = Array.isArray(data.results) ? data.results : [];
      const fromEvents = (list: EventItem[]): ResultItem[] =>
        list.filter((e) => !!toEventDate(e))
            .sort((a, b) => +toEventDate(b)! - +toEventDate(a)!)
            .slice(0, 5)
            .map((e): ResultItem => ({
              _id: `res-${e._id}`,
              title: e.title || (e as any).name || "Race",
              city: e.city || (e as any).location?.city,
              occurredAt: (toEventDate(e) || new Date()).toISOString(),
              banner: e.heroImage || (e as any).banner || (e as any).image,
              topFinishers: [],
            }));
      setResults(
        seeded.length
          ? seeded.slice().sort((a, b) => +new Date(b.occurredAt) - +new Date(a.occurredAt))
          : fromEvents(evts)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const upcomingSorted = useMemo(() => {
    const withDate = events.filter((e) => !!toEventDate(e)).sort((a, b) => +toEventDate(a)! - +toEventDate(b)!);
    const now = new Date();
    const future = withDate.filter((e) => +toEventDate(e)! >= +now);
    return future.length ? future : withDate.slice(-3);
  }, [events]);
  const miniUpcoming = useMemo(() => upcomingSorted.slice(1, 4), [upcomingSorted]);

  const RESULT_W = CARD_W;
  const NEWS_W = CARD_W;

  return (
    <SafeScreen bg={BG}>
      <TopBar title="Home" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: SP, paddingBottom: 88 }} // extra bottom so it clears the tab bar
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor="#fff" />}
      >
        {/* HERO */}
        <Section title=" ">
          <HeroCarousel data={upcomingSorted} />
        </Section>

        {/* Upcoming */}
        <Section
          title="📅 Upcoming Events"
          right={
            <Pressable
              onPress={() =>
                router.push({ pathname: "/racing", params: { tab: "Racing Schedule" } })
              }
            >
              <Text style={styles.viewAll}>View All →</Text>
            </Pressable>
          }
        >
          <View style={styles.card}>
            <View style={{ gap: SP }}>
              {miniUpcoming.length
                ? miniUpcoming.map((e) => <MiniEvent key={e._id} item={e} />)
                : <Text style={{ color: "#9aa" }}>Nothing to show.</Text>}
            </View>
          </View>
        </Section>

        {/* Players */}
        <Section
          title="🏆 Top Players"
          right={
            <Pressable
              onPress={() =>
                router.push({ pathname: "/people", params: { tab: "Wins" } })
              }
            >
              <Text style={styles.viewAll}>View All →</Text>
            </Pressable>
          }
        >
          <View style={styles.playersRow}>
            {players.length
              ? players.map((p, i) => <PlayerCard key={String(p.player || i)} player={p} index={i} />)
              : <Text style={{ color: "#9aa" }}>No players yet.</Text>}
          </View>
        </Section>

        {/* Results */}
        <Section
          title="🏁 Latest Race Results"
          right={
            <Pressable
              onPress={() =>
                router.push({ pathname: "/racing", params: { tab: "Results" } })
              }
            >
              <Text style={styles.viewAll}>View All →</Text>
            </Pressable>
          }
        >
          {results.length ? (
            <FlatList
              data={results.slice(0, 6)}
              keyExtractor={(it) => String(it._id)}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ columnGap: SP, paddingRight: SP }}
              snapToInterval={RESULT_W + SP}
              decelerationRate="fast"
              snapToAlignment="start"
              renderItem={({ item }) => <ResultBlock item={item} cardWidth={RESULT_W} />}
            />
          ) : (
            <Text style={{ color: "#9aa" }}>No past results yet.</Text>
          )}
        </Section>

        {/* News */}
        <Section
          title="📰 Latest News"
          right={
            <Pressable
              onPress={() =>
                router.push({ pathname: "/media", params: { tab: "news" } })
              }
            >
              <Text style={styles.viewAll}>View All →</Text>
            </Pressable>
          }
        >
          {news.length ? (
            <FlatList
              data={news.slice(0, 9)}
              keyExtractor={(it) => String(it._id)}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ columnGap: SP, paddingRight: SP }}
              snapToInterval={NEWS_W + SP}
              decelerationRate="fast"
              snapToAlignment="start"
              renderItem={({ item }) => <NewsCard item={item} width={NEWS_W} />}
            />
          ) : (
            <Text style={{ color: "#9aa" }}>No news yet.</Text>
          )}
        </Section>

      </ScrollView>
    </SafeScreen>
  );
}

/* -------------------- styles -------------------- */
const styles = StyleSheet.create({
  /* sections */
  sectionBox: {
    marginBottom: SP, // consistent gap between sections
  },
  sectionHead: {
    paddingHorizontal: 2,
    paddingVertical: 4,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "900" },
  viewAll: { color: "#00FFFC", fontWeight: "800" },

  /* hero */
  heroCard: {
    borderRadius: R,
    overflow: "hidden",
    backgroundColor: CARD_BG,
  },
  heroImage: { width: "100%", height: "100%" },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.25)" },
  heroTextWrap: {
    position: "absolute",
    left: 12, right: 12, bottom: 12,
    padding: 12, borderRadius: 12, backgroundColor: "rgba(0,0,0,0.35)",
  },
  heroTitle: { color: "#fff", fontSize: 22, fontWeight: "900" },
  heroMeta: { color: "#eaeaea", marginTop: 2, marginBottom: 8 },
  heroCTA: { alignSelf: "flex-start", paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, backgroundColor: "#7e5bef" },
  heroCTAText: { color: "#fff", fontWeight: "700" },

  /* countdown */
  countRow: { flexDirection: "row", justifyContent: "space-between", gap: 6, marginBottom: 10 },
  countBlock: { alignItems: "center", width: 62, paddingVertical: 6, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 12 },
  countValue: { color: "#fff", fontSize: 20, fontWeight: "800" },
  countLabel: { color: "#c9c9c9", fontSize: 10, marginTop: 2 },

  /* generic card */
  card: { backgroundColor: CARD_BG, borderWidth: 1, borderColor: BORDER, borderRadius: R, padding: SP },

  /* mini event */
  miniCard: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 10 },
  miniTitle: { color: "#fff", fontWeight: "700" },
  miniMeta: { color: "#bdbdbd", marginTop: 2, fontSize: 12 },

  /* players */
  playersRow: { flexDirection: "row", gap: SP },
  playerCard: { flex: 1, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 14, padding: 10, alignItems: "center", position: "relative" },
  playerImg: { width: 110, height: 140, borderRadius: 12, backgroundColor: "#0f0f0f" },
  playerSubtitle: { color: "#bdbdbd", fontSize: 12 },
  playerName: { color: "#00FFFC", fontWeight: "800", fontSize: 16, marginTop: 2 },
  badge: { position: "absolute", top: 8, right: 8, width: 26, height: 26, borderRadius: 13, backgroundColor: "#f5b800", alignItems: "center", justifyContent: "center" },
  badgeText: { fontWeight: "800" },

  /* results */
  resultCard: { height: 150, borderRadius: R, overflow: "hidden", backgroundColor: CARD_BG, marginBottom: 6 },
  resultImg: { width: "100%", height: "100%" },
  resultShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.35)" },
  resultInner: { position: "absolute", left: 12, right: 12, bottom: 12 },
  resultTitle: { color: "#fff", fontWeight: "900", fontSize: 16 },
  resultMeta: { color: "#dadada", marginTop: 2 },
  finisherRow: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 12 },
  finisherImg: { width: 28, height: 28, borderRadius: 14 },
  finisherName: { color: "#fff", fontWeight: "600", flex: 1 },

  /* news */
  newsCard: { borderRadius: R, overflow: "hidden", backgroundColor: CARD_BG },
  newsImageWrap: { height: 170, borderTopLeftRadius: R, borderTopRightRadius: R, overflow: "hidden" },
  newsImage: { width: "100%", height: "100%" },
  newsShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.25)" },
  newsHeader: { position: "absolute", left: 12, right: 12, bottom: 10 },
  newsTitle: { color: "#fff", fontWeight: "900", fontSize: 18 },
  newsMetaRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 },
  newsMeta: { color: "#eaeaea" },
  newsBadge: { backgroundColor: "#1fb6ff", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  newsBadgeText: { color: "#001018", fontWeight: "900", fontSize: 12 },
  newsFooter: { paddingHorizontal: 12, paddingVertical: 12, borderBottomLeftRadius: R, borderBottomRightRadius: R, backgroundColor: "rgba(255,255,255,0.04)" },
  newsExcerpt: { color: "#cfcfcf" },
});
