import { NextFunction, Response } from 'express';
import * as reservationController from './reservation';
import { AdminUser } from '../models/AdminUsers';
import { constants } from 'http2';
import { BookTime } from '../models/BookTimes';
import { Break } from '../models/Breaks';
import { Leave } from '../models/Leaves';
import bcrypt from 'bcrypt';
import { Service } from '../models/Services';
import dateUtil from '../utils/dateUtil';
import * as _ from 'lodash';

/**
 * GET /book/book-time/:service_id
 * GET /settings/book/:service_id
 * Returns the book-times of Service with given service_id
 */
export const getBookTime = async (req: any, res: Response, next: NextFunction) => {
  const serviceId = Base64.decode(req.params.service_id);
  BookTime.findOne({ service_id: serviceId })
    .then((dbBookTime) => {
      if (!dbBookTime) {
        return res.status(constants.HTTP_STATUS_NOT_FOUND).send({
          error: 'Book not found',
        });
      }
      const result = {
        lastMonth: dbBookTime.lastMonth,
        startTime: dbBookTime.startTime,
        endTime: dbBookTime.endTime,
        bookDuration: dbBookTime.bookDuration,
        selectedWeekdays: dbBookTime.selectedWeekdays,
      };
      return res.status(constants.HTTP_STATUS_OK).send(result);
    });
};

/**
 * POST /settings/book
 * Updates book-time. If book-time does not exist create one
 */
export const postSaveBookTime = async (req: any, res: Response, next: NextFunction) => {
  AdminUser.findOne({ email: req.body.user_email })
    .then((dbUser) => {
      if (!dbUser) {
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
          error: 'User does not exist',
        });
      }
      bcrypt.compare(req.body.password, dbUser.password)
        .then(async (isMatch) => {
          if (isMatch) {
            Service.findOne({ user_email: req.body.user_email }, 'service_id')
              .then((dbService) => {
                if (!dbService) {
                  return res.status(constants.HTTP_STATUS_NOT_FOUND).send({
                    error: 'Service not found',
                  });
                }
                const bookTime = new BookTime({
                  service_id: dbService.service_id,
                  lastMonth: req.body.lastMonth,
                  startTime: req.body.startTime,
                  endTime: req.body.endTime,
                  bookDuration: req.body.bookDuration,
                  selectedWeekdays: req.body.selectedWeekdays,
                });
                const bookTimeAsObject = bookTime.toObject();
                delete bookTimeAsObject._id;
                BookTime.findOneAndUpdate({ service_id: bookTime.service_id }, bookTimeAsObject, { upsert: true },
                  (updateError, originalBookTime) => {
                    if (updateError) {
                      return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
                        error: 'Error occured during updating bookTime.',
                      });
                    }
                    if (originalBookTime && originalBookTime.startTime) {
                      if (originalBookTime.startTime !== bookTime.startTime
                        || originalBookTime.bookDuration !== bookTime.bookDuration
                        || originalBookTime.endTime !== bookTime.endTime
                        || !areArreysEquals(originalBookTime.selectedWeekdays, bookTime.selectedWeekdays)) {
                        try {
                          reservationController.updateReservationsIfNeeded(bookTime, originalBookTime);
                        } catch (err) {
                          return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
                            error: err,
                          });
                        }
                      }
                    }
                    Break.deleteOne({ service_id: dbService.service_id }, (err) => {
                      if (err) {
                        return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
                          error: 'Error occured during deleting breaks.',
                        });
                      }
                    });
                    return res.sendStatus(constants.HTTP_STATUS_OK);
                  });
              });
          } else {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
              error: 'Incorrect password',
            });
          }
        });
    });
};

/**
 * GET /book/breaks/:service_id
 * GET /settings/breaks/:service_id
 * Returns the breaks of Service with given service_id
 */
export const getBreaks = async (req: any, res: Response, next: NextFunction) => {
  const serviceId = Base64.decode(req.params.service_id);
  Break.findOne({ service_id: serviceId })
    .then((dbBreak) => {
      if (!dbBreak) {
        return res.status(constants.HTTP_STATUS_OK).send({
          details: 'Breaks not found',
        });
      }
      const result = {
        breaks: dbBreak.breaks,
      };
      return res.status(constants.HTTP_STATUS_OK).send(result);
    });
};

/**
 * POST /settings/breaks
 * Updates breaks. If breaks does not exist create one
 */
export const postSaveBreaks = async (req: any, res: Response, next: NextFunction) => {
  AdminUser.findOne({ email: req.body.user_email })
    .then((dbUser) => {
      if (!dbUser) {
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
          error: 'User does not exist',
        });
      }
      bcrypt.compare(req.body.password, dbUser.password)
        .then(async (isMatch) => {
          if (isMatch) {
            Service.findOne({ user_email: req.body.user_email }, 'service_id')
              .then((dbService) => {
                if (!dbService) {
                  return res.status(constants.HTTP_STATUS_NOT_FOUND).send({
                    error: 'Service not found',
                  });
                }
                const breaks = new Break({
                  service_id: dbService.service_id,
                  breaks: JSON.parse(req.body.breaks),
                });
                const breakAsObject = breaks.toObject();
                delete breakAsObject._id;
                _.forEach(breakAsObject.breaks, (currBreak) => {
                  const totalTime = dateUtil.minuteFromHour(currBreak.startTime) + currBreak.duration;
                  if (totalTime > 1440) {
                    currBreak.duration -= totalTime % 1440;
                    breakAsObject.breaks.push({
                      date: dateUtil.addDaysToDate(currBreak.date, 1),
                      startTime: '00:00',
                      duration: totalTime % 1440,
                      always: currBreak.always,
                    });
                  }
                });
                Break.findOneAndUpdate({ service_id: breaks.service_id }, breakAsObject, { upsert: true },
                  (updateError) => {
                    if (updateError) {
                      return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
                        error: 'Error occured during updating breaks.',
                      });
                    }
                    return res.sendStatus(constants.HTTP_STATUS_OK);
                  });
              });
          } else {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
              error: 'Incorrect password',
            });
          }
        });
    });
};

/**
 * GET /book/leaves/:service_id
 * GET /settings/leaves/:service_id
 * Returns the leaves of Service with given service_id
 */
export const getLeaves = async (req: any, res: Response, next: NextFunction) => {
  const serviceId = Base64.decode(req.params.service_id);
  Leave.findOne({ service_id: serviceId })
    .then((dbLeave) => {
      if (!dbLeave) {
        return res.status(constants.HTTP_STATUS_OK).send({
          details: 'Leaves not found',
        });
      }
      const result = {
        leaves: dbLeave.leaves,
      };
      return res.status(constants.HTTP_STATUS_OK).send(result);
    });
};

/**
 * POST /settings/leaves
 * Updates leaves. If leaves does not exist create one
 */
export const postSaveLeaves = async (req: any, res: Response, next: NextFunction) => {
  AdminUser.findOne({ email: req.body.user_email })
    .then((dbUser) => {
      if (!dbUser) {
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
          error: 'User does not exist',
        });
      }
      bcrypt.compare(req.body.password, dbUser.password)
        .then(async (isMatch) => {
          if (isMatch) {
            Service.findOne({ user_email: req.body.user_email }, 'service_id')
              .then((dbService) => {
                if (!dbService) {
                  return res.status(constants.HTTP_STATUS_NOT_FOUND).send({
                    error: 'Service not found',
                  });
                }
                const leaves = new Leave({
                  service_id: dbService.service_id,
                  leaves: JSON.parse(req.body.leaves),
                });
                const leavesAsObject = leaves.toObject();
                delete leavesAsObject._id;
                Leave.findOneAndUpdate({ service_id: leaves.service_id }, leavesAsObject, { upsert: true },
                  (updateError) => {
                    if (updateError) {
                      return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
                        error: 'Error occured during updating leaves.',
                      });
                    }
                    return res.sendStatus(constants.HTTP_STATUS_OK);
                  });
              });
          } else {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
              error: 'Incorrect password',
            });
          }
        });
    });
};

const areArreysEquals = (firstArray: any[], secondArray: any[]) => {
  return _.isEqual(_.sortBy(firstArray), _.sortBy(secondArray));
};
