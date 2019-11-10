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

  router.get('/books', middleware.isAuthenticated, userController.getBookings);
  router.post('/login', validator.credentialValidator, userController.postLogin);
  router.post('/register', validator.registerValidator, userController.postRegister);

  router.post('/admin/login', validator.credentialValidator, adminUserController.postLogin);
  router.post('/admin/register', validator.registerValidator, adminUserController.postRegister);

  router.post('/settings/service', upload.single('image'), serviceController.postSaveService);
  router.post('/settings/get-service', middleware.isAuthenticated, serviceController.getServiceSettings);

  app.use('/api', router);

  if (app.listen(port)) {
// tslint:disable-next-line
    console.log(`Listening on port ${port}`);
  }
});
