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
        service: 'Gmail',
        auth: {
            user: 'pickatimeidopontfoglalas@gmail.com',
            pass: 'WKX^Xar6w^2w6sY%*V?puXThw_a_r?*j=ZXG86S3r86P=4g77zuEr6ma@JPwFCdKr_xDfMyJP',
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
            html: htmlToSend
        };
        if (mailOptions.to) {
            transporter.sendMail(mailOptions, function (err, info) {
                if (err)
                    console.log(err);
                else
                    console.log(info);
            });
        }
        else {
            console.log('Mailing address not provided.');
        }
    });
};
