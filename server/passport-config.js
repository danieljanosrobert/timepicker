"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var passport_jwt_1 = require("passport-jwt");
var Users_1 = require("./models/Users");
var secret = process.env.SECRET || 'sercet';
var opts = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret,
};
exports.default = (function (passport) {
    passport.use(new passport_jwt_1.Strategy(opts, function (payload, done) {
        Users_1.User.findById(payload.id)
            .then(function (user) {
            if (user) {
                return done(null, {
                    id: user.id,
                    email: user.email,
                });
            }
            return done(null, false);
            // tslint:disable-next-line:no-console
        }).catch(function (err) { return console.error(err); });
    }));
});
