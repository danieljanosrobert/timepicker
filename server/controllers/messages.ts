import { NextFunction, Response } from 'express';
import { AdminUser } from '../models/AdminUsers';
import { constants } from "http2";
import { Messages } from '../models/Messages';

export const postGetMessages = async (req: any, res: Response, next: NextFunction) => {
    Messages.findOne({ user_email: req.body.user_email})
      .then( (dbMessages) => {
      if (!dbMessages) {
        return res.status(constants.HTTP_STATUS_NOT_FOUND).send({
          error: 'Messages not found',
        });
      }
      const result = {
        messages: dbMessages.messages,    
      };
      return res.status(constants.HTTP_STATUS_OK).json(result);
    });
  };
  
  export const postSaveMessages = async (req: any, res: Response, next: NextFunction) => {
    AdminUser.findOne({ email: req.body.user_email })
      .then((dbUser) => {
        if (!dbUser) {
          return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
            error: 'User does not exist'
          });
        }
        const messages = new Messages({
          user_email: req.body.user_email,
          messages: JSON.parse(req.body.messages),
        });
        const messagesAsObject = messages.toObject();
        delete messagesAsObject._id;
        Messages.findOneAndUpdate({user_email: messages.user_email}, messagesAsObject, {upsert: true},
          (updateError, no) => {
            if(updateError) {
              console.log(updateError);
              return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
                error: 'Error occured during updating user\'s messages.',
              });
            }
            return res.sendStatus(constants.HTTP_STATUS_OK);
          });
      });
  };
