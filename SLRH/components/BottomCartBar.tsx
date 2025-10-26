// components/BottomCartBar.tsx
import React from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";

export default function BottomCartBar() {
  const { palette } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { items, totalPrice } = useCart();

  if (items.length === 0) return null;

  return (
    <View
      pointerEvents="box-none"
      style={[
        s.fabWrap,
        {
          paddingBottom: Math.max(8, insets.bottom), // sit above home indicator
        },
      ]}
    >
      <View
        style={[
          s.container,
          {
            backgroundColor: palette.card,
            borderColor: palette.border,
            shadowColor: palette.isDark ? "#000" : "#000",
          },
        ]}
      >
        <View style={s.info}>
          <Text style={[s.count, { color: palette.text }]}>
            {items.length} item{items.length > 1 ? "s" : ""}
          </Text>
          <Text style={[s.total, { color: palette.text }]}>
            Rs. {totalPrice.toLocaleString()}
          </Text>
        </View>

        <Pressable
          onPress={() => router.push("/cart")}
          style={[s.btn, { backgroundColor: palette.accent }]}
          android_ripple={{ color: "#00000022", borderless: false }}
        >
          <Ionicons
            name="cart"
            size={18}
            color={palette.background}
            style={{ marginRight: 6 }}
          />
          <Text style={[s.btnText, { color: palette.background }]}>
            Go to Cart
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  fabWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    // allow touches through except the bar itself
    alignItems: "center",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 18, // rounded corners for the whole bar
    marginHorizontal: 12,
    maxWidth: 720,
    width: "94%", // floating with margin on sides
    // shadow/elevation for floating feel
    ...Platform.select({
      ios: {
        shadowOpacity: 0.18,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 8 },
      },
      android: {
        elevation: 8,
      },
    }),
  },
  info: {
    flex: 1,
  },
  count: {
    fontSize: 13,
    fontWeight: "800",
    opacity: 0.9,
  },
  total: {
    fontSize: 16,
    fontWeight: "900",
    marginTop: 2,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999, // pill button
  },
  btnText: { fontSize: 15, fontWeight: "900" },
});
