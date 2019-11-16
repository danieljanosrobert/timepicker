import { NextFunction, Response } from 'express';
import { AdminUser } from '../models/AdminUsers';
import { constants } from "http2";
import {BookTime} from '../models/BookTimes';
import {Break} from '../models/Breaks';
import {Leave} from '../models/Leaves';
import bcrypt from 'bcrypt';

export const postGetBookTimeSettings = async (req: any, res: Response, next: NextFunction) => {
  BookTime.findOne({ user_email: req.body.user_email})
    .then( (dbBookTime) => {
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
    return res.status(constants.HTTP_STATUS_OK).json(result);
  });
};

export const postSaveBookTime = async (req: any, res: Response, next: NextFunction) => {
  AdminUser.findOne({ email: req.body.user_email })
    .then((dbUser) => {
      if (!dbUser) {
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
          error: 'User does not exist'
        });
      }
      bcrypt.compare(req.body.password, dbUser.password)
        .then(async (isMatch) => {
          if (isMatch) {
            const bookTime = new BookTime({
              user_email: req.body.user_email,
              lastMonth: req.body.lastMonth,
              startTime: req.body.startTime,
              endTime: req.body.endTime,
              bookDuration: req.body.bookDuration,
              selectedWeekdays: JSON.parse(req.body.selectedWeekdays),
            });
            const bookTimeAsObject = bookTime.toObject();
            delete bookTimeAsObject._id;
            BookTime.findOneAndUpdate({user_email: bookTime.user_email}, bookTimeAsObject, {upsert: true},
              (updateError, no) => {
                if(updateError) {
                  console.log(updateError);
                  return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
                    error: 'Error occured during updating bookTime.',
                  });
                }
                return res.sendStatus(constants.HTTP_STATUS_OK);
              });
          } else {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
              error: 'Incorrect password',
            });
          }
        });
    });
};

export const postGetBreakSettings = async (req: any, res: Response, next: NextFunction) => {
  Break.findOne({ user_email: req.body.user_email})
    .then( (dbBreak) => {
    if (!dbBreak) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).send({
        error: 'Breaks not found',
      });
    }
    const result = {
      breaks: dbBreak.breaks,    
    };
    return res.status(constants.HTTP_STATUS_OK).json(result);
  });
};

export const postSaveBreaks = async (req: any, res: Response, next: NextFunction) => {
  AdminUser.findOne({ email: req.body.user_email })
    .then((dbUser) => {
      if (!dbUser) {
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
          error: 'User does not exist'
        });
      }
      bcrypt.compare(req.body.password, dbUser.password)
        .then(async (isMatch) => {
          if (isMatch) {
            const breaks = new Break({
              user_email: req.body.user_email,
              breaks: JSON.parse(req.body.breaks),
            });
            const breakAsObject = breaks.toObject();
            delete breakAsObject._id;
            Break.findOneAndUpdate({user_email: breaks.user_email}, breakAsObject, {upsert: true},
              (updateError, no) => {
                if(updateError) {
                  console.log(updateError);
                  return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
                    error: 'Error occured during updating breaks.',
                  });
                }
                return res.sendStatus(constants.HTTP_STATUS_OK);
              });
          } else {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
              error: 'Incorrect password',
            });
          }
        });
    });
};

export const postGetLeaveSettings = async (req: any, res: Response, next: NextFunction) => {
  Leave.findOne({ user_email: req.body.user_email})
    .then( (dbLeave) => {
    if (!dbLeave) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).send({
        error: 'Leaves not found',
      });
    }
    const result = {
      leaves: dbLeave.leaves,    
    };
    return res.status(constants.HTTP_STATUS_OK).json(result);
  });
};

export const postSaveLeaves = async (req: any, res: Response, next: NextFunction) => {
  AdminUser.findOne({ email: req.body.user_email })
    .then((dbUser) => {
      if (!dbUser) {
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
          error: 'User does not exist'
        });
      }
      bcrypt.compare(req.body.password, dbUser.password)
        .then(async (isMatch) => {
          if (isMatch) {
            const leaves = new Leave({
              user_email: req.body.user_email,
              leaves: JSON.parse(req.body.leaves),
            });
            const leavesAsObject = leaves.toObject();
            delete leavesAsObject._id;
            Leave.findOneAndUpdate({user_email: leaves.user_email}, leavesAsObject, {upsert: true},
              (updateError, no) => {
                if(updateError) {
                  console.log(updateError);
                  return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
                    error: 'Error occured during updating leaves.',
                  });
                }
                return res.sendStatus(constants.HTTP_STATUS_OK);
              });
          } else {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
              error: 'Incorrect password',
            });
          }
        });
    });
};