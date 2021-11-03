import { NextApiRequest, NextApiResponse } from 'next';

import redis from '@lib/redis';

export default async function getAll(req: NextApiRequest, res: NextApiResponse) {
  if (redis) {
    const values = await redis.keys('*');

    const filteredValues = values.filter((val: string) => val.includes('id:'));

    filteredValues.forEach(element => {
      console.log(element);
      redis
        ?.hmget(element, 'name', 'email', 'username')
        .then((resp: any) => console.log(resp))
        .catch(err => console.log(err));
    });

    // await redis.del('id:d45820f8734dbbf6c739628a84875a0d4df8657c');
  }

  res.send('Hola');
}
