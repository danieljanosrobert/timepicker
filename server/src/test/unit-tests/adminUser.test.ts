// tslint:disable:no-unused-expression
import chai from 'chai';
import { mockRequest, mockResponse } from 'mock-req-res';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import * as testedController from '../../controllers/adminUser';
import { constants } from 'http2';
import { AdminUser } from '../../models/AdminUsers';
import { MongoError } from 'mongodb';
import bcrypt from 'bcrypt';
import * as serviceController from '../../controllers/service';
import * as contactController from '../../controllers/contact';
import * as messageController from '../../controllers/messages';
import * as authorization from '../../utils/authorization';
import testUtils from './testUtils';

chai.use(sinonChai);
const expect = chai.expect;

const sandbox = sinon.createSandbox();


describe('AdminUsers Controller', () => {
  describe('register AdminUser', () => {

    beforeEach(() => {
      sandbox.stub(AdminUser, 'findOne');
      sandbox.spy(serviceController, 'saveService');
      sandbox.spy(contactController, 'saveContact');
      sandbox.spy(messageController, 'createMessage');
      sandbox.spy(authorization, 'jwtSignUser');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return error when field is missing', async () => {
      const req = mockRequest({
        body: {
          email: testUtils.EMAIL,
          password: testUtils.PASSWORD,
          serviceName: testUtils.SERVICE_NAME,
        },
      });
      const next = sinon.spy();
      const res = mockResponse();

      testedController.postRegister(req, res, next);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_BAD_REQUEST);
      expect(res.send).to.have.been.calledWith({
        error: 'Invalid fields',
      });
      expect(next).to.not.have.been.called;
      expect(serviceController.saveService).to.not.have.been.called;
      expect(contactController.saveContact).to.not.have.been.called;
      expect(messageController.createMessage).to.not.have.been.called;
      expect(authorization.jwtSignUser).to.not.have.been.called;
    });

    it('should return error when two fields are missing', async () => {
      const req = mockRequest({
        body: {
          email: testUtils.EMAIL,
          password: testUtils.PASSWORD,
        },
      });
      const res = mockResponse();
      const next = sinon.spy();

      testedController.postRegister(req, res, next);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_BAD_REQUEST);
      expect(res.send).to.have.been.calledWith({
        error: 'Invalid fields',
      });
      expect(next).to.not.have.been.called;
      expect(serviceController.saveService).to.not.have.been.called;
      expect(contactController.saveContact).to.not.have.been.called;
      expect(messageController.createMessage).to.not.have.been.called;
      expect(authorization.jwtSignUser).to.not.have.been.called;
    });

    it('should return error when fields are falsy', async () => {
      const req = mockRequest({
        body: {
          email: testUtils.EMAIL,
          password: testUtils.PASSWORD,
          serviceName: '',
          name: '',
        },
      });
      const res = mockResponse();
      const next = sinon.spy();

      testedController.postRegister(req, res, next);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_BAD_REQUEST);
      expect(res.send).to.have.been.calledWith({
        error: 'Invalid fields',
      });
      expect(next).to.not.have.been.called;
      expect(serviceController.saveService).to.not.have.been.called;
      expect(contactController.saveContact).to.not.have.been.called;
      expect(messageController.createMessage).to.not.have.been.called;
      expect(authorization.jwtSignUser).to.not.have.been.called;
    });

    it('should return error when AdminUser already exists', async () => {
      const req = mockRequest({
        body: {
          email: testUtils.EMAIL,
          password: testUtils.PASSWORD,
          serviceName: testUtils.SERVICE_NAME,
          name: testUtils.NAME,
        },
      });
      const res = mockResponse();
      const next = sinon.spy();
      (AdminUser.findOne as any).yields(null, { email: testUtils.EMAIL });

      await testedController.postRegister(req, res, next);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_CONFLICT);
      expect(res.send).to.have.been.calledWith({
        error: 'Account with that email address already exists.',
      });

      expect(authorization.jwtSignUser).to.not.have.been.called;
      expect(next).to.not.have.been.called;
      expect(serviceController.saveService).to.not.have.been.called;
      expect(contactController.saveContact).to.not.have.been.called;
      expect(messageController.createMessage).to.not.have.been.called;
    });

    it('should return error when findOne throws any error', async () => {
      const req = mockRequest({
        body: {
          email: testUtils.EMAIL,
          password: testUtils.PASSWORD,
          serviceName: testUtils.SERVICE_NAME,
          name: testUtils.NAME,
        },
      });
      const res = mockResponse();
      const next = sinon.spy();
      const error = new MongoError(testUtils.ERROR);

      (AdminUser.findOne as any).yields(error);

      await testedController.postRegister(req, res, next);

      expect(next).to.have.been.calledWith(error);
      expect(serviceController.saveService).to.not.have.been.called;
      expect(contactController.saveContact).to.not.have.been.called;
      expect(messageController.createMessage).to.not.have.been.called;
      expect(authorization.jwtSignUser).to.not.have.been.called;
    });

    it('should return error when save throws any error', async () => {
      const req = mockRequest({
        body: {
          email: testUtils.EMAIL,
          password: testUtils.PASSWORD,
          serviceName: testUtils.SERVICE_NAME,
          name: testUtils.NAME,
        },
      });
      const error = new MongoError(testUtils.ERROR);
      const res = mockResponse();
      const next = sinon.spy();
      sandbox.stub(AdminUser.prototype, 'save');
      (AdminUser.findOne as any).yields(null);
      (AdminUser.prototype.save as any).yields(error);

      await testedController.postRegister(req, res, next);

      expect(next).to.have.been.calledWith(error);
      expect(serviceController.saveService).to.not.have.been.called;
      expect(contactController.saveContact).to.not.have.been.called;
      expect(messageController.createMessage).to.not.have.been.called;
      expect(authorization.jwtSignUser).to.not.have.been.called;
    });

    it('should proceed to create AdminUser', async () => {
      const req = mockRequest({
        body: {
          email: testUtils.EMAIL,
          password: testUtils.PASSWORD,
          serviceName: testUtils.SERVICE_NAME,
          name: testUtils.NAME,
        },
      });
      const res = mockResponse();
      const next = sinon.spy();
      sinon.stub(AdminUser.prototype, 'save');
      (AdminUser.findOne as any).yields(null);
      (AdminUser.prototype.save as any).yields(null);

      await testedController.postRegister(req, res, next);

      expect(next).to.not.have.been.called;
      expect(serviceController.saveService).to.have.been.called;
      expect(contactController.saveContact).to.have.been.called;
      expect(messageController.createMessage).to.have.been.called;
      expect(authorization.jwtSignUser).to.have.been.called;

      (AdminUser.prototype.save as any).restore();
    });
  });

  describe('login AdminUser', () => {

    beforeEach(() => {
      sandbox.stub(AdminUser, 'findOne');
      sandbox.stub(bcrypt, 'compare');
      sandbox.spy(authorization, 'jwtSignUser');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return error when AdminUser is not existing with given email', async () => {
      const req = mockRequest({
        body: {
          email: testUtils.EMAIL,
          password: testUtils.PASSWORD,
        },
      });
      const res = mockResponse();

      (AdminUser.findOne as any).yields(null);

      await testedController.postLogin(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_BAD_REQUEST);
      expect(res.send).to.have.been.calledWith({
        error: 'Incorrect email or password',
      });
      expect(authorization.jwtSignUser).to.not.have.been.called;
    });

    it('should return error when findOne throws any error', async () => {
      const req = mockRequest({
        body: {
          email: testUtils.EMAIL,
          password: testUtils.PASSWORD,
        },
      });
      const res = mockResponse();

      (AdminUser.findOne as any).yields(MongoError);

      await testedController.postLogin(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
      expect(res.send).to.have.been.calledWith({
        error: 'Some error occured',
      });
      expect(authorization.jwtSignUser).to.not.have.been.called;
    });

    it('should return error when AdminUser password is not correct', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (bcrypt.compare as any).resolves(null);
      (AdminUser.findOne as any).yields(null, { email: testUtils.EMAIL, password: testUtils.WRONG_PASSWORD });

      await testedController.postLogin(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_BAD_REQUEST);
      expect(res.send).to.have.been.calledWith({
        error: 'Incorrect email or password',
      });
      expect(authorization.jwtSignUser).to.not.have.been.called;
    });

    it('should proceed to log AdminUser in', async () => {
      const req = mockRequest({
        body: {
          email: testUtils.EMAIL,
          password: testUtils.PASSWORD,
        },
      });
      const res = mockResponse();

      (bcrypt.compare as any).resolves(testUtils.RESOLVE_PROMISE);
      (AdminUser.findOne as any).yields(null, { email: testUtils.EMAIL, password: testUtils.PASSWORD });

      await testedController.postLogin(req, res);

      expect(authorization.jwtSignUser).to.have.been.called;
    });

  });

  describe('change AdminUser password', () => {

    beforeEach(() => {
      sandbox.stub(AdminUser, 'findOne');
      sandbox.stub(bcrypt, 'compare');
      sandbox.stub(AdminUser.prototype, 'save');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return error when AdminUser is not existing with given email', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (AdminUser.findOne as any).yields(null);

      await testedController.postChangePassword(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_NOT_FOUND);
      expect(res.send).to.have.been.calledWith({
        error: 'User not found',
      });
    });

    it('should return error when findOne throws any error', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (AdminUser.findOne as any).yields(MongoError);

      await testedController.postChangePassword(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
      expect(res.send).to.have.been.calledWith({
        error: 'Some error occured',
      });
    });

    it('should return error when AdminUser password is not correct', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (bcrypt.compare as any).resolves(null);
      (AdminUser.findOne as any).yields(null, { email: testUtils.EMAIL, password: testUtils.WRONG_PASSWORD });

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
      (AdminUser.findOne as any).yields(null, new AdminUser({
        email: testUtils.EMAIL,
      }));
      (AdminUser.prototype.save as any).yields(MongoError);

      await testedController.postChangePassword(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
      expect(res.send).to.have.been.calledWith({
        error: 'Error during save',
      });
    });

    it('should proceed to change AdminUser\'s password', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (bcrypt.compare as any).resolves(testUtils.RESOLVE_PROMISE);
      (AdminUser.findOne as any).yields(null, new AdminUser({
        email: testUtils.EMAIL,
      }));
      (AdminUser.prototype.save as any).yields(null);


      await testedController.postChangePassword(req, res);

      expect(res.sendStatus).to.have.been.calledWith(constants.HTTP_STATUS_OK);
    });

  });

});
