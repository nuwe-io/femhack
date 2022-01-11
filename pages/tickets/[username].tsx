import { GetStaticProps, GetStaticPaths } from 'next';
import Error from 'next/error';
import Head from 'next/head';
import { SkipNavContent } from '@reach/skip-nav';
import redis from '@lib/redis';

import Page from '@components/page';
import ConfContent from '@components/index';
import { SITE_URL, SITE_NAME, META_DESCRIPTION, SAMPLE_TICKET_NUMBER } from '@lib/constants';

type Props = {
  username: string | null;
  usernameFromParams: string | null;
  name: string | null;
  image: string | undefined;
  ticketNumber: number | null;
};

export default function TicketShare({
  username,
  ticketNumber,
  name,
  image,
  usernameFromParams
}: Props) {
  if (!ticketNumber) {
    return <Error statusCode={404} />;
  }

  const meta = username
    ? {
        title: `${name}’s ${SITE_NAME} Ticket`,
        description: META_DESCRIPTION,
        image: image,
        url: `${SITE_URL}/tickets/${username}`
      }
    : {
        title: 'Femhack - Tickets',
        description: META_DESCRIPTION,
        image: image,
        url: `${SITE_URL}/tickets/${usernameFromParams}`
      };

  return (
    <Page meta={meta}>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <SkipNavContent />
      <ConfContent
        defaultUserData={{
          username: username || undefined,
          name: name || '',
          image: image,
          ticketNumber
        }}
        sharePage
      />
    </Page>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const username = params?.username?.toString() || null;

  if (redis) {
    if (username) {
      const [name, image, ticketNumber] = await redis.hmget(
        `user:${username}`,
        'name',
        'image',
        'ticketNumber'
      );

      if (ticketNumber) {
        return {
          props: {
            username: username || null,
            usernameFromParams: username || null,
            name: name || username || null,
            image: image || undefined,
            ticketNumber: parseInt(ticketNumber, 10) || null
          },
          revalidate: 5
        };
      }
    }
    return {
      props: {
        username: null,
        usernameFromParams: username || null,
        name: null,
        image: undefined,
        ticketNumber: null
      },
      revalidate: 5
    };
  } else {
    return {
      props: {
        username: null,
        usernameFromParams: username || null,
        name: null,
        image: undefined,
        ticketNumber: SAMPLE_TICKET_NUMBER
      },
      revalidate: 5
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  return Promise.resolve({
    paths: [],
    fallback: 'blocking'
  });
};
