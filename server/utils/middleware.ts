import {constants} from 'http2';
import * as _ from 'lodash';
import jwt from 'jsonwebtoken';

const adminSecret = process.env.ADMIN_SECRET || 'secret';

class Middleware {

  public static log(req: any, res: any, next: any): void {
    console.log('');
    console.log(`Recived a ${req.method} request from ${req.ip} for ${req.url}`);
    if (!_.isEmpty(req.headers.authorization)) { console.log(`authorization: ${JSON.stringify(req.headers.authorization)}`); }
    if (!_.isEmpty(req.body)) { console.log(`body: ${JSON.stringify(req.body)}`); }
    if (!_.isEmpty(req.params)) { console.log(`params: ${JSON.stringify(req.params)}`); }
    if (!_.isEmpty(req.query)) { console.log(`query: ${JSON.stringify(req.query)}`); }
    next();
  }

  public static isAuthenticated(req: any, res: any, next: any): void {
    const header = req.headers.authorization;
    if (!_.isEmpty(header)) {
      const token = header.split(' ')[1];
      jwt.verify(token, adminSecret, (err: any, authData: any) => {
        if (err) {
          res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED);
        } else {
          next();
        }
      });
    } else {
      res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED);
    }
  }
}

export {Middleware as middleware};
