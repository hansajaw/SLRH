import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { io } from 'socket.io-client';

const BASE = process.env.EXPO_PUBLIC_API_URL!;

export default function Race(){
  const { id } = useLocalSearchParams<{ id:string }>();
  const [event,setEvent]=useState<any|null>(null);
  const [rows,setRows]=useState<any[]>([]);
  const [liveLog,setLiveLog]=useState<any[]>([]);

  useEffect(()=>{
    (async ()=>{
      const res = await fetch(`${BASE}/api/v1/events/${id}`);
      if(res.ok) setEvent(await res.json());
    })();
  },[id]);

  useEffect(()=>{
    const socket = io(BASE, { transports:['websocket'] });
    socket.emit('join_event', id);
    socket.on('leaderboard:update', (p:any)=> setRows(p.rows||[]));
    socket.on('liveblog:new', (e:any)=> setLiveLog((x)=>[e,...x].slice(0,100)));
    return ()=>{ socket.emit('leave_event', id); socket.disconnect(); };
  },[id]);

  if(!event){
    return <View style={{ flex:1, backgroundColor:'#0b0b0b', justifyContent:'center', alignItems:'center' }}>
      <Text style={{ color:'#fff' }}>Loading…</Text>
    </View>;
  }

  const stream = event.sessions?.find((s:any)=>s.type==='race')?.livestreamUrl;

  return (
    <ScrollView style={{ flex:1, backgroundColor:'#0b0b0b' }} contentContainerStyle={{ padding:16 }}>
      <Image source={{ uri:event.heroImage }} style={{ height:220, width:'100%', borderRadius:16 }} />
      <Text style={{ color:'#fff', fontSize:22, fontWeight:'800', marginTop:12 }}>{event.title}</Text>
      <Text style={{ color:'#bbb' }}>{event.city} • {new Date(event.dateUtc).toLocaleString()}</Text>

      {!!stream && (
        <View style={{ marginTop: 16, borderRadius: 16, overflow: 'hidden', backgroundColor: '#000' }}>
          <Video
            source={{ uri: stream }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}  
            style={{ width: '100%', height: 220 }}
          />
        </View>
      )}

      <Text style={{ color:'#00E0C6', marginTop:16, fontWeight:'700' }}>Live Leaderboard</Text>
      {rows.map((r,i)=>(
        <View key={i} style={{ flexDirection:'row', justifyContent:'space-between', paddingVertical:6, borderBottomColor:'#222', borderBottomWidth:1 }}>
          <Text style={{ color:'#fff' }}>{r.pos}</Text>
          <Text style={{ color:'#fff', flex:1, marginLeft:12 }}>{r.participant}</Text>
          <Text style={{ color:'#bbb' }}>{r.laps}L</Text>
          <Text style={{ color:'#bbb' }}>{r.gap}</Text>
        </View>
      ))}

      <Text style={{ color:'#00E0C6', marginTop:16, fontWeight:'700' }}>Live Blog</Text>
      {liveLog.map((e,i)=> <Text key={i} style={{ color:'#ddd', marginTop:6 }}>• {e.text || JSON.stringify(e)}</Text> )}
    </ScrollView>
  );
}
