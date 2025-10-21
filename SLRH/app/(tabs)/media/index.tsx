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

const TABS = ["Videos", "Images", "News"] as const;
type TabKey = (typeof TABS)[number];

const { width: W } = Dimensions.get("window");
const toImg = (x?: any) => (typeof x === "string" ? { uri: x } : x);

export default function MediaScreen() {
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

  /* Load all media data */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [v, a, n] = await Promise.all([
          getVideos(),
          getAlbums(),
          getNews(),
        ]);
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

  /* Animate tab changes */
  useEffect(() => {
    Animated.sequence([
      Animated.timing(fade, { toValue: 0, duration: 120, useNativeDriver: true }),
      Animated.timing(fade, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  }, [tab]);

  /* Handle direct news navigation (from Home) */
  useEffect(() => {
    if (newsId && news.length > 0) {
      const found = news.find((n) => n._id === newsId);
      if (found) {
        setTab("News");
        setSelectedNews(found);
      }
    }
  }, [newsId, news]);

  /* Open Album */
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
      <Text style={s.emptyText}>{text}</Text>
    </View>
  );

  return (
    <SafeScreen bg="#0b0b0b">
      <View style={s.header}>
        <Text style={s.pageTitle}>Media</Text>
      </View>
      <SegmentedBar tabs={TABS} value={tab} onChange={setTab} />

      <Animated.View style={{ flex: 1, opacity: fade }}>
        {loading ? (
          <View style={s.loader}>
            <ActivityIndicator color="#00E0C6" size="large" />
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
                      style={s.card}
                      onPress={() => setSelectedVideo(item)}
                    >
                      {item.thumbnail ? (
                        <Image source={toImg(item.thumbnail)} style={s.thumb} />
                      ) : (
                        <View style={[s.thumb, s.imagePh]} />
                      )}
                      <View style={s.caption}>
                        <Text style={s.title} numberOfLines={2}>
                          {item.title}
                        </Text>
                        {!!item.caption && (
                          <Text style={s.meta} numberOfLines={2}>
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
                        key={item._id}
                        style={s.albumCard}
                        onPress={() => openAlbum(item)}
                      >
                        {item.cover ? (
                          <Image
                            source={toImg(item.cover)}
                            style={s.albumCover}
                          />
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
                    <View style={s.albumToolbar}>
                      <Pressable
                        style={({ pressed }) => [
                          s.backButton,
                          pressed && {
                            transform: [{ scale: 0.96 }],
                            opacity: 0.8,
                          },
                        ]}
                        onPress={() => setSelectedAlbum(null)}
                      >
                        <Text style={s.backArrow}>⟵</Text>
                        <Text style={s.backLabel}>Back to Albums</Text>
                      </Pressable>
                      <View style={s.albumTitleWrap}>
                        <Text style={s.albumToolbarTitle}>
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
                          <Text style={s.modalCap}>
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
                        key={item._id}
                        style={s.newsCard}
                        onPress={() => setSelectedNews(item)}
                      >
                        {item.banner ? (
                          <Image
                            source={toImg(item.banner)}
                            style={s.newsImg}
                          />
                        ) : (
                          <View style={[s.newsImg, s.imagePh]} />
                        )}
                        <View style={s.newsText}>
                          <Text style={s.title}>{item.title}</Text>
                          {!!item.excerpt && (
                            <Text numberOfLines={2} style={s.meta}>
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
                        style={({ pressed }) => [
                          s.backButtonNews,
                          pressed && { opacity: 0.7 },
                        ]}
                        onPress={() => setSelectedNews(null)}
                      >
                        <Text style={s.backArrow}>⟵</Text>
                        <Text style={s.backLabel}>Back to News</Text>
                      </Pressable>
                    }
                    renderItem={({ item }) => (
                      <View>
                        {item.banner ? (
                          <Image
                            source={toImg(item.banner)}
                            style={s.newsHero}
                          />
                        ) : (
                          <View style={[s.newsHero, s.imagePh]} />
                        )}
                        <Text style={s.newsTitle}>{item.title}</Text>
                        <Text style={s.newsBody}>
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

const s = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  pageTitle: { color: "#EFFFFB", fontSize: 22, fontWeight: "900" },
  scrollPad: { padding: 12, paddingBottom: 80 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyWrap: { flex: 1, alignItems: "center", paddingTop: 80 },
  emptyText: { color: "#8ecac1", fontSize: 16, fontWeight: "600" },

  /* Video Cards */
  card: {
    flexDirection: "row",
    marginVertical: 8,
    backgroundColor: "#101522",
    borderRadius: 12,
    overflow: "hidden",
  },
  thumb: { width: 120, height: 80 },
  caption: { flex: 1, padding: 10 },
  title: { color: "#fff", fontWeight: "800" },
  meta: { color: "#9aa" },

  /* Albums */
  albumCard: {
    width: "47%",
    aspectRatio: 1.2,
    marginHorizontal: "1.5%",
    marginBottom: 14,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#101522",
    elevation: 3,
  },
  albumCover: { width: "100%", height: "100%", resizeMode: "cover" },
  albumOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
    padding: 10,
  },
  albumName: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowRadius: 6,
  },

  albumToolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0e0e0e",
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 224, 198, 0.1)",
    borderWidth: 1,
    borderColor: "#00E0C6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  backArrow: { color: "#00E0C6", fontSize: 18, marginRight: 6 },
  backLabel: { color: "#fff", fontWeight: "700" },
  albumTitleWrap: { flex: 1, alignItems: "center" },
  albumToolbarTitle: { color: "#fff", fontWeight: "900", fontSize: 16 },

  imgTile: { flex: 1 / 3, borderRadius: 10, overflow: "hidden" },
  img: { width: "100%", height: 120 },
  photoShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.1)",
  },

  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalInner: { width: "100%", alignItems: "center" },
  modalImg: {
    width: "90%",
    height: "70%",
    resizeMode: "contain",
    borderRadius: 10,
  },
  modalCap: { color: "#cfe", marginTop: 10, textAlign: "center" },

  backButtonNews: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 224, 198, 0.1)",
    borderWidth: 1,
    borderColor: "#00E0C6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 10,
  },

  newsCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#101522",
  },
  newsImg: { width: "100%", height: 150 },
  newsText: { padding: 10 },
  newsHero: { width: "100%", height: 220, borderRadius: 10, marginBottom: 12 },
  imagePh: { backgroundColor: "#222", borderWidth: 1, borderColor: "#2f2f2f" },
  newsTitle: { color: "#fff", fontWeight: "900", fontSize: 18, marginBottom: 6 },
  newsBody: { color: "#cfe", lineHeight: 22 },
});
