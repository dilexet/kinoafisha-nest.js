import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class TokenDto {
  @ApiProperty({
    type: String,
    description: 'Access token',
  })
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty({
    type: String,
    description: 'Refresh token',
  })
  @IsNotEmpty()
  refreshToken: string;
}
