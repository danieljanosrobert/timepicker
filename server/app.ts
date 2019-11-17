import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import * as userController from './controllers/user';
import * as validator from './utils/validators';
import { middleware } from './utils/middleware';
import passport from 'passport';
import passport_config from './passport-config';
import * as adminUserController from './controllers/adminUser';
import * as serviceController from './controllers/service';
import * as contactController from './controllers/contact';
import * as bookController from './controllers/book';
import * as messageController from './controllers/messages';
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
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(middleware.log);

const dbUrl = process.env.DB_URL || 'localhost';
const port = process.env.PORT || 8081;

mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {

  router.post('/login', validator.credentialValidator, userController.postLogin);
  router.post('/register', validator.registerValidator, userController.postRegister);

  router.post('/admin/auth', middleware.isAuthenticatedAsAdmin, adminUserController.auth);
  router.post('/admin/login', validator.credentialValidator, adminUserController.postLogin);
  router.post('/admin/register', validator.registerValidator, adminUserController.postRegister);

  router.post('/settings/service', middleware.isAuthenticatedAsAdmin, upload.single('image'),
      serviceController.postSaveService);
  router.post('/settings/get-service', middleware.isAuthenticatedAsAdmin, serviceController.postGetServiceSettings);

  router.post('/settings/contact', middleware.isAuthenticatedAsAdmin, upload.single('image'),
      contactController.postSaveContact);
  router.post('/settings/get-contact', middleware.isAuthenticatedAsAdmin, contactController.postGetContactSettings);

  router.post('/settings/book', middleware.isAuthenticatedAsAdmin, bookController.postSaveBookTime);
  router.post('/settings/get-book', middleware.isAuthenticatedAsAdmin, bookController.postGetBookTimeSettings);
  router.post('/settings/breaks', middleware.isAuthenticatedAsAdmin, bookController.postSaveBreaks);
  router.post('/settings/get-break', middleware.isAuthenticatedAsAdmin, bookController.postGetBreakSettings);
  router.post('/settings/leaves', middleware.isAuthenticatedAsAdmin, bookController.postSaveLeaves);
  router.post('/settings/get-leave', middleware.isAuthenticatedAsAdmin, bookController.postGetLeaveSettings);
  router.post('/settings/messages', middleware.isAuthenticatedAsAdmin, messageController.postSaveMessages);
  router.post('/settings/get-messages', middleware.isAuthenticatedAsAdmin, messageController.postGetMessages);

  app.use('/api', router);

  if (app.listen(port)) {
// tslint:disable-next-line
    console.log(`Listening on port ${port}`);
  }
});
