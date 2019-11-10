import {Response} from 'express';
import {constants} from 'http2';
import jwt from 'jsonwebtoken';

const secret = process.env.SECRET || 'secret';

export function jwtSignUser(res: Response, payload: any, status = constants.HTTP_STATUS_OK) {
  jwt.sign(payload, secret, { expiresIn: 6000 }, (err, token) => {
    if (err) {
      res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: 'Error signing token', raw: err});
    }
    res.status(status).json({ token: `Bearer ${token}`});
  });
}
