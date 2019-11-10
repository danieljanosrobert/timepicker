import * as cloudinary from 'cloudinary';
import {NextFunction, Request, Response} from 'express';
import {destroyImage, uploadImage} from '../utils/image';
import {constants} from 'http2';
import {Service} from '../models/Services';
import {AdminUser} from '../models/AdminUsers';
import bcrypt from 'bcrypt';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME || 'timepicker',
  api_key: process.env.CLOUDINARY_KEY || '478471557476925',
  api_secret: process.env.CLOUDINARY_SECRET || '4LoBdTZ8Ot8nYO51SMZhHtHZXzU',
});

export const getServiceSettings = async (req: Request, res: Response, next: NextFunction) => {
  Service.findOne({ user_email: req.body.user_email})
    .then( (dbService) => {
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
    return res.status(constants.HTTP_STATUS_OK).json(result);
  });
};

export const postSaveService = async (req: any, res: Response, next: NextFunction) => {
  let image = null;
  let image_id: string;
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
    Service.findOne({user_email: service.user_email})
      .then( (dbService) => {
      if (dbService) {
        image_id = dbService.image_id;
      }
    });
  }
  AdminUser.findOne({ email: service.user_email })
    .then( (dbUser) => {
      if (!dbUser) {
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
          error: 'User does not exist'});
      }
      bcrypt.compare(req.body.password, dbUser.password)
        .then((isMatch) => {
          if (isMatch) {
            Service.findOneAndUpdate({user_email: service.user_email}, serviceAsObject, {upsert: true},
                (updateError, no) => {
              if(updateError) {
                console.log(updateError);
                return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
                  error: 'Error occured during updating service.',
                });
              }
              if (image_id) {
                destroyImage(image_id);
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
