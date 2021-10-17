import { useState, useRef } from 'react';
import { scrollTo } from '@lib/smooth-scroll';
import cn from 'classnames';
import * as qs from 'querystring';
import CheckIcon from '@components/icons/icon-check';
import { REPO, SITE_ORIGIN, TicketGenerationState } from '@lib/constants';
import isMobileOrTablet from '@lib/is-mobile-or-tablet';
import useConfData from '@lib/hooks/use-conf-data';
import LoadingDots from './loading-dots';
import formStyles from './form.module.css';
import ticketFormStyles from './ticket-form.module.css';
import { saveGithubToken } from '@lib/user-api';
import { GitHubOAuthData } from '@lib/types';
import IconLinkedin from './icons/icon-linkedin';

type FormState = 'default' | 'loading' | 'error';

type Props = {
  defaultUsername?: string;
  setTicketGenerationState: React.Dispatch<React.SetStateAction<TicketGenerationState>>;
};

const githubEnabled = Boolean(process.env.NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_ID);

export default function LinkedInForm({ defaultUsername = '', setTicketGenerationState }: Props) {
  const [username, setUsername] = useState(defaultUsername);
  const [formState, setFormState] = useState<FormState>('default');
  const [errorMsg, setErrorMsg] = useState('');
  const { userData, setUserData } = useConfData();
  const formRef = useRef<HTMLFormElement>(null);

  return formState === 'error' ? (
    <div>
      <div className={cn(formStyles['form-row'], ticketFormStyles['form-row'])}>
        <div className={cn(formStyles['input-label'], formStyles.error)}>
          <div className={cn(formStyles.input, formStyles['input-text'])}>{errorMsg}</div>
          <button
            type="button"
            className={cn(formStyles.submit, formStyles.error)}
            onClick={() => {
              setFormState('default');
              setTicketGenerationState('default');
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  ) : (
    <form
      ref={formRef}
      onSubmit={e => {
        e.preventDefault();

        if (formState !== 'default') {
          setTicketGenerationState('default');
          setFormState('default');
          return;
        }

        setFormState('loading');
        setTicketGenerationState('loading');

        if (!process.env.NEXT_PUBLIC_LINKEDIN_OAUTH_CLIENT_ID) {
          setFormState('error');
          setErrorMsg('LinkedIn OAuth App must be set up.');
          return;
        }

        const windowWidth = 600;
        const windowHeight = 700;
        // https://stackoverflow.com/a/32261263/114157
        const windowTop = window.top.outerHeight / 2 + window.top.screenY - 700 / 2;
        const windowLeft = window.top.outerWidth / 2 + window.top.screenX - 600 / 2;

        const q = qs.stringify({
          response_type: 'code',
          client_id: process.env.NEXT_PUBLIC_LINKEDIN_OAUTH_CLIENT_ID,
          redirect_uri: encodeURI(process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI || ''),
          scope: 'r_liteprofile'
        });

        const openedWindow = window.open(
          `https://www.linkedin.com/oauth/v2/authorization?${q} `,
          `resizable,scrollbars,status,width=${windowWidth},height=${windowHeight},top=${windowTop},left=${windowLeft}`
        );

        new Promise<GitHubOAuthData | undefined>(resolve => {
          const interval = setInterval(() => {
            if (!openedWindow || openedWindow.closed) {
              clearInterval(interval);
              resolve(undefined);
            }
          }, 250);

          window.addEventListener('message', function onMessage(msgEvent) {
            // When devtools is opened the message may be received multiple times
            if (SITE_ORIGIN !== msgEvent.origin || !msgEvent.data.type) {
              return;
            }
            clearInterval(interval);
            if (openedWindow) {
              openedWindow.close();
            }
            resolve(msgEvent.data);
          });
        })
          .then(async data => {
            if (!data) {
              setFormState('default');
              setTicketGenerationState('default');
              return;
            }

            let usernameFromResponse: string;
            let name: string;
            let image: string;
            if (data.type === 'token') {
              const res = await saveGithubToken({ id: userData.id, token: data.token });

              if (!res.ok) {
                throw new Error('Failed to store oauth result');
              }

              const responseJson = await res.json();
              usernameFromResponse = responseJson.username;
              name = responseJson.name;
              image = responseJson.image;
            } else {
              usernameFromResponse = data.login;
              name = data.name;
              image = data.image;
            }

            document.body.classList.add('ticket-generated');
            setUserData({ ...userData, username: usernameFromResponse, name });
            setUsername(usernameFromResponse);
            setFormState('default');
            setTicketGenerationState('default');

            // Prefetch GitHub avatar
            new Image().src = image;

            // Prefetch the twitter share URL to eagerly generate the page
            fetch(`/tickets/${usernameFromResponse}`).catch(_ => {});
          })
          .catch(err => {
            // eslint-disable-next-line no-console
            console.error(err);
            setFormState('error');
            setErrorMsg('Error! Please try again.');
            setTicketGenerationState('default');
          });
      }}
    >
      <div className={cn(formStyles['form-row'], ticketFormStyles['form-row'])}>
        <button
          type="submit"
          className={cn(
            formStyles.submit,
            formStyles['generate-with-github'],
            formStyles[formState],
            {
              [formStyles['not-allowed']]: !githubEnabled
            }
          )}
          disabled={
            !process.env.NEXT_PUBLIC_LINKEDIN_OAUTH_CLIENT_ID ||
            formState === 'loading' ||
            Boolean(username)
          }
          onClick={() => {
            if (formRef && formRef.current && isMobileOrTablet()) {
              scrollTo(formRef.current, formRef.current.offsetHeight);
            }
          }}
        >
          <div className={ticketFormStyles.generateWithGithub}>
            <span className={ticketFormStyles.githubIcon}>
              <IconLinkedin color="#fff" size={24} />
            </span>
            {formState === 'loading' ? (
              <LoadingDots size={4} />
            ) : (
              username || 'Generate with Linkedin'
            )}
          </div>
          {username ? (
            <span className={ticketFormStyles.checkIcon}>
              <CheckIcon color="#fff" size={24} />
            </span>
          ) : null}
        </button>
        <p className={ticketFormStyles.description}>
          {githubEnabled ? (
            'Only public info will be used.'
          ) : (
            <>
              <a
                href={`${REPO}#authentication`}
                target="_blank"
                rel="noopener noreferrer"
                className={ticketFormStyles['learn-more']}
              >
                Learn more.
              </a>
            </>
          )}
        </p>
      </div>
    </form>
  );
}
