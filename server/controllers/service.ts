import { NextFunction, Request, Response } from 'express';
import { destroyImage, uploadImage } from '../utils/image';
import { constants } from 'http2';
import { Service } from '../models/Services';
import { AdminUser } from '../models/AdminUsers';
import bcrypt from 'bcrypt';
import { Base64 } from 'js-base64';

export const postObtainServiceId = async (req: Request, res: Response, next: NextFunction) => {
  Service.findOne({ user_email: req.body.user_email })
    .then((dbService) => {
      if (!dbService) {
        return res.status(constants.HTTP_STATUS_NOT_FOUND).send({
          error: 'Service not found',
        });
      }
      const result = {
        service_id: Base64.encode(dbService.service_id),
      };
      return res.status(constants.HTTP_STATUS_OK).send(result);
    });
};

export const getServiceName = async (req: Request, res: Response, next: NextFunction) => {
  const serviceId = Base64.decode(req.params.service_id);
  Service.findOne({ service_id: serviceId })
    .then((dbService) => {
      if (!dbService) {
        return res.status(constants.HTTP_STATUS_NOT_FOUND).send({
          error: 'Service not found',
        });
      }
      return res.status(constants.HTTP_STATUS_OK).send(dbService.name);
    });
};

export const getAvailableServices = async (req: Request, res: Response, next: NextFunction) => {
  Service.find({ hidden: false }, 'service_id name image description')
    .then((dbServices) => {
      if (!dbServices) {
        return res.status(constants.HTTP_STATUS_NOT_FOUND).send({
          error: 'Services not found',
        });
      }
      dbServices.forEach((service: any) => {
        service.service_id = Base64.encode(service.service_id);
      });
      return res.status(constants.HTTP_STATUS_OK).send(JSON.stringify(dbServices));
    });
};

export const getServiceSettings = async (req: Request, res: Response, next: NextFunction) => {
  const serviceId = Base64.decode(req.params.service_id);
  Service.findOne({ service_id: serviceId })
    .then((dbService) => {
      if (!dbService) {
        return res.status(constants.HTTP_STATUS_NOT_FOUND).send({
          error: 'Service not found',
        });
      }
      const result = {
        name: dbService.name,
        image_url: dbService.image,
        description: dbService.description,
        hidden: dbService.hidden,
      };
      return res.status(constants.HTTP_STATUS_OK).send(result);
    });
};

export const saveService = async (req: any, res: Response, next: NextFunction, service_id: string) => {
  const service = new Service({
    user_email: req.body.email,
    service_id: service_id,
    name: req.body.servicename,
    description: '',
    hidden: true,
  });
  service.save((saveError) => {
    if (saveError) {
      return next(saveError);
    }
    next();
  });
};

export const postUpdateService = async (req: any, res: Response, next: NextFunction) => {

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
            let image: any = null;
            let imageId: string;
            const deleteImage = req.body.deleteImage === 'true';
            if (req.file) {
              image = await tryUploadImage(req, res, next);
            }

            const service = new Service({
              user_email: req.body.user_email,
              name: req.body.name,
              description: req.body.description,
              image: image && image.url ? image.url : null,
              image_id: image && image.public_id ? image.public_id : null,
              hidden: req.body.hidden,
            });
            const serviceAsObject = service.toObject();
            delete serviceAsObject._id;
            if (!req.file && !deleteImage) {
              delete serviceAsObject.image;
              delete serviceAsObject.image_id;
            } else {
              Service.findOne({ user_email: service.user_email })
                .then((dbService) => {
                  if (dbService) {
                    imageId = dbService.image_id;
                  }
                });
            }
            Service.findOneAndUpdate({ user_email: service.user_email }, serviceAsObject, { upsert: true },
              (updateError, no) => {
                if (updateError) {
                  if (imageId) {
                    destroyImage(imageId);
                  }
                  console.log(updateError);
                  return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
                    error: 'Error occured during updating service.',
                  });
                }
                if (imageId) {
                  destroyImage(imageId);
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

async function tryUploadImage(req: any, res: any, next: any) {
  try {
    return await uploadImage('services', req, res, next);
  } catch (err) {
    res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
      error: 'An error occured during the upload.',
    });
  }
  return null;
}
