import {NextFunction, Request, Response} from 'express';
import {AdminUser} from '../models/AdminUsers';
import {constants} from "http2";
import bcrypt from 'bcrypt';
import {Contact} from '../models/Contacts';
import {destroyImage, uploadImage} from '../utils/image';

export const postGetContactSettings = async (req: any, res: Response, next: NextFunction) => {  
  Contact.findOne({ user_email: req.body.user_email})
    .then( (dbContact) => {
    if (!dbContact) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).send({
        error: 'Contact not found',
      });
    }
    const result = {
      name: dbContact.name,
      image_url: dbContact.image,
      phoneNumbers: dbContact.phoneNumbers,
      emails: dbContact.emails,
      addresses: dbContact.addresses,
    };
    return res.status(constants.HTTP_STATUS_OK).json(result);
  });
};

export const postSaveContact = async (req: any, res: Response, next: NextFunction) => {
  AdminUser.findOne({ email: req.body.user_email })
      .then( (dbUser) => {
        if (!dbUser) {
          return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
            error: 'User does not exist'});
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
                const contact = new Contact({
                  user_email: req.body.user_email,
                  name: req.body.name,
                  phoneNumbers: JSON.parse(req.body.phoneNumbers),
                  emails: JSON.parse(req.body.emails),
                  addresses: JSON.parse(req.body.addresses),
                  image: image && image.url ? image.url : null,
                  image_id: image && image.public_id ? image.public_id : null,
                });
                const contactAsObject = contact.toObject();
                delete contactAsObject._id;
                if (!req.file && !deleteImage) {
                  delete contactAsObject.image;
                  delete contactAsObject.image_id;
                } else {
                  Contact.findOne({user_email: contact.user_email})
                      .then( (dbService) => {
                        if (dbService) {
                          imageId = dbService.image_id;
                        }
                      });
                }
                Contact.findOneAndUpdate({user_email: contact.user_email}, contactAsObject, {upsert: true},
                    (updateError, no) => {
                      if(updateError) {
                        if (imageId) {
                          destroyImage(imageId);
                        }
                        console.log(updateError);
                        return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
                          error: 'Error occured during updating contact.',
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
    return await uploadImage('contacts', req, res, next);
  } catch (err) {
    res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
      error: 'An error occured during the upload.',
    });
  }
  return null;
}
