import mongoose from 'mongoose';
const SessionSchema = new mongoose.Schema({
  eventId: { type:mongoose.Types.ObjectId, ref:'Event', index:true },
  type: { type:String, enum:['practice','qualifying','race'], index:true },
  startUtc: String,
  endUtc: String,
  livestreamUrl: String,  // HLS .m3u8 or other URL
  youtubeId: String
}, { timestamps:true });
export default mongoose.model('Session', SessionSchema);
