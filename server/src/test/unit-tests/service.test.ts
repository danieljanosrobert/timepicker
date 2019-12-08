// tslint:disable:no-unused-expression
import chai from 'chai';
import { mockRequest, mockResponse } from 'mock-req-res';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import * as testedController from '../../controllers/service';
import { constants } from 'http2';
import { AdminUser } from '../../models/AdminUsers';
import { Service } from '../../models/Services';
import { MongoError } from 'mongodb';
import bcrypt from 'bcrypt';
import testUtils from './testUtils';

chai.use(sinonChai);
const expect = chai.expect;

const sandbox = sinon.createSandbox();

describe('Service controller', () => {
  describe('obtain Service Id', () => {

    beforeEach(() => {
      sandbox.stub(Service, 'findOne');
      sandbox.stub(Base64, 'encode');

    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return error when Service is not existing', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (Service.findOne as any).yields(null);

      await testedController.postObtainServiceId(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_NOT_FOUND);
      expect(res.send).to.have.been.calledWith({
        error: 'Service not found',
      });
    });

    it('should return error when findOne throws any error', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (Service.findOne as any).yields(MongoError);

      await testedController.postObtainServiceId(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
      expect(res.send).to.have.been.calledWith({
        error: 'Some error occured',
      });
    });

    it('should return user\'s Service from email', async () => {
      const req = mockRequest();
      const res = mockResponse();

      const expectedResult = {
        service_id: testUtils.SERVICE_ID,
      };

      (Service.findOne as any).yields(null, expectedResult);
      (Base64.encode as any).returns(testUtils.SERVICE_ID);

      await testedController.postObtainServiceId(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_OK);
      expect(res.send).to.have.been.calledWith(expectedResult);
    });
  });

  describe('get Service name', () => {

    beforeEach(() => {
      sandbox.stub(Service, 'findOne');
      sandbox.stub(Base64, 'encode');

    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return error when Service is not existing', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (Service.findOne as any).yields(null);

      await testedController.getServiceName(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_NOT_FOUND);
      expect(res.send).to.have.been.calledWith({
        error: 'Service not found',
      });
    });

    it('should return error when findOne throws any error', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (Service.findOne as any).yields(MongoError);

      await testedController.getServiceName(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
      expect(res.send).to.have.been.calledWith({
        error: 'Some error occured',
      });
    });

    it('should return Service name by id', async () => {
      const req = mockRequest();
      const res = mockResponse();

      const expectedResult = {
        name: testUtils.NAME,
      };

      (Service.findOne as any).yields(null, expectedResult);
      (Base64.encode as any).returns(testUtils.SERVICE_ID);

      await testedController.getServiceName(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_OK);
      expect(res.send).to.have.been.calledWith(testUtils.NAME);
    });
  });

  describe('get Available services', () => {

    beforeEach(() => {
      sandbox.stub(Service, 'find');
      sandbox.stub(Base64, 'encode');

    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return error when Services are not existing', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (Service.find as any).yields(null);

      await testedController.getAvailableServices(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_NOT_FOUND);
      expect(res.send).to.have.been.calledWith({
        error: 'Services not found',
      });
    });

    it('should return error when find throws any error', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (Service.find as any).yields(MongoError);

      await testedController.getAvailableServices(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
      expect(res.send).to.have.been.calledWith({
        error: 'Some error occured',
      });
    });

    it('should return Service name by id', async () => {
      const req = mockRequest();
      const res = mockResponse();

      const expectedResult = [{
        name: testUtils.NAME,
      }];

      (Service.find as any).yields(null, expectedResult);
      (Base64.encode as any).returns(testUtils.SERVICE_ID);

      await testedController.getAvailableServices(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_OK);
      expect(res.send).to.have.been.calledWith(JSON.stringify(expectedResult));
    });
  });

  describe('get Service', () => {

    beforeEach(() => {
      sandbox.stub(Service, 'findOne');

    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return error when Service is not existing', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (Service.findOne as any).yields(null);

      await testedController.getServiceSettings(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_NOT_FOUND);
      expect(res.send).to.have.been.calledWith({
        error: 'Service not found',
      });
    });

    it('should return error when findOne throws any error', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (Service.findOne as any).yields(MongoError);

      await testedController.getServiceSettings(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
      expect(res.send).to.have.been.calledWith({
        error: 'Some error occured',
      });
    });

    it('should return Service with id from params', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const returnedService = {
        name: testUtils.NAME,
        image: testUtils.IMAGE_URL,
        description: testUtils.SERVICE_DESCRIPTION,
        hidden: false,
      };
      const expectedResult = {
        name: testUtils.NAME,
        image_url: testUtils.IMAGE_URL,
        description: testUtils.SERVICE_DESCRIPTION,
        hidden: false,
      };

      (Service.findOne as any).yields(null, returnedService);

      await testedController.getServiceSettings(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_OK);
      expect(res.send).to.have.been.calledWith(expectedResult);
    });
  });

  describe('save Service when AdminUser registers', () => {

    beforeEach(() => {
      sandbox.stub(Service.prototype, 'save');

    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return error when Service is not existing', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const next = sinon.spy();
      const error = new MongoError(testUtils.ERROR);

      (Service.prototype.save as any).yields(error);

      await testedController.saveService(req, res, next, testUtils.SERVICE_ID);

      expect(next).to.have.been.calledWith(error);
    });

    it('should return error when findOne throws any error', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const next = sinon.spy();
      const returnedService = {
        name: testUtils.NAME,
        image: testUtils.IMAGE_URL,
        description: testUtils.SERVICE_DESCRIPTION,
        hidden: false,
      };

      (Service.prototype.save as any).yields(null, returnedService);

      await testedController.saveService(req, res, next, testUtils.SERVICE_ID);

      expect(next).to.have.been.called;
    });
  });

  describe('save Service', () => {

    beforeEach(() => {
      sandbox.stub(AdminUser, 'findOne');
      sandbox.stub(Service, 'findOne');
      sandbox.stub(Service, 'findOneAndUpdate');
      sandbox.stub(bcrypt, 'compare');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return error when AdminUser is not existing with given email', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (AdminUser.findOne as any).yields(null);

      await testedController.postUpdateService(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_BAD_REQUEST);
      expect(res.send).to.have.been.calledWith({
        error: 'User does not exist',
      });
    });

    it('should return error when AdminUser findOne throws error', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (AdminUser.findOne as any).yields(MongoError);

      await testedController.postUpdateService(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
      expect(res.send).to.have.been.calledWith({
        error: 'Some error occured',
      });
    });

    it('should return error when AdminUser password is not correct', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (bcrypt.compare as any).resolves(null);
      (AdminUser.findOne as any).yields(null, { email: testUtils.EMAIL, password: testUtils.PASSWORD });

      await testedController.postUpdateService(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_BAD_REQUEST);
      expect(res.send).to.have.been.calledWith({
        error: 'Incorrect password',
      });
    });

    it('should return error when Services findOneAndUpdate throws error', async () => {
      const req = mockRequest({
        body: {
          phoneNumbers: testUtils.JSON_EMPTY_ARRAY,
          emails: testUtils.JSON_EMPTY_ARRAY,
          addresses: testUtils.JSON_EMPTY_ARRAY,
        },
      });
      const res = mockResponse();

      (bcrypt.compare as any).resolves(testUtils.RESOLVE_PROMISE);
      (AdminUser.findOne as any).yields(null, { email: testUtils.EMAIL, password: testUtils.PASSWORD });
      (Service.findOneAndUpdate as any).yields(MongoError);

      await testedController.postUpdateService(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
      expect(res.send).to.have.been.calledWith({
        error: 'Error occured during updating service.',
      });
    });

    it('should return error when request\'s body contains deleteImage and Services findOne throws error', async () => {
      const req = mockRequest({
        body: {
          deleteImage: 'true',
        },
      });
      const res = mockResponse();

      (bcrypt.compare as any).resolves(testUtils.RESOLVE_PROMISE);
      (AdminUser.findOne as any).yields(null, { email: testUtils.EMAIL, password: testUtils.PASSWORD });
      (Service.findOne as any).yields(MongoError);

      await testedController.postUpdateService(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
      expect(res.send).to.have.been.calledWith({
        error: 'Some error occured',
      });
    });

    it('should proceed to save Service', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (bcrypt.compare as any).resolves(testUtils.RESOLVE_PROMISE);
      (AdminUser.findOne as any).yields(null, { email: testUtils.EMAIL, password: testUtils.PASSWORD });
      (Service.findOneAndUpdate as any).yields(null, {service_id: testUtils.SERVICE_ID});

      await testedController.postUpdateService(req, res);

      expect(res.sendStatus).to.have.been.calledWith(constants.HTTP_STATUS_OK);
    });

    it('should proceed to save Service when request\'s body contains deleteImage', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (bcrypt.compare as any).resolves(testUtils.RESOLVE_PROMISE);
      (AdminUser.findOne as any).yields(null, { email: testUtils.EMAIL, password: testUtils.PASSWORD });
      (Service.findOne as any).yields(null, {
        service_id: testUtils.SERVICE_ID,
      });
      (Service.findOneAndUpdate as any).yields(null, {service_id: testUtils.SERVICE_ID});

      await testedController.postUpdateService(req, res);

      expect(res.sendStatus).to.have.been.calledWith(constants.HTTP_STATUS_OK);
    });
  });


});

