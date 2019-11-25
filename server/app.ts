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
import * as reservationController from './controllers/reservation';
import * as flagController from './controllers/flag';
import multer from 'multer';
import {constants} from 'http2';

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

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {

  router.post('/login', validator.credentialValidator, userController.postLogin);
  router.post('/register', validator.registerValidator, userController.postRegister);
  router.post('/service/obtain-id', serviceController.postObtainServiceId);

  router.get('/available-services', serviceController.getAvailableServices);
  router.get('/serviceName/:service_id', serviceController.getServiceName);
  router.get('/contact/:service_id', contactController.getContact);
  router.get('/messages/:service_id', messageController.getMessages);
  router.get('/book/book-time/:service_id', bookController.getBookTime);
  router.get('/book/breaks/:service_id', bookController.getBreaks);
  router.get('/book/leaves/:service_id', bookController.getLeaves);

  router.post('/reserve', reservationController.postReserve);
  router.get('/reservations/:service_id', reservationController.getReservations);
  router.post('/flag', middleware.isAuthenticatedAsUser, flagController.postToggleFlagService);
  router.get('/flag/:user_email', middleware.isAuthenticatedAsUser, flagController.getUsersFlags);

  router.post('/user/auth', middleware.isAuthenticatedAsUser, (req, res) => res.sendStatus(constants.HTTP_STATUS_OK));
  router.post('/admin/auth', middleware.isAuthenticatedAsAdmin, (req, res) => res.sendStatus(constants.HTTP_STATUS_OK));

  router.post('/admin/login', validator.credentialValidator, adminUserController.postLogin);
  router.post('/admin/register', validator.registerValidator, adminUserController.postRegister);

  router.post('/settings/change-password', middleware.isAuthenticatedAsUser, validator.passwordChangeValidator,
  userController.postChangePassword);
  router.post('/settings/get-user-data', middleware.isAuthenticatedAsUser, userController.postGetUserData);
  router.post('/settings/modify-user', middleware.isAuthenticatedAsUser, userController.updateUserData);

  router.post('/settings/change-password/admin', middleware.isAuthenticatedAsAdmin, validator.passwordChangeValidator,
    adminUserController.postChangePassword);
  router.post('/settings/service', middleware.isAuthenticatedAsAdmin, upload.single('image'),
    serviceController.postUpdateService);
  router.get('/settings/service/:service_id', middleware.isAuthenticatedAsAdmin, serviceController.getServiceSettings);
  router.post('/settings/contact', middleware.isAuthenticatedAsAdmin, upload.single('image'),
    contactController.postSaveContact);
  router.get('/settings/contact/:service_id', middleware.isAuthenticatedAsAdmin, contactController.getContact);
  router.post('/settings/book', middleware.isAuthenticatedAsAdmin, bookController.postSaveBookTime);
  router.get('/settings/book/:service_id', middleware.isAuthenticatedAsAdmin, bookController.getBookTime);
  router.post('/settings/breaks', middleware.isAuthenticatedAsAdmin, bookController.postSaveBreaks);
  router.get('/settings/breaks/:service_id', middleware.isAuthenticatedAsAdmin, bookController.getBreaks);
  router.post('/settings/leaves', middleware.isAuthenticatedAsAdmin, bookController.postSaveLeaves);
  router.get('/settings/leaves/:service_id', middleware.isAuthenticatedAsAdmin, bookController.getLeaves);
  router.post('/settings/messages', middleware.isAuthenticatedAsAdmin, messageController.postSaveMessages);
  router.get('/settings/messages/:service_id', middleware.isAuthenticatedAsAdmin, messageController.getMessages);

  app.use('/api', router);

  if (app.listen(port)) {
    // tslint:disable-next-line
    console.log(`Listening on port ${port}`);
  }
});
