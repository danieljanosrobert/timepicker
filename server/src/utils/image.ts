import * as cloudinary from 'cloudinary';
import path from 'path';
import Datauri from 'datauri';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME || 'timepicker',
  api_key: process.env.CLOUDINARY_KEY || '478471557476925',
  api_secret: process.env.CLOUDINARY_SECRET || '4LoBdTZ8Ot8nYO51SMZhHtHZXzU',
});

export async function uploadImage(folder: string, req: any, res: any, next: any) {
  const dUri = new Datauri();
  dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);
  const result = await cloudinary.v2.uploader.upload(dUri.content, { folder });
  return result;
}

export async function destroyImage(publicId: string) {
  await cloudinary.v2.uploader.destroy(publicId);
}
