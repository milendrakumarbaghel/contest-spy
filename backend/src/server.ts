import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.routes';
import contestRoutes from './routes/contests.routes';
import { createServer } from 'http';
import { initSocket } from './socket';
import { initRedis } from './config/redis';

dotenv.config();
const PORT = process.env.PORT || 4000;

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

const server = createServer(app);
initSocket(server);
initRedis();

server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
