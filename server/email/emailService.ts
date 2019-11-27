import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';

const readHTMLFile = function (path: any, callback: any) {
  fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
    if (err) {
      throw err;
      callback(err);
    }
    else {
      callback(null, html);
    }
  });
};

export const sendMail = (type: string, emailDetails: any) => {
  if (process.env.TEST) {
    return;
  }

  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'pickatimeidopontfoglalas@gmail.com',
      pass: 'WKX^Xar6w^2w6sY%*V?puXThw_a_r?*j=ZXG86S3r86P=4g77zuEr6ma@JPwFCdKr_xDfMyJP',
    },
  });

  readHTMLFile(__dirname + '/templates/' + type, function (err: any, html: any) {
    var template = handlebars.compile(html);
    var replacements = emailDetails.replacements;
    replacements.homeUrl = process.env.API_URL || 'http://localhost:8081';
    var htmlToSend = template(replacements);

    var mailOptions = {
      from: 'pickatimeidopontfoglalas@gmail.com',
      to: emailDetails.to,
      subject: emailDetails.subject,
      html: htmlToSend
    };
    if (mailOptions.to) {
      transporter.sendMail(mailOptions, function (err, info) {
        if (err)
          console.log(err);
        else
          console.log(info);
      });
    } else {
      console.log('Mailing address not provided.');
    }
  });

};