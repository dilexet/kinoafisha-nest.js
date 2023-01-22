import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
import { AutoMap } from '@automapper/classes';

export class MovieDto {
  @ApiProperty({
    default: 'movie name',
    description: 'Movie name',
  })
  @AutoMap()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    default: 'movie description',
    description: 'Movie description',
  })
  @AutoMap()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Movie premiere date',
    default: '2021-04-19',
  })
  @AutoMap()
  @IsDateString()
  @IsNotEmpty()
  premiereDate: Date;

  @ApiProperty({
    description: 'Movie duration time in minutes',
    default: 120,
  })
  @AutoMap()
  @IsNumber()
  @IsNotEmpty()
  durationInMinutes: number;

  @ApiProperty({
    description: 'Movie genre ids',
    default: ['a8181ddc-baa2-4cb3-a4bf-236a64f3bff7', 'b3ccabb0-1e7a-487a-af7a-7800145c0ea5'],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsNotEmpty({ each: true })
  genres: string[];

  @ApiProperty({
    description: 'Movie county names',
    default: ['USA', 'Russia'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  countries: string[];

  @ApiProperty({
    description: 'Movie poster url',
  })
  @AutoMap()
  @IsNotEmpty()
  @IsString()
  posterURL: string;
}