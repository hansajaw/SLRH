import mongoose from 'mongoose';
const EventSchema = new mongoose.Schema({
  title: { type:String, required:true },
  slug: { type:String, unique:true, index:true },
  category: { type:String, enum:['car','bike','kart','other'], index:true },
  dateUtc: { type:String, index:true },
  timeUtc: String,
  circuit: String,
  city: String,
  status: { type:String, enum:['scheduled','ongoing','completed','cancelled'], index:true },
  heroImage: String,
  participantsCount: Number
}, { timestamps:true });
EventSchema.index({ dateUtc:1, category:1, status:1 });
export default mongoose.model('Event', EventSchema);
