import { GetStaticProps } from 'next';

import Page from '@components/page';
import SponsorsGrid from '@components/sponsors-grid';
import Layout from '@components/layout';
import Header from '@components/header';

import { getAllSponsors } from '@lib/cms-api';
import { Sponsor } from '@lib/types';
import { META_DESCRIPTION } from '@lib/constants';

type Props = {
  sponsors: Sponsor[];
};

export default function ExpoPage({ sponsors }: Props) {
  const meta = {
    title: 'Companies and partners',
    description: META_DESCRIPTION
  };

  return (
    <Page meta={meta}>
      <Layout>
        <Header hero="Expo" description={meta.description} />
        <SponsorsGrid sponsors={sponsors} />
      </Layout>
    </Page>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const sponsors = await getAllSponsors();

  return {
    props: {
      sponsors
    },
    revalidate: 60
  };
};
