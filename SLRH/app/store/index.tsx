import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../../components/TopBar";
import { useCart } from "../../context/CartContext";
import { useLocalSearchParams, useRouter } from "expo-router";

const BASE = process.env.EXPO_PUBLIC_API_URL ?? "http://10.0.2.2:3001";

type Product = {
  _id: string;
  title: string;
  price: number;
  image?: string;
  description?: string;
  quantity: number;
  rating?: number;
  category?: string;
};

export default function ProductScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorText, setErrorText] = useState<string>("");

  async function load() {
    if (!id) return;
    try {
      setLoading(true);
      setErrorText("");
      const res = await fetch(`${BASE}/api/v1/products/${id}`);
      if (!res.ok) {
        const msg = `Failed to load product (${res.status})`;
        setErrorText(msg);
        setProduct(null);
        return;
      }
      const j = (await res.json()) as { item?: Product };
      if (!j?.item) {
        setErrorText("Product not found.");
        setProduct(null);
        return;
      }
      setProduct(j.item);
    } catch (e) {
      setErrorText("Network error loading product.");
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  const renderStars = (rating?: number) => {
    const r = Math.max(0, Math.min(5, Math.floor(rating ?? 0)));
    return (
      <Text style={{ color: "#FFD700", fontSize: 13, fontWeight: "700" }}>
        {"★".repeat(r)}
        {"☆".repeat(5 - r)} {rating ? rating.toFixed(1) : "4.5"}
      </Text>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={s.safe}>
        <TopBar
          title="Product"
          showBack
          showMenu={false}
          showSearch={false}
          showProfile={false}
          onBackPress={() => router.canGoBack() ? router.back() : router.replace("/store")}
        />
        <View style={s.center}>
          <ActivityIndicator color="#00E0C6" size="large" />
          <Text style={{ color: "#9ca3af", marginTop: 10 }}>Loading…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={s.safe}>
        <TopBar
          title="Product"
          showBack
          showMenu={false}
          showSearch={false}
          showProfile={false}
          onBackPress={() => router.canGoBack() ? router.back() : router.replace("/store")}
        />
        <View style={s.center}>
          <Text style={{ color: "#e5e7eb", fontWeight: "800", fontSize: 16 }}>
            {errorText || "Product not found."}
          </Text>
          <Pressable style={[s.addBtn, { marginTop: 16 }]} onPress={() => router.replace("/store")}>
            <Text style={s.addText}>Back to Store</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const outOfStock = product.quantity <= 0;

  return (
    <SafeAreaView style={s.safe}>
      <TopBar
        title="SLRH Store"
        showBack
        showMenu={false}
        showSearch={false}
        showProfile={false}
        onBackPress={() => router.canGoBack() ? router.back() : router.replace("/store")}
      />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Image
          source={{ uri: product.image || "https://via.placeholder.com/800x600?text=SLRH" }}
          style={s.hero}
        />

        <View style={[s.rowBetween, { marginTop: 12 }]}>
          <Text style={s.title}>{product.title}</Text>
          {renderStars(product.rating)}
        </View>

        <Text style={s.price}>Rs. {product.price.toLocaleString()}</Text>
        <Text
          style={{
            color: outOfStock ? "#FF6347" : "#7CFC00",
            fontSize: 12,
            marginTop: 6,
          }}
        >
          {outOfStock ? "Out of Stock" : `In Stock (${product.quantity})`}
        </Text>

        {product.description ? (
          <Text style={s.desc}>{product.description}</Text>
        ) : null}

        <View style={{ marginTop: 18, gap: 10 }}>
          <Pressable
            style={[s.addBtn, outOfStock && { backgroundColor: "#333" }]}
            disabled={outOfStock}
            onPress={() =>
              addToCart({
                id: product._id,
                title: product.title,
                price: product.price,
                image: product.image,
                rating: product.rating ?? 0,
              })
            }
          >
            <Text style={[s.addText, outOfStock && { color: "#888" }]}>
              {outOfStock ? "Out of Stock" : "Add to Cart"}
            </Text>
          </Pressable>

          <Pressable
            style={[s.buyNowBtn, outOfStock && { backgroundColor: "#333" }]}
            disabled={outOfStock}
            onPress={() => router.push("/checkout")}
          >
            <Text style={[s.buyNowText, outOfStock && { color: "#888" }]}>
              Buy Now
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0b0b0b" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  hero: { width: "100%", height: 280, borderRadius: 12, backgroundColor: "#151515" },
  title: { color: "#fff", fontSize: 22, fontWeight: "800", flex: 1, paddingRight: 10 },
  price: { color: "#00E0C6", fontWeight: "800", fontSize: 18, marginTop: 6 },
  desc: { color: "#b8c0c7", fontSize: 14, lineHeight: 20, marginTop: 10 },
  addBtn: {
    backgroundColor: "#00E0C6",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  addText: { color: "#0b0b0b", fontWeight: "900", fontSize: 16 },
  buyNowBtn: {
    backgroundColor: "#ff3333",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  buyNowText: { color: "#fff", fontWeight: "900", fontSize: 16 },
});
