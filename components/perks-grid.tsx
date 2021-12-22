import { Perk } from '@lib/types';
import styles from './jobs-grid.module.css';

type Props = {
  perks: Perk[];
};

function CompanyJobs({ perks }: Props) {
  return (
    <div className={styles.grid}>
      {perks.map(perk => (
        <a
          key={perk.id}
          className={styles.card}
          href={perk.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className={styles.cardBody}>
            <div>
              <h3 className={styles.title}>{perk.title}</h3>
              <p className={styles.company}>{perk.companyName}</p>
              <p className={styles.description}>{perk.description}</p>
            </div>
            <p className={styles.link}>
              Redeem now
              <svg
                className={styles.icon}
                viewBox="0 0 24 24"
                width="16"
                height="16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                shapeRendering="geometricPrecision"
              >
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <path d="M15 3h6v6" />
                <path d="M10 14L21 3" />
              </svg>
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}

export default function PerksGrid({ perks }: Props) {
  const companies = perks?.reduce((allCompanies: any, perk) => {
    allCompanies[perk.companyName] = [...(allCompanies[perk.companyName] || []), perk];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return allCompanies;
  }, {});

  return (
    <>
      {Object.keys(companies)?.map((companyName: string) => (
        <div key={companyName} className={styles.companyRow}>
          <div className={styles.rowHeader}>
            <h2 className={styles.companyName}>{companyName}</h2>
          </div>
          <CompanyJobs perks={companies[companyName]} />
        </div>
      ))}
    </>
  );
}
