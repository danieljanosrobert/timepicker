"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var nodemailer_1 = __importDefault(require("nodemailer"));
var handlebars_1 = __importDefault(require("handlebars"));
var fs_1 = __importDefault(require("fs"));
var readHTMLFile = function (path, callback) {
    fs_1.default.readFile(path, { encoding: 'utf-8' }, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};
exports.sendMail = function (type, emailDetails) {
    if (process.env.TEST) {
        return;
    }
    var transporter = nodemailer_1.default.createTransport({
        service: process.env.SMTP_SERVICE || 'Gmail',
        auth: {
            user: process.env.SMTP_AUTH || 'pickatimeidopontfoglalas@gmail.com',
            pass: process.env.SMTP_PASSWORD || 'password',
        },
    });
    readHTMLFile(__dirname + '/templates/' + type, function (err, html) {
        var template = handlebars_1.default.compile(html);
        var replacements = emailDetails.replacements;
        replacements.homeUrl = process.env.API_URL || 'http://localhost:8081';
        var htmlToSend = template(replacements);
        var mailOptions = {
            from: 'pickatimeidopontfoglalas@gmail.com',
            to: emailDetails.to,
            subject: emailDetails.subject,
            html: htmlToSend,
        };
        if (mailOptions.to) {
            transporter.sendMail(mailOptions, function (mailErr, info) {
                if (mailErr) {
                    // tslint:disable-next-line:no-console
                    console.log(mailErr);
                }
                else {
                    // tslint:disable-next-line:no-console
                    console.log(info);
                }
            });
        }
        else {
            // tslint:disable-next-line:no-console
            console.error('Mailing address not provided.');
        }
    });
};
