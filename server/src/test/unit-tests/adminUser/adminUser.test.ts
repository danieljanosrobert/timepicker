// tslint:disable:no-unused-expression
import chai from 'chai';
import { mockRequest, mockResponse } from 'mock-req-res';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import * as testedController from '../../../controllers/adminUser';
import { constants } from 'http2';
import { AdminUser } from '../../../models/AdminUsers';
import { MongoError } from 'mongodb';
import * as serviceController from '../../../controllers/service';
import * as contactController from '../../../controllers/contact';
import * as messageController from '../../../controllers/messages';
import * as authorization from '../../../utils/authorization';
require('sinon-mongoose');

chai.use(sinonChai);
const expect = chai.expect;


const EMAIL = 'e@mail.com';
const PASSWORD = 'P4ssW0rd';
const SERVICENAME = 'serviceName';
const NAME = 'Test Name';


describe('AdminUsers Controller', () =>  {
  describe('register AdminUser', function() {

    this.beforeAll(() =>  {
      sinon.spy(serviceController, 'saveService');
      sinon.spy(contactController, 'saveContact');
      sinon.spy(messageController, 'createMessage');
      sinon.spy(authorization, 'jwtSignUser');
    });

    beforeEach(() =>  {
      sinon.stub(AdminUser, 'findOne');
    });


    afterEach(() =>  {
      (AdminUser.findOne as any).restore();
    });



    it('should return error when field is missing', async () =>  {
      const req = mockRequest({
        body: {
          email: EMAIL,
          password: PASSWORD,
          serviceName: SERVICENAME,
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

    it('should return error when two fields are missing', async () =>  {
      const req = mockRequest({
        body: {
          email: EMAIL,
          password: PASSWORD,
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

    it('should return error when fields are falsy', async () =>  {
      const req = mockRequest({
        body: {
          email: EMAIL,
          password: PASSWORD,
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

    it('should return error when AdminUser already exists', async () =>  {
      const req = mockRequest({
        body: {
          email: EMAIL,
          password: PASSWORD,
          serviceName: SERVICENAME,
          name: NAME,
        },
      });
      const res = mockResponse();
      const next = sinon.spy();
      (AdminUser.findOne as any).yields(null, { email: EMAIL });

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

    it('should return error when findOne throws any error', async () =>  {
      const req = mockRequest({
        body: {
          email: EMAIL,
          password: PASSWORD,
          serviceName: SERVICENAME,
          name: NAME,
        },
      });
      const res = mockResponse();
      const next = sinon.spy();
      (AdminUser.findOne as any).yields(MongoError, { email: EMAIL });

      await testedController.postRegister(req, res, next);

      expect(next).to.have.been.called;
      expect(serviceController.saveService).to.not.have.been.called;
      expect(contactController.saveContact).to.not.have.been.called;
      expect(messageController.createMessage).to.not.have.been.called;
      expect(authorization.jwtSignUser).to.not.have.been.called;
    });

    it('should return error when save throws any error', async () =>  {
      const req = mockRequest({
        body: {
          email: EMAIL,
          password: PASSWORD,
          serviceName: SERVICENAME,
          name: NAME,
        },
      });
      const res = mockResponse();
      const next = sinon.spy();
      sinon.stub(AdminUser.prototype, 'save');
      (AdminUser.findOne as any).yields(null);
      (AdminUser.prototype.save as any).yields(MongoError);

      await testedController.postRegister(req, res, next);

      expect(next).to.have.been.called;
      expect(serviceController.saveService).to.not.have.been.called;
      expect(contactController.saveContact).to.not.have.been.called;
      expect(messageController.createMessage).to.not.have.been.called;
      expect(authorization.jwtSignUser).to.not.have.been.called;

      (AdminUser.prototype.save as any).restore();
    });

    it('should proceed to create AdminUser', async () => {
      const req = mockRequest({
        body: {
          email: EMAIL,
          password: PASSWORD,
          serviceName: SERVICENAME,
          name: NAME,
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

  describe('authenticate AdminUser', function() {
    it('should return HTTP status OK if function is called', async () => {
      const req = mockRequest();
      const res = mockResponse();
      await testedController.auth(req, res);
      expect(res.sendStatus).to.have.been.calledWith(constants.HTTP_STATUS_OK);
    });
  });

  describe('login AdminUser', function() {

    beforeEach(() =>  {
      sinon.stub(AdminUser, 'findOne');
    });


    afterEach(() =>  {
      (AdminUser.findOne as any).restore();
    });

    it('should return error when AdminUser is not existing with given email', async () => {
      const req = mockRequest({
        body: {
          email: EMAIL,
          password: PASSWORD,
        },
      });
      const res = mockResponse();

      await testedController.postLogin(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_BAD_REQUEST);
      expect(res.send).to.have.been.calledWith({
        error: 'Incorrect email or password.',
      });
    });

    it('should return error when AdminUser is not existing with given email', async () => {
    });

  });

  describe('change AdminUser password', function() {
    it('should return HTTP status OK if function is called', async () => {
      const req = mockRequest();
      const res = mockResponse();
      await testedController.auth(req, res);
      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_OK);
    });
  });
});
