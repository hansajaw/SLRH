import React, { PropsWithChildren, useContext } from "react";
import { View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "../app/_layout";

type Props = PropsWithChildren<{
  bg?: string;
  contentStyle?: ViewStyle;
  edges?: ("top" | "bottom" | "left" | "right")[];
}>;

export default function SafeScreen({
  children,
  bg,
  contentStyle,
  edges = ["top", "bottom"],
}: Props) {
  const theme = useContext(ThemeContext) || "dark";
  const backgroundColor = bg || (theme === "dark" ? "#0b0b0b" : "#f0f0f0");

  return (
    <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor }}>
      <View style={[{ flex: 1, backgroundColor }, contentStyle]}>{children}</View>
    </SafeAreaView>
  );
}
