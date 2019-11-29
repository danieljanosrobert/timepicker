import { NextFunction, Response } from 'express';
import { AdminUser } from '../models/AdminUsers';
import { constants } from 'http2';
import { Messages } from '../models/Messages';
import { Base64 } from 'js-base64';
import { Service } from '../models/Services';

/**
 * GET /messages/:service_id
 * GET /settings/messages/:service_id
 * Returns the messages of Service with given service_id
 */
export const getMessages = async (req: any, res: Response, next: NextFunction) => {
  const serviceId = Base64.decode(req.params.service_id);
  Messages.findOne({ service_id: serviceId })
    .then((dbMessages) => {
      if (!dbMessages) {
        return res.status(constants.HTTP_STATUS_NOT_FOUND).send({
          error: 'Messages not found',
        });
      }
      const result = {
        messages: dbMessages.messages,
      };
      return res.status(constants.HTTP_STATUS_OK).send(result);
    });
};

/**
 * Creates empty message board on AdminUser creation.
 * @param serviceId string of generated UUID that joins AdminUser with Service
 */
export const createMessage = async (req: any, res: Response, next: NextFunction, serviceId: string) => {
  const message = new Messages({
    service_id: serviceId,
    messages: [],
  });
  message.save((saveError) => {
    if (saveError) {
      next(saveError);
    }
    next();
  });
};

/**
 * POST /settings/messages
 * Updates Service's messages
 */
export const postSaveMessages = async (req: any, res: Response, next: NextFunction) => {
  AdminUser.findOne({ email: req.body.user_email })
    .then((dbUser) => {
      if (!dbUser) {
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
          error: 'User does not exist'
        });
      }
      Service.findOne({ user_email: req.body.user_email }, 'service_id')
        .then((dbService) => {
          if (!dbService) {
            return res.status(constants.HTTP_STATUS_NOT_FOUND).send({
              error: 'Service not found',
            });
          }
          const messages = new Messages({
            service_id: dbService.service_id,
            messages: JSON.parse(req.body.messages),
          });
          const messagesAsObject = messages.toObject();
          delete messagesAsObject._id;
          Messages.findOneAndUpdate({ service_id: messages.service_id }, messagesAsObject, { upsert: true },
            (updateError, no) => {
              if (updateError) {
                console.log(updateError);
                return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
                  error: 'Error occured during updating user\'s messages.',
                });
              }
              return res.sendStatus(constants.HTTP_STATUS_OK);
            });
        });
    });
};
