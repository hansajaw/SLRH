import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import TopBar from "../../components/TopBar";
import { useCart } from "../../context/CartContext";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext"; 
import BottomCartBar from "../../components/BottomCartBar";


const BASE =
  process.env.EXPO_PUBLIC_API_URL ||
  (__DEV__ ? "http://172.20.10.4:3001" : "https://slrh-4cql.vercel.app");

type Product = {
  _id: string;
  slug?: string;
  title: string;
  price: number;
  image?: any;
  rating?: number;
  eta?: string;
  discount?: number;
  description?: string;
  category?: string;
  quantity: number;
};

const asSrc = (img: any) => (typeof img === "string" ? { uri: img } : img);
const fmt = (n: number) => `Rs. ${n.toLocaleString()}`;

export default function ProductDetail() {
  const { palette } = useTheme();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [p, setP] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  async function load() {
    if (!id) return;
    setLoading(true);
    setErrorText("");
    try {
      const res = await fetch(`${BASE}/api/v1/products/${id}`);
      if (!res.ok) {
        setErrorText(`Error ${res.status}: Unable to load product`);
        setP(null);
        return;
      }
      const j = await res.json();
      setP(j.item ?? null);
    } catch (e) {
      console.error("product load error:", e);
      setErrorText("Network error while loading product.");
      setP(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function validateAndAdd() {
    if (!p) return;
    if (p.quantity <= 0) {
      Alert.alert("Out of stock", "This item is currently unavailable.");
      return;
    }
    try {
      const res = await fetch(`${BASE}/api/v1/cart/validate-add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: p._id, qty: 1 }),
      });
      const j = await res.json();
      if (!j.ok) {
        Alert.alert(
          j.reason === "OUT_OF_STOCK" ? "Out of stock" : "Cannot add to cart",
          j.reason === "OUT_OF_STOCK"
            ? `Only ${j.stock ?? 0} left.`
            : j.reason ?? "Unknown error"
        );
        return;
      }
      addToCart({
        id: p._id,
        title: p.title,
        price: p.price,
        image: p.image,
        rating: p.rating ?? 4.6,
      });
      Alert.alert("Added to Cart", `${p.title} has been added ✅`);
    } catch (e) {
      console.error("validate-add error", e);
      Alert.alert("Error", "Unable to add to cart.");
    }
  }

  /* ---------------------- Loading ---------------------- */
  if (loading) {
    return (
      <SafeAreaView style={[s.safe, { backgroundColor: palette.background }]}>
        <View style={s.center}>
          <ActivityIndicator color={palette.accent} size="large" />
          <Text style={[s.subText, { color: palette.textSecondary, marginTop: 10 }]}>
            Loading…
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  /* ---------------------- Error ---------------------- */
  if (!p) {
    return (
      <SafeAreaView style={[s.safe, { backgroundColor: palette.background }]}>
        <View style={s.center}>
          <Text style={[s.errorText, { color: palette.text }]}>
            {errorText || "Product not found."}
          </Text>
          <Pressable
            onPress={() => router.replace("/store" as any)}
            style={[s.addBtn, { borderColor: palette.accent, marginTop: 20 }]}
          >
            <Text style={[s.addText, { color: palette.accent }]}>Back to Store</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  /* ---------------------- Product Details ---------------------- */
  const ratingRounded = Math.round(Math.min(5, Math.max(0, p.rating ?? 4.6)));
  const out = p.quantity <= 0;

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: palette.background }]}>

        <ScrollView contentContainerStyle={s.container}>
          {!!p.image && (
            <View style={{ position: "relative" }}>
              <Image source={asSrc(p.image)} style={s.image} />
              <View style={[s.gradientOverlay, { backgroundColor: palette.overlay }]} />
            </View>
          )}

          <View
            style={[
              s.card,
              { backgroundColor: palette.card, borderColor: palette.border },
            ]}
          >
            <View style={s.rowBetween}>
              <Text style={[s.title, { color: palette.text }]}>{p.title}</Text>
              <View style={s.stars}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Ionicons
                    key={i}
                    name={i < ratingRounded ? "star" : "star-outline"}
                    size={16}
                    color="#FFD700"
                    style={{ marginRight: 2 }}
                  />
                ))}
                <Text style={[s.ratingText, { color: "#FFD700" }]}>
                  {(p.rating ?? 4.6).toFixed(1)}
                </Text>
              </View>
            </View>

            <Text style={[s.price, { color: palette.accent }]}>{fmt(p.price)}</Text>

            <View style={s.metaRow}>
              <Text style={[s.badge, { color: out ? "#ef4444" : palette.accent }]}>
                {out ? "🔴 Out of stock" : "🟢 In stock"}
              </Text>
              {!out && (
                <Text style={[s.meta, { color: palette.textSecondary }]}>
                  Qty: {p.quantity}
                </Text>
              )}
              <Text style={[s.meta, { color: palette.textSecondary }]}>
                🕒 {p.eta ?? "2–5 days"}
              </Text>
              <Text style={[s.meta, { color: palette.textSecondary }]}>🚚 Delivered</Text>
            </View>

            <Text style={[s.desc, { color: palette.textSecondary }]}>
              {p.description ?? "No description."}
            </Text>

            <View style={s.btnRow}>
              <Pressable
                style={[
                  s.addBtn,
                  { borderColor: out ? palette.border : palette.accent },
                ]}
                disabled={out}
                onPress={validateAndAdd}
              >
                <Text
                  style={[
                    s.addText,
                    { color: out ? palette.textSecondary : palette.accent },
                  ]}
                >
                  {out ? "Out of Stock" : "Add to Cart"}
                </Text>
              </Pressable>

              <Pressable
                style={[
                  s.buyBtn,
                  { backgroundColor: out ? palette.border : palette.accent },
                ]}
                disabled={out}
                onPress={() => router.push("/checkout" as any)}
              >
                <Text
                  style={[
                    s.buyText,
                    { color: out ? palette.textSecondary : "#000" },
                  ]}
                >
                  Buy Now
                </Text>
              </Pressable>
            </View>
          </View>
        
        </ScrollView>
       <BottomCartBar />
    </SafeAreaView>
  );
}

/* ---------- Styles ---------- */
const s = StyleSheet.create({
  safe: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  container: { padding: 16, paddingBottom: 50 },

  image: { width: "100%", height: 250, borderRadius: 14, marginBottom: 12 },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 90,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 20, fontWeight: "900" },
  stars: { flexDirection: "row", alignItems: "center" },
  ratingText: { marginLeft: 4, fontWeight: "700" },
  price: { fontWeight: "900", fontSize: 18, marginTop: 6 },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    flexWrap: "wrap",
    gap: 8,
  },
  badge: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  meta: { fontSize: 13 },
  desc: { fontSize: 14, lineHeight: 20, marginTop: 12 },
  btnRow: { flexDirection: "row", gap: 10, marginTop: 18 },
  addBtn: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  addText: { fontWeight: "900" },
  buyBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  buyText: { fontWeight: "900" },
  subText: { fontSize: 14, fontWeight: "600" },
  errorText: { fontSize: 16, fontWeight: "800" },
});
