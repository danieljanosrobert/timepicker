import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { middleware } from './utils/middleware';
import passport from 'passport';
import passport_config from './passport-config';
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
});

const router = express.Router();
const app = express();

mongoose.set('useCreateIndex', true);
app.use(passport.initialize());
passport_config(passport);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(middleware.log);

const dbUrl = process.env.DB_URL || 'localhost';
const port = process.env.PORT || 8081;

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  keepAlive: true,
  keepAliveInitialDelay: 300000,
 });
const db = mongoose.connection;
// tslint:disable-next-line:no-console
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {

  app.use('/api', router);
  require('./routes/reservationsRoute')(router);
  require('./routes/contactsRoute')(router, upload);
  require('./routes/messagesRoute')(router);
  require('./routes/servicesRoute')(router, upload);
  require('./routes/usersRoute')(router);
  require('./routes/booksRoute')(router);

  if (app.listen(port)) {
    // tslint:disable-next-line:no-console
    console.log(`Listening on port ${port}`);
  }
});
