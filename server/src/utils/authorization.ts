import {Response} from 'express';
import {constants} from 'http2';
import jwt from 'jsonwebtoken';

export const ADMIN = true;

const adminSecret = process.env.ADMIN_SECRET || 'adminsecretkey';
const secret = process.env.SECRET || 'secret';

export function jwtSignUser(res: Response, payload: any, status = constants.HTTP_STATUS_OK, admin = false) {
  jwt.sign(payload, admin ? adminSecret : secret, { expiresIn: '100h' }, (err, token) => {
    if (err) {
      res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ error: 'Error signing token', raw: err});
    }
    status === constants.HTTP_STATUS_OK
      ? res.status(status).send({ token: `Bearer ${token}`})
      : res.sendStatus(status);
  });
}
