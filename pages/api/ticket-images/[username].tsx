import { NextApiRequest, NextApiResponse } from 'next';
import screenshot from '@lib/screenshot';
import { SITE_URL, SAMPLE_TICKET_NUMBER } from '@lib/constants';
import redis from '@lib/redis';

export default async function ticketImages(req: NextApiRequest, res: NextApiResponse) {
  let url: string;

  const { username } = req.query || {};

  if (username) {
    if (redis) {
      const usernameString = username.toString();

      const info: any = await redis.hmget(
        `user:${usernameString}`,
        'name',
        'image',
        'ticketNumber'
      );

      const name = info[0];
      const image = info[1];
      const ticketNumber = info[2];

      if (!ticketNumber) {
        res.statusCode = 404;
        return res.end(`Not Found ${image}`);
      }

      url = `${SITE_URL}/ticket-image?username=${encodeURIComponent(
        usernameString
      )}&ticketNumber=${encodeURIComponent(ticketNumber)}`;
      if (name) {
        url = `${url}&name=${encodeURIComponent(name)}`;
      }
    } else {
      url = `${SITE_URL}/ticket-image?ticketNumber=${encodeURIComponent(SAMPLE_TICKET_NUMBER)}`;
    }
    const file = await screenshot(url);
    res.setHeader('Content-Type', `image/png`);
    res.setHeader(
      'Cache-Control',
      `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
    );
    res.statusCode = 200;
    res.end(file);
  } else {
    res.status(404).send('Not Found');
  }
}
