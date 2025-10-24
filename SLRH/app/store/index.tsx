import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../../components/TopBar";
import { useRouter } from "expo-router";

const BASE = process.env.EXPO_PUBLIC_API_URL ?? "http://10.0.2.2:3001";

type Product = {
  _id: string;
  title: string;
  price: number;
  image?: string;
  category?: string;
  rating?: number;
  quantity: number;
};

export default function StoreScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BASE}/api/v1/products`);
        const text = await res.text();
        console.log("Products response:", text);
        const j = JSON.parse(text);
        if (Array.isArray(j.items)) {
          setProducts(j.items);
        } else {
          setError("Invalid data format");
        }
      } catch (e) {
        console.error("Error loading products:", e);
        setError("Network error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <TopBar title="SLRH Store" showBack={false} />
        <View style={styles.center}>
          <ActivityIndicator color="#00E0C6" size="large" />
          <Text style={{ color: "#9ca3af", marginTop: 10 }}>Loading products...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <TopBar title="SLRH Store" showBack={false} />
        <View style={styles.center}>
          <Text style={{ color: "#ff6666", fontWeight: "600" }}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!products.length) {
    return (
      <SafeAreaView style={styles.safe}>
        <TopBar title="SLRH Store" showBack={false} />
        <View style={styles.center}>
          <Text style={{ color: "#fff" }}>No products available</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <TopBar title="SLRH Store" showBack={false} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Available Products</Text>

        <View style={styles.grid}>
          {products.map((p) => (
            <Pressable
              key={p._id}
              style={styles.card}
              onPress={() => router.push(`/store/${p._id}`)} // ✅ FIXED navigation ID
            >
              <Image
                source={{
                  uri: p.image || "https://via.placeholder.com/400x400?text=SLRH",
                }}
                style={styles.image}
              />
              <Text style={styles.title}>{p.title}</Text>
              <Text style={styles.price}>Rs. {p.price.toLocaleString()}</Text>
              <Text style={styles.stock}>
                {p.quantity > 0 ? "🟢 In stock" : "🔴 Out of stock"}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0b0b0b" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  container: { padding: 16 },
  header: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 10,
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
    backgroundColor: "#111",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1f1f1f",
    marginBottom: 12,
    overflow: "hidden",
  },
  image: { width: "100%", height: 140, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  title: { color: "#fff", fontSize: 15, fontWeight: "700", marginTop: 6, paddingHorizontal: 6 },
  price: { color: "#00E0C6", fontWeight: "900", marginTop: 2, paddingHorizontal: 6 },
  stock: { color: "#9ca3af", fontSize: 12, padding: 6, marginBottom: 4 },
});
