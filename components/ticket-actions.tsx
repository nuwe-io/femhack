import { useState, useRef, useEffect } from 'react';
import cn from 'classnames';
import { SITE_URL, TWEET_TEXT } from '@lib/constants';
import IconTwitter from './icons/icon-twitter';
import IconLinkedin from './icons/icon-linkedin';
import IconDownload from './icons/icon-download';
import LoadingDots from './loading-dots';
import styleUtils from './utils.module.css';
import styles from './ticket-actions.module.css';

type Props = {
  username: string;
};

export default function TicketActions({ username }: Props) {
  const [imgReady, setImgReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const downloadLink = useRef<HTMLAnchorElement>();
  const permalink = encodeURIComponent(`${SITE_URL}/tickets/${username}`);
  const text = encodeURIComponent(TWEET_TEXT);
  // check nuwe twitter
  const tweetUrl = `https://twitter.com/intent/tweet?url=${permalink}&via=NuweIo&text=${text}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${permalink}`;
  const downloadUrl = `/api/ticket-images/${username}`;

  useEffect(() => {
    setImgReady(false);

    const img = new Image();

    img.src = downloadUrl;
    img.onload = () => {
      setImgReady(true);
      setLoading(false);
      if (downloadLink.current) {
        downloadLink.current.click();
        downloadLink.current = undefined;
      }
    };
  }, [downloadUrl]);

  return (
    <>
      <a
        className={cn(styles.button, styleUtils.appear, styles.first, 'icon-button')}
        href={tweetUrl}
        rel="noopener noreferrer"
        target="_blank"
      >
        <IconTwitter width={24} /> Tweet it!
      </a>
      <a
        className={cn(
          styles.button,
          styleUtils.appear,
          styles.second,
          'icon-button',
          // LinkedIn Share widget doesn’t work on mobile
          styles['linkedin-button']
        )}
        href={linkedInUrl}
        rel="noopener noreferrer"
        target="_blank"
      >
        <IconLinkedin size={20} /> Share on LinkedIn
      </a>
    </>
  );
}
