import { NextFunction, Request, Response } from 'express';
import { constants } from 'http2';
import { Flag } from '../models/Flags';
import { Base64 } from 'js-base64';
import { Service } from '../models/Services';
import * as _ from 'lodash';

export const getUsersFlags = async (req: any, res: Response) => {
	const userEmail = Base64.decode(req.params.user_email);
	Flag.find({user_email: userEmail}, 'service_id', {sort: 'createdAt'})
		.then((dbFlags) => {
			if (dbFlags) {
				const serviceIds = _.map(dbFlags, 'service_id');
				Service.find({service_id: {$in: serviceIds}, hidden: false}, '-_id')
					.then((dbService) => {
						if (dbService) {
							_.map(dbService, (service) => service.service_id = Base64.encode(service.service_id));
							return res.status(constants.HTTP_STATUS_OK).send(dbService);
						}
					});
			} else {
				return res.sendStatus(constants.HTTP_STATUS_OK);
			}
		});
};

export const postToggleFlagService = async (req: any, res: Response, next: NextFunction) => {
  const serviceId = Base64.decode(req.body.service_id)
  Service.findOne({ service_id: serviceId })
    .then((dbService) => {
      if (!dbService) {
        return res.status(constants.HTTP_STATUS_NOT_FOUND).send({
          error: 'Service not found',
        });
      }
      const flag = new Flag({
				user_email: req.body.user_email,
        service_id: serviceId,
      });
      Flag.findOne({ user_email: flag.user_email, service_id: serviceId })
        .then((dbFlag) => {
          if (dbFlag) {
            dbFlag.remove((err) => {
							if (err) {
								return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
									error: 'Error occured during trying to remove flag',
								});
							}
						});
						return res.sendStatus(constants.HTTP_STATUS_OK);
          }
          flag.save((saveError) => {
            if (saveError) {
              return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
                error: 'Error occured during save',
              });
            }
					});
          res.sendStatus(constants.HTTP_STATUS_CREATED);
        });
    });
};