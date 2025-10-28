import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import SegmentedBar from "../../components/SegmentedBar";
import BottomCartBar from "../../components/BottomCartBar";

/* -------------------- Types -------------------- */
type StoreItem = {
  _id: string;
  title: string;
  price: number;
  image?: string;
  category?: string;
  rating?: number;
  quantity: number;
  eventName?: string;
  eventDate?: string;
  venue?: string;
};

/* -------------------- Base URL Logic -------------------- */
const PROD_URL = "https://slrh-4cql.vercel.app/api/v1/products";
const LOCAL_URL_ANDROID = "http://10.0.2.2:3001/api/v1/products";
const LOCAL_URL_IOS = "http://localhost:3001/api/v1/products";

// Choose base dynamically
const BASE_URL =
  __DEV__
    ? Platform.OS === "android"
      ? LOCAL_URL_ANDROID
      : LOCAL_URL_IOS
    : PROD_URL;

console.log("🌍 Using Product API URL:", BASE_URL);

/* -------------------- Tabs -------------------- */
const TABS = ["Products", "Tickets"] as const;
type TabKey = (typeof TABS)[number];

/* -------------------- Component -------------------- */
export default function StoreScreen() {
  const { palette } = useTheme();
  const router = useRouter();

  const [items, setItems] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<TabKey>("Products");

  /* -------------------- Fetch Products -------------------- */
  useEffect(() => {
    (async () => {
      try {
        console.log("🛰️ Fetching:", BASE_URL);
        const res = await fetch(BASE_URL);
        console.log("🔍 Status:", res.status);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const j = await res.json();
        console.log("🧾 API Response:", j);

        if (Array.isArray(j.items)) {
          setItems(j.items);
        } else {
          throw new Error("Invalid data format (missing 'items' array)");
        }
      } catch (e: any) {
        console.error("❌ Error fetching products:", e);
        setError(
          e?.message?.includes("Network")
            ? "Network error. Please check your internet connection."
            : "Unable to load products. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* -------------------- Tabs Split -------------------- */
  const { current } = useMemo(() => {
    const isTicket = (c?: string) => (c || "").toLowerCase().includes("ticket");
    const productItems = items.filter((it) => !isTicket(it.category));
    const ticketItems = items.filter((it) => isTicket(it.category));
    return { current: tab === "Products" ? productItems : ticketItems };
  }, [items, tab]);

  /* -------------------- States: Loading & Error -------------------- */
  if (loading) {
    return (
      <SafeAreaView
        style={[s.safe, { backgroundColor: palette.background }]}
        edges={["top", "bottom"]}
      >
        <View style={s.center}>
          <ActivityIndicator color={palette.accent} size="large" />
          <Text style={[s.subText, { color: palette.textSecondary, marginTop: 10 }]}>
            Loading…
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={[s.safe, { backgroundColor: palette.background }]}
        edges={["top", "bottom"]}
      >
        <View style={s.center}>
          <Text style={[s.errorText, { color: "#ff6666" }]}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  /* -------------------- Main UI -------------------- */
  return (
    <SafeAreaView
      style={[s.safe, { backgroundColor: palette.background }]}
      edges={["top", "bottom"]}
    >
      <ScrollView
        contentContainerStyle={s.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Tabs */}
        <SegmentedBar tabs={TABS} value={tab} onChange={setTab} />

        {/* Section Title */}
        <Text style={[s.header, { color: palette.text }]}>
          {tab === "Products" ? "Available Products" : "Event Tickets"}
        </Text>

        {/* Empty State */}
        {current.length === 0 ? (
          <View style={[s.center, { paddingVertical: 40 }]}>
            <Text style={[s.subText, { color: palette.textSecondary }]}>
              {tab === "Products"
                ? "No products available"
                : "No tickets available"}
            </Text>
          </View>
        ) : (
          <View style={s.grid}>
            {current.map((p) => (
              <Pressable
                key={p._id}
                style={[
                  s.card,
                  { backgroundColor: palette.card, borderColor: palette.border },
                ]}
                onPress={() => router.push(`/store/${p._id}`)}
              >
                <Image
                  source={{
                    uri: p.image || "https://via.placeholder.com/400x400?text=SLRH",
                  }}
                  style={s.image}
                />

                {/* Ticket badge */}
                {tab === "Tickets" && (
                  <View
                    style={[
                      s.badge,
                      {
                        backgroundColor: palette.accent + "22",
                        borderColor: palette.accent,
                      },
                    ]}
                  >
                    <Text style={[s.badgeText, { color: palette.accent }]}>
                      TICKET
                    </Text>
                  </View>
                )}

                <Text style={[s.title, { color: palette.text }]} numberOfLines={2}>
                  {p.title}
                </Text>

                {/* Event Info */}
                {tab === "Tickets" && (p.eventName || p.eventDate || p.venue) ? (
                  <Text
                    style={[s.meta, { color: palette.textSecondary }]}
                    numberOfLines={2}
                  >
                    {p.eventName ? `${p.eventName} • ` : ""}
                    {p.eventDate ? new Date(p.eventDate).toLocaleDateString() : ""}
                    {p.venue ? ` • ${p.venue}` : ""}
                  </Text>
                ) : null}

                <Text style={[s.price, { color: palette.accent }]}>
                  Rs. {p.price.toLocaleString()}
                </Text>

                <Text
                  style={[
                    s.stock,
                    { color: p.quantity > 0 ? palette.textSecondary : "#ff7777" },
                  ]}
                >
                  {p.quantity > 0 ? "🟢 In stock" : "🔴 Out of stock"}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Bottom Cart Summary */}
      <BottomCartBar />
    </SafeAreaView>
  );
}

/* -------------------- Styles -------------------- */
const s = StyleSheet.create({
  safe: { flex: 1, marginTop: -50 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  container: { padding: 16 },
  header: {
    fontSize: 18,
    fontWeight: "900",
    marginTop: 8,
    marginBottom: 12,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  card: {
    width: "47%",
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: 140,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: { fontSize: 10, fontWeight: "900" },
  title: { fontSize: 15, fontWeight: "700", marginTop: 6, paddingHorizontal: 6 },
  meta: { fontSize: 12, marginTop: 2, paddingHorizontal: 6 },
  price: { fontWeight: "900", marginTop: 6, paddingHorizontal: 6 },
  stock: { fontSize: 12, padding: 6, marginBottom: 4 },
  subText: { fontSize: 14, fontWeight: "600" },
  errorText: { fontSize: 14, fontWeight: "700", textAlign: "center" },
});
