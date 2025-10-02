import { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  Dimensions,
  ImageSourcePropType,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";
import SafeScreen from "../../../components/SafeScreen";
import TopBar from "../../../components/TopBar";
import { getMediaData } from "../../data/media";
import type { MediaImage, MediaVideo } from "../../data/media";
import type { NewsItem } from "../../data/home";

const W = Dimensions.get("window").width;
const PAD = 14;
const CARD_W = Math.max(300, W - PAD * 2);

type TabKey = "Videos" | "Images" | "News";

const asSrc = (s?: string | ImageSourcePropType) =>
  typeof s === "string" ? { uri: s } : (s as ImageSourcePropType);

export default function MediaScreen() {
  const [tab, setTab] = useState<TabKey>("Videos");
  const { videos, images, news } = useMemo(() => getMediaData(), []);
  const tabs: TabKey[] = ["Videos", "Images", "News"];

  return (
    <SafeScreen bg="#0b0b0b">
      <TopBar title="Media" />

      {/* Tab switcher */}
      <View style={styles.tabsWrap}>
        <View style={styles.tabs}>
          {tabs.map((t) => {
            const active = tab === t;
            return (
              <Pressable key={t} onPress={() => setTab(t)} style={[styles.tabBtn, active && styles.tabBtnActive]}>
                <Text style={[styles.tabText, active && styles.tabTextActive]}>{t}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* CONTENT */}
      {tab === "Videos" && <VideosView videos={videos} />}
      {tab === "Images" && <ImagesView images={images} />}
      {tab === "News" && <NewsView news={news} />}
    </SafeScreen>
  );
}

/* --------------------- Videos --------------------- */
function VideosView({ videos }: { videos: MediaVideo[] }) {
  // horizontal featured rail
  return (
    <ScrollView contentContainerStyle={{ padding: PAD, paddingBottom: 88 }}>
      <Text style={styles.sectionTitle}>🎬 Featured</Text>
      <FlatList
        data={videos.slice(0, 10)}
        keyExtractor={(it) => String(it._id)}
        renderItem={({ item }) => <VideoCard item={item} width={CARD_W} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ columnGap: PAD, paddingRight: PAD }}
        snapToInterval={CARD_W + PAD}
        decelerationRate="fast"
        snapToAlignment="start"
        style={{ marginBottom: 14 }}
      />

      <Text style={styles.sectionTitle}>All Videos</Text>
      <View style={{ gap: 12 }}>
        {videos.map((v) => (
          <VideoRow key={v._id} item={v} />
        ))}
      </View>
    </ScrollView>
  );
}

function VideoCard({ item, width }: { item: MediaVideo; width: number }) {
  return (
    <View style={[styles.videoCard, { width }]}>
      <Image source={asSrc(item.thumbnail)} style={styles.videoImg} />
      <View style={styles.playOverlay}>
        <Text style={styles.playSymbol}>▶</Text>
      </View>
      <View style={styles.videoMeta}>
        <Text style={styles.videoTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.videoSub}>{item.duration ?? ""}</Text>
      </View>
      {/* Link to a player page if you add one later */}
    </View>
  );
}

function VideoRow({ item }: { item: MediaVideo }) {
  return (
    <View style={styles.videoRow}>
      <Image source={asSrc(item.thumbnail)} style={styles.videoRowImg} />
      <View style={{ flex: 1 }}>
        <Text style={styles.videoRowTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.videoRowSub} numberOfLines={1}>
          {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : ""} {item.duration ? ` · ${item.duration}` : ""}
        </Text>
      </View>
      <Pressable style={styles.rowPlay}><Text style={{ color: "#fff", fontWeight: "800" }}>▶</Text></Pressable>
    </View>
  );
}

/* --------------------- Images --------------------- */
function ImagesView({ images }: { images: MediaImage[] }) {
  // simple 2-column grid
  const size = Math.floor((W - PAD * 3) / 2); // 2 columns with gaps and side padding
  return (
    <FlatList
      data={images}
      keyExtractor={(it) => String(it._id)}
      numColumns={2}
      contentContainerStyle={{ padding: PAD, paddingBottom: 88, rowGap: PAD, columnGap: PAD }}
      renderItem={({ item }) => (
        <View style={[styles.imageTile, { width: size, height: size }]}>
          <Image source={asSrc(item.src)} style={{ width: "100%", height: "100%" }} />
          <View style={styles.imageShade} />
          <Text style={styles.imageCaption} numberOfLines={2}>{item.caption || ""}</Text>
        </View>
      )}
    />
  );
}

/* --------------------- News --------------------- */
function NewsView({ news }: { news: NewsItem[] }) {
  return (
    <ScrollView contentContainerStyle={{ padding: PAD, paddingBottom: 88 }}>
      <FlatList
        data={news}
        keyExtractor={(it) => String(it._id)}
        renderItem={({ item }) => <NewsCard item={item} width={CARD_W} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ columnGap: PAD, paddingRight: PAD }}
        snapToInterval={CARD_W + PAD}
        decelerationRate="fast"
        snapToAlignment="start"
        ListHeaderComponent={<Text style={[styles.sectionTitle, { marginBottom: 8 }]}>Latest News</Text>}
      />

      <View style={{ height: 12 }} />

      {news.slice(0, 20).map((n) => (
        <Link key={n._id} href="/media" asChild>
          <Pressable style={styles.newsRow}>
            <Image source={asSrc(n.banner || n.image)} style={styles.newsRowImg} />
            <View style={{ flex: 1 }}>
              <Text style={styles.newsRowTitle} numberOfLines={2}>{n.title}</Text>
              <Text style={styles.newsRowSub} numberOfLines={1}>
                {n.publishedAt ? new Date(n.publishedAt).toLocaleDateString() : ""}
                {n.category ? `  •  ${n.category}` : ""}
              </Text>
            </View>
          </Pressable>
        </Link>
      ))}
    </ScrollView>
  );
}

function NewsCard({ item, width }: { item: NewsItem; width: number }) {
  const when = item.publishedAt || item.createdAt;
  const dt = when ? new Date(when) : undefined;
  return (
    <View style={[styles.newsCard, { width }]}>
      <View style={styles.newsImgWrap}>
        <Image source={asSrc(item.banner || item.image)} style={styles.newsImg} />
        <View style={styles.imgOverlay} />
        <View style={styles.newsHead}>
          <Text style={styles.newsTitle} numberOfLines={1}>{item.title}</Text>
          <View style={styles.newsMetaRow}>
            <Text style={styles.newsMeta}>📅 {dt ? dt.toLocaleDateString() : ""}</Text>
            {!!item.category && <View style={styles.newsBadge}><Text style={styles.newsBadgeText}>{item.category}</Text></View>}
          </View>
        </View>
      </View>
      <View style={styles.newsFoot}>
        <Text style={styles.newsExcerpt} numberOfLines={2}>{item.excerpt || ""}</Text>
      </View>
    </View>
  );
}

/* --------------------- styles --------------------- */
const styles = StyleSheet.create({
  tabsWrap: { paddingHorizontal: PAD, paddingTop: 8, paddingBottom: 4, backgroundColor: "#0b0b0b" },
  tabs: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  tabBtnActive: { backgroundColor: "#1f1f1f" },
  tabText: { color: "#a9a9a9", fontWeight: "700" },
  tabTextActive: { color: "#00E0C6" },

  sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "900", marginBottom: 8 },

  /* video cards */
  videoCard: { borderRadius: 16, overflow: "hidden", backgroundColor: "#151515" },
  videoImg: { width: "100%", height: 180 },
  playOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center" },
  playSymbol: {
    fontSize: 40,
    lineHeight: 40,
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 30,
  },
  videoMeta: { padding: 12 },
  videoTitle: { color: "#fff", fontWeight: "800", fontSize: 16 },
  videoSub: { color: "#cfcfcf", marginTop: 4 },

  videoRow: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 14,
    padding: 10,
    alignItems: "center",
  },
  videoRowImg: { width: 120, height: 72, borderRadius: 10, backgroundColor: "#222" },
  videoRowTitle: { color: "#fff", fontWeight: "800" },
  videoRowSub: { color: "#bdbdbd", marginTop: 4 },
  rowPlay: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#7e5bef", alignItems: "center", justifyContent: "center" },

  /* image grid */
  imageTile: { borderRadius: 14, overflow: "hidden", backgroundColor: "#111" },
  imageShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.15)" },
  imageCaption: { position: "absolute", left: 8, right: 8, bottom: 8, color: "#fff", fontWeight: "700" },

  /* news cards & rows */
  newsCard: { borderRadius: 16, overflow: "hidden", backgroundColor: "#141414" },
  newsImgWrap: { height: 170, overflow: "hidden" },
  newsImg: { width: "100%", height: "100%" },
  imgOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.25)" },
  newsHead: { position: "absolute", left: 12, right: 12, bottom: 10 },
  newsTitle: { color: "#fff", fontWeight: "900", fontSize: 18 },
  newsMetaRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 },
  newsMeta: { color: "#eaeaea" },
  newsBadge: { backgroundColor: "#1fb6ff", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  newsBadgeText: { color: "#001018", fontWeight: "900", fontSize: 12 },
  newsFoot: { paddingHorizontal: 12, paddingVertical: 12, backgroundColor: "rgba(255,255,255,0.04)" },
  newsExcerpt: { color: "#cfcfcf" },

  newsRow: { flexDirection: "row", gap: 12, alignItems: "center", backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 14, padding: 10, marginBottom: 10 },
  newsRowImg: { width: 80, height: 60, borderRadius: 10, backgroundColor: "#222" },
  newsRowTitle: { color: "#fff", fontWeight: "800" },
  newsRowSub: { color: "#bdbdbd", marginTop: 2 },
});
