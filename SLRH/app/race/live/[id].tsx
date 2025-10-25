import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { WebView } from "react-native-webview";
import SafeScreen from "../../../components/SafeScreen";
import Header from "../../../components/Header";
import TopBar from "../../../components/TopBar";
import { useLiveContext } from "../../../context/LiveContext";
import LiveChat from "./components/LiveChat";
import DriverCard from "./components/DriverCard";
import FanLeaderboard from "./components/FanLeaderboard";

const { width } = Dimensions.get("window");

export default function LiveRaceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const liveStreams = useLiveContext();

  // ✅ If context doesn’t include id, prevent crashes
  const liveVideoId = liveStreams?.[id ?? ""] || "";
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Mock data (you can connect Firestore later)
  const [drivers, setDrivers] = useState([
    { id: "d1", name: "A. Perera", car: "BMW M4", position: 1 },
    { id: "d2", name: "S. Fernando", car: "Audi RS5", position: 2 },
    { id: "d3", name: "N. Jayasuriya", car: "Mercedes AMG", position: 3 },
  ]);

  const [leaderboard, setLeaderboard] = useState([
    { fan: "RacerFan01", points: 120 },
    { fan: "TrackLover", points: 110 },
    { fan: "SpeedDevil", points: 95 },
  ]);

  useEffect(() => {
    // 🔄 Later: WebSocket or Firestore listener for real-time updates
  }, []);

  return (
    <SafeScreen>
      <Header title="Live Race Coverage" />

      <ScrollView contentContainerStyle={s.container}>
        {liveVideoId ? (
          <>
            {/* 🎥 Embedded Live Video */}
            <View style={s.videoContainer}>
              {isLoading && (
                <View style={s.loader}>
                  <ActivityIndicator size="large" color="#00E0C6" />
                </View>
              )}
              <WebView
                onLoadEnd={() => setIsLoading(false)}
                style={s.webview}
                allowsFullscreenVideo
                javaScriptEnabled
                domStorageEnabled
                source={{
                  uri: `https://www.youtube.com/embed/${liveVideoId}?autoplay=1&modestbranding=1&showinfo=0`,
                }}
              />
            </View>

            {/* 💬 Live Chat */}
            <Text style={s.sectionTitle}>Live Chat</Text>
            <LiveChat videoId={liveVideoId} />

            {/* 🏎️ Drivers */}
            <Text style={s.sectionTitle}>Driver Details</Text>
            {drivers.map((d) => (
              <DriverCard key={d.id} driver={d} />
            ))}

            {/* 🏆 Fan Leaderboard */}
            <Text style={s.sectionTitle}>Fan Leaderboard</Text>
            <FanLeaderboard leaderboard={leaderboard} />
          </>
        ) : (
          <View style={s.noStreamBox}>
            <Text style={s.placeholder}>No live stream available right now.</Text>
            <Text style={s.subText}>
              Please check back later or visit upcoming race schedules.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeScreen>
  );
}

/* ✅ Styles */
const s = StyleSheet.create({
  container: { padding: 16, alignItems: "center" },
  videoContainer: {
    width: width * 0.95,
    height: (width * 9) / 16,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#000",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#1a1a1a",
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  webview: { flex: 1 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#C6FFF4",
    alignSelf: "flex-start",
    marginTop: 24,
    marginBottom: 10,
  },
  placeholder: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    fontWeight: "500",
  },
  subText: {
    color: "#666",
    textAlign: "center",
    fontSize: 13,
    marginTop: 6,
  },
  noStreamBox: {
    marginTop: 100,
    paddingHorizontal: 20,
    alignItems: "center",
  },
});
