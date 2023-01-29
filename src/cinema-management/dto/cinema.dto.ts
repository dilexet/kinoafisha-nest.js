import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { IsNotEmpty } from 'class-validator';

export class CinemaDto {
  @ApiProperty({
    default: 'Moon',
    description: 'Cinema name',
  })
  @AutoMap()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    default: 'Belarus',
    description: 'Cinema country',
  })
  @AutoMap()
  @IsNotEmpty()
  country: string;

  @ApiProperty({
    default: 'Grodno',
    description: 'Cinema city',
  })
  @AutoMap()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    default: 'Soviet',
    description: 'Cinema street',
  })
  @AutoMap()
  @IsNotEmpty()
  street: string;

  @ApiProperty({
    default: 20,
    description: 'Cinema house number',
  })
  @AutoMap()
  @IsNotEmpty()
  houseNumber: number;
}
