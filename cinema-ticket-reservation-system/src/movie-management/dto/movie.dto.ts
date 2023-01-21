import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';
import { AutoMap } from '@automapper/classes';


export class MovieDto {
  @ApiProperty({
    type: String,
    default: 'movie name',
    description: 'Movie name',
  })
  @IsNotEmpty()
  @AutoMap()
  name: string;

  @ApiProperty({
    type: String,
    default: 'movie description',
    description: 'Movie description',
  })
  @AutoMap()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    type: 'string',
    description: 'Movie release date',
    default: '2021-04-19',
  })
  @AutoMap()
  @IsDateString()
  @IsNotEmpty()
  releaseDate: Date;

  @ApiProperty({
    type: [String],
    default: [""],
  })
  genres: string[];

  @ApiProperty({
    type: String,
    description: 'Movie poster',
    format: 'binary',
  })
  poster: Express.Multer.File;
}