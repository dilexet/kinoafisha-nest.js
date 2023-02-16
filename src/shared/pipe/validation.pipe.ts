import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const validationErrors = await validate(object);

    if (validationErrors.length > 0) {
      const errors = Array.from(validationErrors, (value) => {
        return {
          property: value.property,
          messages: value.constraints,
        };
      });
      throw new BadRequestException(errors);
    }
    return value;
  }

  private toValidate(metatype): boolean {
    const types: any = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
