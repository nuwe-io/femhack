/* eslint-disable node/no-path-concat */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import hbs from 'nodemailer-express-handlebars';
import { scheduleEmailPipeline } from '../../../lib/email/scheduler';

enum MomentTypes {
  days = 'days',
  hours = 'hours'
}

export default async function sendUserChallengeInvite(email: string) {
  const CLIENT_ID = process.env.EMAIL_CLIENT_ID;
  const CLEINT_SECRET = process.env.EMAIL_CLIENT_SECRET;
  const REDIRECT_URI = process.env.EMAIL_REDIRECT_RUI;
  const REFRESH_TOKEN = process.env.EMAIL_REFRESH_TOKEN;

  const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLEINT_SECRET, REDIRECT_URI);

  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  const firstEmail = {
    title: '🎉 Congrats, you are in!',
    eventImage: '',
    description:
      'Thank you for registering for the Femhack webinars! We are excited that you will be joining us on January 21-23 for our all-digital event experience. \n\n We will share more details about the speakers, agenda, and activities once the event is closer. ',
    secondParaph:
      'Please save this email for future reference. And if you have any question, please contact the support team at: femhack@nuwe.io',
    thirdParagraph:
      'Now that you are in, if you want to participate in the hackathon competition please go to nuwe.io/femhack',
    grettings: 'We look forward to getting together virtually in January!',
    signtarue: 'Femhack team',
    eventURL: 'https://femhack.nuwe.io',
    subject: '🎉 You have successfully registered for the Femhack workshops'
  };

  const followUp = {
    title: 'Tomorrow is the big day!',
    eventImage: '',
    description: `Just a day away from this amazing event! We are all ready for tomorrrow`,
    secondParaph:
      'In just one day we are going LIVE and we will stream the full event at: https://femhack.nuwe.io/stage',
    thirdParagraph:
      'Stay in touch with us and join our community discord server where you can connect with other amazing people!',
    grettings: 'We look forward to getting together virtually in January!',
    signtarue: 'Femhack team',
    eventURL: 'https://femhack.nuwe.io',
    subject: `😎 Just one day to go, don't miss it!`
  };

  const lastAlert = {
    title: 'Just one hour left!',
    eventImage: '',
    description: `It's us again, we can not wait to see all of you there!`,
    secondParaph:
      'In just one hour we are going LIVE. We will stream the full event at: https://femhack.nuwe.io/stage',
    thirdParagraph:
      'Stay in touch with us and join our community discord server where you can connect with other amazing people!',
    grettings: 'We look forward to getting together virtually in January!',
    signtarue: 'Femhack team',
    eventURL: 'https://femhack.nuwe.io/stage',
    subject: `🥳 We are going Live in 1Hour!  `
  };

  const liveEmail = {
    title: 'WE ARE LIVE!',
    eventImage: '',
    description: `It's time, we are live and we do not want you to miss anything.`,
    secondParaph: 'Follow the event through our livestream at https://femhack.nuwe.io/stage',
    thirdParagraph:
      'And if you have any doubts or just want to contact us, please reach out to this email or connect with us at our Discord server.',
    grettings: 'We look forward to getting together virtually in January!',
    signtarue: 'Femhack team',
    eventURL: 'https://femhack.nuwe.io/stage',
    subject: `🥳 Femhack is LIVE!🎉 `
  };

  const accessToken: any = await oAuth2Client.getAccessToken();

  if (!accessToken) {
    console.log('No access token');
    return false;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'hello@nuwe.io',
      clientId: CLIENT_ID,
      clientSecret: CLEINT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken
    }
  });

  if (!transporter) {
    console.log('No transporter');
    return false;
  }

  transporter.use(
    'compile',
    hbs({
      viewEngine: {
        partialsDir: './pages/api/email/views/partials',
        layoutsDir: './pages/api/email/views/layouts',
        defaultLayout: '',
        extname: '.hbs'
      },
      extName: '.hbs',
      viewPath: './pages/api/email/views'
    })
  );

  const firstMailOptions = {
    from: {
      name: 'Femhack Team',
      address: 'hello@nuwe.io'
    },
    to: email,
    subject: firstEmail.subject,
    template: 'eventEmail',
    context: firstEmail
  };

  const followMailOptions = {
    from: {
      name: 'Femhack Team',
      address: 'hello@nuwe.io'
    },
    to: email,
    subject: followUp.subject,
    template: 'eventEmail',
    context: followUp
  };

  const alertMailOptions = {
    from: {
      name: 'Femhack Team',
      address: 'hello@nuwe.io'
    },
    to: email,
    subject: lastAlert.subject,
    template: 'eventEmailLive',
    context: lastAlert
  };

  const lastMailOptions = {
    from: {
      name: 'Femhack Team',
      address: 'hello@nuwe.io'
    },
    to: email,
    subject: liveEmail.subject,
    template: 'eventEmailLive',
    context: liveEmail
  };

  const pieplineObject = {
    setDate: new Date('2021-10-29 14:00:00'),
    transporter: transporter,
    mailOptions: firstMailOptions,
    followOptions: followMailOptions,
    alertOptions: alertMailOptions,
    liveOptions: lastMailOptions
  };

  const followup = { time: 1, type: MomentTypes.days };
  const lastAlertInfo = { time: 1, type: MomentTypes.hours };

  console.log('Calling to send the first email');

  await new Promise((resolve, reject) => {
    // send mail
    transporter.sendMail(firstMailOptions, (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(info);
        resolve(info);
      }
    });
  });
}
