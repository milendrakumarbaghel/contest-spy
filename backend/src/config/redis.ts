import { createClient } from 'redis';

export let redisClient: ReturnType<typeof createClient>;

export const initRedis = async () => {
  redisClient = createClient({ url: process.env.REDIS_URL });

  redisClient.on('error', (err) => console.error('❌ Redis error:', err));
  redisClient.on('connect', () => console.log('✅ Connected to Redis'));

  await redisClient.connect();
};
