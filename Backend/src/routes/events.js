import { Router } from 'express';
import Event from '../models/Event.js';
import Session from '../models/Session.js';

const r = Router();

// List (filters optional)
r.get('/', async (req,res)=>{
  const { category, status, q } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (status) filter.status = status;
  if (q) filter.title = new RegExp(q, 'i');
  const items = await Event.find(filter).sort({ dateUtc: 1 }).lean();
  res.json({ items });
});

// Detail + sessions
r.get('/:slugOrId', async (req,res)=>{
  const { slugOrId } = req.params;
  const byId = await Event.findById(slugOrId).lean().catch(()=>null);
  const ev = byId || await Event.findOne({ slug: slugOrId }).lean();
  if (!ev) return res.status(404).json({ error:'not found' });
  const sessions = await Session.find({ eventId: ev._id }).sort({ startUtc:1 }).lean();
  res.json({ ...ev, sessions });
});

// Dev seed: add two events
r.post('/seed', async (_req,res)=>{
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
  res.json({ ok:true });
});

export default r;
