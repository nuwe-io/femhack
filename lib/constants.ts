export const SITE_URL = 'https://femhack.nuwe.io';
export const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || new URL(SITE_URL).origin;
export const TWITTER_USER_NAME = 'nuwe.io';
export const BRAND_NAME = 'International FemHack';
export const SITE_NAME_MULTILINE = ['International', 'FemHack'];
export const SITE_NAME = 'International FemHack';
export const META_DESCRIPTION =
  'The International FemHack is an online event composed of a female-only international Hackaton on the modalities of Frontend, Backend and Data Science and a series of talks by tech industry leaders opened for everyone.';
export const SITE_DESCRIPTION = 'Listen to the top tech female leaders from companies such as Google or Novartis';
export const DATE = 'January 21-23, 2022';
export const SHORT_DATE = 'Jan 21 - 5:00pm CEST';
export const FULL_DATE = 'Jan 21th 5pm Central European Summer Time (UTC+2)';
export const TWEET_TEXT = META_DESCRIPTION;
export const COOKIE = 'user-id';

// Remove process.env.NEXT_PUBLIC_... below and replace them with
// strings containing your own privacy policy URL and copyright holder name
export const LEGAL_URL = process.env.NEXT_PUBLIC_PRIVACY_POLICY_URL;
export const COPYRIGHT_HOLDER = process.env.NEXT_PUBLIC_COPYRIGHT_HOLDER;

export const CODE_OF_CONDUCT =
  'https://www.notion.so/vercel/Code-of-Conduct-Example-7ddd8d0e9c354bb597a0faed87310a78';
export const REPO = 'https://github.com/nuwe-io/femhack';
export const SAMPLE_TICKET_NUMBER = 1234;
export const NAVIGATION = [
  {
    name: 'Livestream',
    route: '/stage'
  },
  {
    name: 'Schedule',
    route: '/schedule'
  },
  {
    name: 'Speakers',
    route: '/speakers'
  },
  {
    name: 'Expo',
    route: '/expo'
  },
  {
    name: 'Jobs',
    route: '/jobs'
  },
  {
    name: 'Perks',
    route: '/perks'
  }
];

export type TicketGenerationState = 'default' | 'loading';
