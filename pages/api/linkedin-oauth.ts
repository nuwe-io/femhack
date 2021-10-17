import { NextApiRequest, NextApiResponse } from 'next';
import { nanoid } from 'nanoid';
import * as qs from 'querystring';
import redis from '@lib/redis';
import { renderSuccess, renderError } from '@lib/render-github-popup';
import axios from 'axios';

export default async function linkedInOAuth(req: NextApiRequest, res: NextApiResponse) {
  const q = qs.stringify({
    grant_type: 'authorization_code',
    client_id: process.env.NEXT_PUBLIC_LINKEDIN_OAUTH_CLIENT_ID,
    client_secret: process.env.LINKEDIN_OAUTH_CLIENT_SECRET,
    redirect_uri: encodeURI(process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI || ''),
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

  if (accessToken === false) {
    res.statusCode = 500;
    res.end(renderError());
    return;
  }

  const user: any = await axios
    .get('https://api.linkedin.com/v2/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    .then(respone => respone.data)
    .catch(err => {
      console.log(err);
      return false;
    });

  if (!user) {
    console.error(`Failed to get LikedIn user`);
    res.statusCode = 500;
    res.end(renderError());
    return;
  }

  console.log(user);

  const imageObj: any = await axios.get(
    `https://api.linkedin.com/v2/me?projection=(${user.id},profilePicture(displayImage~:playableStreams))`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  const iamgeURL =
    imageObj.data.profilePicture['displayImage~']?.elements[2].identifiers[0].identifier;

  if (redis) {
    const token = nanoid();
    const key = `github-user:${token}`;

    await redis
      .multi()
      .hmset(
        key,
        'id',
        user.id,
        'login',
        iamgeURL,
        'image',
        iamgeURL,
        'name',
        user.localizedFirstName + ' ' + user.localizedLastName || ''
      )
      .expire(key, 60 * 10) // 10m TTL
      .exec();

    res.end(renderSuccess({ type: 'token', token }));
  } else {
    res.end(
      renderSuccess({
        type: 'user',
        login: user.login,
        name: user.localizedFirstName + ' ' + user.localizedLastName,
        image: iamgeURL
      })
    );
  }
}
