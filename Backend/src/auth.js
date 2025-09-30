import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
export async function hash(p){ return bcrypt.hash(p, 10); }
export async function compare(p,h){ return bcrypt.compare(p,h); }
export function sign(user){ return jwt.sign({ sub:user._id }, process.env.JWT_SECRET, { expiresIn:'15m' }); }
