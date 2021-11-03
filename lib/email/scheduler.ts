/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import moment from 'moment';
import schedule from 'node-schedule';
import Mail from 'nodemailer/lib/mailer';

type ScheduleObject = {
  setDate: Date; // 2021-10-26 14:13:00
  transporter: Mail;
  mailOptions: any;
};

type PipelineObject = {
  setDate: Date; // 2021-10-26 14:13:00
  transporter: Mail;
  mailOptions: any;
  followOptions: any;
  alertOptions: any;
  liveOptions: any;
};

enum MomentTypes {
  days = 'days',
  hours = 'hours'
}

type PipelineAlert = {
  time: number;
  type: MomentTypes;
};

const setUpSchdule = (rule: schedule.RecurrenceRule, date: Date) => {
  rule.tz = 'Europe/Madrid';
  rule.year = moment(date).year();
  rule.month = moment(date).month();
  rule.date = moment(date).date();
  rule.hour = moment(date).hours();
  rule.minute = moment(date).minutes();
  rule.second = moment(date).seconds();
};

/**
 * Function to schedule and email
 * @param {ScheduleObject} Object That contains the email and date information
 */
export const scheduleEmail = ({ setDate, transporter, mailOptions }: ScheduleObject) => {
  console.log('Step 4');
  const rule = new schedule.RecurrenceRule();
  setUpSchdule(rule, setDate);
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  schedule.scheduleJob(rule, async () => {
    return await new Promise((resolve, reject) => {
      // send mail
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log(info);
          resolve(info);
        }
      });
    });
  });
};

/**
 * @name scheduleEmailPipeline
 * 4-Steps notification email pipeline
 * @param {ScheduleObject} Object That contains the email and date information
 * @param {PipelineAlert} followup Date when the folloup needs to be send
 * @param {PipelineAlert} lastAlert Date when the last alret needs to be send
 */
export const scheduleEmailPipeline = async (
  { setDate, transporter, mailOptions, followOptions, alertOptions, liveOptions }: PipelineObject,
  followup: PipelineAlert,
  lastAlert: PipelineAlert
) => {
  console.log('Step 2');
  // Convert to UTC+2
  const date = new Date(setDate);
  const followupDate = moment(date).subtract(followup.time, followup.type).toString();
  const beforeStart = moment(date).subtract(lastAlert.time, lastAlert.type).toString();

  // First email once they have joined
  console.log('Step 3');

  await new Promise((resolve, reject) => {
    // send mail
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(info);
        resolve(info);
      }
    });
  });

  // Followup
  scheduleEmail({ setDate: new Date(followupDate), transporter, mailOptions: followOptions });

  // Last alert
  scheduleEmail({ setDate: new Date(beforeStart), transporter, mailOptions: alertOptions });

  // Send when starts
  scheduleEmail({ setDate, transporter, mailOptions: liveOptions });
};
