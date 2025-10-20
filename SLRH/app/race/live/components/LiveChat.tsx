import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { WebView } from "react-native-webview";

const { width } = Dimensions.get("window");

type Props = {
  videoId: string;
};

export default function LiveChat({ videoId }: Props) {
  const chatUrl = `https://www.youtube.com/live_chat?v=${videoId}&embed_domain=example.com`;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: chatUrl }}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width * 0.95,
    height: 400,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
  },
  webview: { flex: 1 },
});
