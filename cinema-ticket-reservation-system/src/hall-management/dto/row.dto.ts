import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { SeatDto } from './seat.dto';
import { AutoMap } from '@automapper/classes';

export class RowDto {
  @ApiProperty({
    default: 1,
    description: 'Row number',
  })
  @AutoMap()
  @IsNotEmpty()
  @IsNumber()
  numberRow: number;

  @ApiProperty({
    type: SeatDto,
    isArray: true,
    description: 'Seats array',
  })
  @AutoMap()
  @IsNotEmpty()
  seats: SeatDto[];
}
