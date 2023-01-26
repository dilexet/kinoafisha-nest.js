import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import * as uuid from 'uuid';
import * as path from 'path';

export const imageFileFilter = (req: any, file: any, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return callback(new BadRequestException('Only .jpg, .jpeg, .png files are allowed'), false);
  }
  callback(null, true);
};

export const imageDiskStorage = diskStorage({
  destination: './images/',
  filename(req, file, callback) {
    const fileName = uuid.v4();
    const extension = path.parse(file.originalname).ext;
    callback(null, `${fileName}${extension}`);
  },
});