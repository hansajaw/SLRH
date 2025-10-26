import React, { useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  LayoutChangeEvent,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useTheme } from "../context/ThemeContext";

type Props<T extends string = string> = {
  tabs: readonly T[];
  value: T;
  onChange: (v: T) => void;
  style?: any;
  wrapToTwoLines?: boolean;
};

export default function SegmentedBar<T extends string>({
  tabs,
  value,
  onChange,
  style,
  wrapToTwoLines = false,
}: Props<T>) {
  const { palette } = useTheme();

  const widthsRef = useRef<number[]>([]);
  const x = useRef(new Animated.Value(0)).current;
  const w = useRef(new Animated.Value(0)).current;

  const activeIndex = useMemo(
    () => Math.max(0, tabs.indexOf(value)),
    [tabs, value]
  );

  function onTabLayout(i: number, e: LayoutChangeEvent) {
    const { width } = e.nativeEvent.layout;
    widthsRef.current[i] = width;
    if (
      widthsRef.current.filter((n) => Number.isFinite(n)).length === tabs.length
    ) {
      const left = widthsRef.current
        .slice(0, activeIndex)
        .reduce((a, b) => a + b, 0);
      x.setValue(left);
      w.setValue(widthsRef.current[activeIndex] || 0);
    }
  }

  useEffect(() => {
    const left = widthsRef.current
      .slice(0, activeIndex)
      .reduce((a, b) => a + b, 0);
    Animated.spring(x, {
      toValue: left,
      useNativeDriver: false,
      friction: 8,
      tension: 120,
    }).start();
    Animated.spring(w, {
      toValue: widthsRef.current[activeIndex] || 0,
      useNativeDriver: false,
      friction: 8,
      tension: 120,
    }).start();
  }, [activeIndex, w, x]);

  function formatLabel(label: string) {
    const words = label.trim().split(/\s+/);
    if (!wrapToTwoLines || words.length <= 1)
      return { display: label, singleWord: true };
    const mid = Math.ceil(words.length / 2);
    return {
      display:
        words.slice(0, mid).join(" ") + "\n" + words.slice(mid).join(" "),
      singleWord: false,
    };
  }

  return (
    <View style={[styles.wrap, style]}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: palette.card,
            borderColor: palette.border,
          },
        ]}
      >
        {/* Animated indicator */}
        <Animated.View
          style={[
            styles.indicator,
            {
              transform: [{ translateX: x }],
              width: w,
            },
          ]}
        >
          <LinearGradient
            colors={[palette.accent, palette.accentAlt]}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>

        {tabs.map((t, i) => {
          const active = i === activeIndex;
          const { display, singleWord } = formatLabel(String(t));
          return (
            <Pressable
              key={String(t)}
              onLayout={(e) => onTabLayout(i, e)}
              onPress={() => {
                Haptics.selectionAsync();
                onChange(t);
              }}
              style={styles.tab}
            >
              <Text
                style={[
                  styles.label,
                  {
                    color: active ? palette.text : palette.textSecondary,
                  },
                ]}
                numberOfLines={singleWord ? 1 : 2}
                ellipsizeMode="tail"
              >
                {display}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/* ---------------------- Styles ---------------------- */
const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 10 },
  container: {
    flexDirection: "row",
    alignItems: "stretch",
    borderRadius: 22,
    borderWidth: 1,
    overflow: "hidden",
    elevation: 3,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  indicator: {
    position: "absolute",
    top: 3,
    bottom: 3,
    left: 0,
    borderRadius: 18,
    overflow: "hidden",
  },
  gradient: { flex: 1, borderRadius: 18 },
  label: {
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 18,
    fontSize: 13,
  },
});
