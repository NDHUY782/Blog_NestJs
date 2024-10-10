import { diskStorage } from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

export const storageConfig_local = (folder: string) =>
  diskStorage({
    destination: `upload/${folder}`,
    filename: (req, file, cb) => {
      const name = Date.now() + '-' + file.originalname;
      cb(null, name);
    },
  });

export const storageConfig = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const ext = file.originalname.split('.').pop();
    if (!['jpg', 'jpeg', 'png'].includes(ext)) {
      throw new Error('Invalid file format');
    }

    return {
      folder: 'avatar',
      format: ext,
      public_id: Date.now() + '-' + file.originalname.split('.')[0],
      //   transformation: [{ width: 500, height: 500, crop: 'limit' }],
    };
  },
});
