import Redis from 'ioredis';
import crypto from 'crypto';

const redis = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : undefined;

export function emailToId(email: string) {
  if (process.env.REDIS_EMAIL_TO_ID_SECRET) {
    const hmac = crypto.createHmac('sha1', process.env.REDIS_EMAIL_TO_ID_SECRET);
    hmac.update(email);
    return hmac.digest('hex');
  } else {
    throw new Error('REDIS_EMAIL_TO_ID_SECRET is missing');
  }
}

export default redis;
