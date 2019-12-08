import { NextFunction, Request, Response } from 'express';
import { AdminUser } from '../models/AdminUsers';
import { constants } from 'http2';
import bcrypt from 'bcrypt';
import { Contact } from '../models/Contacts';
import { destroyImage, uploadImage } from '../utils/image';
import { Base64 } from 'js-base64';
import { Service } from '../models/Services';

/**
 * GET /contact/:service_id
 * GET /settings/contact/:service_id
 * Returns the contact info of Service with given service_id
 */
export const getContact = async (req: any, res: Response) => {
  const serviceId = Base64.decode(req.params.service_id);
  Contact.findOne({ service_id: serviceId }, (err, dbContact) => {
    if (err) {
      return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ error: 'Some error occured' });
    }
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
    return res.status(constants.HTTP_STATUS_OK).send(result);
  });
};

/**
 * Creates contact info on AdminUser creation.
 * @param serviceId string of generated UUID that joins AdminUser with Service
 */
export const saveContact = async (req: any, res: Response, next: NextFunction, serviceId: string) => {
  const contact = new Contact({
    service_id: serviceId,
    name: req.body.name,
    phoneNumbers: [],
    emails: [],
    addresses: [],
  });
  contact.save((saveError) => {
    if (saveError) {
      next(saveError);
    }
    next();
  });
};

/**
 * POST /settings/contact
 * Updates Service's contact info.
 */
export const postSaveContact = async (req: any, res: Response) => {
  AdminUser.findOne({ email: req.body.user_email }, (adminUserError, dbUser) => {
    if (adminUserError) {
      return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ error: 'Some error occured' });
    }
    if (!dbUser) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
        error: 'User does not exist',
      });
    }
    bcrypt.compare(req.body.password, dbUser.password)
      .then((isMatch) => {
        if (isMatch) {
          Service.findOne({ user_email: req.body.user_email }, 'service_id', async (serviceError, dbService) => {
            if (serviceError) {
              return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ error: 'Some error occured' });
            }
            if (!dbService) {
              return res.status(constants.HTTP_STATUS_NOT_FOUND).send({
                error: 'Service not found',
              });
            }
            let image: any = null;
            let imageId: string;
            const deleteImage = req.body.deleteImage === 'true';
            if (req.file) {
              image = await tryUploadImage(req, res);
            }
            const contact = new Contact({
              service_id: dbService.service_id,
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
              Contact.findOne({ service_id: contact.service_id }, (contactError, dbContact) => {
                if (contactError) {
                  return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ error: 'Some error occured' });
                }
                if (dbContact) {
                  imageId = dbContact.image_id;
                }
              });
            }
            Contact.findOneAndUpdate({ service_id: contact.service_id }, contactAsObject, { upsert: true },
              (updateError, no) => {
                if (updateError) {
                  if (imageId) {
                    destroyImage(imageId);
                  }
                  return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
                    error: 'Error occured during updating contact.',
                  });
                }
                if (imageId) {
                  destroyImage(imageId);
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

async function tryUploadImage(req: any, res: any) {
  try {
    return await uploadImage('contacts', req, res);
  } catch (err) {
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
      error: 'An error occured during upload.',
    });
  }
}
