import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext"; 

const BASE = process.env.EXPO_PUBLIC_API_URL ?? "http://172:20:10:4:3001";

export default function CheckoutScreen() {
  const router = useRouter();
  const { palette } = useTheme();
  const { items, totalPrice, clearCart } = useCart();

  // 🧍 Customer
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  // 💳 Payment
  const [payment, setPayment] = useState<"cash" | "card">("cash");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");

  const deliveryFee = totalPrice > 0 ? 500 : 0;
  const grandTotal = useMemo(() => totalPrice + deliveryFee, [totalPrice, deliveryFee]);

  const handleConfirm = async () => {
    if (!name || !phone || !address) {
      Alert.alert("Missing Information", "Please fill all required fields.");
      return;
    }
    if (
      payment === "card" &&
      (!cardName || !cardNumber || !cardExpiry || !cardCVV)
    ) {
      Alert.alert("Incomplete Card Details", "Please fill in all card fields.");
      return;
    }
    if (items.length === 0) {
      Alert.alert("Cart is empty", "Add items to cart first.");
      return;
    }

    try {
      const payload = {
        items: items.map((l: any) => ({ productId: l.id, qty: l.quantity })),
      };
      const res = await fetch(`${BASE}/api/v1/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await res.json();

      if (!j.ok) {
        const fails = (j.failures || [])
          .map(
            (f: any) =>
              `• Item ${f.productId}: need ${f.needed}, available ${f.available} (${f.reason})`
          )
          .join("\n");
        Alert.alert("Checkout failed", fails || "Unknown error");
        return;
      }

      clearCart();
      Alert.alert("Order Confirmed ✅", `Order ID: ${j.orderId}`, [
        { text: "OK", onPress: () => router.replace("/store" as any) },
      ]);
    } catch (e) {
      console.error("checkout error", e);
      Alert.alert("Error", "Could not complete checkout.");
    }
  };

  return (
    <SafeAreaView
      style={[s.safe, { backgroundColor: palette.background }]}
    >
 
      <ScrollView
        contentContainerStyle={[s.container, { backgroundColor: palette.background }]}
      >
        <Text style={[s.sectionTitle, { color: palette.accentAlt }]}>
          Customer Details
        </Text>
        <TextInput
          style={[s.input, { backgroundColor: palette.input, color: palette.text, borderColor: palette.border }]}
          placeholder="Full Name *"
          placeholderTextColor={palette.textSecondary}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={[s.input, { backgroundColor: palette.input, color: palette.text, borderColor: palette.border }]}
          placeholder="Phone Number *"
          placeholderTextColor={palette.textSecondary}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput
          style={[s.input, { backgroundColor: palette.input, color: palette.text, borderColor: palette.border }]}
          placeholder="Email Address"
          placeholderTextColor={palette.textSecondary}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={[s.sectionTitle, { color: palette.accentAlt, marginTop: 24 }]}>
          Delivery Address
        </Text>
        <TextInput
          style={[
            s.input,
            {
              backgroundColor: palette.input,
              color: palette.text,
              borderColor: palette.border,
              height: 80,
            },
          ]}
          multiline
          placeholder="Enter your delivery address *"
          placeholderTextColor={palette.textSecondary}
          value={address}
          onChangeText={setAddress}
        />

        <Text style={[s.sectionTitle, { color: palette.accentAlt, marginTop: 24 }]}>
          Payment Method
        </Text>
        <Pressable
          onPress={() => setPayment("cash")}
          style={[
            s.option,
            {
              backgroundColor:
                payment === "cash" ? palette.card : palette.input,
              borderColor:
                payment === "cash" ? palette.accent : palette.border,
            },
          ]}
        >
          <Text style={[s.optionText, { color: palette.text }]}>
            💵 Cash on Delivery
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setPayment("card")}
          style={[
            s.option,
            {
              backgroundColor:
                payment === "card" ? palette.card : palette.input,
              borderColor:
                payment === "card" ? palette.accent : palette.border,
            },
          ]}
        >
          <Text style={[s.optionText, { color: palette.text }]}>
            💳 Credit / Debit Card
          </Text>
        </Pressable>

        {payment === "card" && (
          <View
            style={[
              s.cardForm,
              { backgroundColor: palette.card, borderColor: palette.border },
            ]}
          >
            <TextInput
              style={[s.input, { backgroundColor: palette.input, color: palette.text, borderColor: palette.border }]}
              placeholder="Cardholder Name *"
              placeholderTextColor={palette.textSecondary}
              value={cardName}
              onChangeText={setCardName}
            />
            <TextInput
              style={[s.input, { backgroundColor: palette.input, color: palette.text, borderColor: palette.border }]}
              placeholder="Card Number *"
              placeholderTextColor={palette.textSecondary}
              keyboardType="numeric"
              maxLength={16}
              value={cardNumber}
              onChangeText={setCardNumber}
            />
            <View style={s.row}>
              <TextInput
                style={[
                  s.input,
                  s.halfInput,
                  { backgroundColor: palette.input, color: palette.text, borderColor: palette.border },
                ]}
                placeholder="MM/YY *"
                placeholderTextColor={palette.textSecondary}
                value={cardExpiry}
                onChangeText={setCardExpiry}
              />
              <TextInput
                style={[
                  s.input,
                  s.halfInput,
                  { backgroundColor: palette.input, color: palette.text, borderColor: palette.border },
                ]}
                placeholder="CVV *"
                placeholderTextColor={palette.textSecondary}
                keyboardType="numeric"
                secureTextEntry
                maxLength={3}
                value={cardCVV}
                onChangeText={setCardCVV}
              />
            </View>
          </View>
        )}

        <Text style={[s.sectionTitle, { color: palette.accentAlt, marginTop: 24 }]}>
          Order Summary
        </Text>
        <View
          style={[
            s.summaryBox,
            { backgroundColor: palette.card, borderColor: palette.border },
          ]}
        >
          <View style={s.row}>
            <Text style={[s.label, { color: palette.textSecondary }]}>
              Sub Total
            </Text>
            <Text style={[s.value, { color: palette.text }]}>
              Rs. {totalPrice.toLocaleString()}
            </Text>
          </View>
          <View style={s.row}>
            <Text style={[s.label, { color: palette.textSecondary }]}>
              Delivery Fee
            </Text>
            <Text style={[s.value, { color: palette.text }]}>
              Rs. {deliveryFee.toLocaleString()}
            </Text>
          </View>
          <View style={[s.divider, { borderBottomColor: palette.border }]} />
          <View style={s.row}>
            <Text style={[s.totalLabel, { color: palette.accentAlt }]}>
              Total
            </Text>
            <Text style={[s.totalValue, { color: palette.accent }]}>
              Rs. {grandTotal.toLocaleString()}
            </Text>
          </View>
        </View>

        <Pressable
          style={[s.confirmBtn, { backgroundColor: palette.accent }]}
          onPress={handleConfirm}
        >
          <Text
            style={[s.confirmText, { color: palette.background }]}
          >
            Place Order
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 20, paddingBottom: 60 },
  sectionTitle: { fontWeight: "700", fontSize: 17, marginBottom: 8 },
  input: {
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  option: {
    borderWidth: 1.5,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  optionText: { fontSize: 15 },
  cardForm: {
    marginTop: 10,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  halfInput: { flex: 1, marginRight: 6 },
  summaryBox: { padding: 16, borderRadius: 12, marginTop: 8, borderWidth: 1 },
  label: { fontSize: 15 },
  value: { fontSize: 15, fontWeight: "600" },
  divider: { borderBottomWidth: 1, marginVertical: 8 },
  totalLabel: { fontSize: 16, fontWeight: "700" },
  totalValue: { fontSize: 18, fontWeight: "800" },
  confirmBtn: {
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
  },
  confirmText: {
    fontWeight: "900",
    fontSize: 16,
    textTransform: "uppercase",
  },
});
