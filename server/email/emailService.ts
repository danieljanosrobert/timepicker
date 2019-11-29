import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';

const readHTMLFile = (path: any, callback: any) => {
  fs.readFile(path, { encoding: 'utf-8' }, (err, html) => {
    if (err) {
      throw err;
      callback(err);
    } else {
      callback(null, html);
    }
  });
};

export const sendMail = (type: string, emailDetails: any) => {
  if (process.env.TEST) {
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'pickatimeidopontfoglalas@gmail.com',
      pass: 'WKX^Xar6w^2w6sY%*V?puXThw_a_r?*j=ZXG86S3r86P=4g77zuEr6ma@JPwFCdKr_xDfMyJP',
    },
  });

  readHTMLFile(__dirname + '/templates/' + type, (err: any, html: any) => {
    const template = handlebars.compile(html);
    const replacements = emailDetails.replacements;
    replacements.homeUrl = process.env.API_URL || 'http://localhost:8081';
    const htmlToSend = template(replacements);

    const mailOptions = {
      from: 'pickatimeidopontfoglalas@gmail.com',
      to: emailDetails.to,
      subject: emailDetails.subject,
      html: htmlToSend,
    };
    if (mailOptions.to) {
      transporter.sendMail(mailOptions, (mailErr, info) => {
        if (mailErr) {
          // tslint:disable-next-line:no-console
          console.log(mailErr);
        } else {
          // tslint:disable-next-line:no-console
          console.log(info);
        }
      });
    } else {
      // tslint:disable-next-line:no-console
      console.error('Mailing address not provided.');
    }
  });

};
