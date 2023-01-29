import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { AutoMap } from '@automapper/classes';

export class SeatTypePriceDto {
  @ApiProperty({
    default: 100.56,
    description: 'Seat price $',
  })
  @IsNotEmpty()
  @IsNumber()
  @AutoMap()
  price: number;

  @ApiProperty({
    default: 'cca46371-283f-4487-b4af-3b9830f67cd1',
    description: 'Seat type id',
  })
  @AutoMap()
  @IsNotEmpty()
  seatTypeId?: string;
}
