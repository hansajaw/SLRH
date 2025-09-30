import mongoose from 'mongoose';
const ParticipantSchema = new mongoose.Schema({
  name: { type:String, required:true, index:true },
  number: String,
  nationality: String,
  team: String,
  vehicle: String,
  avatar: String
}, { timestamps:true });
export default mongoose.model('Participant', ParticipantSchema);
