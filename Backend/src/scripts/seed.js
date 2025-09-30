import 'dotenv/config';
import mongoose from 'mongoose';
import Event from '../src/models/Event.js';
import Session from '../src/models/Session.js';

await mongoose.connect(process.env.MONGO_URL);
await Event.deleteMany({});
await Session.deleteMany({});

const [e1,e2] = await Event.insertMany([
  { title:'Kandy Hill Climb', slug:'kandy-hill-climb', category:'bike', dateUtc:'2025-10-12T04:30:00Z', circuit:'Kandy Hill', city:'Kandy', status:'scheduled', heroImage:'https://images.unsplash.com/photo-1542365887-3f161a0b4776?q=80&w=1200', participantsCount:18 },
  { title:'Nuwara Eliya Championship', slug:'nuwara-eliya-championship', category:'car', dateUtc:'2025-09-08T09:15:00Z', circuit:'Nuwara Eliya City Circuit', city:'Nuwara Eliya', status:'completed', heroImage:'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200', participantsCount:32 }
]);
await Session.insertMany([
  { eventId:e1._id, type:'race', startUtc:'2025-10-12T04:30:00Z', livestreamUrl:'' },
  { eventId:e2._id, type:'race', startUtc:'2025-09-08T09:15:00Z', livestreamUrl:'' }
]);

console.log('✅ Seeded'); process.exit(0);
