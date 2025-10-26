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
import YoutubePlayer from "react-native-youtube-iframe";
import { useTheme } from "../../../context/ThemeContext"; // 👈 Theme

const TABS = ["Videos", "Images", "News"] as const;
type TabKey = (typeof TABS)[number];

const { width: W } = Dimensions.get("window");
const toImg = (x?: any) => (typeof x === "string" ? { uri: x } : x);

export default function MediaScreen() {
  const { palette } = useTheme();
  const { tab: tabParam, id: newsId } = useLocalSearchParams<{
    tab?: string;
    id?: string;
  }>();

  const initialTab: TabKey = useMemo(() => {
    const t = (tabParam ?? "").toLowerCase();
    if (t.includes("news")) return "News";
    if (t.includes("image") || t.includes("photo")) return "Images";
    return "Videos";
  }, [tabParam]);

  const [tab, setTab] = useState<TabKey>(initialTab);
  const fade = useRef(new Animated.Value(1)).current;

  const [videos, setVideos] = useState<MediaVideo[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedVideo, setSelectedVideo] = useState<MediaVideo | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [albumImages, setAlbumImages] = useState<MediaImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<MediaImage | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  // Load media data
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [v, a, n] = await Promise.all([getVideos(), getAlbums(), getNews()]);
        setVideos(v);
        setAlbums(a);
        setNews(n);
      } catch (e) {
        console.warn("Media load error", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Animate fade transition between tabs
  useEffect(() => {
    Animated.sequence([
      Animated.timing(fade, { toValue: 0, duration: 120, useNativeDriver: true }),
      Animated.timing(fade, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  }, [tab]);

  // Direct news deep-link
  useEffect(() => {
    if (newsId && news.length > 0) {
      const found = news.find((n) => n._id === newsId);
      if (found) {
        setTab("News");
        setSelectedNews(found);
      }
    }
  }, [newsId, news]);

  // Open Album and fetch images
  async function openAlbum(a: Album) {
    setSelectedAlbum(a);
    try {
      const imgs = await getAlbumImages(a._id);
      setAlbumImages(imgs);
    } catch (e) {
      console.warn(e);
    }
  }

  const Empty = ({ text }: { text: string }) => (
    <View style={s.emptyWrap}>
      <Text style={[s.emptyText, { color: palette.textSecondary }]}>{text}</Text>
    </View>
  );

  return (
    <SafeScreen bg={palette.background}>
      <View style={s.header}>
        <Text style={[s.pageTitle, { color: palette.text }]}>Media</Text>
      </View>

      <SegmentedBar tabs={TABS} value={tab} onChange={setTab} />

      <Animated.View style={{ flex: 1, opacity: fade }}>
        {loading ? (
          <View style={s.loader}>
            <ActivityIndicator color={palette.accent} size="large" />
          </View>
        ) : (
          <>
            {/* ------------------ VIDEOS ------------------ */}
            {tab === "Videos" && (
              <>
                <Modal
                  visible={!!selectedVideo}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setSelectedVideo(null)}
                >
                  <Pressable
                    style={s.modalBg}
                    onPress={() => setSelectedVideo(null)}
                  >
                    <View style={s.modalInner}>
                      {selectedVideo && (
                        <YoutubePlayer
                          height={(W * 9) / 16}
                          width={W * 0.92}
                          videoId={selectedVideo.youtubeId}
                          play={true}
                        />
                      )}
                    </View>
                  </Pressable>
                </Modal>

                <FlatList
                  data={videos}
                  keyExtractor={(v) => v._id}
                  contentContainerStyle={s.scrollPad}
                  ListEmptyComponent={<Empty text="No videos yet" />}
                  renderItem={({ item }) => (
                    <Pressable
                      style={[
                        s.card,
                        { backgroundColor: palette.card, borderColor: palette.border },
                      ]}
                      onPress={() => setSelectedVideo(item)}
                    >
                      {item.thumbnail ? (
                        <Image source={toImg(item.thumbnail)} style={s.thumb} />
                      ) : (
                        <View style={[s.thumb, s.imagePh]} />
                      )}
                      <View style={s.caption}>
                        <Text style={[s.title, { color: palette.text }]}>
                          {item.title}
                        </Text>
                        {!!item.caption && (
                          <Text
                            style={[s.meta, { color: palette.textSecondary }]}
                            numberOfLines={2}
                          >
                            {item.caption}
                          </Text>
                        )}
                      </View>
                    </Pressable>
                  )}
                />
              </>
            )}

            {/* ------------------ IMAGES ------------------ */}
            {tab === "Images" && (
              <>
                {!selectedAlbum ? (
                  <FlatList
                    key={"albums"}
                    data={albums}
                    numColumns={2}
                    keyExtractor={(a) => a._id}
                    contentContainerStyle={[s.scrollPad, { paddingBottom: 100 }]}
                    ListEmptyComponent={<Empty text="No albums yet" />}
                    renderItem={({ item }) => (
                      <Pressable
                        style={[
                          s.albumCard,
                          { backgroundColor: palette.card },
                        ]}
                        onPress={() => openAlbum(item)}
                      >
                        {item.cover ? (
                          <Image source={toImg(item.cover)} style={s.albumCover} />
                        ) : (
                          <View style={[s.albumCover, s.imagePh]} />
                        )}
                        <View style={s.albumOverlay}>
                          <Text style={s.albumName}>{item.title}</Text>
                        </View>
                      </Pressable>
                    )}
                  />
                ) : (
                  <>
                    {/* Back Toolbar */}
                    <View
                      style={[
                        s.albumToolbar,
                        { backgroundColor: palette.background, borderColor: palette.border },
                      ]}
                    >
                      <Pressable
                        style={[
                          s.backButton,
                          { borderColor: palette.accent, backgroundColor: palette.accent + "22" },
                        ]}
                        onPress={() => setSelectedAlbum(null)}
                      >
                        <Text style={[s.backArrow, { color: palette.accent }]}>⟵</Text>
                        <Text style={[s.backLabel, { color: palette.text }]}>
                          Back to Albums
                        </Text>
                      </Pressable>
                      <View style={s.albumTitleWrap}>
                        <Text style={[s.albumToolbarTitle, { color: palette.text }]}>
                          {selectedAlbum.title}
                        </Text>
                      </View>
                    </View>

                    {/* Album Grid */}
                    <FlatList
                      key={`images-${selectedAlbum._id}`}
                      data={albumImages}
                      keyExtractor={(i) => i._id}
                      numColumns={3}
                      columnWrapperStyle={{ gap: 6 }}
                      contentContainerStyle={{
                        gap: 6,
                        marginTop: 10,
                        padding: 12,
                      }}
                      ListEmptyComponent={<Empty text="No images yet" />}
                      renderItem={({ item }) => (
                        <Pressable
                          onPress={() => setSelectedImage(item)}
                          style={s.imgTile}
                        >
                          <Image source={toImg(item.src)} style={s.img} />
                          <View style={s.photoShade} />
                        </Pressable>
                      )}
                    />
                  </>
                )}

                {/* Full-Screen Image Modal */}
                <Modal
                  visible={!!selectedImage}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setSelectedImage(null)}
                >
                  <Pressable
                    style={s.modalBg}
                    onPress={() => setSelectedImage(null)}
                  >
                    {selectedImage && (
                      <View style={s.modalInner}>
                        <Image
                          source={toImg(selectedImage.src)}
                          style={s.modalImg}
                        />
                        {!!selectedImage.caption && (
                          <Text style={[s.modalCap, { color: palette.text }]}>
                            {selectedImage.caption}
                          </Text>
                        )}
                      </View>
                    )}
                  </Pressable>
                </Modal>
              </>
            )}

            {/* ------------------ NEWS ------------------ */}
            {tab === "News" && (
              <>
                {!selectedNews ? (
                  <FlatList
                    data={news}
                    keyExtractor={(n) => n._id}
                    contentContainerStyle={s.scrollPad}
                    ListEmptyComponent={<Empty text="No news available" />}
                    renderItem={({ item }) => (
                      <Pressable
                        style={[
                          s.newsCard,
                          { backgroundColor: palette.card, borderColor: palette.border },
                        ]}
                        onPress={() => setSelectedNews(item)}
                      >
                        {item.banner ? (
                          <Image source={toImg(item.banner)} style={s.newsImg} />
                        ) : (
                          <View style={[s.newsImg, s.imagePh]} />
                        )}
                        <View style={s.newsText}>
                          <Text style={[s.title, { color: palette.text }]}>
                            {item.title}
                          </Text>
                          {!!item.excerpt && (
                            <Text
                              numberOfLines={2}
                              style={[s.meta, { color: palette.textSecondary }]}
                            >
                              {item.excerpt}
                            </Text>
                          )}
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
                      <Pressable
                        style={[
                          s.backButtonNews,
                          { borderColor: palette.accent, backgroundColor: palette.accent + "22" },
                        ]}
                        onPress={() => setSelectedNews(null)}
                      >
                        <Text style={[s.backArrow, { color: palette.accent }]}>⟵</Text>
                        <Text style={[s.backLabel, { color: palette.text }]}>
                          Back to News
                        </Text>
                      </Pressable>
                    }
                    renderItem={({ item }) => (
                      <View>
                        {item.banner ? (
                          <Image source={toImg(item.banner)} style={s.newsHero} />
                        ) : (
                          <View style={[s.newsHero, s.imagePh]} />
                        )}
                        <Text style={[s.newsTitle, { color: palette.text }]}>
                          {item.title}
                        </Text>
                        <Text style={[s.newsBody, { color: palette.textSecondary }]}>
                          {item.body ||
                            item.excerpt ||
                            "Full article coming soon..."}
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

/* -------------------- Styles -------------------- */
const s = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  pageTitle: { fontSize: 22, fontWeight: "900" },
  scrollPad: { padding: 12, paddingBottom: 80 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyWrap: { flex: 1, alignItems: "center", paddingTop: 80 },
  emptyText: { fontSize: 16, fontWeight: "600" },

  /* Video Cards */
  card: { flexDirection: "row", marginVertical: 8, borderWidth: 1, borderRadius: 12 },
  thumb: { width: 120, height: 80 },
  caption: { flex: 1, padding: 10 },
  title: { fontWeight: "800" },
  meta: { fontSize: 13 },

  /* Albums */
  albumCard: { width: "47%", aspectRatio: 1.2, marginHorizontal: "1.5%", marginBottom: 14, borderRadius: 16, overflow: "hidden", elevation: 3 },
  albumCover: { width: "100%", height: "100%", resizeMode: "cover" },
  albumOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "flex-end", padding: 10 },
  albumName: { color: "#fff", fontWeight: "800", fontSize: 15, textShadowColor: "rgba(0,0,0,0.6)", textShadowRadius: 6 },

  albumToolbar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, paddingHorizontal: 14, paddingVertical: 10 },
  backButton: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  backArrow: { fontSize: 18, marginRight: 6 },
  backLabel: { fontWeight: "700" },
  albumTitleWrap: { flex: 1, alignItems: "center" },
  albumToolbarTitle: { fontWeight: "900", fontSize: 16 },

  imgTile: { flex: 1 / 3, borderRadius: 10, overflow: "hidden" },
  img: { width: "100%", height: 120 },
  photoShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.1)" },

  modalBg: { flex: 1, backgroundColor: "rgba(0,0,0,0.95)", justifyContent: "center", alignItems: "center" },
  modalInner: { width: "100%", alignItems: "center" },
  modalImg: { width: "90%", height: "70%", resizeMode: "contain", borderRadius: 10 },
  modalCap: { marginTop: 10, textAlign: "center" },

  backButtonNews: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, alignSelf: "flex-start", marginBottom: 10 },

  newsCard: { marginBottom: 12, borderRadius: 12, overflow: "hidden", borderWidth: 1 },
  newsImg: { width: "100%", height: 150 },
  newsText: { padding: 10 },
  newsHero: { width: "100%", height: 220, borderRadius: 10, marginBottom: 12 },
  imagePh: { backgroundColor: "#222", borderWidth: 1, borderColor: "#2f2f2f" },
  newsTitle: { fontWeight: "900", fontSize: 18, marginBottom: 6 },
  newsBody: { lineHeight: 22 },
});
