// tslint:disable:no-console

import {constants} from 'http2';
import * as _ from 'lodash';
import jwt from 'jsonwebtoken';

const adminSecret = process.env.ADMIN_SECRET || 'adminsecretkey';
const secret = process.env.SECRET || 'secret';

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

  public static async isAuthenticatedAsAdmin(req: any, res: any, next: any): Promise<any> {
    const header = req.headers.authorization;
    if (!_.isEmpty(header)) {
      const token = header.split(' ')[1];
      jwt.verify(token, adminSecret, (err: any, authData: any) => {
        if (err) {
          res.status(constants.HTTP_STATUS_UNAUTHORIZED).send({error: 'auth'});
        } else {
          next();
        }
      });
    } else {
      res.status(constants.HTTP_STATUS_UNAUTHORIZED).send({error: 'auth'});
    }
  }

  public static async isAuthenticatedAsUser(req: any, res: any, next: any): Promise<any> {
    const header = req.headers.authorization;
    if (!_.isEmpty(header)) {
      const token = header.split(' ')[1];
      jwt.verify(token, secret, (err: any, authData: any) => {
        if (err) {
          res.status(constants.HTTP_STATUS_UNAUTHORIZED).send({error: 'auth'});
        } else {
          next();
        }
      });
    } else {
      res.status(constants.HTTP_STATUS_UNAUTHORIZED).send({error: 'auth'});
    }
  }
}

export {Middleware as middleware};
