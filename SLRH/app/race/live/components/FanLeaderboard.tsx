import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Fan = {
  fan: string;
  points: number;
};

export default function FanLeaderboard({ leaderboard }: { leaderboard: Fan[] }) {
  return (
    <View style={styles.container}>
      {leaderboard.map((item, i) => (
        <View key={i} style={styles.row}>
          <Text style={styles.rank}>{i + 1}</Text>
          <Text style={styles.name}>{item.fan}</Text>
          <Text style={styles.points}>{item.points} pts</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "95%",
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 10,
    marginBottom: 40,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomColor: "#333",
    borderBottomWidth: 1,
  },
  rank: { color: "#00E0C6", fontWeight: "bold", width: 30, textAlign: "center" },
  name: { color: "#fff", flex: 1 },
  points: { color: "#bbb", fontWeight: "600" },
});
