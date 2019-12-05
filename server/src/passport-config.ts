import {ExtractJwt, Strategy} from 'passport-jwt';
import {User} from './models/Users';

const secret = process.env.SECRET || 'sercet';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret,
};

export default (passport: any) => {
  passport.use(
      new Strategy(opts, (payload, done) => {
        User.findById(payload.id)
            .then((user) => {
              if (user) {
                return done(null, {
                  id: user.id,
                  email: user.email,
                });
              }
              return done(null, false);
            // tslint:disable-next-line:no-console
            }).catch((err) => console.error(err));
      }),
  );
};
