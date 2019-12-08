// tslint:disable:no-unused-expression
import chai from 'chai';
import { mockRequest, mockResponse } from 'mock-req-res';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import * as testedController from '../../controllers/flag';
import { constants } from 'http2';
import { Service } from '../../models/Services';
import { Flag } from '../../models/Flags';
import { MongoError } from 'mongodb';
import { Base64 } from 'js-base64';
import testUtils from './testUtils';

chai.use(sinonChai);
const expect = chai.expect;

const sandbox = sinon.createSandbox();

describe('Flag controller', () => {
  describe('get Flag', () => {

    beforeEach(() => {
      sandbox.stub(Flag, 'find');
      sandbox.stub(Service, 'find');
      sandbox.stub(Base64, 'encode');

    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return error HTTP OK when user does not have any flags', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (Flag.find as any).yields(null);

      await testedController.getUsersFlags(req, res);

      expect(res.sendStatus).to.have.been.calledWith(constants.HTTP_STATUS_OK);
    });

    it('should return error when Flag find throws any error', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (Flag.find as any).yields(MongoError);

      await testedController.getUsersFlags(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
      expect(res.send).to.have.been.calledWith({
        error: 'Some error occured',
      });
    });

    it('should return error when Service find throws any error', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const foundFlags = [{
        user_email: testUtils.EMAIL,
        service_id: testUtils.SERVICE_ID,
      }];

      (Flag.find as any).yields(null, foundFlags);
      (Service.find as any).yields(MongoError);

      await testedController.getUsersFlags(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
      expect(res.send).to.have.been.calledWith({
        error: 'Some error occured',
      });
    });

    it('should return user\'s Flags', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const foundFlags = [{
        user_email: testUtils.EMAIL,
        service_id: testUtils.SERVICE_ID,
      }];
      const foundServices = [{
        service_id: testUtils.SERVICE_ID,
      }];

      (Flag.find as any).yields(null, foundFlags);
      (Service.find as any).yields(null, foundServices);
      (Base64.encode as any).returns(testUtils.SERVICE_ID);

      await testedController.getUsersFlags(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_OK);
      expect(res.send).to.have.been.calledWith(foundServices);
    });
  });

  describe('toggle service is flagged', () => {

    beforeEach(() => {
      sandbox.stub(Service, 'findOne');
      sandbox.stub(Flag, 'findOne');
      sandbox.stub(Base64, 'decode');
      sandbox.stub(Flag.prototype, 'save');
      sandbox.stub(Flag.prototype, 'remove');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return error when Service is not existing with given service_id', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (Base64.decode as any).returns(testUtils.SERVICE_ID);
      (Service.findOne as any).yields(null);

      await testedController.postToggleFlagService(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_NOT_FOUND);
      expect(res.send).to.have.been.calledWith({
        error: 'Service not found',
      });
    });

    it('should return error when Service findOne throws error', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (Service.findOne as any).yields(MongoError);

      await testedController.postToggleFlagService(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
      expect(res.send).to.have.been.calledWith({
        error: 'Some error occured',
      });
    });

    it('should return error when Flags findOne throws error', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (Service.findOne as any).yields(null, {
        service_id: testUtils.SERVICE_ID,
      });
      (Flag.findOne as any).yields(MongoError);

      await testedController.postToggleFlagService(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
      expect(res.send).to.have.been.calledWith({
        error: 'Some error occured',
      });
    });

    it('should return error when save throws error', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (Service.findOne as any).yields(null, {
        service_id: testUtils.SERVICE_ID,
      });
      (Flag.findOne as any).yields(null);
      (Flag.prototype.save as any).yields(MongoError);

      await testedController.postToggleFlagService(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
      expect(res.send).to.have.been.calledWith({
        error: 'Error occured during save',
      });
    });

    it('should proceed to save Flag', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (Service.findOne as any).yields(null, {
        service_id: testUtils.SERVICE_ID,
      });
      (Flag.findOne as any).yields(null);
      (Flag.prototype.save as any).yields(null);

      await testedController.postToggleFlagService(req, res);

      expect(res.sendStatus).to.have.been.calledWith(constants.HTTP_STATUS_CREATED);
    });

    it('should return error when remove throws error', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const findOneResult = new Flag({
        user_email: testUtils.EMAIL,
        service_id: testUtils.SERVICE_ID,
      });

      (Service.findOne as any).yields(null, {
        service_id: testUtils.SERVICE_ID,
      });
      (Flag.findOne as any).yields(null, findOneResult);
      (Flag.prototype.remove as any).yields(MongoError);

      await testedController.postToggleFlagService(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
      expect(res.send).to.have.been.calledWith({
        error: 'Error occured during trying to remove flag',
      });
    });

    it('should proceed to remove Flag', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const findOneResult = new Flag({
        user_email: testUtils.EMAIL,
        service_id: testUtils.SERVICE_ID,
      });

      (Service.findOne as any).yields(null, {
        service_id: testUtils.SERVICE_ID,
      });
      (Flag.findOne as any).yields(null, findOneResult);
      (Flag.prototype.remove as any).yields(null);

      await testedController.postToggleFlagService(req, res);

      expect(res.sendStatus).to.have.been.calledWith(constants.HTTP_STATUS_OK);
    });
  });

});
