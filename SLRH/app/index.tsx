import { useEffect, useState } from 'react';
import { FlatList, RefreshControl, View, Text, Image, Pressable } from 'react-native';
import { Link } from 'expo-router';

const BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:3001';

type EventItem = {
  _id: string;
  slug?: string;
  title: string;
  city?: string;
  dateUtc?: string;
  heroImage?: string;
};

function EventCard({ item }: { item: EventItem }) {
  const id = String(item.slug ?? item._id);

  return (
    <View style={{ marginBottom: 16, borderRadius: 16, overflow: 'hidden', backgroundColor: '#111' }}>
      <Image source={{ uri: item.heroImage || '' }} style={{ height: 180, width: '100%' }} />
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 12,
          backgroundColor: 'rgba(0,0,0,0.35)',
        }}
      >
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: '800' }}>{item.title}</Text>
        <Text style={{ color: '#fff' }}>
          {item.city ? `${item.city} • ` : ''}
          {item.dateUtc ? new Date(item.dateUtc).toLocaleDateString() : ''}
        </Text>
      </View>

      {/* Use object form so TypeScript can infer the route */}
      <Link href={{ pathname: '/race/[id]', params: { id } }} asChild>
        <Pressable
          accessibilityRole="button"
          style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
        />
      </Link>
    </View>
  );
}

export default function Home() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/v1/events`);
      const j = await res.json();
      setItems((j.items || []) as EventItem[]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: '#0b0b0b' }}
      contentContainerStyle={{ padding: 16, paddingTop: 24 }}
      data={items}
      keyExtractor={(it) => String(it._id)}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor="#fff" />}
      renderItem={({ item }) => <EventCard item={item} />}
      ListEmptyComponent={<Text style={{ color: '#ffff', padding: 16 }}>No events yet.</Text>}
    />
  );
}
