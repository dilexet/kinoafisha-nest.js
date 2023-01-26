import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class SessionTimeDto {
  @ApiProperty({
    description: 'Session start date',
    default: '2023-02-25 12:00:00',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({
    description: 'Session coefficient for price (1, 1.5, 2)',
    default: 1.1,
  })
  @Min(0.5)
  @IsNumber()
  @IsNotEmpty()
  coefficient: number;
}
