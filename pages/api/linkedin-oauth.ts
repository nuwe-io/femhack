import { NextApiRequest, NextApiResponse } from 'next';
import { nanoid } from 'nanoid';
import * as qs from 'querystring';
import redis from '@lib/redis';
import { renderSuccess, renderError } from '@lib/render-github-popup';
import axios from 'axios';
/**
 * This API route must be triggered as a callback of your GitHub OAuth app.
 */
export default async function linkedInOAuth(req: NextApiRequest, res: NextApiResponse) {
  if (!req.query.code) {
    res.end(renderSuccess());
    return;
  }

  const q = qs.stringify({
    grant_type: 'authorization_code',
    client_id: process.env.NEXT_PUBLIC_LINKEDIN_OAUTH_CLIENT_ID,
    client_secret: process.env.LINKEDIN_OAUTH_CLIENT_SECRET,
    redirect_uri: encodeURIComponent(process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI || ''),
    code: req.query.code
  });
  //const q =       `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&client_id=${process.env.NEXT_PUBLIC_LINKEDIN_OAUTH_CLIENT_ID}&client_secret=${process.env.LINKEDIN_OAUTH_CLIENT_SECRET}&redirect_uri=${process.env.NEXT_PUBLIC_SITE_ORIGIN}&code=${req.query.code}`,

  const accessToken: any = await axios
    .post(`https://www.linkedin.com/oauth/v2/accessToken?${q}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then((response: any) => response.data.access_token)
    .catch(err => {
      console.log(err);
      return false;
    });

  console.log(accessToken)  

  if (!accessToken) {
    res.statusCode = 500;
    res.end(renderError());
    return;
  }

  const userRes = await fetch('https://api.linkedin.com/v2/me', {
    headers: {
      Authorization: `bearer ${accessToken as string}`
    }
  });

  if (!userRes.ok) {
    console.error(`Failed to get LikedIn user: ${userRes.status} ${await userRes.text()}`);
    res.statusCode = 500;
    res.end(renderError());
    return;
  }

  const user = await userRes.json();

  if (redis) {
    const token = nanoid();
    const key = `linkedin-user:${token}`;

    await redis
      .multi()
      .hmset(
        key,
        'id',
        user.id,
        'login',
        user.profilePicture,
        'name',
        user.firstname + ' ' + user.lastName || ''
      )
      .expire(key, 60 * 10) // 10m TTL
      .exec();

    res.end(renderSuccess({ type: 'token', token }));
  } else {
    res.end(renderSuccess({ type: 'user', login: user.login, name: user.name }));
  }
}
