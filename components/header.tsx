import styles from './header.module.css';
import buttonStyle from './buttons.module.css';

type Props = {
  hero: React.ReactNode;
  description: React.ReactNode;
};

export default function Header({ hero, description }: Props) {
  return (
    <>
      <h1 className={styles.hero}>{hero}</h1>
      <p className={styles.description}>{description}</p>
      <div style={{ display: 'flex', margin: 'auto' }}>
        <div style={{ margin: '30px 0px' }}>
          {hero === 'Schedule' ? (
            <button
              className={buttonStyle.button}
              onClick={() =>
                window.open(
                  'https://calendar.google.com/calendar/u/0?cid=Y19ycWw5c2docms2MjFxNTNscWMxYzNmNHBpY0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t',
                  '_blank'
                )
              }
            >
              Add schedule to my calendar
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
}
