import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { connectDB } from './db.js';
import eventsRouter from './routes/events.js';
import { initLive } from './sockets/live.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: (process.env.CORS_ORIGIN || '*').split(',') }));
app.use(express.json({ limit:'1mb' }));
app.use(morgan('tiny'));

app.get('/api/v1/health', (_,res)=>res.json({ ok:true }));
app.use('/api/v1/events', eventsRouter);

await connectDB(process.env.MONGO_URL);

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: (process.env.CORS_ORIGIN || '*').split(',') } });
initLive(io);

const port = process.env.PORT || 3001;
httpServer.listen(port, ()=>console.log(`🚀 API on http://localhost:${port}`));
