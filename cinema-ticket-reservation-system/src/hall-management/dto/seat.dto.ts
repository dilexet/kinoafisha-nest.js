import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { AutoMap } from '@automapper/classes';

export class SeatDto {
  @ApiProperty({
    default: 1,
    description: 'Seat number',
  })
  @IsNotEmpty()
  @IsNumber()
  @AutoMap()
  numberSeat: number;

  @ApiProperty({
    default: 'cca46371-283f-4487-b4af-3b9830f67cd1',
    description: 'Seat type id',
  })
  @AutoMap()
  @IsNotEmpty()
  seatTypeId?: string;
}
