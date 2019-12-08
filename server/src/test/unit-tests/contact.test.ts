// tslint:disable:no-unused-expression
import chai from 'chai';
import { mockRequest, mockResponse } from 'mock-req-res';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import * as testedController from '../../controllers/contact';
import { constants } from 'http2';
import { AdminUser } from '../../models/AdminUsers';
import { Service } from '../../models/Services';
import { Contact } from '../../models/Contacts';
import { MongoError } from 'mongodb';
import bcrypt from 'bcrypt';
import testUtils from './testUtils';

chai.use(sinonChai);
const expect = chai.expect;

const sandbox = sinon.createSandbox();

describe('Contact controller', () => {
  describe('get Contact', () => {

    beforeEach(() => {
      sandbox.stub(Contact, 'findOne');

    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return error when Contact is not existing', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (Contact.findOne as any).yields(null);

      await testedController.getContact(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_NOT_FOUND);
      expect(res.send).to.have.been.calledWith({
        error: 'Contact not found',
      });
    });

    it('should return error when findOne throws any error', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (Contact.findOne as any).yields(MongoError);

      await testedController.getContact(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
      expect(res.send).to.have.been.calledWith({
        error: 'Some error occured',
      });
    });

    it('should return Contact with id from params', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const returnedContact = {
        name: testUtils.NAME,
        image: testUtils.IMAGE_URL,
        phoneNumbers: testUtils.CONTACT_PHONE_NUMBERS,
        emails: testUtils.CONTACT_EMAILS,
        addresses: testUtils.CONTACT_ADDRESSES,
      };
      const expectedResult = {
        name: testUtils.NAME,
        image_url: testUtils.IMAGE_URL,
        phoneNumbers: testUtils.CONTACT_PHONE_NUMBERS,
        emails: testUtils.CONTACT_EMAILS,
        addresses: testUtils.CONTACT_ADDRESSES,
      };

      (Contact.findOne as any).yields(null, returnedContact);

      await testedController.getContact(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_OK);
      expect(res.send).to.have.been.calledWith(expectedResult);
    });
  });

  describe('save Contact when AdminUser registers', () => {

    beforeEach(() => {
      sandbox.stub(Contact.prototype, 'save');

    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return error when Contact is not existing', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const next = sinon.spy();
      const error = new MongoError(testUtils.ERROR);

      (Contact.prototype.save as any).yields(error);

      await testedController.saveContact(req, res, next, testUtils.SERVICE_ID);

      expect(next).to.have.been.calledWith(error);
    });

    it('should return error when findOne throws any error', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const next = sinon.spy();
      const returnedContact = {
        name: testUtils.NAME,
        image: testUtils.IMAGE_URL,
        phoneNumbers: testUtils.CONTACT_PHONE_NUMBERS,
        emails: testUtils.CONTACT_EMAILS,
        addresses: testUtils.CONTACT_ADDRESSES,
      };

      (Contact.prototype.save as any).yields(null, returnedContact);

      await testedController.saveContact(req, res, next, testUtils.SERVICE_ID);

      expect(next).to.have.been.called;
    });
  });

  describe('save Contact', () => {

    beforeEach(() => {
      sandbox.stub(AdminUser, 'findOne');
      sandbox.stub(Service, 'findOne');
      sandbox.stub(bcrypt, 'compare');
      sandbox.stub(Contact, 'findOne');
      sandbox.stub(Contact, 'findOneAndUpdate');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return error when AdminUser is not existing with given email', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (AdminUser.findOne as any).yields(null);

      await testedController.postSaveContact(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_BAD_REQUEST);
      expect(res.send).to.have.been.calledWith({
        error: 'User does not exist',
      });
    });

    it('should return error when AdminUser findOne throws error', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (AdminUser.findOne as any).yields(MongoError);

      await testedController.postSaveContact(req, res);

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

      await testedController.postSaveContact(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_BAD_REQUEST);
      expect(res.send).to.have.been.calledWith({
        error: 'Incorrect password',
      });
    });

    it('should return error when Service is not existing with given service_id', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (bcrypt.compare as any).resolves(testUtils.RESOLVE_PROMISE);
      (AdminUser.findOne as any).yields(null, { email: testUtils.EMAIL, password: testUtils.PASSWORD });
      (Service.findOne as any).yields(null);

      await testedController.postSaveContact(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_NOT_FOUND);
      expect(res.send).to.have.been.calledWith({
        error: 'Service not found',
      });
    });

    it('should return error when Service findOne throws error', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (bcrypt.compare as any).resolves(testUtils.RESOLVE_PROMISE);
      (AdminUser.findOne as any).yields(null, { email: testUtils.EMAIL, password: testUtils.PASSWORD });
      (Service.findOne as any).yields(MongoError);

      await testedController.postSaveContact(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
      expect(res.send).to.have.been.calledWith({
        error: 'Some error occured',
      });
    });

    it('should return error when Contacts findOneAndUpdate throws error', async () => {
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
      (Service.findOne as any).yields(null, {
        service_id: testUtils.SERVICE_ID,
      });
      (Contact.findOneAndUpdate as any).yields(MongoError);

      await testedController.postSaveContact(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
      expect(res.send).to.have.been.calledWith({
        error: 'Error occured during updating contact.',
      });
    });

    it('should return error when request\'s body contains deleteImage and Contacts findOne throws error', async () => {
      const req = mockRequest({
        body: {
          phoneNumbers: testUtils.JSON_EMPTY_ARRAY,
          emails: testUtils.JSON_EMPTY_ARRAY,
          addresses: testUtils.JSON_EMPTY_ARRAY,
          deleteImage: 'true',
        },
      });
      const res = mockResponse();

      (bcrypt.compare as any).resolves(testUtils.RESOLVE_PROMISE);
      (AdminUser.findOne as any).yields(null, { email: testUtils.EMAIL, password: testUtils.PASSWORD });
      (Service.findOne as any).yields(null, {
        service_id: testUtils.SERVICE_ID,
      });
      (Contact.findOne as any).yields(MongoError);

      await testedController.postSaveContact(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
      expect(res.send).to.have.been.calledWith({
        error: 'Some error occured',
      });
    });

    it('should proceed to save Contacts', async () => {
      const req = mockRequest({
        body: {
          phoneNumbers: testUtils.JSON_EMPTY_ARRAY,
          emails: testUtils.JSON_EMPTY_ARRAY,
          addresses: testUtils.JSON_EMPTY_ARRAY,
        },
      });
      const res = mockResponse();
      const expectedResult = {
        contacts: [],
      };

      (bcrypt.compare as any).resolves(testUtils.RESOLVE_PROMISE);
      (AdminUser.findOne as any).yields(null, { email: testUtils.EMAIL, password: testUtils.PASSWORD });
      (Service.findOne as any).yields(null, {
        service_id: testUtils.SERVICE_ID,
      });
      (Contact.findOneAndUpdate as any).yields(null, expectedResult);

      await testedController.postSaveContact(req, res);

      expect(res.sendStatus).to.have.been.calledWith(constants.HTTP_STATUS_OK);
    });

    it('should proceed to save Contacts when request\'s body contains deleteImage', async () => {
      const req = mockRequest({
        body: {
          phoneNumbers: testUtils.JSON_EMPTY_ARRAY,
          emails: testUtils.JSON_EMPTY_ARRAY,
          addresses: testUtils.JSON_EMPTY_ARRAY,
          deleteImage: 'true',
        },
      });
      const res = mockResponse();
      const expectedResult = {
        contacts: [],
      };

      (bcrypt.compare as any).resolves(testUtils.RESOLVE_PROMISE);
      (AdminUser.findOne as any).yields(null, { email: testUtils.EMAIL, password: testUtils.PASSWORD });
      (Service.findOne as any).yields(null, {
        service_id: testUtils.SERVICE_ID,
      });
      (Contact.findOne as any).yields(null);
      (Contact.findOneAndUpdate as any).yields(null, expectedResult);

      await testedController.postSaveContact(req, res);

      expect(res.sendStatus).to.have.been.calledWith(constants.HTTP_STATUS_OK);
    });
  });


});

