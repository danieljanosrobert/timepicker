// tslint:disable:no-unused-expression
import chai from 'chai';
import { mockRequest, mockResponse } from 'mock-req-res';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import * as testedController from '../../controllers/book';
import * as reservationController from '../../controllers/reservation';
import { constants } from 'http2';
import { AdminUser } from '../../models/AdminUsers';
import { Service } from '../../models/Services';
import { BookTime } from '../../models/BookTimes';
import { Break } from '../../models/Breaks';
import { Leave } from '../../models/Leaves';
import { MongoError } from 'mongodb';
import bcrypt from 'bcrypt';
import testUtils from './testUtils';

chai.use(sinonChai);
const expect = chai.expect;

const sandbox = sinon.createSandbox();


describe('BookTimes in Book controller', () => {
  describe('get BookTime', () => {

    beforeEach(() => {
      sandbox.stub(BookTime, 'findOne');

    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return error when BookTime is not existing', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (BookTime.findOne as any).yields(null);

      await testedController.getBookTime(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_NOT_FOUND);
      expect(res.send).to.have.been.calledWith({
        error: 'Book not found',
      });
    });

    it('should return error when findOne throws any error', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (BookTime.findOne as any).yields(MongoError);

      await testedController.getBookTime(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
      expect(res.send).to.have.been.calledWith({
        error: 'Some error occured',
      });
    });

    it('should return BookTime with id from params', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const expectedResult = {
        lastMonth: testUtils.LAST_MONTH,
        startTime: testUtils.START_TIME,
        endTime: testUtils.END_TIME,
        bookDuration: testUtils.BOOK_DURATION,
        selectedWeekdays: testUtils.SELECTED_WEEKDAYS,
      };

      (BookTime.findOne as any).yields(null, expectedResult);

      await testedController.getBookTime(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_OK);
      expect(res.send).to.have.been.calledWith(expectedResult);
    });
  });

  describe('save BookTime', () => {

    beforeEach(() => {
      sandbox.stub(AdminUser, 'findOne');
      sandbox.stub(Service, 'findOne');
      sandbox.stub(bcrypt, 'compare');
      sandbox.stub(BookTime, 'findOneAndUpdate');
      sandbox.stub(Break, 'deleteOne');
      sandbox.stub(reservationController, 'updateReservationsIfNeeded');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return error when AdminUser is not existing with given email', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (AdminUser.findOne as any).yields(null);

      await testedController.postSaveBookTime(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_BAD_REQUEST);
      expect(res.send).to.have.been.calledWith({
        error: 'User does not exist',
      });
    });

    it('should return error when AdminUser findOne throws error', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (AdminUser.findOne as any).yields(MongoError);

      await testedController.postSaveBookTime(req, res);

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

      await testedController.postSaveBookTime(req, res);

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

      await testedController.postSaveBookTime(req, res);

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

      await testedController.postSaveBookTime(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
      expect(res.send).to.have.been.calledWith({
        error: 'Some error occured',
      });
    });

    it('should return error when BookTime findOneAndUpdate throws error', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (bcrypt.compare as any).resolves(testUtils.RESOLVE_PROMISE);
      (AdminUser.findOne as any).yields(null, { email: testUtils.EMAIL, password: testUtils.PASSWORD });
      (Service.findOne as any).yields(null, {
        service_id: testUtils.SERVICE_ID,
      });
      (BookTime.findOneAndUpdate as any).yields(MongoError);

      await testedController.postSaveBookTime(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
      expect(res.send).to.have.been.calledWith({
        error: 'Error occured during updating bookTime.',
      });
    });

    it('should return error when BookTime updateReservationsIfNeeded throws error', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const error = new Error('Service does not exist');
      const expectedResult = {
        service_id: testUtils.SERVICE_ID,
        lastMonth: testUtils.LAST_MONTH,
        startTime: testUtils.START_TIME,
        endTime: testUtils.END_TIME,
        bookDuration: testUtils.BOOK_DURATION,
        selectedWeekdays: testUtils.SELECTED_WEEKDAYS,
      };

      (bcrypt.compare as any).resolves(testUtils.RESOLVE_PROMISE);
      (AdminUser.findOne as any).yields(null, { email: testUtils.EMAIL, password: testUtils.PASSWORD });
      (Service.findOne as any).yields(null, {
        service_id: testUtils.SERVICE_ID,
      });
      (BookTime.findOneAndUpdate as any).yields(null, expectedResult);
      (reservationController.updateReservationsIfNeeded as any).throws(error);

      await testedController.postSaveBookTime(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_BAD_REQUEST);
      expect(res.send).to.have.been.calledWith({ error });
    });

    it('should return error when Break deleteOne throws error', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const expectedResult = {
        service_id: testUtils.SERVICE_ID,
        lastMonth: testUtils.LAST_MONTH,
        startTime: testUtils.START_TIME,
        endTime: testUtils.END_TIME,
        bookDuration: testUtils.BOOK_DURATION,
        selectedWeekdays: testUtils.SELECTED_WEEKDAYS,
      };

      (bcrypt.compare as any).resolves(testUtils.RESOLVE_PROMISE);
      (AdminUser.findOne as any).yields(null, { email: testUtils.EMAIL, password: testUtils.PASSWORD });
      (Service.findOne as any).yields(null, {
        service_id: testUtils.SERVICE_ID,
      });
      (BookTime.findOneAndUpdate as any).yields(null, expectedResult);
      (Break.deleteOne as any).yields(MongoError);

      await testedController.postSaveBookTime(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
      expect(res.send).to.have.been.calledWith({
        error: 'Error occured during deleting breaks.',
      });
    });

    it('should proceed to save BookTime', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const expectedResult = {
        service_id: testUtils.SERVICE_ID,
        lastMonth: testUtils.LAST_MONTH,
        startTime: testUtils.START_TIME,
        endTime: testUtils.END_TIME,
        bookDuration: testUtils.BOOK_DURATION,
        selectedWeekdays: testUtils.SELECTED_WEEKDAYS,
      };

      (bcrypt.compare as any).resolves(testUtils.RESOLVE_PROMISE);
      (AdminUser.findOne as any).yields(null, { email: testUtils.EMAIL, password: testUtils.PASSWORD });
      (Service.findOne as any).yields(null, {
        service_id: testUtils.SERVICE_ID,
      });
      (BookTime.findOneAndUpdate as any).yields(null, expectedResult);
      (Break.deleteOne as any).yields(null);

      await testedController.postSaveBookTime(req, res);

      expect(res.sendStatus).to.have.been.calledWith(constants.HTTP_STATUS_OK);
    });
  });

});

describe('Breaks in Book controller', () => {
  describe('get Breaks', () => {

    beforeEach(() => {
      sandbox.stub(Break, 'findOne');

    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return error when Breaks are not existing', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (Break.findOne as any).yields(null);

      await testedController.getBreaks(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_NOT_FOUND);
      expect(res.send).to.have.been.calledWith({
        error: 'Breaks not found',
      });
    });

    it('should return error when findOne throws any error', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (Break.findOne as any).yields(MongoError);

      await testedController.getBreaks(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
      expect(res.send).to.have.been.calledWith({
        error: 'Some error occured',
      });
    });

    it('should return Breaks with id from params', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const expectedResult = {
        breaks: [],
      };

      (Break.findOne as any).yields(null, expectedResult);

      await testedController.getBreaks(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_OK);
      expect(res.send).to.have.been.calledWith(expectedResult);
    });
  });

  describe('save Breaks', () => {

    beforeEach(() => {
      sandbox.stub(AdminUser, 'findOne');
      sandbox.stub(Service, 'findOne');
      sandbox.stub(bcrypt, 'compare');
      sandbox.stub(Break, 'findOneAndUpdate');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return error when AdminUser is not existing with given email', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (AdminUser.findOne as any).yields(null);

      await testedController.postSaveBreaks(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_BAD_REQUEST);
      expect(res.send).to.have.been.calledWith({
        error: 'User does not exist',
      });
    });

    it('should return error when AdminUser findOne throws error', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (AdminUser.findOne as any).yields(MongoError);

      await testedController.postSaveBreaks(req, res);

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

      await testedController.postSaveBreaks(req, res);

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

      await testedController.postSaveBreaks(req, res);

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

      await testedController.postSaveBreaks(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
      expect(res.send).to.have.been.calledWith({
        error: 'Some error occured',
      });
    });

    it('should return error when Break findOneAndUpdate throws error', async () => {
      const req = mockRequest({
        body: {
          breaks: testUtils.JSON_EMPTY_ARRAY,
        },
      });
      const res = mockResponse();

      (bcrypt.compare as any).resolves(testUtils.RESOLVE_PROMISE);
      (AdminUser.findOne as any).yields(null, { email: testUtils.EMAIL, password: testUtils.PASSWORD });
      (Service.findOne as any).yields(null, {
        service_id: testUtils.SERVICE_ID,
      });
      (Break.findOneAndUpdate as any).yields(MongoError);

      await testedController.postSaveBreaks(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
      expect(res.send).to.have.been.calledWith({
        error: 'Error occured during updating breaks.',
      });
    });

    it('should proceed to save Breaks', async () => {
      const req = mockRequest({
        body: {
          breaks: testUtils.JSON_EMPTY_ARRAY,
        },
      });
      const res = mockResponse();
      const expectedResult = {
        breaks: [],
      };

      (bcrypt.compare as any).resolves(testUtils.RESOLVE_PROMISE);
      (AdminUser.findOne as any).yields(null, { email: testUtils.EMAIL, password: testUtils.PASSWORD });
      (Service.findOne as any).yields(null, {
        service_id: testUtils.SERVICE_ID,
      });
      (Break.findOneAndUpdate as any).yields(null, expectedResult);

      await testedController.postSaveBreaks(req, res);

      expect(res.sendStatus).to.have.been.calledWith(constants.HTTP_STATUS_OK);
    });
  });

});

describe('Leaves in Book controller', () => {
  describe('get Leaves', () => {

    beforeEach(() => {
      sandbox.stub(Leave, 'findOne');

    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return error when Leaves are not existing', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (Leave.findOne as any).yields(null);

      await testedController.getLeaves(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_NOT_FOUND);
      expect(res.send).to.have.been.calledWith({
        error: 'Leaves not found',
      });
    });

    it('should return error when findOne throws any error', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (Leave.findOne as any).yields(MongoError);

      await testedController.getLeaves(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
      expect(res.send).to.have.been.calledWith({
        error: 'Some error occured',
      });
    });

    it('should return Leaves with id from params', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const expectedResult = {
        leaves: [],
      };

      (Leave.findOne as any).yields(null, expectedResult);

      await testedController.getLeaves(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_OK);
      expect(res.send).to.have.been.calledWith(expectedResult);
    });
  });

  describe('save Leaves', () => {

    beforeEach(() => {
      sandbox.stub(AdminUser, 'findOne');
      sandbox.stub(Service, 'findOne');
      sandbox.stub(bcrypt, 'compare');
      sandbox.stub(Leave, 'findOneAndUpdate');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return error when AdminUser is not existing with given email', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (AdminUser.findOne as any).yields(null);

      await testedController.postSaveLeaves(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_BAD_REQUEST);
      expect(res.send).to.have.been.calledWith({
        error: 'User does not exist',
      });
    });

    it('should return error when AdminUser findOne throws error', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (AdminUser.findOne as any).yields(MongoError);

      await testedController.postSaveLeaves(req, res);

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

      await testedController.postSaveLeaves(req, res);

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

      await testedController.postSaveLeaves(req, res);

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

      await testedController.postSaveLeaves(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
      expect(res.send).to.have.been.calledWith({
        error: 'Some error occured',
      });
    });

    it('should return error when Leaves findOneAndUpdate throws error', async () => {
      const req = mockRequest({
        body: {
          leaves: testUtils.JSON_EMPTY_ARRAY,
        },
      });
      const res = mockResponse();

      (bcrypt.compare as any).resolves(testUtils.RESOLVE_PROMISE);
      (AdminUser.findOne as any).yields(null, { email: testUtils.EMAIL, password: testUtils.PASSWORD });
      (Service.findOne as any).yields(null, {
        service_id: testUtils.SERVICE_ID,
      });
      (Leave.findOneAndUpdate as any).yields(MongoError);

      await testedController.postSaveLeaves(req, res);

      expect(res.status).to.have.been.calledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
      expect(res.send).to.have.been.calledWith({
        error: 'Error occured during updating leaves.',
      });
    });

    it('should proceed to save Leaves', async () => {
      const req = mockRequest({
        body: {
          leaves: testUtils.JSON_EMPTY_ARRAY,
        },
      });
      const res = mockResponse();
      const expectedResult = {
        leaves: [],
      };

      (bcrypt.compare as any).resolves(testUtils.RESOLVE_PROMISE);
      (AdminUser.findOne as any).yields(null, { email: testUtils.EMAIL, password: testUtils.PASSWORD });
      (Service.findOne as any).yields(null, {
        service_id: testUtils.SERVICE_ID,
      });
      (Leave.findOneAndUpdate as any).yields(null, expectedResult);

      await testedController.postSaveLeaves(req, res);

      expect(res.sendStatus).to.have.been.calledWith(constants.HTTP_STATUS_OK);
    });
  });

});
