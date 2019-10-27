import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import * as userController from './controllers/user';

const router = express.Router();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const url =
    'mongodb+srv://user:nXyW33882ppCYgWr@cluster0-9qyy7.azure.mongodb.net/timepicker?retryWrites=true&w=majority';

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
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

  const port = process.env.PORT || 8081;
  if (app.listen(port)) {
// tslint:disable-next-line
    console.log(`Listening on port ${port}`);
  }
});
