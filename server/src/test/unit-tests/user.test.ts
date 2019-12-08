// tslint:disable:no-unused-expression
import chai from 'chai';
import { mockRequest, mockResponse } from 'mock-req-res';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import * as testedController from '../../controllers/user';
import { constants } from 'http2';
import { User } from '../../models/Users';
import { MongoError } from 'mongodb';
import bcrypt from 'bcrypt';
import * as authorization from '../../utils/authorization';
import testUtils from './testUtils';

chai.use(sinonChai);
const expect = chai.expect;

const sandbox = sinon.createSandbox();


describe('Users Controller', () => {
  describe('register User', () => {

    beforeEach(() => {
      sandbox.stub(User, 'findOne');
      sandbox.spy(authorization, 'jwtSignUser');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return error when User already exists', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const next = sinon.spy();
      (User.findOne as any).yields(null, { email: testUtils.EMAIL });

      await testedController.postRegister(req, res, next);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_CONFLICT);
      expect(res.send).to.have.been.calledWith({
        error: 'Account with that email address already exists.',
      });

      expect(authorization.jwtSignUser).to.not.have.been.called;
      expect(next).to.not.have.been.called;
    });

    it('should return error when findOne throws any error', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const next = sinon.spy();
      const error = new MongoError(testUtils.ERROR);

      (User.findOne as any).yields(error);

      await testedController.postRegister(req, res, next);

      expect(next).to.have.been.calledWith(error);
      expect(authorization.jwtSignUser).to.not.have.been.called;
    });

    it('should return error when save throws any error', async () => {
      const req = mockRequest();
      const error = new MongoError(testUtils.ERROR);
      const res = mockResponse();
      const next = sinon.spy();
      sandbox.stub(User.prototype, 'save');
      (User.findOne as any).yields(null);
      (User.prototype.save as any).yields(error);

      await testedController.postRegister(req, res, next);

      expect(next).to.have.been.calledWith(error);
      expect(authorization.jwtSignUser).to.not.have.been.called;
    });

    it('should proceed to create User', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const next = sinon.spy();
      sinon.stub(User.prototype, 'save');
      (User.findOne as any).yields(null);
      (User.prototype.save as any).yields(null);

      await testedController.postRegister(req, res, next);

      expect(next).to.not.have.been.called;
      expect(authorization.jwtSignUser).to.have.been.called;

      (User.prototype.save as any).restore();
    });
  });

  describe('login User', () => {

    beforeEach(() => {
      sandbox.stub(User, 'findOne');
      sandbox.stub(bcrypt, 'compare');
      sandbox.spy(authorization, 'jwtSignUser');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return error when User is not existing with given email', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (User.findOne as any).yields(null);

      await testedController.postLogin(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_BAD_REQUEST);
      expect(res.send).to.have.been.calledWith({
        error: 'Incorrect email or password',
      });
      expect(authorization.jwtSignUser).to.not.have.been.called;
    });

    it('should return error when findOne throws any error', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (User.findOne as any).yields(MongoError);

      await testedController.postLogin(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
      expect(res.send).to.have.been.calledWith({
        error: 'Some error occured',
      });
      expect(authorization.jwtSignUser).to.not.have.been.called;
    });

    it('should return error when User password is not correct', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (bcrypt.compare as any).resolves(null);
      (User.findOne as any).yields(null, { email: testUtils.EMAIL, password: testUtils.WRONG_PASSWORD });

      await testedController.postLogin(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_BAD_REQUEST);
      expect(res.send).to.have.been.calledWith({
        error: 'Incorrect email or password',
      });
      expect(authorization.jwtSignUser).to.not.have.been.called;
    });

    it('should proceed to log User in', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (bcrypt.compare as any).resolves(testUtils.RESOLVE_PROMISE);
      (User.findOne as any).yields(null, { email: testUtils.EMAIL, password: testUtils.PASSWORD });

      await testedController.postLogin(req, res);

      expect(authorization.jwtSignUser).to.have.been.called;
    });

  });

  describe('change User password', () => {

    beforeEach(() => {
      sandbox.stub(User, 'findOne');
      sandbox.stub(bcrypt, 'compare');
      sandbox.stub(User.prototype, 'save');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return error when User is not existing with given email', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (User.findOne as any).yields(null);

      await testedController.postChangePassword(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_NOT_FOUND);
      expect(res.send).to.have.been.calledWith({
        error: 'User not found',
      });
    });

    it('should return error when findOne throws any error', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (User.findOne as any).yields(MongoError);

      await testedController.postChangePassword(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
      expect(res.send).to.have.been.calledWith({
        error: 'Some error occured',
      });
    });

    it('should return error when User password is not correct', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (bcrypt.compare as any).resolves(null);
      (User.findOne as any).yields(null, { email: testUtils.EMAIL, password: testUtils.WRONG_PASSWORD });

      await testedController.postChangePassword(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_BAD_REQUEST);
      expect(res.send).to.have.been.calledWith({
        error: 'Incorrect password',
      });
    });

    it('should return error when save throws error', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (bcrypt.compare as any).resolves(testUtils.RESOLVE_PROMISE);
      (User.findOne as any).yields(null, new User({
        email: testUtils.EMAIL,
      }));
      (User.prototype.save as any).yields(MongoError);

      await testedController.postChangePassword(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
      expect(res.send).to.have.been.calledWith({
        error: 'Error during save',
      });
    });

    it('should proceed to change User\'s password', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (bcrypt.compare as any).resolves(testUtils.RESOLVE_PROMISE);
      (User.findOne as any).yields(null, new User({
        email: testUtils.EMAIL,
      }));
      (User.prototype.save as any).yields(null);


      await testedController.postChangePassword(req, res);

      expect(res.sendStatus).to.have.been.calledWith(constants.HTTP_STATUS_OK);
    });

  });

  describe('get User data', () => {

    beforeEach(() => {
      sandbox.stub(User, 'findOne');

    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return error when User is not existing with given email', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (User.findOne as any).yields(null);

      await testedController.postGetUserData(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_NOT_FOUND);
      expect(res.send).to.have.been.calledWith({
        error: 'User not found',
      });
    });

    it('should return error when findOne throws any error', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (User.findOne as any).yields(MongoError);

      await testedController.postGetUserData(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
      expect(res.send).to.have.been.calledWith({
        error: 'Some error occured',
      });
    });

    it('should return user\'s data', async () => {
      const req = mockRequest();
      const res = mockResponse();

      const expectedResult = {
        lastName: testUtils.NAME,
        firstName: testUtils.NAME,
        city: testUtils.CONTACT_ADDRESSES[0].city,
      };

      (User.findOne as any).yields(null, expectedResult);

      await testedController.postGetUserData(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_OK);
      expect(res.send).to.have.been.calledWith(expectedResult);
    });
  });

  describe('save User data', () => {

    beforeEach(() => {
      sandbox.stub(bcrypt, 'compare');
      sandbox.stub(User, 'findOne');
      sandbox.stub(Base64, 'encode');
      sandbox.stub(User.prototype, 'save');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return error when User is not existing with given email', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (User.findOne as any).yields(null);

      await testedController.updateUserData(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_NOT_FOUND);
      expect(res.send).to.have.been.calledWith({
        error: 'User not found',
      });
    });

    it('should return error when findOne throws any error', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (User.findOne as any).yields(MongoError);

      await testedController.updateUserData(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
      expect(res.send).to.have.been.calledWith({
        error: 'Some error occured',
      });
    });

    it('should return error when User password is not correct', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (bcrypt.compare as any).resolves(null);
      (User.findOne as any).yields(null, { email: testUtils.EMAIL, password: testUtils.WRONG_PASSWORD });

      await testedController.updateUserData(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_BAD_REQUEST);
      expect(res.send).to.have.been.calledWith({
        error: 'Incorrect password',
      });
    });

    it('should return error when save throws error', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (bcrypt.compare as any).resolves(testUtils.RESOLVE_PROMISE);
      (User.findOne as any).yields(null, new User({
        email: testUtils.EMAIL,
      }));
      (User.prototype.save as any).yields(MongoError);

      await testedController.postChangePassword(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
      expect(res.send).to.have.been.calledWith({
        error: 'Error during save',
      });
    });

    it('should save user\'s data', async () => {
      const req = mockRequest();
      const res = mockResponse();

      const expectedResult = {
        lastName: testUtils.NAME,
        firstName: testUtils.NAME,
        city: testUtils.CONTACT_ADDRESSES[0].city,
      };

      (bcrypt.compare as any).resolves(testUtils.RESOLVE_PROMISE);
      (User.findOne as any).yields(null, new User(expectedResult));
      (User.prototype.save as any).yields(null);


      await testedController.updateUserData(req, res);

      expect(res.sendStatus).to.have.been.calledWith(constants.HTTP_STATUS_OK);
    });
  });

});
