import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class UserCreateDto extends UserDto {
  @ApiProperty({
    description: 'User password',
  })
  @IsNotEmpty()
  password: string;
}
