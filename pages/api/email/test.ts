import { NextApiRequest, NextApiResponse } from 'next';
import sendUserChallengeInvite from './index';

export default async function getAll(req: NextApiRequest, res: NextApiResponse) {
  await sendUserChallengeInvite('hello@nuwe.io');

  res.send('Hola');
}
