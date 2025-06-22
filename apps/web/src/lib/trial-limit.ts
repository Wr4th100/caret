import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const TRIAL_REQUEST_LIMIT = 50;

export interface TrialUsageStats {
  current: number;
  remaining: number;
  allowed: boolean;
}

export async function incrementTrialUsage(userId: string): Promise<TrialUsageStats> {
  const key = `trial:user:${userId}`;
  const current = await redis.incr(key);

  return {
    current,
    remaining: Math.max(0, TRIAL_REQUEST_LIMIT - current),
    allowed: current <= TRIAL_REQUEST_LIMIT,
  };
}

export async function getTrialUsage(userId: string): Promise<TrialUsageStats> {
  const key = `trial:user:${userId}`;
  const current = (await redis.get<number>(key)) ?? 0;

  return {
    current,
    remaining: Math.max(0, TRIAL_REQUEST_LIMIT - current),
    allowed: current < TRIAL_REQUEST_LIMIT,
  };
}
