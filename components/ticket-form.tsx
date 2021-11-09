/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { useState, useRef } from 'react';
import { scrollTo } from '@lib/smooth-scroll';
import cn from 'classnames';
import { TicketGenerationState } from '@lib/constants';
import isMobileOrTablet from '@lib/is-mobile-or-tablet';
import useConfData from '@lib/hooks/use-conf-data';
import LoadingDots from './loading-dots';
import formStyles from './form.module.css';
import ticketFormStyles from './ticket-form.module.css';
import axios from 'axios';
import CheckIcon from '@components/icons/icon-check';

type FormState = 'default' | 'loading' | 'error';

type Props = {
  defaultUsername?: string;
  setTicketGenerationState: React.Dispatch<React.SetStateAction<TicketGenerationState>>;
};

type ErrorProps = {
  setFormState: any;
  setTicketGenerationState: any;
  errorMsg: string;
};

type UserProps = {
  formRef: any;
  focused: boolean;
  name: string;
  username: string;
  submit: any;
  setName: any;
  setFocused: any;
  setUsername: any;
  formState: FormState;
};

const UserInfoForm = ({
  formRef,
  focused,
  name,
  submit,
  setName,
  setFocused,
  formState
}: UserProps) => {
  return (
    <form ref={formRef} onSubmit={e => submit(e)}>
      <div className={cn(formStyles['form-row'], ticketFormStyles['form-row'])}>
        <label
          htmlFor="name-input-field"
          className={cn(formStyles['input-label'], {
            [formStyles.focused]: focused
          })}
        >
          <input
            className={formStyles.input}
            autoComplete="off"
            type="string"
            id="name-input-field"
            value={name}
            onChange={e => setName(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Enter your full name"
            aria-label="Your full name"
            required
          />
        </label>
      </div>
      <div className={cn(formStyles['form-row'], ticketFormStyles['form-row'])}>
        <button
          type="submit"
          className={cn(formStyles.submit, formStyles[formState])}
          onClick={() => {
            if (formRef && formRef.current && isMobileOrTablet()) {
              scrollTo(formRef.current, formRef.current.offsetHeight);
            }
          }}
        >
          <div className={ticketFormStyles.generateWithGithub}>
            {formState === 'loading' ? <LoadingDots size={4} /> : 'Set up my ticket information'}
          </div>
        </button>
      </div>
    </form>
  );
};

const ErrorAction = ({ setFormState, setTicketGenerationState, errorMsg }: ErrorProps) => {
  return (
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
  );
};

export default function Form({ defaultUsername = '', setTicketGenerationState }: Props) {
  const [username, setUsername] = useState(defaultUsername || '');
  const [formState, setFormState] = useState<FormState>('default');
  const [errorMsg, setErrorMsg] = useState('');
  const { userData, setUserData } = useConfData();
  const formRef = useRef<HTMLFormElement>(null);
  const [focused, setFocused] = useState(false);
  const [name, setName] = useState('');

  const submit = async (e: any) => {
    e.preventDefault();

    if (formState !== 'default') {
      setTicketGenerationState('default');
      setFormState('default');
      return;
    }

    setFormState('loading');
    setTicketGenerationState('loading');

    await axios
      .post(`${process.env.NEXT_PUBLIC_SITE_ORIGIN}/api/set-user-info`, {
        id: userData.id,
        username: name.toLowerCase().split(' ').join(''),
        name: name,
        image: ''
      })
      .then((res: any) => {
        const usernameFromResponse = res.data.username;
        const nameFromResponse = res.data.name;
        document.body.classList.add('ticket-generated');
        setUserData({
          ...userData,
          username: usernameFromResponse,
          name: nameFromResponse
        });
        setUsername(usernameFromResponse);
        setFormState('default');
        setTicketGenerationState('default');

        // Prefetch the twitter share URL to eagerly generate the page
        fetch(`/tickets/${usernameFromResponse}`).catch(error => console.log(error));
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error(err);
        setFormState('error');
        setErrorMsg('Error! Please try again.');
        setTicketGenerationState('default');
      });
  };

  return formState === 'error' ? (
    <ErrorAction
      setFormState={setFormState}
      setTicketGenerationState={setTicketGenerationState}
      errorMsg={errorMsg}
    />
  ) : userData.username ? (
    <button
      disabled={true}
      className={cn(formStyles.submit, formStyles['generate-with-github'], formStyles[formState])}
    >
      <div className={ticketFormStyles.generatedUser}>
        <img height="40px" src="/femhack.png" />
        {userData?.username}
      </div>
      <span className={ticketFormStyles.checkIcon}>
        <CheckIcon color="#000" size={24} />
      </span>
    </button>
  ) : (
    <UserInfoForm
      formRef={formRef}
      focused={focused}
      name={name}
      username={username}
      submit={submit}
      setName={setName}
      setFocused={setFocused}
      setUsername={setUsername}
      formState={formState}
    />
  );
}
