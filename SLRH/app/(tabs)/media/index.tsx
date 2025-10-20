import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Animated,
  Modal,
  Dimensions,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import SafeScreen from "../../../components/SafeScreen";
import SegmentedBar from "../../../components/SegmentedBar";
import {
  getVideos,
  getAlbums,
  getAlbumImages,
  getNews,
  type MediaVideo,
  type Album,
  type MediaImage,
  type NewsItem,
} from "../../data/media";
import { useLocalSearchParams } from "expo-router";

/* ---------------- Tabs ---------------- */
const TABS = ["Videos", "Images", "News"] as const;
type TabKey = (typeof TABS)[number];

/* Helper: map any incoming string to a valid tab */
function normalizeTab(input?: string): TabKey {
  const t = (input ?? "").toString().trim().toLowerCase();
  if (t.startsWith("new")) return "News";
  if (t.startsWith("img") || t.startsWith("pho")) return "Images";
  return "Videos";
}

const { width: W } = Dimensions.get("window");

/* Helper to ensure valid Image source */
const toImageSrc = (src?: string | any) =>
  typeof src === "string" ? { uri: src } : src;

export default function MediaScreen() {
  const { tab: tabParam } = useLocalSearchParams<{ tab?: string }>();

  // initialize from URL param on first render
  const initialTab = useMemo<TabKey>(() => normalizeTab(tabParam), [tabParam]);
  const [tab, setTab] = useState<TabKey>(initialTab);

  // also react to param changes while mounted
  useEffect(() => {
    setTab(normalizeTab(tabParam));
  }, [tabParam]);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const [videos, setVideos] = useState<MediaVideo[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedVideo, setSelectedVideo] = useState<MediaVideo | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [albumImages, setAlbumImages] = useState<MediaImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<MediaImage | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setVideos(await getVideos());
        setAlbums(await getAlbums());
        setNews(await getNews());
      } catch (err) {
        console.warn("Media load error", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function switchTab(next: TabKey) {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 120, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    setTab(next);
    setSelectedAlbum(null);
    setSelectedImage(null);
    setSelectedNews(null);
    setSelectedVideo(null);
  }

  async function openAlbum(a: Album) {
    setSelectedAlbum(a);
    // If your getAlbumImages does not accept an id, change to: await getAlbumImages()
    setAlbumImages(await getAlbumImages(a._id as any));
  }

  const Empty = ({ text }: { text: string }) => (
    <View style={s.emptyWrap}>
      <Text style={s.emptyText}>{text}</Text>
    </View>
  );

  return (
    <SafeScreen bg="#0b0b0b">
      <View style={s.header}>
        <Text style={s.pageTitle}>Media Hub</Text>
      </View>

      <SegmentedBar tabs={TABS} value={tab} onChange={switchTab} />

      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {loading ? (
          <View style={s.loader}>
            <ActivityIndicator color="#00E0C6" size="large" />
          </View>
        ) : (
          <>
            {/* -------------------- VIDEOS -------------------- */}
            {tab === "Videos" && (
              <>
                {selectedVideo && (
                  <Modal
                    visible
                    transparent
                    animationType="fade"
                    onRequestClose={() => setSelectedVideo(null)}
                  >
                    <Pressable style={s.modalBg} onPress={() => setSelectedVideo(null)}>
                      <Video
                        source={{ uri: selectedVideo.source }}
                        style={s.modalVideo}
                        useNativeControls
                        resizeMode={ResizeMode.CONTAIN}
                        shouldPlay
                      />
                    </Pressable>
                  </Modal>
                )}
                <FlatList
                  data={videos}
                  keyExtractor={(v) => v._id}
                  contentContainerStyle={s.scrollPad}
                  ListEmptyComponent={<Empty text="No videos yet" />}
                  renderItem={({ item }) => (
                    <Pressable style={s.card} onPress={() => setSelectedVideo(item)}>
                      <Image source={toImageSrc(item.thumbnail)} style={s.thumb} />
                      <View style={s.caption}>
                        <Text style={s.title}>{item.title}</Text>
                        {!!item.duration && <Text style={s.meta}>{item.duration}</Text>}
                      </View>
                    </Pressable>
                  )}
                />
              </>
            )}

            {/* -------------------- IMAGES -------------------- */}
            {tab === "Images" && (
              <>
                {!selectedAlbum ? (
                  <FlatList
                    data={albums}
                    numColumns={2}
                    keyExtractor={(a) => a._id}
                    contentContainerStyle={[s.scrollPad, { justifyContent: "center" }]}
                    ListEmptyComponent={<Empty text="No albums yet" />}
                    renderItem={({ item }) => (
                      <Pressable key={item._id} style={s.album} onPress={() => openAlbum(item)}>
                        <Image source={toImageSrc(item.cover)} style={s.albumImg} />
                        <View style={s.overlay} />
                        <Text style={s.albumTitle}>{item.title}</Text>
                      </Pressable>
                    )}
                  />
                ) : (
                  <FlatList
                    data={albumImages}
                    numColumns={3}
                    keyExtractor={(i) => i._id}
                    columnWrapperStyle={{ gap: 6 }}
                    contentContainerStyle={{ gap: 6, marginTop: 8, padding: 12 }}
                    ListHeaderComponent={
                      <Pressable onPress={() => setSelectedAlbum(null)}>
                        <Text style={s.back}>← Back to Albums</Text>
                      </Pressable>
                    }
                    renderItem={({ item }) => (
                      <Pressable onPress={() => setSelectedImage(item)} style={s.imgTile}>
                        <Image source={toImageSrc(item.src)} style={s.img} />
                      </Pressable>
                    )}
                  />
                )}
                <Modal
                  visible={!!selectedImage}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setSelectedImage(null)}
                >
                  <Pressable style={s.modalBg} onPress={() => setSelectedImage(null)}>
                    {selectedImage && (
                      <>
                        <Image source={toImageSrc(selectedImage.src)} style={s.modalImg} />
                        {selectedImage?.caption && <Text style={s.modalCap}>{selectedImage.caption}</Text>}
                      </>
                    )}
                  </Pressable>
                </Modal>
              </>
            )}

            {/* -------------------- NEWS -------------------- */}
            {tab === "News" && (
              <>
                {!selectedNews ? (
                  <FlatList
                    data={news}
                    keyExtractor={(n) => n._id}
                    contentContainerStyle={s.scrollPad}
                    ListEmptyComponent={<Empty text="No news available" />}
                    renderItem={({ item }) => (
                      <Pressable key={item._id} style={s.newsCard} onPress={() => setSelectedNews(item)}>
                        <Image source={toImageSrc(item.banner)} style={s.newsImg} />
                        <View style={s.newsText}>
                          <Text style={s.title}>{item.title}</Text>
                          <Text numberOfLines={2} style={s.meta}>{item.excerpt}</Text>
                        </View>
                      </Pressable>
                    )}
                  />
                ) : (
                  <FlatList
                    data={[selectedNews]}
                    keyExtractor={(n) => n._id}
                    contentContainerStyle={s.scrollPad}
                    ListHeaderComponent={
                      <Pressable onPress={() => setSelectedNews(null)}>
                        <Text style={s.back}>← Back to News</Text>
                      </Pressable>
                    }
                    renderItem={({ item }) => (
                      <View>
                        <Image source={toImageSrc(item.banner)} style={s.newsHero} />
                        <Text style={s.newsTitle}>{item.title}</Text>
                        <Text style={s.newsBody}>
                          {item.excerpt ?? "Full article coming soon..."}
                        </Text>
                      </View>
                    )}
                  />
                )}
              </>
            )}
          </>
        )}
      </Animated.View>
    </SafeScreen>
  );
}

/* -------------------- STYLES -------------------- */
const s = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  pageTitle: { color: "#EFFFFB", fontSize: 22, fontWeight: "900" },
  scrollPad: { padding: 12, paddingBottom: 80 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyWrap: { flex: 1, alignItems: "center", paddingTop: 80 },
  emptyText: { color: "#8ecac1", fontSize: 16, fontWeight: "600" },
  card: { flexDirection: "row", marginVertical: 8, backgroundColor: "#101522", borderRadius: 12, overflow: "hidden" },
  thumb: { width: 120, height: 80 },
  caption: { flex: 1, padding: 10 },
  title: { color: "#fff", fontWeight: "800" },
  meta: { color: "#9aa" },
  album: { width: W / 2.3, height: 150, borderRadius: 12, overflow: "hidden", marginBottom: 8 },
  albumImg: { width: "100%", height: "100%" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.25)" },
  albumTitle: { position: "absolute", bottom: 8, left: 10, color: "#fff", fontWeight: "800" },
  imgTile: { flex: 1 / 3, borderRadius: 10, overflow: "hidden" },
  img: { width: "100%", height: 120 },
  modalBg: { flex: 1, backgroundColor: "rgba(0,0,0,0.95)", justifyContent: "center", alignItems: "center" },
  modalImg: { width: "90%", height: "70%", resizeMode: "contain", borderRadius: 10 },
  modalCap: { color: "#cfe", marginTop: 10, textAlign: "center" },
  modalVideo: { width: "90%", height: (W * 0.9 * 9) / 16, borderRadius: 10 },
  back: { color: "#00E0C6", marginBottom: 8, fontWeight: "700" },
  newsCard: { marginBottom: 12, borderRadius: 12, overflow: "hidden", backgroundColor: "#101522" },
  newsImg: { width: "100%", height: 150 },
  newsText: { padding: 10 },
  newsHero: { width: "100%", height: 220, borderRadius: 10, marginBottom: 12 },
  newsTitle: { color: "#fff", fontWeight: "900", fontSize: 18, marginBottom: 6 },
  newsBody: { color: "#cfe", lineHeight: 22 },
});
