import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserProfileDto {
  @ApiProperty({ nullable: true, required: false })
  name: string;

  @ApiProperty({ nullable: true, required: false })
  email: string;

  @ApiProperty({ nullable: true, required: false })
  oldPassword: string;

  @ApiProperty({ nullable: true, required: false })
  newPassword: string;
}
