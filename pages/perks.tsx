import { GetStaticProps } from 'next';

import Page from '@components/page';
import Layout from '@components/layout';
import Header from '@components/header';

import { Perk } from '@lib/types';
import { META_DESCRIPTION } from '@lib/constants';
import PerksGrid from '@components/perks-grid';
import { getAllPerks } from '@lib/cms-api';

type Props = {
  perks: Perk[];
};

export default function Perks({ perks }: Props) {
  const meta = {
    title: 'Career Fair - Femhack International',
    description: META_DESCRIPTION
  };

  const perksDesription =
    'Femhack perks are a sets of discounts, freebies, and other benefits that you can get for attending the conferences. You can get them by attending the conference or participating in the hackathon. Send and email to femhack@nuwe.io with the perk name you are intereseted in and your email and we will send you the details and the code so benefit from the perk.';

  return (
    <Page meta={meta}>
      <Layout>
        <Header hero="Femhack's grants" description={perksDesription} />
        <PerksGrid perks={perks} />
      </Layout>
    </Page>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const perks = await getAllPerks();

  return {
    props: {
      perks
    },
    revalidate: 60
  };
};
