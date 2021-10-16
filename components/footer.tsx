import cn from 'classnames';
import VercelLogo from '@components/icons/icon-platform';
import styles from './footer.module.css';
import { COPYRIGHT_HOLDER, SITE_NAME } from '@lib/constants';

export function HostedByVercel() {
  return (
    <a
      href="https://nuwe.io"
      className={cn(styles['footer-link'], styles['footer-logo'])}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className={styles['secondary-text']}>Created by </div>
      <VercelLogo color="var(--green)" />
    </a>
  );
}

export default function Footer() {
  return (
    <footer className={cn(styles.footer)}>
      <div className={styles['footer-legal']}>
        <div className={styles['footer-hostedby']}>
          <HostedByVercel />
          <div className={styles['footer-separator']} />
        </div>
        <div className={styles['footer-copyright']}>
          Copyright © {`${new Date().getFullYear()} `} {COPYRIGHT_HOLDER || `${SITE_NAME}.`} All
          rights reserved.
        </div>
      </div>
    </footer>
  );
}
