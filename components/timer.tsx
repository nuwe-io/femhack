import cn from 'classnames';
import styleUtils from './utils.module.css';
import styles from './hero.module.css';
import counterStyles from './timer.module.css';
import { SITE_DESCRIPTION } from '@lib/constants';
import ConfContainer from './conf-container';
import { useState, useEffect } from 'react';

const Countdown = () => {
  const [countdownDate, setCountdownDate] = useState(new Date('Jan 21, 2022 17:00:00').getTime());
  const [state, setState] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    setInterval(() => setNewTime(), 1000);
  }, []);

  const setNewTime = () => {
    if (countdownDate) {
      const currentTime = new Date().getTime();

      const distanceToDate = countdownDate - currentTime;

      let days: any = Math.floor(distanceToDate / (1000 * 60 * 60 * 24));
      let hours: any = Math.floor((distanceToDate % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes: any = Math.floor((distanceToDate % (1000 * 60 * 60)) / (1000 * 60));
      let seconds: any = Math.floor((distanceToDate % (1000 * 60)) / 1000);

      const numbersToAddZeroTo = [1, 2, 3, 4, 5, 6, 7, 8, 9];

      days = `${days}`;
      if (numbersToAddZeroTo.includes(hours)) {
        hours = `0${hours}`;
      } else if (numbersToAddZeroTo.includes(minutes)) {
        minutes = `0${minutes}`;
      } else if (numbersToAddZeroTo.includes(seconds)) {
        seconds = `0${seconds}`;
      }

      setState({ days: days, hours: hours, minutes, seconds });
    }
  };

  return (
    <div className={cn(styleUtils.appear, styleUtils['appear-fourth'])}>
      <div className={counterStyles['countdown-wrapper']}>
        <div className={counterStyles['time-section']}>
          <h1 className={counterStyles['time']}>{state.days || '0'}</h1>
          <small className={counterStyles['time-text']}>Days</small>
        </div>
        <div className={counterStyles['time-section']}>
          <div className={counterStyles['time']}>:</div>
        </div>
        <div className={counterStyles['time-section']}>
          <h1 className={counterStyles['time']}>{state.hours || '00'}</h1>
          <small className={counterStyles['time-text']}>Hours</small>
        </div>
        <div className={counterStyles['time-section']}>
          <div className={counterStyles['time']}>:</div>
        </div>
        <div className={counterStyles['time-section']}>
          <div className={counterStyles['time']}>{state.minutes || '00'}</div>
          <small className={counterStyles['time-text']}>Minutes</small>
        </div>
        <div className={counterStyles['time-section']}>
          <div className={counterStyles['time']}>:</div>
        </div>
        <div className={counterStyles['time-section']}>
          <div className={counterStyles['time']}>{state.seconds || '00'}</div>
          <small className={counterStyles['time-text']}>Seconds</small>
        </div>
      </div>
    </div>
  );
};

export default function Timer() {
  return (
    <ConfContainer>
      <div className={styles.wrapper}>
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
        <div className={cn(styleUtils.appear, styleUtils['appear-third'], styles.live)}>
          <p>We will be live in:</p>
        </div>
        <h2
          className={cn(
            styleUtils.appear,
            styleUtils['appear-fourth'],
            styleUtils['show-on-mobile'],
            styles.description
          )}
        >
          {SITE_DESCRIPTION}
        </h2>
        <Countdown />
      </div>
    </ConfContainer>
  );
}
