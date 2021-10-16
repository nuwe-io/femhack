import styles from './ticket-info.module.css';
import styleUtils from './utils.module.css';
import Logo from './logo';
import { DATE, SITE_URL } from '@lib/constants';
import { NuweLogo } from '@components/icons/icon-platform';

const siteUrl = new URL(SITE_URL);
const siteUrlForTicket = `${siteUrl.host}${siteUrl.pathname}`.replace(/\/$/, '');

export default function TicketInfo({ logoTextSecondaryColor = 'var(--secondary-color)' }) {
  const createdBy = (
    <div className={styles['created-by']}>
      <div className={styles['created-by-text']}>Created by </div>
      <div className={styles['created-by-logo']}>
        <NuweLogo height="100%" color="var(--green)" />
      </div>
    </div>
  );
  return (
    <div className={styles.info}>
      <div className={styles.logo}>
        <Logo textSecondaryColor={logoTextSecondaryColor} />
      </div>
      <div className={styles.date}>
        <div>{DATE}</div>
        <div>ONLINE</div>
      </div>
      <div className={styleUtils['hide-on-mobile']}>{createdBy}</div>
      <div className={styles.url}>{siteUrlForTicket}</div>
      <div className={styleUtils['show-on-mobile']}>{createdBy}</div>
    </div>
  );
}
