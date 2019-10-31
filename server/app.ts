import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import * as userController from './controllers/user';
import {log} from './logger/loggingMiddleware';
import passport from 'passport';
import passport_config from './passport-config';

const router = express.Router();
const app = express();

mongoose.set('useCreateIndex', true);
app.use(passport.initialize());
passport_config(passport);
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(log);

const dbUrl = process.env.DB_URL || 'localhost';
const port = process.env.PORT || 8081;

mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {

  router.post('/login', userController.credentialValidator, userController.postLogin);
  router.post('/register', userController.registerValidator, userController.postRegister);

  router.get('/hello', (req: express.Request, res: express.Response) => {
    res.send('Csoró');
  });

  router.post('/post', (req, res) => {
    db.collection('posts').insertOne(req.body, (cucc: any) => {
      res.sendStatus(201);
    });
  });

  app.use('/api', router);

  if (app.listen(port)) {
// tslint:disable-next-line
    console.log(`Listening on port ${port}`);
  }
});
