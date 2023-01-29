import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { SessionTimeDto } from './session-time.dto';

export class SessionUpdateDto {
  @ApiProperty({
    type: SessionTimeDto,
    description: 'Session times with coefficient',
  })
  @IsNotEmpty()
  sessionTime: SessionTimeDto;

  @ApiProperty({
    default: 'id',
    description: 'Hall id',
  })
  @IsNotEmpty()
  hallId: string;

  @ApiProperty({
    default: 'id',
    description: 'Movie id',
  })
  @IsNotEmpty()
  movieId: string;
}
