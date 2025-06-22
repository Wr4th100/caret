import { Redis } from '@upstash/redis';

import { eq } from '@caret/db';
import { db } from '@caret/db/client';
import { user } from '@caret/db/schema';

import { decrypt } from '@/lib/api-key';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const USER_API_KEY_CACHE_TTL = 60 * 60 * 6; // 6 hours

export async function getUserApiKey(userId: string): Promise<string | null> {
  const redisKey = `user:perplexityKey:${userId}`;
  const cached = await redis.get<string>(redisKey);

  if (cached) {
    return decrypt(cached);
  }

  // Fallback to DB if not in Redis
  const [currUser] = await db
    .select({ apiKey: user.perplexityApiKey })
    .from(user)
    .where(eq(user.id, userId));

  if (!currUser || !currUser.apiKey) {
    return null; // No API key found for user
  }

  const apiKey = currUser?.apiKey ?? null;

  if (!apiKey) {
    return null; // No API key found for user
  }

  const decryptedApiKey = decrypt(apiKey);

  if (apiKey) {
    await redis.set(redisKey, apiKey, { ex: USER_API_KEY_CACHE_TTL });
  }

  return decryptedApiKey;
}
