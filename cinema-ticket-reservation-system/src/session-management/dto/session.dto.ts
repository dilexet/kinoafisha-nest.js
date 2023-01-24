import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { SessionTimeDto } from './session-time.dto';

export class SessionDto {
  @ApiProperty({
    type: SessionTimeDto,
    isArray: true,
    description: 'Session times with coefficients',
  })
  @IsNotEmpty()
  sessionTimes: SessionTimeDto[];

  @ApiProperty({
    default: 'id',
    description: 'Cinema id',
  })
  @IsNotEmpty()
  cinemaId: string;

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
