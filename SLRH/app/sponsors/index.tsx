import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, StyleSheet, Image, View } from "react-native";
import TopBar from "../../components/TopBar";

export default function SponsorsScreen() {
  return (
    <SafeAreaView style={s.safe}>
      <TopBar title="Sponsors" showBack={true} showMenu={false} showSearch={false} showProfile={false} />
      <ScrollView contentContainerStyle={s.container}>
        <Text style={s.title}>🏁 Our Sponsors</Text>
        <Text style={s.text}>
          SLRH is proudly supported by our global partners who share our passion for motorsport excellence.
        </Text>

        <View style={s.logoRow}>
          <Image source={require("../../assets/sponsors/sponsor1.png")} style={s.logo} />
          <Image source={require("../../assets/sponsors/sponsor2.png")} style={s.logo} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0b0b0b" },
  container: { padding: 20 },
  title: { color: "#C6FFF4", fontWeight: "900", fontSize: 22, marginBottom: 10 },
  text: { color: "#fff", fontSize: 16, lineHeight: 24 },
  logoRow: { flexDirection: "row", justifyContent: "space-around", marginTop: 20 },
  logo: { width: 100, height: 60, resizeMode: "contain" },
});
