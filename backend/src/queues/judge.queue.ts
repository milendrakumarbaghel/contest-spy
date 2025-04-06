import { Queue } from 'bull';
import Bull from 'bull';
import { judgeSubmission } from '../workers/judge.worker';

export const judgeQueue: Queue = new Bull('judge-queue', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
});

judgeQueue.process(judgeSubmission);
