import { AutoMap } from '@automapper/classes';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: 'User name',
  })
  @IsNotEmpty()
  @AutoMap()
  name: string;

  @ApiProperty({
    description: 'User email',
  })
  @IsEmail()
  @IsNotEmpty()
  @AutoMap()
  email: string;

  @ApiProperty({
    description: 'User role id',
  })
  @IsNotEmpty()
  roleId: string;
}
