import redis from '@lib/redis';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function setUserTicketInfo(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(501).json({
      error: {
        code: 'method_unknown',
        message: 'This endpoint only responds to POST'
      }
    });
  }

  const { username, name, image, id } = req.body;

  console.log(req.body);

  if (!redis) {
    throw new Error('Redis must be set up');
  }

  const ticketNumber = await redis.hget(`id:${id}`, 'ticketNumber');

  if (!ticketNumber) {
    return res.status(404).json({ code: 'invalid_id', message: 'The registration does not exist' });
  }

  const userKey = `id:${id}`;
  const key = `user:${username}`;

  await redis
    .multi()
    .hmset(
      key,
      'username',
      username,
      'name',
      name || '',
      'image',
      image || '',
      'ticketNumber',
      ticketNumber
    )
    .hmset(
      userKey,
      'username',
      username || '',
      'name',
      name,
      'image',
      image || '',
      'ticketNumber',
      ticketNumber
    )
    .exec();

  res.json({ username, name, image });
}
