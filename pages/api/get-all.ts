import { NextApiRequest, NextApiResponse } from 'next';

import redis from '@lib/redis';

export default async function getAll(req: NextApiRequest, res: NextApiResponse) {
  if (redis) {
    const values = await redis.keys('*');

    const filteredValues = values.filter((val: string) => val.includes('id:'));
    let sum = 0;
    filteredValues.forEach(element => {
      sum += 1;
      console.log(element);
      redis
        ?.hmget(element, 'name', 'email', 'username')
        .then((resp: any) => console.log(sum))
        .catch(err => console.log(err));
    });

    // await redis.del('id:dffc5f2ff789bb8215db2f38979f7ca5c155230d');
  }

  res.send('Hola');
}
