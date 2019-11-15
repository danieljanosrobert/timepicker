import {Response} from 'express';
import {constants} from 'http2';
import jwt from 'jsonwebtoken';

export const ADMIN = true;

const adminSecret = process.env.ADMIN_SECRET || 'adminsecretkey';
const secret = process.env.SECRET || 'secret';

export function jwtSignUser(res: Response, payload: any, status = constants.HTTP_STATUS_OK, admin = false) {
  jwt.sign(payload, admin ? adminSecret : secret, { expiresIn: 600 }, (err, token) => {
    console.log('asd');
    if (err) {
      res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: 'Error signing token', raw: err});
    }
    res.status(status).json({ token: `Bearer ${token}`});
  });
}
