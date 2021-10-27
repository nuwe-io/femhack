import { NextApiRequest, NextApiResponse } from 'next';

import redis from '@lib/redis';

export default async function getAll(req: NextApiRequest, res: NextApiResponse) {
  if (redis) {
    const values = await redis.keys('*');

    const filteredValues = values.filter((val: string) => val.includes('id:'));

    filteredValues.forEach(element => {
      console.log(element);
      redis
        ?.hmget(element, 'name', 'email', 'username', 'image', 'createdAt')
        .then((resp: any) => console.log(resp))
        .catch(err => console.log(err));
    });
  }

  res.send('Hola');
}
