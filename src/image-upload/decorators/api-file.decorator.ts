import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  imageDiskStorage,
  imageFileFilter,
} from '../utils/file-upload.helpers';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

export function ApiFile(fieldName = 'file', required = true) {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(fieldName, {
        storage: imageDiskStorage,
        fileFilter: imageFileFilter,
      }),
    ),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: required ? [fieldName] : [],
        properties: {
          [fieldName]: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
  );
}
