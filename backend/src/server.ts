import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.routes';
import contestRoutes from './routes/contests.routes';
import problemRoutes from './routes/problems.routes';
import submissionRoutes from './routes/submissions.routes';
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

app.use('/api/v1/auth', authRoutes); // Authentication routes
app.use('/api/v1/contests', contestRoutes); // Contest routes
app.use('/api/v1/problems', problemRoutes); // Problem routes
app.use('/api/v1/submissions', submissionRoutes); // Submission routes

// server.listen(PORT, () => {
//   console.log(`🚀 Server is running on http://localhost:${PORT}`);
// });

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
}
