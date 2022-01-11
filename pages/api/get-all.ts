import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import redis from '@lib/redis';

export default async function getAll(req: NextApiRequest, res: NextApiResponse) {
  const wstream = fs.createWriteStream('myOutput.csv');

  if (redis) {
    const values = await redis.keys('*');

    const filteredValues = values.filter((val: string) => val.includes('id:'));
    const jobs: any[] = [];
    filteredValues.forEach(element => {
      redis
        ?.hmget(element, 'name', 'email', 'username')
        .then((resp: any) => {
          jobs.push(resp);
          const csv = `${resp}; \n`;
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          wstream.write(csv);
        })
        .catch(err => console.log(err));
    });
    res.json(jobs);
    // await redis.del('id:dffc5f2ff789bb8215db2f38979f7ca5c155230d');
  }

  // res.send('hola');
}
