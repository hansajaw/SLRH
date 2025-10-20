import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Driver = {
  id: string;
  name: string;
  car: string;
  position: number;
};

export default function DriverCard({ driver }: { driver: Driver }) {
  return (
    <View style={styles.card}>
      <Text style={styles.position}>#{driver.position}</Text>
      <View>
        <Text style={styles.name}>{driver.name}</Text>
        <Text style={styles.car}>{driver.car}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    width: "95%",
    backgroundColor: "#1a1a1a",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  position: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00E0C6",
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  car: {
    fontSize: 13,
    color: "#aaa",
  },
});
