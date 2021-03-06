import cn from 'classnames';
import styleUtils from './utils.module.css';
import styles from './hero.module.css';
import { DATE, SITE_DESCRIPTION } from '@lib/constants';

export default function Hero() {
  return (
    <div className={styles.wrapper}>
      <h1 className={cn(styleUtils.appear, styleUtils['appear-third'], styles.hero)}>
        Listen to top
        <br className={styleUtils['show-on-desktop']} /> tech female leaders
      </h1>
      <h2
        className={cn(
          styleUtils.appear,
          styleUtils['appear-third'],
          styleUtils['show-on-tablet'],
          styles.description
        )}
      >
        {SITE_DESCRIPTION}
      </h2>
      <div className={cn(styleUtils.appear, styleUtils['appear-fourth'], styles.info)}>
        <p>{DATE}</p>
        <div className={styles['description-separator']} />
        <p>
          <strong>Online</strong>
        </p>
      </div>
    </div>
  );
}
