import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Image, Pressable, ScrollView, Alert } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import TopBar from "../../components/TopBar";
import { useCart } from "../../context/CartContext";

const BASE = process.env.EXPO_PUBLIC_API_URL ?? "http://10.0.2.2:3001";
const asSrc = (img: any) => (typeof img === "string" ? { uri: img } : img);

function Stars({ rating = 4.2 }: { rating?: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const stars = Array.from({ length: 5 }, (_, i) =>
    i < full ? "star" : i === full && half ? "star-half" : "star-outline"
  );
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
      {stars.map((name, i) => (
        <Ionicons key={i} name={name as any} size={12} color="#FACC15" />
      ))}
      <Text style={st.starText}>{rating.toFixed(1)}</Text>
    </View>
  );
}

function CartItemCard({
  id,
  title,
  price,
  quantity,
  image,
  rating,
  stock,
  onMinus,
  onPlus,
  onRemove,
}: {
  id: string | number;
  title: string;
  price: number;
  quantity: number;
  image: any;
  rating?: number;
  stock?: number;
  onMinus: () => void;
  onPlus: () => void;
  onRemove: () => void;
}) {
  const maxed = typeof stock === "number" && quantity >= stock;
  return (
    <View style={st.card}>
      <Image source={asSrc(image)} style={st.cardImg} />
      <View style={{ flex: 1 }}>
        <Text style={st.cardTitle} numberOfLines={1}>{title}</Text>
        <Text style={st.cardSub} numberOfLines={2}>Fresh, guaranteed quality!</Text>
        <View style={st.metaRow}>
          <View style={st.pill}>
            <Ionicons name="bicycle" size={12} color="#22C55E" />
            <Text style={st.pillText}>Delivered</Text>
          </View>
          <Stars rating={rating ?? 4.3} />
        </View>
        <View style={st.priceRow}>
          <Text style={st.price}>Rs. {price.toLocaleString()}</Text>
          <View style={st.stepper}>
            <Pressable onPress={onMinus} style={st.stepBtn} hitSlop={6}>
              <Ionicons name="remove" size={14} color="#0a0a0a" />
            </Pressable>
            <Text style={st.stepQty}>{quantity}</Text>
            <Pressable
              onPress={onPlus}
              style={[st.stepBtn, { backgroundColor: maxed ? "#E5E7EB" : "#D1FAE5" }]}
              hitSlop={6}
              disabled={maxed}
            >
              <Ionicons name="add" size={14} color={maxed ? "#9ca3af" : "#059669"} />
            </Pressable>
          </View>
        </View>
        {typeof stock === "number" && (
          <Text style={{ color: "#9ca3af", marginTop: 6 }}>
            Stock: {stock} {maxed ? "(max reached)" : ""}
          </Text>
        )}
      </View>
      <Pressable onPress={onRemove} hitSlop={8} style={st.removeBtn} accessibilityLabel="Remove item">
        <Ionicons name="trash-outline" size={20} color="#ef4444" />
      </Pressable>
    </View>
  );
}

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const cart = useCart() as any;

  const { items, removeFromCart, total } = cart;
  const updateQuantity: ((id: any, qty: number) => void) | undefined = cart?.updateQuantity;

  // live stocks map
  const [stocks, setStocks] = useState<Record<string, number>>({});

  // fetch latest stock for all items present
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const entries = await Promise.all(
          items.map(async (it: any) => {
            const res = await fetch(`${BASE}/api/v1/products/${it.id}`);
            const j = await res.json();
            return [String(it.id), Number(j?.item?.quantity ?? 0)] as const;
          })
        );
        if (!cancelled) {
          const m: Record<string, number> = {};
          for (const [id, q] of entries) m[id] = q;
          setStocks(m);
        }
      } catch (e) {
        // ignore; fallback: no stock caps
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [items]);

  // money math
  const subTotal = useMemo(
    () => items.reduce((sum: number, it: any) => sum + it.price * it.quantity, 0),
    [items]
  );
  const deliveryFee = items.length ? 200 : 0;
  const discountPct = 5;
  const discount = Math.round((subTotal * discountPct) / 100);
  const grandTotal = Math.max(subTotal + deliveryFee - discount, 0);

  const changeQty = async (id: any, next: number) => {
    if (next <= 0) {
      removeFromCart(id);
      return;
    }
    const stock = stocks[String(id)];
    if (typeof stock === "number" && next > stock) {
      Alert.alert("Not enough stock", `Only ${stock} available.`);
      return;
    }
    if (updateQuantity) {
      updateQuantity(id, next);
      return;
    }
    // graceful fallback if your context doesn’t have updateQuantity:contentReference[oaicite:4]{index=4}
    const item = items.find((i: any) => i.id === id);
    if (!item) return;
    removeFromCart(id);
    cart.addToCart?.({ ...item, quantity: next }); // uses your existing addToCart API
  };

  return (
    <SafeAreaView style={[st.safe, { paddingBottom: insets.bottom }]}>
      <TopBar
        title="Cart"
        showBack
        showMenu={false}
        showSearch={false}
        showProfile={false}
        onBackPress={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {items.length === 0 ? (
          <View style={st.emptyWrap}>
            <Ionicons name="cart-outline" size={40} color="#6b7280" />
            <Text style={st.emptyTitle}>Your cart is empty</Text>
            <Text style={st.emptySub}>Browse the store and add some goodies.</Text>
            <Pressable style={st.exploreBtn} onPress={() => router.replace("/store" as any)}>
              <Text style={st.exploreText}>Explore Store</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {items.map((it: any) => (
              <CartItemCard
                key={it.id}
                id={it.id}
                title={it.title}
                price={it.price}
                quantity={it.quantity}
                image={it.image}
                rating={it.rating}
                stock={stocks[String(it.id)]}
                onMinus={() => changeQty(it.id, it.quantity - 1)}
                onPlus={() => changeQty(it.id, it.quantity + 1)}
                onRemove={() =>
                  Alert.alert("Remove item", "Do you want to remove this from cart?", [
                    { text: "Cancel", style: "cancel" },
                    { text: "Remove", style: "destructive", onPress: () => removeFromCart(it.id) },
                  ])
                }
              />
            ))}

            {/* Summary */}
            <View style={st.summary}>
              <Row label="Subtotal" value={`Rs. ${subTotal.toLocaleString()}`} />
              <Row label="Delivery Fee" value={`Rs. ${deliveryFee.toLocaleString()}`} />
              <Row label={`Discount (${discountPct}%)`} value={`- Rs. ${discount.toLocaleString()}`} />
              <View style={st.dotted} />
              <Row label="Total" value={`Rs. ${grandTotal.toLocaleString()}`} bold />
            </View>
          </>
        )}
      </ScrollView>

      {/* Sticky Buy Now Bar */}
      {items.length > 0 && (
        <View style={[st.buyBar, { paddingBottom: Math.max(12, insets.bottom) }]}>
          <View>
            <Text style={st.totalLabel}>Total</Text>
            <Text style={st.totalValue}>Rs. {grandTotal.toLocaleString()}</Text>
          </View>
          <Pressable
            style={st.buyBtn}
            onPress={() => router.push("/checkout" as any)}
            accessibilityRole="button"
          >
            <Ionicons name="bag-check" size={18} color="#0b0b0b" />
            <Text style={st.buyText}>Buy Now</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={st.row}>
      <Text style={[st.rowLabel, bold && { fontWeight: "900", color: "#fff" }]}>{label}</Text>
      <Text style={[st.rowValue, bold && { fontWeight: "900", color: "#fff" }]}>{value}</Text>
    </View>
  );
}

const st = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0b0b0b" },
  card: {
    flexDirection: "row",
    gap: 12,
    padding: 12,
    borderRadius: 18,
    backgroundColor: "#0f1420",
    borderWidth: 1,
    borderColor: "#1b2430",
    marginBottom: 12,
  },
  cardImg: { width: 96, height: 96, borderRadius: 14, backgroundColor: "#1a2030" },
  cardTitle: { color: "#E6FFF9", fontWeight: "900", fontSize: 15 },
  cardSub: { color: "#93a3af", marginTop: 2, fontSize: 12 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(34,197,94,0.15)",
    borderColor: "rgba(34,197,94,0.35)",
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  pillText: { color: "#22C55E", fontWeight: "800", fontSize: 11 },
  starText: { color: "#e5e7eb", fontSize: 11, marginLeft: 2 },
  priceRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10 },
  price: { color: "#fff", fontWeight: "900", fontSize: 16 },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 4,
    gap: 8,
  },
  stepBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  stepQty: { minWidth: 18, textAlign: "center", fontWeight: "900", color: "#0a0a0a" },
  removeBtn: { padding: 6, alignSelf: "flex-start" },

  emptyWrap: { alignItems: "center", paddingTop: 48 },
  emptyTitle: { color: "#e5e7eb", fontWeight: "900", fontSize: 18, marginTop: 10 },
  emptySub: { color: "#9ca3af", marginTop: 4 },
  exploreBtn: {
    marginTop: 14,
    backgroundColor: "#00E0C6",
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  exploreText: { color: "#001814", fontWeight: "900" },

  summary: {
    marginTop: 8,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#0f1420",
    borderWidth: 1,
    borderColor: "#1b2430",
  },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 6 },
  rowLabel: { color: "#cbd5e1", fontWeight: "700" },
  rowValue: { color: "#cbd5e1", fontWeight: "800" },
  dotted: {
    height: 1,
    borderStyle: "dashed",
    borderBottomWidth: 1,
    borderColor: "#263043",
    marginVertical: 6,
  },

  buyBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#0b0b0b",
    borderTopColor: "#141a25",
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  totalLabel: { color: "#9ca3af", fontWeight: "700", fontSize: 12 },
  totalValue: { color: "#E6FFF9", fontWeight: "900", fontSize: 18, marginTop: 2 },
  buyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: "#00E0C6",
    borderRadius: 999,
  },
  buyText: { color: "#001814", fontWeight: "900", fontSize: 16 },
});
