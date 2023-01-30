import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LogoutDto {
  @ApiProperty({
    type: String,
    description: 'Refresh token',
  })
  @IsNotEmpty()
  refreshToken: string;
}