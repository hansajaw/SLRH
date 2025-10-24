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
import TopBar from "../../components/TopBar";
import { useRouter } from "expo-router";
import { useCart } from "../../context/CartContext";

const BASE = process.env.EXPO_PUBLIC_API_URL ?? "http://10.0.2.2:3001";

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();

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

  const deliveryFee = total > 0 ? 500 : 0;
  const grandTotal = useMemo(() => total + deliveryFee, [total, deliveryFee]);

  const handleConfirm = async () => {
    if (!name || !phone || !address) {
      Alert.alert("Missing Information", "Please fill all required fields.");
      return;
    }
    if (payment === "card" && (!cardName || !cardNumber || !cardExpiry || !cardCVV)) {
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
          .map((f: any) => `• Item ${f.productId}: need ${f.needed}, available ${f.available} (${f.reason})`)
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
    <SafeAreaView style={s.safe}>
      <TopBar
        title="Checkout"
        showBack
        showMenu={false}
        showSearch={false}
        showProfile={false}
        onBackPress={() => router.replace("/cart" as any)}
      />
      <ScrollView contentContainerStyle={s.container}>
        <Text style={s.sectionTitle}>Customer Details</Text>
        <TextInput style={s.input} placeholder="Full Name *" placeholderTextColor="#666" value={name} onChangeText={setName} />
        <TextInput style={s.input} placeholder="Phone Number *" placeholderTextColor="#666" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
        <TextInput style={s.input} placeholder="Email Address" placeholderTextColor="#666" keyboardType="email-address" value={email} onChangeText={setEmail} />

        <Text style={[s.sectionTitle, { marginTop: 24 }]}>Delivery Address</Text>
        <TextInput style={[s.input, { height: 80 }]} multiline placeholder="Enter your delivery address *" placeholderTextColor="#666" value={address} onChangeText={setAddress} />

        <Text style={[s.sectionTitle, { marginTop: 24 }]}>Payment Method</Text>
        <Pressable onPress={() => setPayment("cash")} style={[s.option, payment === "cash" && s.optionActive]}>
          <Text style={s.optionText}>💵 Cash on Delivery</Text>
        </Pressable>
        <Pressable onPress={() => setPayment("card")} style={[s.option, payment === "card" && s.optionActive]}>
          <Text style={s.optionText}>💳 Credit / Debit Card</Text>
        </Pressable>

        {payment === "card" && (
          <View style={s.cardForm}>
            <TextInput style={s.input} placeholder="Cardholder Name *" placeholderTextColor="#666" value={cardName} onChangeText={setCardName} />
            <TextInput style={s.input} placeholder="Card Number *" placeholderTextColor="#666" keyboardType="numeric" maxLength={16} value={cardNumber} onChangeText={setCardNumber} />
            <View style={s.row}>
              <TextInput style={[s.input, s.halfInput]} placeholder="MM/YY *" placeholderTextColor="#666" value={cardExpiry} onChangeText={setCardExpiry} />
              <TextInput style={[s.input, s.halfInput]} placeholder="CVV *" placeholderTextColor="#666" keyboardType="numeric" secureTextEntry maxLength={3} value={cardCVV} onChangeText={setCardCVV} />
            </View>
          </View>
        )}

        <Text style={[s.sectionTitle, { marginTop: 24 }]}>Order Summary</Text>
        <View style={s.summaryBox}>
          <View style={s.row}>
            <Text style={s.label}>Sub Total</Text>
            <Text style={s.value}>Rs. {total.toLocaleString()}</Text>
          </View>
          <View style={s.row}>
            <Text style={s.label}>Delivery Fee</Text>
            <Text style={s.value}>Rs. {deliveryFee.toLocaleString()}</Text>
          </View>
          <View style={s.divider} />
          <View style={s.row}>
            <Text style={s.totalLabel}>Total</Text>
            <Text style={s.totalValue}>Rs. {grandTotal.toLocaleString()}</Text>
          </View>
        </View>

        <Pressable style={s.confirmBtn} onPress={handleConfirm}>
          <Text style={s.confirmText}>Place Order</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0b0b0b" },
  container: { padding: 20, paddingBottom: 60 },
  sectionTitle: { color: "#C6FFF4", fontWeight: "700", fontSize: 17, marginBottom: 8 },
  input: {
    backgroundColor: "#111",
    color: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#1b2430",
    marginBottom: 10,
  },
  option: { backgroundColor: "#111", padding: 12, borderRadius: 8, marginBottom: 10 },
  optionActive: { borderColor: "#00E0C6", borderWidth: 1.5, backgroundColor: "#121212" },
  optionText: { color: "#fff", fontSize: 15 },
  cardForm: { marginTop: 10, backgroundColor: "#0f0f0f", borderRadius: 10, padding: 10, borderWidth: 1, borderColor: "#1b2430" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  halfInput: { flex: 1, marginRight: 6 },
  summaryBox: { backgroundColor: "#111", padding: 16, borderRadius: 12, marginTop: 8 },
  label: { color: "#aaa", fontSize: 15 },
  value: { color: "#fff", fontSize: 15, fontWeight: "600" },
  divider: { borderBottomColor: "#1b2430", borderBottomWidth: 1, marginVertical: 8 },
  totalLabel: { color: "#C6FFF4", fontSize: 16, fontWeight: "700" },
  totalValue: { color: "#00E0C6", fontSize: 18, fontWeight: "800" },
  confirmBtn: { backgroundColor: "#00E0C6", paddingVertical: 16, borderRadius: 10, marginTop: 30, alignItems: "center" },
  confirmText: { color: "#0b0b0b", fontWeight: "900", fontSize: 16, textTransform: "uppercase" },
});
