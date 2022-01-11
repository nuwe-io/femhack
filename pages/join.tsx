import cn from 'classnames';
import styles from '../components/buttons.module.css';
import Page from '@components/page';
import Layout from '@components/layout';
import { META_DESCRIPTION } from '@lib/constants';
import Link from 'next/link';
import styleUtils from '../components/utils.module.css';
import heroStyles from '../components/hero.module.css';
import ConfContainer from '@components/conf-container';

export default function Join() {
  const meta = {
    title: 'Join the Femhack! - The international women-only hackthon',
    description: META_DESCRIPTION
  };

  return (
    <Page meta={meta}>
      <Layout>
        <ConfContainer>
          <div className={heroStyles.wrapper}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <img
                className={cn(styleUtils.appear, styleUtils['appear-first'])}
                alt="femhackLogo"
                width="330px"
                src="/femhackFull.png"
              />
            </div>
            <h1 className={cn(styleUtils.appear, styleUtils['appear-second'], heroStyles.hero)}>
              Break the algorithm
            </h1>
            <div className={cn(styleUtils.appear, styleUtils['appear-third'])}>
              <p className={styles.pdiv}>
                If you join as a competitor you'll also be joining as a listener, so do not worry.
                We'll keep you updated every step of the way
              </p>
              <div className={styles.buttonsdiv}>
                <div style={{ margin: '20px' }}>
                  <Link href="https://nuwe.io/event/femhack">
                    <button type="button" className={styles.button}>
                      Be a competitor
                    </button>
                  </Link>
                </div>

                <div style={{ margin: '20px' }}>
                  <Link href="/">
                    <button id="button" type="button" className={cn(styles.button, styles.primary)}>
                      Join the conferences
                    </button>
                  </Link>
                </div>
              </div>
              <div className={styles.pdiv}>
                An international women-only Hackathon opened to all levels of expertise, and a
                series of talks from tech industry leaders.
              </div>
              <div className={styles.pdiv}>
                With the purpose to give more visibility to women in tech, promote more female
                employers and create female role models for the next generations.
              </div>
            </div>
          </div>
        </ConfContainer>
      </Layout>
    </Page>
  );
}
