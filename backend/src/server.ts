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
import userRoutes from './routes/users.routes';
import plagiarismRoutes from './routes/plagiarism.routes';
import rankingRoutes from './routes/rankings.routes';
import resultsRoutes from './routes/result.routes';
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
app.use('/api/v1/plagiarism', plagiarismRoutes); // Plagiarism routes
app.use('/api/v1/problems', problemRoutes); // Problem routes
app.use('/api/v1/ranking', rankingRoutes); // Ranking routes
app.use('/api/v1/results', resultsRoutes) // Results routes
app.use('/api/v1/submissions', submissionRoutes); // Submission routes
app.use('/api/v1/users', userRoutes); // User routes

// server.listen(PORT, () => {
//   console.log(`🚀 Server is running on http://localhost:${PORT}`);
// });

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
}
