import { PropsWithChildren } from 'react';
import { View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = PropsWithChildren<{
  bg?: string; // screen background (also fills status/gesture areas)
  contentStyle?: ViewStyle;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}>;

export default function SafeScreen({
  children,
  bg = '#0b0b0b',
  contentStyle,
  edges = ['top', 'bottom'],
}: Props) {
  return (
    <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: bg }}>
      <View style={[{ flex: 1, backgroundColor: bg }, contentStyle]}>{children}</View>
    </SafeAreaView>
  );
}
