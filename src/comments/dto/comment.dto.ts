import { ApiProperty } from '@nestjs/swagger';

export class CommentDto {
  @ApiProperty()
  userProfileId: string;
  @ApiProperty()
  movieId: string;
  @ApiProperty()
  text: string;
}
