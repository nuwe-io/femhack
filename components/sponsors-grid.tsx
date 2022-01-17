import Link from 'next/link';
import Image from 'next/image';
import cn from 'classnames';
import { Sponsor } from '@lib/types';
import styles from './sponsors-grid.module.css';
import Header from '@components/header';

function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  return (
    <Link key={sponsor.name} href={`/sponsors/${sponsor.slug}`}>
      <a
        role="button"
        tabIndex={0}
        className={cn(styles.card, {
          [styles.diamond]: sponsor.tier === 'diamond',
          [styles.gold]: sponsor.tier === 'gold'
        })}
      >
        <div className={styles.imageWrapper}>
          <Image
            alt={sponsor.name}
            src={sponsor.cardImage.url}
            className={cn(styles.image, {
              [styles.silver]: sponsor.tier === 'silver'
            })}
            loading="lazy"
            title={sponsor.name}
            width={900}
            height={500}
          />
        </div>
        {sponsor.tier !== 'silver' && (
          <div className={styles.cardBody}>
            <div>
              <h2 className={styles.name}>{sponsor.name}</h2>
              <p className={styles.description}>{sponsor.description}</p>
            </div>
          </div>
        )}
      </a>
    </Link>
  );
}

type Props = {
  sponsors: Sponsor[];
};

export default function SponsorsGrid({ sponsors }: Props) {
  const silverSponsors = sponsors.filter(s => s.tier === 'silver');
  const diamondSponsors = sponsors.filter(s => s.tier === 'diamond');
  const platinumSponsors = sponsors.filter(s => s.tier === 'Platinum');

  return (
    <>
      <Header
        hero="Game changers"
        // Game changers are companies not just committed to the cause but they are also looking for the best TOP candidates and will be hiring talent to close the gap.
        description=""
      />
      <div className={styles.grid}>
        {diamondSponsors.map(sponsor => (
          <SponsorCard key={sponsor.name} sponsor={sponsor} />
        ))}
      </div>
      <Header hero="Evangelists" description="" />
      <div className={styles.grid}>
        {platinumSponsors.map(sponsor => (
          <SponsorCard key={sponsor.name} sponsor={sponsor} />
        ))}
      </div>
      <Header
        hero="Supporters"
        // Game changers are companies not just committed to the cause but they are also looking for the best TOP candidates and will be hiring talent to close the gap.
        description=""
      />
      <div className={styles.grid}>
        {silverSponsors.map(sponsor => (
          <SponsorCard key={sponsor.name} sponsor={sponsor} />
        ))}
      </div>
    </>
  );
}
