import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { IsNotEmpty } from 'class-validator';
import { RowDto } from './row.dto';
import { SeatTypePriceDto } from './seat-type-price.dto';

export class HallDto {
  @ApiProperty({
    default: 'Vip hall',
    description: 'Hall name',
  })
  @AutoMap()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    default: 'id',
    description: 'Cinema id',
  })
  cinemaId: string;

  @ApiProperty({
    type: RowDto,
    isArray: true,
    description: 'Rows array',
  })
  @AutoMap()
  @IsNotEmpty()
  rows: RowDto[];

  @ApiProperty({
    type: SeatTypePriceDto,
    isArray: true,
    description: 'Seat price by type',
  })
  @IsNotEmpty()
  seatTypePrices: SeatTypePriceDto[];
}
