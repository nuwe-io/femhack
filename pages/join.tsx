/**
 * Copyright 2020 Vercel Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
                If you join as a competitor you'll also be joining as a viewer, so do not worry.
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
            </div>
          </div>
        </ConfContainer>
      </Layout>
    </Page>
  );
}
